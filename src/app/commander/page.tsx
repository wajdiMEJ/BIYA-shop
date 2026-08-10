'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createOrder } from './actions'

const GOVERNORATS = [
  { value: 'Tunis', label: 'Tunis' },
  { value: 'Ariana', label: 'Ariana' },
  { value: 'Beja', label: 'Beja' },
  { value: 'Ben Arous', label: 'Ben Arous' },
  { value: 'Bizerte', label: 'Bizerte' },
  { value: 'Gabes', label: 'Gabes' },
  { value: 'Gafsa', label: 'Gafsa' },
  { value: 'Jendouba', label: 'Jendouba' },
  { value: 'Kairouan', label: 'Kairouan' },
  { value: 'Kasserine', label: 'Kasserine' },
  { value: 'Kebili', label: 'Kebili' },
  { value: 'Kef', label: 'Kef' },
  { value: 'Mahdia', label: 'Mahdia' },
  { value: 'Manouba', label: 'Manouba' },
  { value: 'Medenine', label: 'Medenine' },
  { value: 'Monastir', label: 'Monastir' },
  { value: 'Nabeul', label: 'Nabeul' },
  { value: 'Sfax', label: 'Sfax' },
  { value: 'Sidi Bouzid', label: 'Sidi Bouzid' },
  { value: 'Siliana', label: 'Siliana' },
  { value: 'Sousse', label: 'Sousse' },
  { value: 'Tataouine', label: 'Tataouine' },
  { value: 'Tozeur', label: 'Tozeur' },
  { value: 'Zaghouan', label: 'Zaghouan' },
]

function FloatingInput({
  name,
  label,
  value,
  onChange,
  error,
  type = 'text',
  maxLength
}: {
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  maxLength?: number
}) {
  const hasValue = value.trim().length > 0

  return (
    <div className="position-relative mb-3">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder=" "
        className="form-control"
        style={{
          height: 56,
          paddingTop: 20,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: '#fff',
          borderColor: error ? '#dc2626' : '#D8CBB8',
          borderWidth: error ? 2 : 1,
          borderRadius: 12,
          color: '#3E3125',
          fontSize: 15,
          transition: 'all 0.2s'
        }}
      />
      <label
        className="position-absolute text-muted"
        style={{
          left: 16,
          top: hasValue ? 6 : '50%',
          transform: hasValue ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: hasValue ? 11 : 14,
          color: error ? '#dc2626' : hasValue ? '#6F4E37' : '#999',
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          backgroundColor: 'transparent',
          padding: '0 4px',
          fontWeight: hasValue ? 600 : 400,
        }}
      >
        {label}
      </label>
      {error && (
        <div className="mt-1 small fw-bold" style={{ color: '#dc2626', fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  )
}

function FloatingSelect({
  name,
  label,
  value,
  onChange,
  options
}: {
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
}) {
  const hasValue = value.trim().length > 0

  return (
    <div className="position-relative mb-3">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-select"
        style={{
          height: 56,
          paddingTop: 20,
          paddingBottom: 8,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: '#fff',
          borderColor: '#D8CBB8',
          borderRadius: 12,
          color: '#3E3125',
          fontSize: 15,
        }}
      >
        <option value=""></option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label
        className="position-absolute"
        style={{
          left: 16,
          top: hasValue ? 6 : '50%',
          transform: hasValue ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: hasValue ? 11 : 14,
          color: hasValue ? '#6F4E37' : '#999',
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          fontWeight: hasValue ? 600 : 400,
        }}
      >
        {label}
      </label>
    </div>
  )
}

export default function CommanderPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const shippingCost = 8.00
  const total = totalPrice + shippingCost

  const [loading, setLoading] = useState(false)
  const [sameBilling, setSameBilling] = useState(true)
  const [discountCode, setDiscountCode] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: '',
    saveInfo: false,
  })

  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: '',
  })

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <h2 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Votre panier est vide</h2>
        <Link href="/produits" className="btn btn-lg fw-bold px-5" style={{ backgroundColor: '#6F4E37', color: '#F8F5EF', borderRadius: 50 }}>
          Continuer les achats
        </Link>
      </div>
    )
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'L\'email doit contenir @'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est obligatoire'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est obligatoire'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le telephone est obligatoire'
    } else if (!/^\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Le telephone doit contenir exactement 8 chiffres'
    }

    if (!sameBilling) {
      if (!billingData.lastName.trim()) newErrors.billingLastName = 'Le nom est obligatoire'
      if (!billingData.address.trim()) newErrors.billingAddress = 'L\'adresse est obligatoire'
      if (!billingData.city.trim()) newErrors.billingCity = 'La ville est obligatoire'
      if (!billingData.phone.trim()) {
        newErrors.billingPhone = 'Le telephone est obligatoire'
      } else if (!/^\d{8}$/.test(billingData.phone.replace(/\s/g, ''))) {
        newErrors.billingPhone = 'Le telephone doit contenir exactement 8 chiffres'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    if (errors[name]) {
      setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
    }
  }

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBillingData(prev => ({ ...prev, [name]: value }))
    const errorKey = 'billing' + name.charAt(0).toUpperCase() + name.slice(1)
    if (errors[errorKey]) {
      setErrors(prev => { const n = { ...prev }; delete n[errorKey]; return n })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    const result = await createOrder({
      ...formData,
      shippingCost,
      total,
      billingAddress: sameBilling ? null : billingData,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }))
    })

    if (result.success) {
      clearCart()
      router.push(`/commander/success?order=${result.orderId}`)
    } else {
      alert('Erreur lors de la commande. Veuillez reessayer.')
    }
    setLoading(false)
  }

  return (
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <Link href="/" className="text-decoration-none">
                <h3 className="fw-bold" style={{ color: '#6F4E37' }}>BiYa By Marrou </h3>
              </Link>
            </div>

            <h5 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Contact</h5>
            <FloatingInput
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <h5 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Livraison</h5>

            <FloatingSelect
              name="country"
              label="Gouvernorat"
              value={formData.country}
              onChange={handleChange}
              options={GOVERNORATS}
            />

            <div className="row g-2">
              <div className="col-6">
                <FloatingInput
                  name="firstName"
                  label="Prenom"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-6">
                <FloatingInput
                  name="lastName"
                  label="Nom"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>
            </div>

            <FloatingInput
              name="address"
              label="Adresse"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />

            <div className="row g-2">
              <div className="col-4">
                <FloatingInput
                  name="postalCode"
                  label="Code postal"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
              <div className="col-8">
                <FloatingInput
                  name="city"
                  label="Ville"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                />
              </div>
            </div>

            <FloatingInput
              name="phone"
              label="Telephone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              maxLength={8}
            />

            <div className="form-check mb-4">
              <input
                type="checkbox"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleChange}
                className="form-check-input"
                style={{ borderColor: '#D8CBB8' }}
              />
              <label className="form-check-label small" style={{ color: '#6F4E37' }}>
                Sauvegarder ces informations pour la prochaine fois
              </label>
            </div>

            <h5 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Methode de livraison</h5>
            <div
              className="card mb-4 p-3 d-flex flex-row justify-content-between align-items-center"
              style={{ backgroundColor: '#F0EDE8', borderColor: '#6F4E37', borderWidth: 2, borderRadius: 10 }}
            >
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 20, height: 20, border: '2px solid #6F4E37' }}>
                  <div className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: '#6F4E37' }}></div>
                </div>
              </div>
              <span className="fw-bold" style={{ color: '#3E3125' }}>{shippingCost.toFixed(3)} DT</span>
            </div>

            <h5 className="fw-bold mb-1" style={{ color: '#3E3125' }}>Paiement</h5>
            <p className="small text-muted mb-3">Toutes les transactions sont securisees et cryptees.</p>

            <div className="card mb-3 p-3" style={{ backgroundColor: '#F0EDE8', borderColor: '#6F4E37', borderWidth: 2, borderRadius: 10 }}>
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 20, height: 20, border: '2px solid #6F4E37' }}>
                  <div className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: '#6F4E37' }}></div>
                </div>
                <span className="fw-medium" style={{ color: '#3E3125' }}>
                  الدفع عند التوصيل - Cash on delivery
                </span>
              </div>
            </div>
            <div className="card mb-4 p-3" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8', borderRadius: 10 }}>
              <p className="small mb-0" style={{ color: '#6F4E37' }}>
                Pour les commandes internationales : Le paiement est effectue via un lien securise envoye a votre email.
              </p>
            </div>

            <h5 className="fw-bold mb-3" style={{ color: '#3E3125' }}>Adresse de facturation</h5>

            <div
              className="card mb-2 p-3 d-flex flex-row align-items-center gap-2"
              onClick={() => { setSameBilling(true); setErrors(prev => { const n = { ...prev }; delete n.billingLastName; delete n.billingAddress; delete n.billingCity; delete n.billingPhone; return n }) }}
              style={{ backgroundColor: sameBilling ? '#F0EDE8' : '#F8F5EF', borderColor: sameBilling ? '#6F4E37' : '#D8CBB8', borderWidth: sameBilling ? 2 : 1, borderRadius: 10, cursor: 'pointer' }}
            >
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 20, height: 20, border: '2px solid #6F4E37' }}>
                {sameBilling && <div className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: '#6F4E37' }}></div>}
              </div>
              <span className="fw-medium" style={{ color: '#3E3125' }}>Identique a l'adresse de livraison</span>
            </div>

            <div
              className="card mb-3 p-3 d-flex flex-row align-items-center gap-2"
              onClick={() => setSameBilling(false)}
              style={{ backgroundColor: !sameBilling ? '#F0EDE8' : '#F8F5EF', borderColor: !sameBilling ? '#6F4E37' : '#D8CBB8', borderWidth: !sameBilling ? 2 : 1, borderRadius: 10, cursor: 'pointer' }}
            >
              <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 20, height: 20, border: '2px solid #6F4E37' }}>
                {!sameBilling && <div className="rounded-circle" style={{ width: 10, height: 10, backgroundColor: '#6F4E37' }}></div>}
              </div>
              <span className="fw-medium" style={{ color: '#3E3125' }}>Utiliser une adresse de facturation differente</span>
            </div>

            {!sameBilling && (
              <div className="card p-3 mb-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8', borderRadius: 12 }}>
                <FloatingSelect
                  name="country"
                  label="Gouvernorat"
                  value={billingData.country}
                  onChange={handleBillingChange}
                  options={GOVERNORATS}
                />

                <div className="row g-2">
                  <div className="col-6">
                    <FloatingInput
                      name="firstName"
                      label="Prenom"
                      value={billingData.firstName}
                      onChange={handleBillingChange}
                    />
                  </div>
                  <div className="col-6">
                    <FloatingInput
                      name="lastName"
                      label="Nom"
                      value={billingData.lastName}
                      onChange={handleBillingChange}
                      error={errors.billingLastName}
                    />
                  </div>
                </div>

                <FloatingInput
                  name="address"
                  label="Adresse"
                  value={billingData.address}
                  onChange={handleBillingChange}
                  error={errors.billingAddress}
                />

                <div className="row g-2">
                  <div className="col-4">
                    <FloatingInput
                      name="postalCode"
                      label="Code postal"
                      value={billingData.postalCode}
                      onChange={handleBillingChange}
                    />
                  </div>
                  <div className="col-8">
                    <FloatingInput
                      name="city"
                      label="Ville"
                      value={billingData.city}
                      onChange={handleBillingChange}
                      error={errors.billingCity}
                    />
                  </div>
                </div>

                <FloatingInput
                  name="phone"
                  label="Telephone"
                  value={billingData.phone}
                  onChange={handleBillingChange}
                  error={errors.billingPhone}
                  maxLength={8}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 fw-bold border-0 mb-3"
              style={{ backgroundColor: '#0056b3', color: '#fff', borderRadius: 10, padding: '16px', fontSize: 16 }}
            >
              {loading ? 'Traitement...' : 'Complete order'}
            </button>

            <div className="text-center">
              <Link href="/panier" className="text-decoration-none small" style={{ color: '#6F4E37' }}>← Retour au panier</Link>
            </div>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="p-4" style={{ backgroundColor: '#F8F5EF', borderRadius: 16, border: '1px solid #D8CBB8' }}>
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="d-flex align-items-center gap-3 mb-3">
                <div className="position-relative flex-shrink-0" style={{ width: 60, height: 60, borderRadius: 10, overflow: 'hidden', border: '1px solid #D8CBB8' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                  <div className="position-absolute top-0 end-0 d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: 20, height: 20, backgroundColor: '#6F4E37', fontSize: 11, borderRadius: '50%', transform: 'translate(30%, -30%)' }}>
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-medium" style={{ color: '#3E3125', fontSize: 14 }}>{item.name}</div>
                  <div className="small" style={{ color: '#6F4E37' }}>Taille: {item.size}</div>
                </div>
                <div className="fw-bold" style={{ color: '#3E3125', fontSize: 14 }}>
                  {(item.price * item.quantity).toFixed(3)} DT
                </div>
              </div>
            ))}

            <hr style={{ borderColor: '#D8CBB8' }} />

            <div className="d-flex gap-2 mb-3">
              <input type="text" placeholder="Code promo" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} className="form-control" style={{ backgroundColor: '#fff', borderColor: '#D8CBB8', color: '#3E3125' }} />
              <button type="button" className="btn fw-bold px-4" style={{ backgroundColor: '#D8CBB8', color: '#3E3125', borderRadius: 8 }}>Appliquer</button>
            </div>

            <hr style={{ borderColor: '#D8CBB8' }} />

            <div className="d-flex justify-content-between mb-2" style={{ color: '#6F4E37', fontSize: 14 }}>
              <span>Sous-total</span>
              <span>{totalPrice.toFixed(3)} DT</span>
            </div>
            <div className="d-flex justify-content-between mb-3" style={{ color: '#6F4E37', fontSize: 14 }}>
              <span>Livraison</span>
              <span>{shippingCost.toFixed(3)} DT</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-bold" style={{ color: '#3E3125', fontSize: 18 }}>Total</span>
              <span className="fw-bold" style={{ color: '#3E3125', fontSize: 18 }}>{total.toFixed(3)} DT</span>
            </div>
            <div className="text-end small mb-3" style={{ color: '#6F4E37' }}>
              Dont {(total * 0.19).toFixed(3)} DT de taxes
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 