import { EditableText } from '@/components/cms/EditableText'
import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

const CHECK = (
  <span className="check-icon">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  </span>
)
const X = (
  <span className="x-icon">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  </span>
)

export function Compare({ t, lang }: Props) {
  return (
    <section className="compare section" id="compare">
      <div className="wrap">
        <div className="compare-head">
          <div>
            <div className="section-eyebrow">
              <span className="section-eyebrow-num">03</span>
              <EditableText cmsKey={`cmp_eyebrow_${lang}`} html={t('cmp_eyebrow')} />
            </div>
            <h2 className="section-title">
              <EditableText cmsKey={`cmp_title_${lang}`} html={t('cmp_title')} />
            </h2>
          </div>
          <div className="compare-tag">
            <span>$60</span>&nbsp;<EditableText cmsKey={`cmp_tag_${lang}`} html={t('cmp_tag')} />
          </div>
        </div>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_product') }} />
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_price') }} />
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_tel') }} />
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_stt') }} />
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_wa') }} />
              </tr>
            </thead>
            <tbody>
              <tr className="compare-row-us">
                <td className="compare-prod">Networker</td>
                <td className="compare-price" dangerouslySetInnerHTML={{ __html: t('cmp_us_price') }} />
                <td><span className="compare-cell-y">{CHECK} <span dangerouslySetInnerHTML={{ __html: t('cmp_us_tel') }} /></span></td>
                <td><span className="compare-cell-y">{CHECK} <span dangerouslySetInnerHTML={{ __html: t('cmp_us_stt') }} /></span></td>
                <td><span className="compare-cell-y">{CHECK} <span dangerouslySetInnerHTML={{ __html: t('cmp_us_wa') }} /></span></td>
              </tr>
              <tr>
                <td className="compare-prod">Salesforce</td>
                <td className="compare-price">$150+</td>
                <td><span className="compare-cell-addon" dangerouslySetInnerHTML={{ __html: t('cmp_addon') }} /></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no6') }} /></span></td>
              </tr>
              <tr>
                <td className="compare-prod">Bitrix24</td>
                <td className="compare-price" dangerouslySetInnerHTML={{ __html: t('cmp_bitrix_price') }} />
                <td><span className="compare-cell-addon" dangerouslySetInnerHTML={{ __html: t('cmp_addon2') }} /></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no2') }} /></span></td>
                <td><span className="compare-cell-addon" dangerouslySetInnerHTML={{ __html: t('cmp_third') }} /></td>
              </tr>
              <tr>
                <td className="compare-prod">Zoho CRM</td>
                <td className="compare-price">$20+</td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no3') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no4') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_ext') }} /></span></td>
              </tr>
              <tr>
                <td className="compare-prod">HubSpot</td>
                <td className="compare-price">$0 – $45+</td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no5') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no6') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_lim') }} /></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
