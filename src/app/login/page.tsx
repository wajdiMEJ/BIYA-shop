'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn, getSession } from 'next-auth/react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === 'true'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      const session = await getSession()

      if (session?.user?.role === 'ADMIN') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/'
      }
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow p-4" style={{ backgroundColor: '#F8F5EF', borderColor: '#D8CBB8' }}>
            <h2 className="text-center mb-4" style={{ color: '#3E3125' }}>Connexion</h2>

            {justRegistered && (
              <div className="alert alert-success">
                ✅ Compte créé avec succès ! Connectez-vous maintenant.
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8' }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ backgroundColor: '#EEE6D8', borderColor: '#D8CBB8' }}
                />
              </div>

              <button
                type="submit"
                className="btn w-100"
                disabled={loading}
                style={{ backgroundColor: '#6F4E37', color: '#F8F5EF' }}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="text-center mt-3">
              <Link href="/" style={{ color: '#6F4E37' }}>← Retour à l'accueil</Link>
            </div>
            <div className="text-center mt-2">
              <span style={{ color: '#6F4E37' }}>Pas de compte ? </span>
              <Link href="/register" style={{ color: '#B8895A', fontWeight: 'bold' }}>S'inscrire</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}