import { useEffect, useRef, useState } from 'react'
import './App.css'
import { DEMO_PROFILE, initialOf } from './demoProfile'

const chatColors = [
  { name: 'Black', className: 'black', value: '#000000' },
  { name: 'Red', className: 'red', value: '#ef392e' },
  { name: 'Orange', className: 'orange', value: '#f39800' },
  { name: 'Lime Green', className: 'green', value: '#a4d312' },
  { name: 'Brown', className: 'brown', value: '#67321d' },
  { name: 'White', className: 'white', value: '#ffffff' },
]

/**
 * @typedef {{
 *   lang: string,
 *   onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null,
 *   onerror: ((event: unknown) => void) | null,
 *   onend: (() => void) | null,
 *   start: () => void,
 *   stop: () => void
 * }} SpeechRecognitionLike
 */
/** @typedef {new () => SpeechRecognitionLike} SpeechRecognitionConstructor */
/** @typedef {Window & { SpeechRecognition?: SpeechRecognitionConstructor, webkitSpeechRecognition?: SpeechRecognitionConstructor }} SpeechWindow */

/**
 * @param {{ onSearch?: (query: string) => void | Promise<void>, userName?: string }} props
 */
export function App({ onSearch, userName } = {}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState('')
  const [selectedChatColor, setSelectedChatColor] = useState(
    chatColors.find((color) => color.name === 'White'),
  )
  const [query, setQuery] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState('')
  const busyRef = useRef(false)
  const recognitionRef = useRef(/** @type {SpeechRecognitionLike | null} */ (null))
  const SpeechRecognition =
    typeof window !== 'undefined'
      ? /** @type {SpeechWindow} */ (window).SpeechRecognition ||
        /** @type {SpeechWindow} */ (window).webkitSpeechRecognition
      : undefined

  useEffect(() => () => recognitionRef.current?.stop(), [])

  /** @param {string} query */
  const handleSubmit = async (query) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery || busyRef.current) return

    busyRef.current = true
    setIsBusy(true)
    setError('')

    try {
      await onSearch?.(trimmedQuery)
    } catch {
      setError('Search failed. Check your connection and try again.')
    } finally {
      busyRef.current = false
      setIsBusy(false)
    }
  }

  const handleVoiceInput = () => {
    if (!SpeechRecognition || isBusy || isListening) return

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = 'en-IN'
    /** @param {{ results: ArrayLike<ArrayLike<{ transcript: string }>> }} event */
    recognition.onresult = (event) => {
      setQuery(event.results[0][0].transcript)
    }
    recognition.onerror = () => {
      setError('Voice input failed. Please try again.')
    }
    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
    }

    setError('')
    setIsListening(true)
    recognition.start()
  }

  return (
    <div className="app-shell">
      <section className="screen screen--welcome" aria-label="Welcome screen">
        <header className="topbar" aria-hidden="true" />
        <aside className="menu-rail" aria-label="Main menu">
          <button
            type="button"
            className="icon-button menu-button"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isSidebarOpen}
            aria-controls="app-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </aside>

        {isProfileOpen ? (
          <main className="profile-screen" aria-label="Profile settings">
            <section className="profile-settings" aria-label="Account settings">
              <div className="profile-setting-row">
                <h2>Name</h2>
                <div className="profile-setting-value">
                  <span>{DEMO_PROFILE.displayName}</span>
                  <button type="button" className="profile-edit-button" aria-label="Edit name">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m14.5 4.5 5 5M3 21l4.7-1 12.1-12.1a2.1 2.1 0 0 0-3-3L4.7 17 3 21Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="profile-setting-row">
                <h2>Email Address</h2>
                <div className="profile-setting-value">
                  <span>{DEMO_PROFILE.email}</span>
                  <button type="button" className="profile-edit-button" aria-label="Edit email address">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m14.5 4.5 5 5M3 21l4.7-1 12.1-12.1a2.1 2.1 0 0 0-3-3L4.7 17 3 21Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="profile-setting-row">
                <h2>Phone Number</h2>
                <div className="profile-setting-value">
                  <span>{DEMO_PROFILE.phone}</span>
                  <button type="button" className="profile-edit-button" aria-label="Edit phone number">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m14.5 4.5 5 5M3 21l4.7-1 12.1-12.1a2.1 2.1 0 0 0-3-3L4.7 17 3 21Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="profile-setting-row profile-setting-row--password">
                <h2>Password</h2>
                <div className="profile-setting-value profile-password-value">
                  <span>{DEMO_PROFILE.passwordMask}</span>
                  <button type="button" className="profile-edit-button" aria-label="Edit password">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m14.5 4.5 5 5M3 21l4.7-1 12.1-12.1a2.1 2.1 0 0 0-3-3L4.7 17 3 21Z" />
                    </svg>
                  </button>
                  <span className="password-changed">Last changed {DEMO_PROFILE.passwordChanged}</span>
                </div>
              </div>
              <div className="profile-setting-row">
                <h2>Origin</h2>
                <div className="profile-setting-value">
                  <span>{DEMO_PROFILE.origin}</span>
                </div>
              </div>
              <div className="profile-setting-row">
                <h2>Theme</h2>
                <div className="profile-setting-value">
                  <span>System Default</span>
                  <span className="profile-chevron" aria-hidden="true" />
                </div>
              </div>
              <div className="profile-setting-row profile-setting-row--chat-color">
                <h2>Chat Color</h2>
                <div className="profile-setting-value profile-chat-colors">
                  <span className="chat-color-name">{selectedChatColor?.name}</span>
                  <span className="profile-chevron" aria-hidden="true" />
                  <div className="chat-color-dots" aria-label="Available chat colors">
                    {chatColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        className={`chat-color-dot chat-color-dot--${color.className}`}
                        aria-label={`Set chat color to ${color.name}`}
                        aria-pressed={selectedChatColor?.name === color.name}
                        onClick={() => {
                          setSelectedChatColor(color)
                          setIsProfileOpen(false)
                          setIsSidebarOpen(false)
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </main>
        ) : (
          <main className="welcome-content">
            {typeof userName === 'string' && userName.trim() && (
              <p className="hero__greeting">Welcome back, {userName}.</p>
            )}
            <h1>Welcome, {DEMO_PROFILE.displayName}!</h1>
            <p className="welcome-subtitle">What are we searching for today?</p>

            <form
              className="search-panel"
              style={{ backgroundColor: selectedChatColor?.value }}
              role="search"
              aria-busy={isBusy}
              onSubmit={(event) => {
                event.preventDefault()
                void handleSubmit(query)
              }}
            >
              <input
                className="search-input"
                type="text"
                aria-label="Search"
                placeholder="Find something to research"
                value={query}
                disabled={isBusy}
                onChange={(event) => setQuery(event.target.value)}
              />
              <div className="search-actions">
                {SpeechRecognition && (
                  <button
                    type="button"
                    className="voice-button"
                    aria-label="Voice input"
                    aria-pressed={isListening}
                    disabled={isBusy || isListening}
                    onClick={handleVoiceInput}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="send-button"
                  aria-label="Search"
                  disabled={!query.trim() || isBusy}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3 3l19 9-19 9 4.5-9z" />
                  </svg>
                </button>
              </div>
            </form>
            {(isBusy || isListening || error) && (
              <p className="search-status" role="status">
                {isBusy ? 'Searching…' : isListening ? 'Listening…' : error}
              </p>
            )}
          </main>
        )}
      </section>

      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        id="app-sidebar"
        className={`sidebar-panel${isSidebarOpen ? ' is-open' : ''}`}
        aria-label="Sidebar navigation"
        aria-hidden={!isSidebarOpen}
        inert={!isSidebarOpen}
      >
        <nav className="sidebar-nav" aria-label="Main navigation">
          <button
            type="button"
            className="nav-item"
            aria-pressed={activeNavItem === 'libraries'}
            onClick={() => {
              setActiveNavItem('libraries')
              setIsProfileOpen(false)
            }}
          >
            <span className="nav-icon nav-icon--library" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M5 7.8v9.4A2.8 2.8 0 0 0 7.8 20h8.4a2.8 2.8 0 0 0 2.8-2.8V7.8L15 5l-5 2.8L5 7.8Z" /><path d="M10 7.8 15 5v12.2l-5-2.8V7.8Z" /></svg>
            </span>
            <span>View Libraries</span>
          </button>

          <button
            type="button"
            className="nav-item"
            aria-pressed={activeNavItem === 'findings'}
            onClick={() => {
              setActiveNavItem('findings')
              setIsProfileOpen(false)
            }}
          >
            <span className="nav-icon nav-icon--findings" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="5.5" /><path d="M15.5 15.5 20 20" /></svg>
            </span>
            <span>Quick Findings</span>
          </button>

          <button
            type="button"
            className="nav-item"
            aria-pressed={activeNavItem === 'websites'}
            onClick={() => {
              setActiveNavItem('websites')
              setIsProfileOpen(false)
            }}
          >
            <span className="nav-icon nav-icon--web" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" /></svg>
            </span>
            <span>Visit recent websites</span>
          </button>
        </nav>

        <div className="chat-section">
          <span>Chats</span>
        </div>

        <button
          type="button"
          className={`profile-block${isProfileOpen ? ' is-selected' : ''}`}
          aria-label={`Open profile for ${DEMO_PROFILE.displayName}`}
          aria-pressed={isProfileOpen}
          onClick={() => {
            setIsProfileOpen(!isProfileOpen)
            setActiveNavItem('')
            setIsSidebarOpen(false)
          }}
        >
          <div className="avatar" aria-hidden="true">{initialOf(DEMO_PROFILE.displayName)}</div>
          <span>{DEMO_PROFILE.displayName}</span>
        </button>
      </aside>
    </div>
  )
}

export default App
