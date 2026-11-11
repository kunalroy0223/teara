
import type { Metadata } from 'next';
import PageScene from '@/components/PageScene';
import Rise from '@/components/Rise';

export const metadata: Metadata = {
  title: 'About Us · Teara',
  description:
    'The story of Teara, from a question in the Darjeeling hills to a growing venture.',
};

const CHAPTERS = [
  {
    n: 'i.',
    e: 'Where we began',
    h: 'A familiar landscape.',
    t: 'Darjeeling has always been shaped by tea. Its gardens, its people, its rhythm of life. Growing up around this landscape, we knew the journey from leaf to cup. But we began to wonder about the part of the story that remained untold.',
  },
  {
    n: 'ii.',
    e: 'What remained',
    h: 'A story left unfinished.',
    t: 'After processing, much of the tea leaf was left behind. Its familiar purpose had been fulfilled, but we wondered if its story had ended there. Could something valuable still be found within it?',
  },
  {
    n: 'iii.',
    e: 'Where the leaves come from',
    h: 'Rooted in Darjeeling.',
    t: 'Our exploration brought us to Lopchu Tea Estate and Glenburn Tea Estate. We work with the leaves remaining after processing, looking at an existing resource through a different lens.',
  },
];

export default function About() {
  return (
    <>
      <PageScene mode="story" />

      <section className="hero wrap" aria-labelledby="h-about">
        <div className="stack">
          <p className="eyebrow">The beginning</p>
          <h1 id="h-about">A question hidden in the hills.</h1>
          <p className="tag">
            And a possibility waiting to be discovered.
          </p>
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
            <p className="eyebrow">The making of Teara</p>
            <h2 id="h-how">
              From a question in the hills to a growing venture.
            </h2>
            <p className="muted">
              Each step below marks a part of our journey.
            </p>
          </div>

          <Rise as="ol" className="timeline panel">
            <li>
              <h3>The first question</h3>
              <p>
                A question about what happens to tea leaves after processing
                became the beginning of Chaicycle, the original identity of
                what would later become Teara.
              </p>
            </li>

            <li>
              <h3>A new identity</h3>
              <p>
                As the concept evolved, so did our vision. Chaicycle became
                Teara, carrying the original question forward with a clearer
                direction and a renewed sense of purpose.
              </p>
            </li>

            <li>
              <h3>The first experiment</h3>
              <p>
                An oil based green tea leaf extract became our first proof of
                concept. We took it into conversations with potential
                customers, learning what the possibility could become.
              </p>
            </li>

            <li>
              <h3>Taking the idea further</h3>
              <p>
                The idea found recognition at local and national pitch
                competitions. In 2026, Teara secured a Top 3 position at
                Pitch Karo India, selected from more than 7,000 applications.
              </p>
            </li>

            <li>
              <h3>Growing beyond the beginning</h3>
              <p>
                Teara joined AIC-SMUTBI and Inhub E-Cell as part of its
                incubation journey. Along the way, we were selected among
                the Top 20 startups from North East India under AEGIS NE,
                an initiative supported by Numaligarh Refinery Limited
                (NRL).
              </p>
            </li>

            <li className="now">
              <h3>The work continues</h3>
              <p>
                What began as a question continues to shape our work. We
                remain committed to exploring the possibilities of
                Darjeeling&apos;s tea heritage and finding new meaning in
                what the land already offers.
              </p>
            </li>
          </Rise>
        </div>
      </section>

      <section
        className="section wrap"
        aria-labelledby="h-incubation"
      >
        <div className="stack">
          <p className="eyebrow">The people along the way.</p>
          <h2 id="h-incubation">The ecosystems supporting our journey.</h2>

          <div className="incubators-grid">
            <Rise className="partner">
              <div className="incubator-card">
                <div className="incubator-logo-wrap aic-logo-wrap">
                  <img
                    src="/brand/aic-smutbi.png"
                    alt="AIC-SMUTBI logo"
                    className="incubator-logo"
                    width={260}
                    height={260}
                  />
                </div>

                <div className="stack-sm">
                  <h3>AIC-SMUTBI</h3>
                  <p>
                    An incubation ecosystem that has supported Teara&apos;s
                    growth, providing an environment to learn, connect and
                    take our early vision further.
                  </p>
                </div>
              </div>
            </Rise>

            <Rise className="partner">
              <div className="incubator-card">
                <div className="incubator-logo-wrap inhub-logo-wrap">
                  <img
                    src="/brand/inhub.png"
                    alt="Inhub Entrepreneurship Cell logo"
                    className="incubator-logo"
                    width={260}
                    height={260}
                  />
                </div>

                <div className="stack-sm">
                  <h3>Inhub Entrepreneurship Cell</h3>
                  <p>
                    An ecosystem that has been part of Teara&apos;s
                    beginnings, supporting our efforts to turn an early
                    question into a venture.
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
            Made here, from what is <em> already here.</em>
          </p>
        </Rise>
      </section>
    </>
  );
}
