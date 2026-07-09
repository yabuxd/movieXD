import { describe, it, expect } from 'vitest'
import { mapFirebaseUser } from './mapUser.js'

describe('mapFirebaseUser', () => {
  it('returns null for missing user', () => {
    expect(mapFirebaseUser(null)).toBeNull()
  })

  it('maps email user fields', () => {
    const user = {
      uid: 'uid-1',
      email: 'test@example.com',
      emailVerified: true,
      displayName: 'Test User',
      photoURL: null,
      providerData: [{ providerId: 'password' }],
    }

    const mapped = mapFirebaseUser(user)
    expect(mapped.id).toBe('uid-1')
    expect(mapped.email).toBe('test@example.com')
    expect(mapped.name).toBe('Test User')
    expect(mapped.emailVerified).toBe(true)
    expect(mapped.authProvider).toBe('email')
  })

  it('maps google provider', () => {
    const user = {
      uid: 'uid-2',
      email: 'g@example.com',
      emailVerified: true,
      displayName: 'Google User',
      photoURL: 'https://example.com/a.jpg',
      providerData: [{ providerId: 'google.com' }],
    }

    const mapped = mapFirebaseUser(user)
    expect(mapped.authProvider).toBe('google')
    expect(mapped.avatar).toBe('https://example.com/a.jpg')
  })
})
