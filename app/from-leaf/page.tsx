import type { Metadata } from 'next';
import PageScene from '@/components/PageScene';
import Rise from '@/components/Rise';

export const metadata: Metadata = { title: 'From Leaf · Teara', description: 'The seven steps from a Darjeeling tea leaf to a facial serum, and what we can and cannot claim yet.' };

const STEPS = [
  ['On the estate', 'It starts on the slopes.', 'Tea is grown and plucked on Darjeeling estates for the cup. Everything we make will begin with these leaves.'],
  ['After processing', 'Some leaf is left over.', 'Processing leaves behind leaf that has little further use. This is the material we work with.'],
  ['Collection', 'We collect what is left.', 'We collect leftover leaf from Lopchu and Glenburn tea estates and bring it to the lab.'],
  ['Extraction', 'We compare ways to draw it out.', 'Different extraction methods pull different things from a leaf. We are comparing methods to learn which works best for our leaf, and which gives a stable extract.'],
  ['Understanding the extract', 'We find out what is in it.', 'Tea leaves contain compounds such as polyphenols, which skincare researchers study. We want to know which of them survive our process, before we make any promise about them.'],
  ['Formulation', 'Only then do we make the serum.', 'Once the extract is understood, we will develop a facial serum around it, guided by what the people we spoke to asked for.'],
  ['Back to Darjeeling', 'Value goes back to where it started.', 'Leaf that would have been thrown away becomes an ingredient, and the estates get something back for it.'],
];

export default function FromLeaf() {
  return (
    <>
      <PageScene mode="leaf" stage />
      <section className="hero wrap" aria-labelledby="h-leaf">
        <div className="stack">
          <p className="eyebrow">From Leaf</p>
          <h1 id="h-leaf">From leaf to serum, one step at a time.</h1>
          <p className="lede">Seven steps, from a tea estate in Darjeeling to a bottle on your shelf. Scroll, and watch the leaf change shape.</p>
        </div>
      </section>

      <section className="wrap steps" aria-label="The seven steps">
        {STEPS.map(([name, h, t], i) => (
          <article className="step" data-step={i} key={name}>
            <div className="panel">
              <span className="k">{String(i + 1).padStart(2, '0')} · {name}</span>
              <h2>{h}</h2>
              <p>{t}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="section wrap" aria-labelledby="h-honest">
        <div className="stack">
          <p className="eyebrow">Being clear with you</p>
          <h2 id="h-honest" style={{ maxWidth: '14em' }}>What we know, what we are testing, and what we will not claim yet.</h2>
          <Rise className="three">
            <div>
              <h3>What we know</h3>
              <ul>
                <li>Darjeeling estates are left with tea leaf after processing.</li>
                <li>We can source leftover leaves from Lopchu and Glenburn.</li>
                <li>We have made a first green tea leaf extract in oil form.</li>
                <li>The people we spoke to wanted a product like this.</li>
              </ul>
            </div>
            <div>
              <h3>What we are testing</h3>
              <ul>
                <li>Which extraction method works best for this leaf.</li>
                <li>How to keep the extract stable inside a serum.</li>
                <li>What people need from a facial serum.</li>
              </ul>
            </div>
            <div>
              <h3>What we will not claim yet</h3>
              <ul>
                <li>Any result on skin.</li>
                <li>Anti-aging or other benefits.</li>
                <li>That it suits every skin type.</li>
              </ul>
              <p className="muted" style={{ fontSize: 'var(--step--1)' }}>We will only say these things once proper testing supports them.</p>
            </div>
          </Rise>
        </div>
      </section>
    </>
  );
}
