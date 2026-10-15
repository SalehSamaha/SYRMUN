import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { PageHero } from '../components/ui.jsx';
import { useSettings } from '../lib/content.jsx';
import { safeUrl, usePageMeta } from '../lib/util.js';

export default function Contact() {
  const { settings } = useSettings();
  usePageMeta('Contact', 'Contact the SYRMUN 2027 organising team.');

  const socials = [
    ['Instagram', settings.instagram_url],
    ['TikTok', settings.tiktok_url],
    ['X', settings.x_url],
    ['LinkedIn', settings.linkedin_url],
    ['YouTube', settings.youtube_url],
  ].filter(([, url]) => safeUrl(url));

  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" intro="Questions about registration, committees, partnerships or anything else — we are happy to help." />
      <section className="py-16">
        <div className="container-x grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card h-full">
              <p className="eyebrow">Email</p>
              {settings.contact_email ? (
                <a href={`mailto:${settings.contact_email}`} className="mt-3 block break-all font-serif text-2xl font-bold text-navy-950 underline decoration-gold-500 underline-offset-4">
                  {settings.contact_email}
                </a>
              ) : (
                <p className="mt-3 text-navy-700">Our official email address will be published here soon. In the meantime, message us on Instagram.</p>
              )}
              <p className="mt-4 text-sm text-navy-600">We reply as soon as we can. For registration questions, please include your reference number.</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="card h-full">
              <p className="eyebrow">Follow SYRMUN</p>
              {socials.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {socials.map(([name, url]) => (
                    <a key={name} href={safeUrl(url)} target="_blank" rel="noopener noreferrer" className="btn-navy">
                      {name}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-navy-700">Social links coming soon.</p>
              )}
              <p className="mt-4 text-sm text-navy-600">Announcements are posted on our social channels as well as on this website.</p>
            </div>
          </Reveal>

          <Reveal className="md:col-span-2">
            <div className="rounded-2xl bg-navy-50 p-8 text-center">
              <h2 className="text-2xl font-bold text-navy-950">Looking for a quick answer?</h2>
              <p className="mt-2 text-navy-700">Many common questions are answered in the FAQ and on the delegate information page.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link to="/faq" className="btn-navy">
                  FAQ
                </Link>
                <Link to="/delegates" className="btn-outline-dark">
                  Delegate information
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
