import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

function env(key) {
  const value = import.meta.env[key]
  return typeof value === 'string' ? value.trim() : value
}

const firebaseConfig = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
}

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
)

const configIssues = []

if (isConfigured) {
  const { projectId, authDomain } = firebaseConfig
  const validDomains = [
    `${projectId}.firebaseapp.com`,
    `${projectId}.web.app`,
  ]
  if (!validDomains.includes(authDomain)) {
    configIssues.push(
      `VITE_FIREBASE_AUTH_DOMAIN (${authDomain}) does not match project ${projectId}. Expected ${validDomains[0]}`
    )
  }
}

if (import.meta.env.DEV && configIssues.length > 0) {
  console.warn('[Firebase] Configuration issues:', configIssues)
}

let auth = null
let googleProvider = null

if (isConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({ prompt: 'select_account' })
  } catch (error) {
    console.error('[Firebase] Failed to initialize:', error)
    configIssues.push('Firebase failed to initialize — check your config values.')
  }
}

export { auth, googleProvider, isConfigured, firebaseConfig, configIssues }
