import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  HeartHandshake,
  Mail,
  MessageCircle,
  MoveUpRight,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react';
import { env } from '../config/env';
import { ApplicationForm } from '../features/application/components/ApplicationForm';

const faqs = [
  [
    'Who can apply?',
    'Any student currently enrolled at one of the 22 institutions in the application dropdown. You don’t need previous ambassador experience — we want people who are interested, reliable and comfortable connecting with other students.',
  ],
  [
    'What would I actually do?',
    'Introduce Adbox to fellow students in person, help them sign up and try a post or survey, and tell our team what works and what needs fixing. Report your activity honestly and only help students who are present create their own accounts.',
  ],
  [
    'Is there a stipend?',
    'Yes. Selected student representatives receive a stipend for the role. The amount, payment arrangements, weekly hours and launch term will be agreed with selected representatives.',
  ],
  [
    'Do I need a polished video?',
    'No. A simple introduction on your phone is perfect. Tell us why we should choose you in 30 seconds or less. Keep the file under 50 MB and upload it as MP4, MOV or WebM.',
  ],
  [
    'What happens after I apply?',
    env.isMock
      ? 'This page is currently a preview. Once real applications open, our recruitment team will review submissions and contact shortlisted applicants. Applications close on 20 December 2026.'
      : 'Our recruitment team will review submissions and contact shortlisted applicants using the details provided. Applications close on 20 December 2026.',
  ],
];

export function App() {
  return (
    <>
      <a className="skip-link" href="#apply">
        Skip to application
      </a>
      {env.isMock && (
        <div className="preview-banner">
          <span className="preview-dot" />
          You’re viewing a preview. Applications aren’t being sent yet.
        </div>
      )}
      <header className="site-header">
        <div className="container nav-inner">
          <a href="#" className="brand" aria-label="Adbox campus representatives home">
            <img src="/brand/adbox-mark.svg" alt="" width="33" height="33" />
            <span>
              adbox<span className="brand-period">.</span>
            </span>
            <span className="brand-divider" />
            <span className="brand-label">Campus reps</span>
          </a>
          <nav aria-label="Main navigation">
            <a className="nav-text" href="#the-role">
              The role
            </a>
            <a className="nav-text" href="#questions">
              FAQs
            </a>
            <a className="button nav-apply" href="#apply">
              Apply now <MoveUpRight size={16} />
            </a>
          </nav>
        </div>
      </header>
      <main>
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="open-tag">
              <span />
              THE NEXT CHAPTER STARTS ON CAMPUS
            </div>
            <h1 id="hero-title">
              Your campus.
              <br />
              Your people.
              <br />
              <span>Your impact.</span>
            </h1>
            <p>
              Be one of the first to bring Adbox to your campus. Connect your people, help shape the
              app, and make your voice count.
            </p>
            <div className="hero-actions">
              <a href="#apply" className="button primary hero-cta">
                Become a campus rep <ArrowRight size={19} />
              </a>
              <span className="time-note">
                <Clock3 size={17} />
                About 5 minutes
              </span>
            </div>
            <div className="hero-perks">
              <span>
                <Check size={15} />
                Open to current students
              </span>
              <span>
                <Check size={15} />
                Stipend included
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="photo-wrap">
              <img
                src="/brand/campus-students.jpg"
                alt="Three students connecting over a phone on a sunny campus"
                fetchPriority="high"
                width="1536"
                height="1024"
              />
              <div className="photo-shade" />
              <span className="photo-label">
                <span className="live-dot" />
                MADE IN GHANA. BUILT WITH YOU.
              </span>
              <div className="photo-caption">
                Good things start
                <br />
                with your people.
              </div>
            </div>
            <div className="rep-badge">
              <span className="badge-icon">
                <Users size={24} />
              </span>
              <div>
                <strong>2 reps. One campus.</strong>
                <span>Your chance to be part of the beginning.</span>
              </div>
              <Sparkles size={22} className="badge-spark" />
            </div>
            <span className="decor-star" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>
        <section id="the-role" className="role-strip" aria-label="The campus representative role">
          <div className="container role-grid">
            <div className="role-intro">
              <span className="eyebrow">SMALL ACTIONS. REAL IMPACT.</span>
              <h2>Be the connection.</h2>
              <p>Adbox brings community posts and student-run surveys to campus life.</p>
            </div>
            <div className="role-item">
              <span className="role-icon">
                <Users size={22} />
              </span>
              <h3>Bring your campus in</h3>
              <p>Meet students, introduce Adbox and help them sign up.</p>
            </div>
            <div className="role-item">
              <span className="role-icon">
                <MessageCircle size={22} />
              </span>
              <h3>Get the conversation going</h3>
              <p>Help someone make a first post or answer a survey.</p>
            </div>
            <div className="role-item">
              <span className="role-icon">
                <HeartHandshake size={22} />
              </span>
              <h3>Help us make it better</h3>
              <p>Share honest feedback and tell us when something breaks.</p>
            </div>
          </div>
        </section>
        <section
          className="application-section container"
          id="apply"
          aria-labelledby="application-title"
        >
          <div className="application-intro">
            <div>
              <span className="eyebrow">THE APPLICATION</span>
              <h2 id="application-title">
                A little about you.
                <br />A lot of possibility.
              </h2>
            </div>
            <div className="deadline">
              <CalendarDays size={21} />
              <div>
                <span>Applications close</span>
                <strong>20 December 2026</strong>
              </div>
            </div>
          </div>
          <div className="application-layout">
            <ApplicationForm />
            <aside className="application-sidebar">
              <div className="side-card expectations">
                <span className="mini-tag">YOUR NEXT CHAPTER</span>
                <h3>
                  You bring the energy.
                  <br />
                  We’ll get you started.
                </h3>
                <p>No experience needed. Just curiosity, reliability and a little campus spirit.</p>
                <ul>
                  <li>
                    <Check size={17} />
                    Help launch a Ghanaian app
                  </li>
                  <li>
                    <Check size={17} />
                    Work directly with the Adbox team
                  </li>
                  <li>
                    <Wallet size={17} />
                    Receive a rep stipend
                  </li>
                </ul>
                <div className="side-note">
                  Hours and launch term will be agreed with selected reps.
                </div>
              </div>
              <div className="prepare-card">
                <h3>Before you begin</h3>
                <p>
                  Have your contact details ready and a short video about why we should choose you.
                </p>
                <div>
                  <Clock3 size={17} />
                  <span>14 questions + a 30-second video</span>
                </div>
                <p className="muted">Short, honest answers are welcome.</p>
              </div>
              <a href="mailto:info@adboxgh.com" className="help-card">
                <span>
                  <Mail size={21} />
                </span>
                <div>
                  <strong>Need a hand?</strong>
                  <small>info@adboxgh.com</small>
                </div>
                <MoveUpRight size={17} />
              </a>
            </aside>
          </div>
        </section>
        <section className="faq-section container" id="questions" aria-labelledby="faq-title">
          <div className="faq-intro">
            <span className="eyebrow">GOOD QUESTIONS</span>
            <h2 id="faq-title">
              A few things
              <br />
              you might wonder.
            </h2>
            <p>
              Still curious?{' '}
              <a href="mailto:info@adboxgh.com">
                Talk to our team <ArrowRight size={15} />
              </a>
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([title, answer]) => (
              <details key={title}>
                <summary>
                  {title}
                  <ArrowDown size={18} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-main">
          <div>
            <a href="#" className="brand">
              <img src="/brand/adbox-mark.svg" alt="" width="30" height="30" />
              <span>adbox.</span>
            </a>
            <p>Campus life, connected.</p>
          </div>
          <div className="footer-address">
            <p>
              No. 64A, Omensa Plaza
              <br />
              Off Awoshie–Pokuase Road
              <br />
              Accra, Ghana
            </p>
          </div>
          <div className="footer-contact">
            <a href="mailto:info@adboxgh.com">info@adboxgh.com</a>
            <a href="tel:+233506843863">+233 (0) 50 684 3863</a>
            <a href="tel:+233244389842">+233 (0) 24 438 9842</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Adbox. All rights reserved.</span>
          <span>Made for campus. Made in Ghana.</span>
        </div>
      </footer>
    </>
  );
}
