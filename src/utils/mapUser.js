export function mapFirebaseUser(user) {
  if (!user) return null

  const isGoogle = user.providerData?.some((p) => p.providerId === 'google.com')

  return {
    id: user.uid,
    email: user.email,
    name: user.displayName || user.email?.split('@')[0] || 'User',
    username: user.displayName || user.email?.split('@')[0] || 'User',
    avatar: user.photoURL || null,
    emailVerified: user.emailVerified,
    providers: isGoogle ? ['google'] : ['email'],
    authProvider: isGoogle ? 'google' : 'email',
  }
}
