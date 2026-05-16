import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Networker — All-in-one. AI-powered. CRM for Georgian sales teams.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F1C32',
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          padding: '80px 96px', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, background: '#0D9488', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>N</div>
          </div>
          <span style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>Networker</span>
        </div>
        <div style={{ color: 'white', fontSize: 56, fontWeight: 800, lineHeight: 1.05, maxWidth: 800, letterSpacing: '-2px', marginBottom: 24 }}>
          The CRM Georgian sales teams actually use.
        </div>
        <div style={{ color: '#14B8A6', fontSize: 22, fontWeight: 500 }}>
          All-in-one · AI-powered · $60/user/month
        </div>
      </div>
    ),
    size
  )
}
