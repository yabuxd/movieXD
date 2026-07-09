import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import { validateEmail } from '../utils/authValidation'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const { login, loginWithGoogle, loading, error, clearError, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    const emailError = validateEmail(email)
    if (emailError || !password) {
      setFieldErrors({
        email: emailError,
        password: !password ? 'Password is required' : null,
      })
      return
    }

    setFieldErrors({})
    const result = await login(email, password)

    if (result.success) {
      navigate(from, { replace: true })
    }
  }

  const handleGoogle = async () => {
    clearError()
    await loginWithGoogle()
  }

  return (
    <>
      <Helmet>
        <title>Sign In — MovieXD</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-cinematic-mesh pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
            <p className="text-brand-muted text-sm">Sign in to access your library</p>
          </div>

          <div className="glass rounded-2xl border border-brand-border p-8 shadow-2xl space-y-6">
            {!isConfigured && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Firebase is not configured. Add <code className="text-amber-100">VITE_FIREBASE_*</code> variables to your environment.
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading || !isConfigured}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-brand-border bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-200 disabled:opacity-50"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-brand-border" />
              <span className="text-xs text-brand-muted uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-brand-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-brand-gold/50 transition-colors"
                  placeholder="you@example.com"
                />
                {fieldErrors.email && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-brand-surface border border-brand-border text-white placeholder-brand-muted focus:outline-none focus:border-brand-gold/50 transition-colors"
                  placeholder="••••••••"
                />
                {fieldErrors.password && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full btn-primary justify-center disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-brand-muted">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-brand-gold font-semibold hover:text-brand-gold-hover transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
