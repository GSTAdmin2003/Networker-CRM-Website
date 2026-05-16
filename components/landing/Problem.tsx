import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

export function Problem({ t }: Props) {
  return (
    <section className="problem section">
      <div className="wrap problem-inner">
        <div>
          <div className="section-eyebrow">
            <span className="section-eyebrow-num">01</span>
            <span dangerouslySetInnerHTML={{ __html: t('problem_eyebrow') }} />
          </div>
          <div className="problem-stat">50<span className="problem-stat-pct">%</span></div>
          <div className="problem-stat-caption" dangerouslySetInnerHTML={{ __html: t('problem_caption') }} />
        </div>
        <div className="problem-text">
          <h2 dangerouslySetInnerHTML={{ __html: t('problem_h2') }} />
          <p dangerouslySetInnerHTML={{ __html: t('problem_p1') }} />
          <p dangerouslySetInnerHTML={{ __html: t('problem_p2') }} />
          <ul className="problem-list">
            {(['problem_li_1','problem_li_2','problem_li_3','problem_li_4'] as const).map((k) => (
              <li key={k} dangerouslySetInnerHTML={{ __html: t(k) }} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
