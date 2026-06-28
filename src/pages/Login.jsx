import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, error, setError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [formLoading, setFormLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      // Error is stored in AuthContext and displayed below
    } finally {
      setFormLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch (err) {
      // Error is stored in AuthContext and displayed below
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-brand-gold-muted/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
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
          <p className="text-gray-500 text-sm mt-2">Your cinema, everywhere.</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-brand-border shadow-2xl overflow-hidden">
          {/* Tab switcher */}
          <div className="flex">
            <div className="flex-1 py-4 text-center text-sm font-semibold bg-brand-gold/10 text-white border-b-2 border-brand-gold">
              Sign In
            </div>
            <Link
              to="/register"
              id="auth-tab-signup"
              className="flex-1 py-4 text-center text-sm font-semibold text-gray-500 hover:text-gray-300 border-b border-brand-border transition-all duration-200"
            >
              Create Account
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {/* Display error message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-shake">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-400 mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-brand-gold/60 focus:bg-white/8 transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-brand-gold hover:text-brand-gold-hover transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-brand-gold/60 transition-all duration-200"
              />
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={formLoading || googleLoading}
              className="w-full btn-primary justify-center py-3.5 text-base rounded-xl"
            >
              {formLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-transparent text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                id="auth-google-btn"
                onClick={handleGoogleLogin}
                disabled={googleLoading || formLoading}
                className="btn-secondary justify-center py-2.5 text-sm rounded-xl"
              >
                {googleLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in with Google...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                      <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                      <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                      <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9159572 0.435448291,15.7350961 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </div>
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
