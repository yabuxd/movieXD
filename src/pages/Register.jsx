import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, loading, error, setError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '', confirmPassword: '' })

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' })
  }

  const validateForm = () => {
    const errors = { email: '', password: '', confirmPassword: '' }
    let isValid = true

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!emailRegex.test(form.email)) {
      errors.email = 'Invalid email format'
      isValid = false
    }

    // Password validation
    if (!form.password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
      isValid = false
    } else if (!/\d/.test(form.password)) {
      errors.password = 'Password must contain at least 1 number'
      isValid = false
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setFieldErrors(errors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await register(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      // Error handled by AuthContext
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-gold-muted/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md my-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold to-brand-gold-muted flex items-center justify-center shadow-glow-gold group-hover:scale-110 transition-transform">
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <path d="M3 3l4 4-4 4V3zm5 0h7v2h-7V3zm0 4h5v2h-5V7zm0 4h7v2h-7v-2z" fill="#0A0F1E" />
              </svg>
            </div>
            <span className="text-2xl font-black">
              <span className="text-brand-text">Movie</span>
              <span className="text-gradient-gold">XD</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Create your cinematic account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-brand-border shadow-2xl overflow-hidden">
          {/* Header Switcher */}
          <div className="flex">
            <Link
              to="/login"
              className="flex-1 py-4 text-center text-sm font-semibold text-gray-500 hover:text-gray-300 border-b border-brand-border transition-all duration-200"
            >
              Sign In
            </Link>
            <div className="flex-1 py-4 text-center text-sm font-semibold bg-brand-gold/10 text-white border-b-2 border-brand-gold">
              Create Account
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Display general auth error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-400 mb-1.5">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all duration-200 ${
                  fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-gold/60'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all duration-200 ${
                  fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-gold/60'
                }`}
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-400 mb-1.5">
                Confirm Password
              </label>
              <input
                id="reg-confirm-password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:bg-white/8 transition-all duration-200 ${
                  fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-gold/60'
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3.5 text-base rounded-xl mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By continuing, you agree to MovieXD's{' '}
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Terms of Service</span>{' '}
          and{' '}
          <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
