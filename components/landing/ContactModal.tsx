'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'
import { Lang } from '@/lib/i18n'

const INDUSTRIES = [
  { value: 'construction',           label: 'Construction' },
  { value: 'real_estate',            label: 'Real Estate' },
  { value: 'accounting_finance',     label: 'Accounting & Finance' },
  { value: 'retail',                 label: 'Retail' },
  { value: 'marketing_advertising',  label: 'Marketing & Advertising' },
  { value: 'wholesale_distribution', label: 'Wholesale & Distribution' },
  { value: 'logistics',              label: 'Logistics' },
  { value: 'it_technology',          label: 'IT & Technology' },
  { value: 'manufacturing',          label: 'Manufacturing' },
  { value: 'healthcare',             label: 'Healthcare' },
  { value: 'legal',                  label: 'Legal' },
  { value: 'other',                  label: 'Other' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
  lang: Lang
}

export function ContactModal({ isOpen, onClose, t, lang }: Props) {
  const [phase, setPhase] = useState<'1' | '2'>('1')
  const [contactId, setContactId] = useState('')
  const [industry, setIndustry] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setPhase('1')
    setContactId('')
    setIndustry('')
    setError('')
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      abortRef.current?.abort()
    }
  }, [isOpen, onClose])

  async function handlePhase1(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()
    try {
      abortRef.current = new AbortController()
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, lang }),
        signal: abortRef.current.signal,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setContactId(data.id)
      setPhase('2')
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handlePhase2(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!contactId) { setError('Something went wrong'); return }
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? ''
    try {
      abortRef.current = new AbortController()
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contactId,
          company_name: getValue('company_name'),
          company_id:   getValue('company_id'),
          rep_name:     getValue('rep_name'),
          rep_email:    getValue('rep_email'),
          industry,
          industry_other: industry === 'other' ? getValue('industry_other') : '',
        }),
        signal: abortRef.current.signal,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      onClose()
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
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

        {phase === '1' && (
          <>
            <div className="contact-eyebrow">{t('contact_eyebrow')}</div>
            <h2 className="contact-title">{t('contact_title')}</h2>
            <p className="contact-sub">{t('contact_sub')}</p>
            <form className="contact-form" onSubmit={handlePhase1} noValidate>
              <input
                type="tel" name="phone" required
                className="contact-input"
                placeholder={t('contact_ph_phone')}
                autoComplete="tel"
                maxLength={30}
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
          </>
        )}

        {phase === '2' && (
          <>
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
            <form className="contact-form" onSubmit={handlePhase2} noValidate>
              <input
                type="text" name="company_name"
                className="contact-input"
                placeholder={t('contact_ph_company_name')}
                maxLength={255}
              />
              <input
                type="text" name="company_id"
                className="contact-input"
                placeholder={t('contact_ph_company_id')}
                maxLength={255}
              />
              <input
                type="text" name="rep_name"
                className="contact-input"
                placeholder={t('contact_ph_rep_name')}
                maxLength={255}
              />
              <input
                type="email" name="rep_email"
                className="contact-input"
                placeholder={t('contact_ph_rep_email')}
              />
              <select
                name="industry"
                className="contact-input"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">{t('contact_ph_industry')}</option>
                {INDUSTRIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {industry === 'other' && (
                <input
                  type="text" name="industry_other" required
                  className="contact-input"
                  placeholder={t('contact_ph_industry_other')}
                  maxLength={255}
                />
              )}
              {error && <p className="contact-error">{error}</p>}
              <button className="contact-submit" type="submit" disabled={loading}>
                {loading ? '…' : (
                  <>
                    <span>{t('contact_submit_details')}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
