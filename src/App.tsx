const contactHref =
  'mailto:hello@ubtesting.com?subject=UB%20Testing%20%E2%80%94%20Early%20access'

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      <span>U</span>
      <span>B</span>
    </span>
  )
}

function SignalStage() {
  return (
    <div className="signal-stage" aria-hidden="true">
      <div className="stage-glow" />
      <div className="orbit orbit-outer">
        <span className="orbit-node node-one" />
        <span className="orbit-node node-two" />
      </div>
      <div className="orbit orbit-middle">
        <span className="orbit-node node-three" />
      </div>
      <div className="orbit orbit-inner" />
      <div className="core">
        <span className="core-pulse" />
        <img
          className="core-logo"
          src="/logo.webp"
          alt=""
          width={384}
          height={384}
          decoding="async"
        />
      </div>
      <span className="core-index">UB / 01</span>
      <span className="core-word">Proof</span>
      <span className="coordinate coordinate-top">52.5200° N</span>
      <span className="coordinate coordinate-bottom">13.4050° E</span>
      <span className="axis axis-x" />
      <span className="axis axis-y" />
    </div>
  )
}

export default function App() {
  return (
    <div className="site-shell" id="top">
      <div className="grain" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="UB Testing home">
          <Mark />
          <span className="brand-name">
            UB <span>Testing</span>
          </span>
        </a>

        <div className="header-meta" aria-label="Studio launch status">
          <span className="status-dot" aria-hidden="true" />
          <span>Independent digital studio</span>
          <span className="header-index">EST. 2026</span>
        </div>
      </header>

      <main aria-label="UB Testing introduction">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow reveal reveal-one">
              <span>Coming soon</span>
              <span className="eyebrow-line" />
              <span>Berlin / Everywhere</span>
            </p>

            <h1 className="reveal reveal-two">
              We make
              <span className="serif-line">digital certainty</span>
              feel inevitable.
            </h1>

            <div className="hero-footer reveal reveal-three">
              <p className="intro">
                We design, test, and sharpen digital products until every interaction earns its
                place. A new studio experience is taking shape.
              </p>

              <a className="contact-link" href={contactHref}>
                <span>Request early access</span>
                <span className="contact-icon">
                  <ArrowIcon />
                </span>
              </a>
            </div>
          </div>

          <div className="visual-column reveal reveal-four">
            <SignalStage />

            <dl className="practice-list" aria-label="Studio practices">
              <div>
                <dt>01</dt>
                <dd>Product systems</dd>
              </div>
              <div>
                <dt>02</dt>
                <dd>Experience design</dd>
              </div>
              <div>
                <dt>03</dt>
                <dd>Quality engineering</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <footer className="site-footer reveal reveal-five">
        <div className="build-status" role="status">
          <span className="status-ping" aria-hidden="true">
            <span />
          </span>
          <span>Currently calibrating</span>
          <span className="status-progress" aria-hidden="true">
            <span />
          </span>
          <span>72%</span>
        </div>

        <p>© {new Date().getFullYear()} UB Testing. Built with intent.</p>
      </footer>
    </div>
  )
}
