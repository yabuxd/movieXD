import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validateName,
  mapAuthError,
} from './authValidation.js'

describe('validateEmail', () => {
  it('rejects empty email', () => {
    expect(validateEmail('')).toBe('Email is required')
  })

  it('rejects invalid format', () => {
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address')
  })

  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBeNull()
  })
})

describe('validatePassword', () => {
  it('rejects short passwords', () => {
    expect(validatePassword('short')).toBe('Password must be at least 8 characters')
  })

  it('rejects common passwords', () => {
    expect(validatePassword('password123')).toBe('This password is too common. Choose a stronger one.')
  })

  it('accepts strong passwords', () => {
    expect(validatePassword('MyStr0ng!Pass')).toBeNull()
  })
})

describe('validateName', () => {
  it('requires at least 2 characters', () => {
    expect(validateName('A')).toBe('Name must be at least 2 characters')
  })

  it('accepts valid names', () => {
    expect(validateName('Alex')).toBeNull()
  })
})

describe('mapAuthError', () => {
  it('maps invalid credentials to generic message', () => {
    expect(mapAuthError({ code: 'auth/invalid-credential' })).toBe('Invalid email or password.')
  })

  it('maps unconfirmed email', () => {
    expect(mapAuthError('Email not confirmed')).toBe('Please verify your email before signing in.')
  })
})
