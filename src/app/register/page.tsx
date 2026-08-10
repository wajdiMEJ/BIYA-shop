'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation simple côté client
    if (form.password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères')
      setLoading(false)
      return
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Erreur inscription')
      setLoading(false)
    } else {
      router.push('/login?registered=true')
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
            <h2 className="text-center mb-4" style={{ color: '#3E3125' }}>Créer un compte</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Prénom</label>
                  <input type="text" className="form-control" required
                    style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8' }}
                    onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Nom</label>
                  <input type="text" className="form-control" required
                    style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8' }}
                    onChange={e => setForm({...form, lastName: e.target.value})} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" required
                  style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8' }}
                  onChange={e => setForm({...form, email: e.target.value})} />
              </div>

              <div className="mb-3">
                <label className="form-label">Téléphone (optionnel)</label>
                <input type="tel" className="form-control"
                  style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8' }}
                  onChange={e => setForm({...form, phone: e.target.value})} />
              </div>

              <div className="mb-4">
                <label className="form-label">Mot de passe (min 6 caractères)</label>
                <input type="password" className="form-control" required minLength={6}
                  style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8' }}
                  onChange={e => setForm({...form, password: e.target.value})} />
              </div>

              <button type="submit" className="btn w-100 mb-3" disabled={loading}
                style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}>
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>

              <div className="text-center">
                <span style={{ color: '#6F4E37' }}>Déjà un compte ? </span>
                <Link href="/login" style={{ color: '#B8895A', fontWeight: 'bold' }}>Se connecter</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}