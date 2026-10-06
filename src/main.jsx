import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthenticateWithRedirectCallback, ClerkProvider } from '@clerk/react'
import '@fontsource/alegreya/400.css'
import '@fontsource/alegreya/400-italic.css'
import '@fontsource/source-sans-3/400.css'
import '@fontsource/source-sans-3/500.css'
import '@fontsource/source-sans-3/600.css'
import './index.css'
import Root from './Root.jsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element was not found.')
}

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(rootElement).render(
  <StrictMode>
    {clerkPublishableKey ? (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        {window.location.pathname === '/sso-callback' ? (
          <AuthenticateWithRedirectCallback />
        ) : (
          <Root />
        )}
      </ClerkProvider>
    ) : (
      <main className="flex min-h-screen items-center justify-center bg-white p-8 font-sans text-gray-950">
        <p>Authentication is not configured. Set VITE_CLERK_PUBLISHABLE_KEY and restart the app.</p>
      </main>
    )}
  </StrictMode>,
)
