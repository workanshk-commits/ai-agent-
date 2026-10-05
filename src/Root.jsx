import { useAuth } from '@clerk/react'
import { useState } from 'react'
import App from './App.jsx'
import Login from './pages/Login.jsx'

export default function Root() {
  const { isLoaded, isSignedIn } = useAuth()
  const [isGuest, setIsGuest] = useState(false)

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1e6] font-sans text-sm text-gray-500">
        Loading...
      </main>
    )
  }

  if (isSignedIn || isGuest) return <App />

  return (
    <Login
      onGuest={() => {
        setIsGuest(true)
      }}
    />
  )
}
