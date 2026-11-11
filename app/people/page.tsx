import type { Metadata } from 'next';
import PageScene from '@/components/PageScene';
import PreviewForm from '@/components/PreviewForm';
import Rise from '@/components/Rise';
import { Arrow, Icon, IconLink } from '@/components/Icons';
import { CONTACT } from '@/lib/site';

export const metadata: Metadata = {
  title: 'People · Teara',
  description:
    'The founders and mentors behind Teara, and how to reach us.',
};

const TEAM = [
  {
    name: 'Ayan Sunuwar',
    role: 'Founder',
    description:
      'The originator of the founding idea, shaping its vision and purpose while defining the direction and principles on which the venture is built.',
    photo: '/pfp/ayan.png',
    linkedin: 'https://www.linkedin.com/in/ayan-sunuwar/',
    email: 'founder@teara.in',
  },
  {
    name: 'Kunal Roy',
    role: 'Co-founder & CEO',
    description:
      'At the intersection of vision, strategy and execution, bringing together people, ideas and opportunities while shaping the venture toward sustainable growth and long-term impact.',
    photo: '/pfp/kunal.png',
    linkedin: 'https://www.linkedin.com/in/kunal-roy-/',
    email: 'ceo@teara.in',
  },
  {
    name: 'Tanmoy Saha',
    role: 'Chief Operating Officer',
    description:
      'At the core of operational planning and execution, translating organisational priorities into structured processes while keeping teams aligned and work moving forward.',
    photo: '/pfp/tanmoy.png',
    linkedin: 'https://www.linkedin.com/in/tanmoy-saha-developer/',
    email: 'coo@teara.in',
  },
  {
    name: 'Tanisha Chowdhury',
    role: "Founder's Associate",
    description:
      'Bridging strategy and execution, coordinating cross-functional initiatives and keeping key priorities on track.',
    photo: '/pfp/tanisha.png',
    linkedin: 'https://www.linkedin.com/in/tanisha-chowdhury26/',
    email: 'associate@teara.in',
  },
];

const MENTORS = [
  {
    name: 'Dr. Aditya Lama',
    description:
      'Assistant Professor and Program Coordinator, BBA Entrepreneurship, School of Management, Inspiria Knowledge Campus. Works on entrepreneurship development and building the startup ecosystem.',
    photo: '/pfp/dr-aditya-lama.png',
    linkedin: 'https://www.linkedin.com/in/dr-aditya-lama-16947ba8',
  },
  {
    name: 'Sonam Wangdi Bhutia',
    description:
      'Assistant Professor, School of Management, Inspiria Knowledge Campus. An entrepreneur himself, with over three years in the startup ecosystem.',
    photo: '/pfp/sonam-bhutia.png',
    linkedin: 'https://www.linkedin.com/in/sonam-wangdi-bhutia-a4b527243/',
  },
];

const WHO = [
  ['estate', 'A tea estate'],
  ['research', 'A researcher'],
  ['customer', 'A future customer'],
  ['other', 'Something else'],
];

export default function People() {
  return (
    <>
      <PageScene mode="people" />

      <section className="hero wrap" aria-labelledby="h-people">
        <div className="stack">
          <p className="eyebrow">Our team</p>
          <h1 id="h-people">A journey shaped by shared belief.</h1>
          <p className="lede">
            What began with a common conviction has grown into a collective effort. Through every challenge, conversation and milestone, we continue to work towards a purpose that brings us together, with the encouragement and guidance of our mentors.
          </p>
        </div>
      </section>

      {/* Founding team */}
      <section className="section wrap" aria-labelledby="h-team">
        <div className="stack">
          <p className="eyebrow">The Minds Behind</p>
          <h2 id="h-team">The Vision</h2>

          <Rise className="team">
            {TEAM.map((person) => (
              <div className="person" key={person.name}>
                <img
                  className="person-photo"
                  src={person.photo}
                  alt={person.name}
                  width={120}
                  height={120}
                  loading="lazy"
                />

                <div className="stack-sm">
                  <h3>{person.name}</h3>
                  <p className="role">{person.role}</p>
                  <p>{person.description}</p>
                </div>

                <div className="icons">
                  <IconLink
                    kind="linkedin"
                    label={`View ${person.name} on LinkedIn`}
                    url={person.linkedin}
                  />

                  <IconLink
                    kind="mail"
                    label={`Email ${person.name}`}
                    url={`mailto:${person.email}`}
                  />
                </div>
              </div>
            ))}
          </Rise>
        </div>
      </section>

      {/* Mentors */}
      <section className="section wrap" aria-labelledby="h-mentors">
        <div className="stack">
          <p className="eyebrow">Guided By Experience</p>
          <h2 id="h-mentors">Our mentors.</h2>

          <Rise className="partner">
            {MENTORS.map((mentor) => (
              <div className="person mentor-card" key={mentor.name}>
                <img
                  className="person-photo"
                  src={mentor.photo}
                  alt={mentor.name}
                  width={120}
                  height={120}
                  loading="lazy"
                />

                <div className="stack-sm">
                  <h3>{mentor.name}</h3>
                  <p>{mentor.description}</p>
                </div>

                <div className="icons">
                  <IconLink
                    kind="linkedin"
                    label={`View ${mentor.name} on LinkedIn`}
                    url={mentor.linkedin}
                  />
                </div>
              </div>
            ))}
          </Rise>
        </div>
      </section>

      {/* Work with us */}
      <section className="section wrap" aria-labelledby="h-partner">
        <div className="stack">
          <p className="eyebrow">Work with us</p>
          <h2 id="h-partner" style={{ maxWidth: '14em' }}>
            We would like to hear from you.
          </h2>

          <Rise className="partner three-col">
            <div>
              <h3>Tea estates</h3>
              <p>
                If your estate has leaf left after processing, we would like
                to talk about sourcing it responsibly.
              </p>
            </div>

            <div>
              <h3>Researchers and labs</h3>
              <p>
                We want expert help with extraction methods, stability and
                formulation.
              </p>
            </div>

            <div>
              <h3>Future customers</h3>
              <p>
                Tell us what your skin needs. The serum is still being
                designed, so your answer matters.
              </p>
            </div>
          </Rise>
        </div>
      </section>

      {/* Contact */}
      <section className="section wrap" aria-labelledby="h-contact">
        <div className="contact-grid">
          <div className="stack panel">
            <p className="eyebrow">Contact</p>
            <h2 id="h-contact">Write to the team.</h2>

            <PreviewForm
              subject="New Teara website contact enquiry"
              done="Thank you for writing to Teara. Your message has been delivered to our team. We will be in touch."
            >
              <div className="field">
                <label htmlFor="c-name">Your name</label>
                <input
                  id="c-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                />
              </div>

              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <fieldset>
                <legend>I am writing as</legend>

                {WHO.map(([value, label]) => (
                  <label className="chip" key={value}>
                    <input
                      type="radio"
                      name="who"
                      value={value}
                      required={value === 'estate'}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>

              <div className="field">
                <label htmlFor="c-msg">Message</label>
                <textarea
                  id="c-msg"
                  name="message"
                  required
                  minLength={10}
                  maxLength={3000}
                />
              </div>

              <p>
                <button className="btn" type="submit">
                  Send message <Arrow />
                </button>
              </p>
            </PreviewForm>
          </div>

          <div className="stack contact-info">
            <div className="info">
              <span className="ic">
                <Icon kind="mail" />
              </span>
              <div>
                <p className="eyebrow">General enquiries</p>
                <p>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </p>
              </div>
            </div>

            <div className="info">
              <span className="ic">
                <Icon kind="phone" />
              </span>
              <div>
                <p className="eyebrow">Phone</p>
                <p>
                  <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
                </p>
              </div>
            </div>

            <div className="info">
              <span className="ic">
                <Icon kind="pin" />
              </span>
              <div>
                <p className="eyebrow">Main office</p>
                <address>
                  Inhub Co-working Space, 3rd floor
                  <br />
                  Inspiria Knowledge Campus, Phase II
                  <br />
                  Himachal Vihar, Matigara, Siliguri
                  <br />
                  District Darjeeling, West Bengal 734010
                </address>
              </div>
            </div>

            <div className="info">
              <span className="ic">
                <Icon kind="pin" />
              </span>
              <div>
                <p className="eyebrow">Second location</p>
                <address>
                  Lopchu Bazar, Tukdah Forest
                  <br />
                  Darjeeling, West Bengal 734213
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
