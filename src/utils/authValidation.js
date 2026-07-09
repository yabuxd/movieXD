const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COMMON_PASSWORDS = new Set([
  'password',
  'password123',
  '12345678',
  '123456789',
  'qwerty123',
  'letmein',
  'welcome',
  'admin123',
  'moviexd',
  'movie123',
])

export function validateEmail(email) {
  const trimmed = email.trim()
  if (!trimmed) return 'Email is required'
  if (!EMAIL_RE.test(trimmed)) return 'Enter a valid email address'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return 'This password is too common. Choose a stronger one.'
  }
  return null
}

export function validateName(name) {
  const trimmed = name.trim()
  if (!trimmed) return 'Name is required'
  if (trimmed.length < 2) return 'Name must be at least 2 characters'
  return null
}

export function mapAuthError(error) {
  const code = typeof error === 'object' ? error?.code : null
  const message = typeof error === 'object' ? error?.message : error
  const msg = message || 'Something went wrong. Please try again.'
  const lower = msg.toLowerCase()

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    code === 'auth/invalid-login-credentials'
  ) {
    return 'Invalid email or password.'
  }
  if (code === 'auth/email-already-in-use') {
    return 'An account with this email already exists.'
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (code === 'auth/weak-password') {
    return 'Password does not meet security requirements.'
  }

  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Invalid email or password.'
  }
  if (lower.includes('email not confirmed') || lower.includes('verify your email')) {
    return 'Please verify your email before signing in.'
  }
  if (lower.includes('email already in use')) {
    return 'An account with this email already exists.'
  }
  if (lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  return msg
}
