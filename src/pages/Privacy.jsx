import { PageHero } from '../components/ui.jsx';
import { useSettings } from '../lib/content.jsx';
import { usePageMeta } from '../lib/util.js';

// NOTE FOR THE TEAM: this is a plain-language starting point, not legal advice.
// Review it (especially the retention paragraph) before launch.

export default function Privacy() {
  const { settings } = useSettings();
  usePageMeta('Privacy', 'How SYRMUN collects, uses and protects the personal information you submit.');

  return (
    <>
      <PageHero eyebrow="Privacy" title="How we handle your information" />
      <section className="py-14">
        <div className="container-x max-w-3xl space-y-8 leading-relaxed text-navy-800">
          <div>
            <h2 className="text-2xl font-bold text-navy-950">What we collect</h2>
            <p className="mt-2">
              When you register as a delegate or apply to join the team we collect only what we need to run the conference: your
              name, email address, and — if you choose to give them — your school or institution, age group, committee
              preferences, MUN experience and any notes you add. Staff applications also include your experience, motivation and
              availability.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-950">How we use it</h2>
            <p className="mt-2">
              We use your information to review your application, contact you about it, allocate committees and organise the
              conference. We do not sell your information and we do not use it for advertising.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-950">Who can see it</h2>
            <p className="mt-2">
              Applications are stored in a private database. They are not shown on this website and can only be viewed by members of
              the SYRMUN organising team who have an administrator account.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-950">How long we keep it</h2>
            <p className="mt-2">
              We keep application data until the conference and any follow-up have finished, and then delete or anonymise it. You
              can ask us to delete your information earlier at any time.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-950">Your choices</h2>
            <p className="mt-2">
              You can ask to see, correct or delete the information we hold about you.{' '}
              {settings.contact_email ? (
                <>
                  Email us at{' '}
                  <a href={`mailto:${settings.contact_email}`} className="font-semibold underline decoration-gold-500 underline-offset-2">
                    {settings.contact_email}
                  </a>
                  .
                </>
              ) : (
                'Use the contact details on our Contact page.'
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
