import type { Metadata } from 'next';
import PageScene from '@/components/PageScene';
import Rise from '@/components/Rise';
import Go from '@/components/Go';
import { Arrow } from '@/components/Icons';

export const metadata: Metadata = { title: 'Questions · Teara', description: 'Straight answers about the Teara serum, its testing, sourcing and team.' };

const FAQ = [
  ['Can I buy the serum?', 'Not yet. It is still in research and there is no formula yet. Join the early list on the serum page and we will tell you when that changes.'],
  ['When will it launch?', 'We do not have a date. Extraction, formulation and testing all come first, and we will only share a date when we are confident in it.'],
  ['What will it do for my skin?', 'We do not know yet, and we will not guess. We will only describe what the serum does after it has been properly tested.'],
  ['Is it safe?', "Nothing will reach anyone's skin before it has gone through stability and safety testing."],
  ['Where do the leaves come from?', 'From Lopchu Tea Estate and Glenburn Tea Estate in Darjeeling. We use leaf that is left over after processing.'],
  ['Why use leftover leaves?', 'They would otherwise have little use. Using them means no extra land or crop is needed, and the estates get value from something they already have.'],
  ['Who is behind Teara?', 'Four students from Inspiria Knowledge Campus in Siliguri, guided by two mentors. You can meet them on the People page.'],
  ['How can I help?', 'Tell us what you want from a serum, or get in touch if you run a tea estate or work in extraction or formulation research.'],
];

export default function Questions() {
  return (
    <>
      <PageScene mode="seal" stage />
      <section className="hero wrap" aria-labelledby="h-q">
        <div className="stack">
          <p className="eyebrow">Questions</p>
          <h1 id="h-q">Straight answers.</h1>
          <p className="lede">The questions we hear most often, answered as plainly as we can. If yours is not here, ask us.</p>
        </div>
      </section>

      <section className="section wrap" aria-label="Questions and answers">
        <Rise as="dl" className="faq panel-m">
          {FAQ.map(([q, a]) => <div className="qa" key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </Rise>
      </section>

      <section className="section wrap" aria-labelledby="h-ask">
        <div className="stack panel-m">
          <p className="eyebrow">Still curious?</p>
          <h2 id="h-ask">Ask the team directly.</h2>
          <p><Go to="people" hash="#h-contact" className="btn">Write to us <Arrow /></Go></p>
        </div>
      </section>
    </>
  );
}
