import type { Metadata } from 'next';
import PageScene from '@/components/PageScene';
import PreviewForm from '@/components/PreviewForm';
import Rise from '@/components/Rise';
import { Arrow } from '@/components/Icons';

export const metadata: Metadata = { title: 'The Serum · Teara', description: "Teara's first product, a tea-extract facial serum, and where it stands today." };

const STATUS: [string, string, string, string][] = [
  ['Proof of concept', 'done', 'Done', 'A green tea leaf extract in oil form, and the idea tested with potential customers.'],
  ['Extraction method', 'now', 'In progress', 'Comparing methods to find the one that suits our leaves best.'],
  ['Formula', 'later', 'Not started', 'Developed once the extract is understood and stable.'],
  ['Testing', 'later', 'Not started', 'Stability and safety testing come before anything reaches skin.'],
  ['Launch', 'later', 'No date yet', 'We will share a date when we are confident in one.'],
];
const SKIN = [['dry', 'Dry'], ['oily', 'Oily'], ['combination', 'Combination'], ['sensitive', 'Sensitive'], ['not sure', 'Not sure']];

export default function Serum() {
  return (
    <>
      <PageScene mode="serum" stage />
      <section className="hero wrap" aria-labelledby="h-serum">
        <div className="stack">
          <p className="eyebrow">The Serum · N° 01</p>
          <h1 id="h-serum">A tea-extract facial serum. In the making.</h1>
          <p className="lede">Our first product will be a facial serum built around an extract of Darjeeling tea leaves. There is no formula yet, and we would rather tell you that than pretend otherwise.</p>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="h-stands">
        <div className="split">
          <div className="stack panel-m">
            <p className="eyebrow">Where it stands today</p>
            <h2 id="h-stands">Five steps. One done.</h2>
            <Rise as="ul" className="status">
              {STATUS.map(([k, cls, pill, t]) => (
                <li key={k}><strong>{k}</strong><span className={`pill ${cls}`}>{pill}</span><p>{t}</p></li>
              ))}
            </Rise>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="h-updates">
        <div className="split">
          <div className="stack panel-m">
            <p className="eyebrow">Following along</p>
            <h2 id="h-updates">What we will share as we go.</h2>
            <p>When we choose an extraction method, we will explain why. When we have a first formula, we will say what is in it. When testing is done, we will share what it showed, including anything that did not work.</p>
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="h-help">
        <div className="split">
          <div className="stack panel">
            <p className="eyebrow">Early list</p>
            <h2 id="h-help">Help us shape it.</h2>
            <p>Tell us about your skin and what you want from a serum. Every answer goes into how we design it.</p>
            <PreviewForm done="Thank you. This preview cannot send answers yet. On the live site they will reach the team, and we will only write when there is real news.">
              <div className="field"><label htmlFor="s-name">Your name</label><input id="s-name" name="name" type="text" autoComplete="name" placeholder="Pema" /></div>
              <div className="field"><label htmlFor="s-email">Email</label><input id="s-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>
              <fieldset>
                <legend>My skin usually feels</legend>
                {SKIN.map(([v, l]) => (
                  <label className="chip" key={v}><input type="radio" name="skin" value={v} /><span>{l}</span></label>
                ))}
              </fieldset>
              <div className="field"><label htmlFor="s-want">What do you want from a serum?</label><textarea id="s-want" name="want" placeholder="Something light I can wear under sunscreen in the humid months." /></div>
              <label className="check"><input type="checkbox" name="news" defaultChecked /> Write to me when there is real news about the serum.</label>
              <p><button className="btn" type="submit">Join the early list <Arrow /></button></p>
            </PreviewForm>
          </div>
        </div>
      </section>
    </>
  );
}
