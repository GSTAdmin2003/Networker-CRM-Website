'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'
import { Lang } from '@/lib/i18n'

interface Props {
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
  lang: Lang
}

export function ContactModal({ isOpen, onClose, t, lang }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setSubmitted(false)
    setError('')
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="contact-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('contact_title')}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="contact-panel" ref={panelRef} tabIndex={-1}>
        <button className="contact-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="contact-eyebrow">{t('contact_eyebrow')}</div>
        <h2 className="contact-title">{t('contact_title')}</h2>
        <p className="contact-sub">{t('contact_sub')}</p>

        {!submitted ? (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <input
              type="text" name="name" required
              className="contact-input"
              placeholder={t('contact_ph_name')}
              autoComplete="name"
              maxLength={120}
            />
            <input
              type="email" name="email" required
              className="contact-input"
              placeholder={t('contact_ph_email')}
              autoComplete="email"
            />
            <textarea
              name="message" required
              className="contact-textarea"
              placeholder={t('contact_ph_message')}
              maxLength={2000}
            />
            {error && <p className="contact-error">{error}</p>}
            <button className="contact-submit" type="submit" disabled={loading}>
              {loading ? '…' : (
                <>
                  <span>{t('contact_submit')}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="contact-success" role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <div>
              <div className="contact-success-title">{t('contact_ok_title')}</div>
              <div className="contact-success-body">{t('contact_ok_body')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
