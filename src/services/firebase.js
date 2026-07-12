import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
)

// #region agent log
fetch('http://127.0.0.1:7413/ingest/a3696a9f-9e8c-4e33-8045-80214d6aad95',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7cb7ff'},body:JSON.stringify({sessionId:'7cb7ff',runId:'pre-fix',hypothesisId:'A,F',location:'firebase.js:init',message:'Firebase config presence check',data:{isConfigured,hasApiKey:Boolean(firebaseConfig.apiKey),apiKeyLen:firebaseConfig.apiKey?.length??0,apiKeyPrefix:firebaseConfig.apiKey?.slice(0,8)??null,authDomain:firebaseConfig.authDomain??null,projectId:firebaseConfig.projectId??null,hasStorageBucket:Boolean(firebaseConfig.storageBucket),hasMessagingSenderId:Boolean(firebaseConfig.messagingSenderId),hasAppId:Boolean(firebaseConfig.appId),appIdSuffix:firebaseConfig.appId?.slice(-8)??null,origin:typeof window!=='undefined'?window.location.origin:null,hostname:typeof window!=='undefined'?window.location.hostname:null},timestamp:Date.now()})}).catch(()=>{});
// #endregion

let app = null
let auth = null
let googleProvider = null

if (isConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  googleProvider.setCustomParameters({ prompt: 'select_account' })
}

export { auth, googleProvider }
