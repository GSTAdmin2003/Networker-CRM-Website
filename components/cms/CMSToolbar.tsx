'use client'
import { useCMS } from './CMSContext'

export function CMSToolbar() {
  const { saving, error, save, logout } = useCMS()
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
    }}>
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
          padding: '8px 14px', borderRadius: 8, fontSize: 13, maxWidth: 300,
        }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href="/leads?edit=1"
          target="_blank"
          rel="noreferrer"
          style={{
            height: 40, padding: '0 16px', background: '#111',
            border: '1px solid #1e1e1e', borderRadius: 8,
            fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#6ee7b7',
            display: 'flex', alignItems: 'center', textDecoration: 'none',
          }}
        >
          Leads ↗
        </a>
        <button
          onClick={logout}
          style={{
            height: 40, padding: '0 16px', background: 'white',
            border: '1px solid #e5e7eb', borderRadius: 8,
            fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#374151',
          }}
        >
          Exit edit mode
        </button>
        <button
          onClick={save}
          disabled={saving}
          style={{
            height: 40, padding: '0 20px',
            background: saving ? '#6b7280' : '#0D9488',
            color: 'white', border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
