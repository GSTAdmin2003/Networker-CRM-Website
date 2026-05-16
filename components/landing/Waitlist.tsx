'use client'
import { useState, FormEvent } from 'react'
import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

export function Waitlist({ t, lang }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, lang }),
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

  const roleKeys = ['wl_role_founder','wl_role_mgr','wl_role_rep','wl_role_ops','wl_role_inv','wl_role_other'] as const
  const roleValues = ['founder','sales-manager','rep','ops','investor','other']

  return (
    <section className="waitlist section" id="waitlist">
      <div className="wrap waitlist-inner">
        <div className="waitlist-eyebrow">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
          <span dangerouslySetInnerHTML={{ __html: t('wl_eyebrow') }} />
        </div>
        <h2 dangerouslySetInnerHTML={{ __html: t('wl_title') }} />
        <p className="waitlist-sub" dangerouslySetInnerHTML={{ __html: t('wl_sub') }} />

        {!submitted ? (
          <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
            <input
              type="email" name="email" required
              className="wl-input" placeholder={t('wl_ph_email')}
              autoComplete="email"
            />
            <select name="role" required className="wl-input" defaultValue="">
              <option value="" disabled>{t('wl_role_default')}</option>
              {roleKeys.map((k, i) => (
                <option key={k} value={roleValues[i]}>{t(k)}</option>
              ))}
            </select>
            <button className="wl-submit" type="submit" disabled={loading}>
              {loading ? '…' : <><span dangerouslySetInnerHTML={{ __html: t('wl_submit') }} /><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>}
            </button>
            {error && <p style={{ color: '#f87171', fontSize: 13, gridColumn: '1/-1', margin: 0 }}>{error}</p>}
          </form>
        ) : (
          <div className="wl-success show" role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <div>
              <div className="wl-success-title" dangerouslySetInnerHTML={{ __html: t('wl_ok_title') }} />
              <div className="wl-success-body" dangerouslySetInnerHTML={{ __html: t('wl_ok_body') }} />
            </div>
          </div>
        )}

        <div className="wl-foot">
          {(['wl_foot_1','wl_foot_2','wl_foot_3'] as const).map((k) => (
            <span key={k} dangerouslySetInnerHTML={{ __html: t(k) }} />
          ))}
        </div>
      </div>
    </section>
  )
}
