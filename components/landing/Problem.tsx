import { EditableText } from '@/components/cms/EditableText'
import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

export function Problem({ t, lang }: Props) {
  return (
    <section className="problem section">
      <div className="wrap problem-inner">
        <div>
          <div className="section-eyebrow">
            <span className="section-eyebrow-num">01</span>
            <EditableText cmsKey={`problem_eyebrow_${lang}`} html={t('problem_eyebrow')} />
          </div>
          <div className="problem-stat">50<span className="problem-stat-pct">%</span></div>
          <div className="problem-stat-caption">
            <EditableText cmsKey={`problem_caption_${lang}`} html={t('problem_caption')} />
          </div>
        </div>
        <div className="problem-text">
          <h2>
            <EditableText cmsKey={`problem_h2_${lang}`} html={t('problem_h2')} />
          </h2>
          <p>
            <EditableText cmsKey={`problem_p1_${lang}`} html={t('problem_p1')} />
          </p>
          <p>
            <EditableText cmsKey={`problem_p2_${lang}`} html={t('problem_p2')} />
          </p>
          <ul className="problem-list">
            {(['problem_li_1','problem_li_2','problem_li_3','problem_li_4'] as const).map((k) => (
              <li key={k}>
                <EditableText cmsKey={`${k}_${lang}`} html={t(k)} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
