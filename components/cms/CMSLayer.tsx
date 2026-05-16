'use client'
import { useState, useEffect } from 'react'
import { CMSContextProvider } from './CMSContext'
import { CMSToolbar } from './CMSToolbar'

export default function CMSLayer({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'prompt' | 'authed'>('checking')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    fetch('/api/cms/auth')
      .then((r) => setStatus(r.ok ? 'authed' : 'prompt'))
      .catch(() => setStatus('prompt'))
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const res = await fetch('/api/cms/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) setStatus('authed')
    else setAuthError('Wrong password')
  }

  if (status === 'checking') return null

  if (status === 'prompt') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,20,36,0.85)', backdropFilter: 'blur(8px)',
      }}>
        <form onSubmit={handleLogin} style={{
          background: 'white', borderRadius: 12, padding: 32,
          display: 'flex', flexDirection: 'column', gap: 14, minWidth: 320,
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, color: '#0F1C32' }}>
            Edit mode
          </div>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="CMS password" autoFocus
            style={{
              height: 42, border: '1.5px solid #e5e7eb', borderRadius: 8,
              padding: '0 14px', fontSize: 14, outline: 'none',
            }}
          />
          {authError && <div style={{ color: '#dc2626', fontSize: 13 }}>{authError}</div>}
          <button type="submit" style={{
            height: 42, background: '#0F1C32', color: 'white', border: 'none',
            borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Unlock
          </button>
        </form>
      </div>
    )
  }

  return (
    <CMSContextProvider>
      {children}
      <CMSToolbar />
    </CMSContextProvider>
  )
}
