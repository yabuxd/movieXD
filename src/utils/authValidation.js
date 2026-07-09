const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required'
  if (!EMAIL_REGEX.test(email.trim())) return 'Invalid email format'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/\d/.test(password)) return 'Password must contain at least 1 number'
  return ''
}

export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) return 'Confirm password is required'
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}
