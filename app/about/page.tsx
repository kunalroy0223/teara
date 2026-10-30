
import type { Metadata } from 'next';
import PageScene from '@/components/PageScene';
import Rise from '@/components/Rise';

export const metadata: Metadata = {
  title: 'About Us · Teara',
  description:
    'Where Teara comes from, how a student idea became a company, and where it is incubated.',
};

const CHAPTERS = [
  {
    n: 'i.',
    e: 'Where we are from',
    h: 'Close to the gardens.',
    t: 'We are four students at Inspiria Knowledge Campus in Siliguri, a short drive from the Darjeeling tea estates. Tea is the industry we see around us every day, so it was natural to start there.',
  },
  {
    n: 'ii.',
    e: 'What we noticed',
    h: 'Good leaf, very little use.',
    t: 'Once tea is processed, the leaf that remains rarely goes anywhere useful. We wondered whether some of what makes tea leaves interesting could still be recovered from it.',
  },
  {
    n: 'iii.',
    e: 'Where our leaves come from',
    h: 'Lopchu and Glenburn.',
    t: 'Our leaves come from two Darjeeling estates, Lopchu Tea Estate and Glenburn Tea Estate. We work with leaf that is left after processing, so we use material that already exists instead of growing more.',
  },
];

export default function About() {
  return (
    <>
      <PageScene mode="story" />

      <section className="hero wrap" aria-labelledby="h-about">
        <div className="stack">
          <p className="eyebrow">About Us</p>
          <h1 id="h-about">It started with a pile of used tea leaves.</h1>
          <p className="tag">And a simple question about where they go.</p>
        </div>
      </section>

      {CHAPTERS.map((c, i) => (
        <section className="section wrap" key={c.n}>
          <Rise className={`chapter panel${i % 2 ? ' right' : ''}`}>
            <span className="num">{c.n}</span>
            <div className="stack-sm">
              <p className="eyebrow">{c.e}</p>
              <h2>{c.h}</h2>
              <p>{c.t}</p>
            </div>
          </Rise>
        </section>
      ))}

      <section className="section wrap" aria-labelledby="h-how">
        <div className="split">
          <div className="stack">
            <p className="eyebrow">How Teara started</p>
            <h2 id="h-how">From a student question to a company.</h2>
            <p className="muted">Each step below happened in this order.</p>
          </div>

          <Rise as="ol" className="timeline panel">
            <li>
              <span className="when">The idea</span>
              <h3>Chaicycle</h3>
              <p>
                Ayan Sunuwar asked what happens to tea leaves after processing.
                The first name for the idea was Chaicycle.
              </p>
            </li>

            <li>
              <span className="when">Proof of concept</span>
              <h3>A first extract</h3>
              <p>
                The team made a green tea leaf extract in oil form and tested
                the idea in conversations with potential customers.
              </p>
            </li>

            <li>
              <span className="when">On stage</span>
              <h3>Pitch competitions</h3>
              <p>
                The idea won at local and national pitch competitions, and
                placed in the Top 3 at Pitch Karo India 2026, out of more than
                7,000 applications.
              </p>
            </li>

            <li>
              <span className="when">Incubation</span>
              <h3>Two incubators</h3>
              <p>
                Teara is incubated at AIC-SMUTBI and Inhub E-Cell,
                supporting our journey from an early-stage idea toward
                product development.
              </p>
            </li>

            <li>
              <span className="when">Recognition</span>
              <h3>Top 20 startups in North East India</h3>
              <p>
                Teara was recognized as one of the Top 20 startups in North
                East India under the AEGIS NE programme, under AIC-SMUTBI and
                supported by NRL.
              </p>
            </li>

            <li className="now">
              <span className="when">Now</span>
              <h3>Research</h3>
              <p>
                Comparing extraction methods and working toward a stable
                tea-extract facial serum.
              </p>
            </li>
          </Rise>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="h-incubation">
        <div className="stack">
          <p className="eyebrow">Incubation</p>
          <h2 id="h-incubation">Supported by our ecosystem.</h2>

          <div className="incubators-grid">
            <Rise className="partner">
              <div className="incubator-card">
                <img
                  src="/brand/aic-smutbi.png"
                  alt="AIC-SMUTBI logo"
                  className="incubator-logo"
                  width={260}
                  height={260}
                />

                <div className="stack-sm">
                  <h3>AIC-SMUTBI</h3>
                  <p>
                    Teara is incubated at AIC-SMUTBI, which supports our
                    entrepreneurial journey as we move from idea to product.
                  </p>
                </div>
              </div>
            </Rise>

            <Rise className="partner">
              <div className="incubator-card">
                <img
                  src="/brand/inhub.png"
                  alt="Inhub Entrepreneurship Cell logo"
                  className="incubator-logo"
                  width={260}
                  height={260}
                />

                <div className="stack-sm">
                  <h3>Inhub E-Cell</h3>
                  <p>
                    Inhub E-Cell supports our entrepreneurial
                    journey, helping us develop our idea and build Teara from
                    the ground up.
                  </p>
                </div>
              </div>
            </Rise>
          </div>
        </div>
      </section>

      <section className="section wrap">
        <Rise>
          <p className="quote">
            Made here, from what is already <em>here.</em>
          </p>
        </Rise>
      </section>
    </>
  );
}
