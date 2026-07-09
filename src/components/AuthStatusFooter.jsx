export default function AuthStatusFooter({ isConfigured, useMockAuth, authEnabled, firebaseProjectId, configIssues = [] }) {
  return (
    <>
      {import.meta.env.DEV && (
        <div className="text-center text-xs mt-3 space-y-1 text-gray-500">
          {isConfigured ? (
            <p className="text-green-500/80">
              Firebase connected{firebaseProjectId ? ` (project: ${firebaseProjectId})` : ''}
            </p>
          ) : useMockAuth ? (
            <p className="text-amber-500/80">Mock auth mode (demo: user@example.com / password123)</p>
          ) : (
            <p className="text-red-400/80">Firebase not configured — auth disabled in production builds</p>
          )}
          {configIssues.map((issue) => (
            <p key={issue} className="text-amber-400/80">{issue}</p>
          ))}
        </div>
      )}

      {!authEnabled && (
        <p className="text-center text-xs mt-3 text-red-400/80">
          Authentication is not configured on this deployment. Set VITE_FIREBASE_* in Netlify and redeploy.
        </p>
      )}
    </>
  )
}
