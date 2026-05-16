'use client'
import { EditableImage } from '@/components/cms/EditableImage'
import { useCMS } from '@/components/cms/CMSContext'
import { Lang } from '@/lib/i18n'

interface Props {
  t: (key: string) => string
  lang: Lang
  photos: { tsotne: string | null; davit: string | null; levan: string | null }
}

const MEMBERS = [
  { id: 'tsotne', slot: 'team-tsotne', initials: 'TT', nKey: 'team_n1', rKey: 'team_r1', bKey: 'team_b1' },
  { id: 'davit',  slot: 'team-davit',  initials: 'DS', nKey: 'team_n2', rKey: 'team_r2', bKey: 'team_b2' },
  { id: 'levan',  slot: 'team-levan',  initials: 'LK', nKey: 'team_n3', rKey: 'team_r3', bKey: 'team_b3' },
] as const

export function Team({ t, photos }: Props) {
  const { editMode } = useCMS()
  return (
    <section className="section-tight" id="team" style={{ background: 'white' }}>
      <div className="wrap">
        <div style={{ maxWidth: 720 }}>
          <div className="section-eyebrow">
            <span className="section-eyebrow-num">05</span>
            <span dangerouslySetInnerHTML={{ __html: t('team_eyebrow') }} />
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('team_title') }} />
          <p className="section-lede" dangerouslySetInnerHTML={{ __html: t('team_lede') }} />
        </div>
        <div className="team-grid">
          {MEMBERS.map((m, idx) => (
            <article key={m.id} className="team-card">
              <div className="team-photo-wrap">
                <div className="team-photo-fallback">
                  <div className="team-photo-initials" style={idx === 1 ? { background: 'var(--teal-700)' } : idx === 2 ? { background: 'var(--navy-700)' } : {}}>
                    {m.initials}
                  </div>
                  {editMode && <div className="team-photo-hint">Drop photo</div>}
                </div>
                <EditableImage
                  slot={m.slot}
                  src={photos[m.id as keyof typeof photos]}
                  alt={t(m.nKey)}
                  fallback={null}
                />
              </div>
              <div className="team-content">
                <div className="team-name" dangerouslySetInnerHTML={{ __html: t(m.nKey) }} />
                <div className="team-role" dangerouslySetInnerHTML={{ __html: t(m.rKey) }} />
                <div className="team-bio" dangerouslySetInnerHTML={{ __html: t(m.bKey) }} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
