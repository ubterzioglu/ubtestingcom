import {
  weiterbildungIntro,
  weiterbildungSections,
  weiterbildungTitle,
} from './weiterbildungContent'
import './weiterbildung.css'

export default function WeiterbildungPage() {
  return (
    <div className="doc-page" lang="tr">
      <header className="doc-hero">
        <div className="doc-hero-inner">
          <a className="doc-back" href="/">
            ← ubtesting.com
          </a>
          <h1>{weiterbildungTitle}</h1>
          <p>{weiterbildungIntro}</p>
        </div>
      </header>

      <div className="doc-layout">
        <nav className="doc-nav" aria-label="İçindekiler">
          <strong>İçindekiler</strong>
          {weiterbildungSections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.navLabel}
            </a>
          ))}
        </nav>

        <main className="doc-main" aria-label={weiterbildungTitle}>
          {weiterbildungSections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </main>
      </div>

      <p className="doc-footer">Hazırlanan HTML dokümanı</p>
    </div>
  )
}
