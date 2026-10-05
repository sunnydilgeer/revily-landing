"use client";

import { useState, useCallback, useEffect } from "react";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { RevilyLogo } from "../src/ui";
import "./landing.css";

const track = (event: string, payload: Record<string, unknown> = {}) => {
  console.log("[track]", event, payload);
};

// Update manually as Alpha applications are accepted.
const ALPHA_PLACES_TOTAL = 30;
const ALPHA_PLACES_REMAINING = 30;

const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Notice",
    updated: "17 Aug 2026",
    sections: [
      { heading: "What Revily is", body: "Revily is a GCSE Maths revision app currently in Alpha. A working prototype exists and we are opening it to a small first cohort of students. We are not a fully launched product." },
      { heading: "What we collect", body: "When you submit the Alpha application form, we collect: your email address; whether you are a parent, student, or tutor; your exam board; tier; target grade; whether you could commit to daily practice during the Alpha; the page URL; and the time of submission." },
      { heading: "Why we collect it", body: "We use this information to select and manage the first Alpha cohort, understand what parents and students actually want, decide what to build first, and contact you about Revily when the product develops." },
      { heading: "Legal basis", body: "We process Alpha application information because you have asked to join the cohort and because we have a legitimate interest in understanding demand for Revily and improving the product. Where we send marketing emails, we will follow applicable UK electronic marketing rules." },
      { heading: "How we store it", body: "Form submissions are processed and stored through Formspree. We do not operate our own database at this stage." },
      { heading: "Payments", body: "We do not take payments on this page. Pricing buttons are interest signals only — clicking them does not start a payment or subscription." },
      { heading: "Sharing", body: "We do not sell your personal information. We do not share it with third parties except as needed to operate the service (e.g. Formspree for form processing)." },
      { heading: "Analytics and advertising", body: "We do not currently use Meta Pixel or advertising cookies on this page. We may add analytics or advertising tools in future. If we use cookies or similar technologies where consent is required, we will ask for consent before they are used and update this notice." },
      { heading: "Under-16s", body: "If you are under 16, please ask a parent or guardian before submitting your details." },
      { heading: "Your rights", body: "You can ask us to delete your data at any time by emailing hello@revily.co.uk. We will action deletion requests promptly." },
      { heading: "Contact", body: "hello@revily.co.uk" },
    ],
  },
  terms: {
    title: "Terms of Use",
    updated: "17 Aug 2026",
    sections: [
      { heading: "Alpha product", body: "Revily is currently an Alpha — a working prototype being opened to a small first cohort. It is not a fully launched product." },
      { heading: "No payments", body: "Pricing buttons on this page do not start a payment or subscription. They are interest signals only." },
      { heading: "No grade guarantees", body: "Revily does not guarantee any GCSE grade or exam outcome." },
      { heading: "Prototype screens and planned features", body: "Content shown on the page includes prototype screens and planned features. The final product may differ." },
      { heading: "No exam-board affiliation", body: "Revily is independent and is not affiliated with, endorsed by, or approved by any exam board." },
      { heading: "Educational guidance", body: "This site is for Alpha recruitment and general educational interest only at this stage." },
      { heading: "Changes", body: "We may update these terms as the product develops." },
      { heading: "Contact", body: "hello@revily.co.uk" },
    ],
  },
  contact: {
    title: "Contact",
    updated: null,
    sections: [
      { heading: null, body: "For questions, feedback, or data deletion requests, get in touch at:", highlight: false },
      { heading: null, body: "hello@revily.co.uk", highlight: true },
      { heading: null, body: "Revily is currently in Alpha, so response times may vary. We'll always reply.", highlight: false },
    ],
  },
};

type ModalKey = "privacy" | "terms" | "contact";

function LegalModal({ modalKey, onClose }: { modalKey: ModalKey; onClose: () => void }) {
  const content = LEGAL_CONTENT[modalKey];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!content) return null;

  const display = { fontFamily: "var(--rv-font-display)" };
  const mono = { fontFamily: "var(--rv-font-body)", letterSpacing: "0.08em" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "rgba(11, 16, 21, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="relative w-full max-w-lg bg-[#F7FAFD] rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.35)] flex flex-col"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-7 pt-7 pb-5 border-b border-black/[0.07] flex-shrink-0">
          <div>
            <h2 id="legal-modal-title" style={display} className="text-2xl font-bold tracking-tight text-[#18203B]">
              {content.title}
            </h2>
            {content.updated && (
              <p className="text-[11px] text-black/45 mt-1" style={mono}>
                LAST UPDATED: {content.updated.toUpperCase()}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="flex-shrink-0 w-8 h-8 rounded-full bg-black/[0.06] hover:bg-black/[0.12] flex items-center justify-center transition-colors mt-0.5">
            <X className="w-4 h-4 text-[#18203B]" strokeWidth={2.5} />
          </button>
        </div>
        <div className="overflow-y-auto px-7 py-6 space-y-5 flex-1">
          {content.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h3 className="text-[13px] font-bold text-[#18203B] uppercase tracking-wider mb-1.5" style={mono}>
                  {section.heading}
                </h3>
              )}
              <p className={`leading-relaxed ${section.highlight ? "text-[17px] font-semibold text-[#18203B]" : "text-[15px] text-black/70"}`}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 px-7 py-5 border-t border-black/[0.07]">
          <button type="button" onClick={onClose}
            className="w-full bg-[#18203B] hover:bg-black text-[#FFD35C] font-semibold py-3 rounded-full text-sm transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RevilyLanding() {
  const [legalModal, setLegalModal] = useState<ModalKey | null>(null);
  const closeLegal = useCallback(() => setLegalModal(null), []);

  return (
    <div className="lp">
      <a className="lp-skip" href="#main">Skip to main content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Subjects />
        <HowItWorks />
        <Arcade />
        <SignupForm />
        <FAQ />
      </main>
      <Footer onOpenModal={setLegalModal} />
      {legalModal && <LegalModal modalKey={legalModal} onClose={closeLegal} />}
    </div>
  );
}

const scrollToSignup = (source: string) => {
  track(source);
  document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
};

function Nav() {
  return (
    <header className="lp-nav">
      <div className="lp-wrap lp-nav__inner">
        <RevilyLogo href="/" size={26} />
        <nav className="lp-nav__links" aria-label="Page sections">
          <a href="#subjects">Subjects</a>
          <a href="#how">How it works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button type="button" className="lp-btn lp-btn--small" onClick={() => scrollToSignup("nav_cta_click")}>Join the Alpha</button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="lp-hero">
      <div className="lp-wrap lp-hero__grid">
        <div className="lp-hero__copy">
          <p className="lp-pill"><span aria-hidden="true">●</span> Alpha · GCSE Maths &amp; Science</p>
          <h1>GCSE revision, one <mark>small step</mark> at a time.</h1>
          <p className="lp-lede">Bite-sized GCSE Maths and Science that takes you up a grade, one step at a time. Plus an Arcade for days you&apos;d rather play.</p>
          <div className="lp-hero__actions">
            <button type="button" className="lp-btn" onClick={() => scrollToSignup("hero_cta_click")}>
              Join the Alpha <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
        <HeroMock />
      </div>
    </section>
  );
}

function HeroMock() {
  return (
    <div className="lp-mock" aria-hidden="true">
      <div className="lp-mock__lesson">
        <div className="lp-mock__top">
          <span className="lp-mock__crumb">Number · <b>Fractions</b></span>
          <span className="lp-mock__contents">Contents</span>
        </div>
        <div className="lp-mock__bar"><span /></div>
        <p className="lp-mock__step">Simplifying</p>
        <p className="lp-mock__q">Simplify <span className="lp-frac"><b>18</b><b>24</b></span> fully.</p>
        <div className="lp-mock__options">
          <span>9/12</span><span className="is-right">3/4 <Check /></span><span>6/8</span>
        </div>
        <p className="lp-mock__feedback"><Check /> Spot on. Divide the top and bottom by 6, the highest common factor.</p>
      </div>
      <div className="lp-mock__card">
        <span className="lp-mock__stamp">Got it ✓</span>
        <span className="lp-mock__side">Answer</span>
        <strong>The HCF is the biggest number that divides into both.</strong>
      </div>
      <span className="lp-mock__chip lp-mock__chip--streak">⚡ 4 day streak</span>
    </div>
  );
}

function Subjects() {
  return (
    <section id="subjects" className="lp-section">
      <div className="lp-wrap">
        <header className="lp-head">
          <p className="lp-kicker">Two subjects</p>
          <h2>Maths and Science, one way of learning.</h2>
        </header>
        <div className="lp-subjects">
          <article className="lp-subject lp-subject--maths">
            <p className="lp-subject__tag">GCSE Maths · Foundation</p>
            <h3>23 lessons across Number and Algebra</h3>
            <ul className="lp-chips">
              <li>Number · 14</li><li>Algebra · 9</li><li className="is-soon">Ratio, Geometry and Higher next</li>
            </ul>
            <figure className="lp-phone lp-phone--subject">
              <img src="/landing/maths-quadratics.webp" width={520} height={1167} loading="lazy" decoding="async"
                alt="Solving quadratics lesson: x² + x = 20 worked step by step, testing factor pairs of 20, factorising to (x − 4)(x + 5) = 0, and finishing with x = 4 or x = −5." />
            </figure>
          </article>
          <article className="lp-subject lp-subject--science">
            <p className="lp-subject__tag">AQA Combined Science Trilogy</p>
            <h3>Nearly 200 lessons, in early preview</h3>
            <ul className="lp-chips">
              <li>Biology</li><li>Chemistry</li><li>Physics</li><li>Foundation &amp; Higher</li><li className="is-soon">Being reviewed by teachers</li>
            </ul>
            <figure className="lp-phone lp-phone--subject">
              <img src="/landing/science-heart.webp" width={520} height={1125} loading="lazy" decoding="async"
                alt="Circulatory system lesson, Two loops, one heart: a labelled diagram of the double circulation, with the pulmonary circuit to the lungs and the systemic circuit to the body." />
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="lp-section lp-section--night">
      <div className="lp-wrap">
        <header className="lp-head">
          <p className="lp-kicker">How it works</p>
          <h2>Learn it. Practise it. Keep it.</h2>
        </header>
        <ol className="lp-steps">
          <li className="lp-step">
            <div className="lp-step__visual lp-step__visual--learn" aria-hidden="true">
              {["B", "I", "D", "M", "A", "S"].map((letter, i) => <span key={letter} className={`lp-letter lp-letter--${i}`}>{letter}</span>)}
            </div>
            <p className="lp-step__num">1 · Learn</p>
            <h3>One idea per screen</h3>
            <p>Worked examples and short videos, one step at a time.</p>
          </li>
          <li className="lp-step">
            <div className="lp-step__visual lp-step__visual--practise" aria-hidden="true">
              <span className="lp-input">3/4</span><span className="lp-tick"><Check /></span>
            </div>
            <p className="lp-step__num">2 · Practise</p>
            <h3>Answer as you go</h3>
            <p>Instant marking, hints, and the full working when you slip.</p>
          </li>
          <li className="lp-step">
            <div className="lp-step__visual lp-step__visual--remember" aria-hidden="true">
              <span className="lp-mini-card lp-mini-card--back" /><span className="lp-mini-card">Swipe right if you&apos;ve got it →</span>
            </div>
            <p className="lp-step__num">3 · Remember</p>
            <h3>Cards that come back</h3>
            <p>Topics return just before you&apos;d forget them. Swipe right if you&apos;ve got it.</p>
          </li>
        </ol>
      </div>
    </section>
  );
}

const ARCADE_SHOTS = [
  { src: "/landing/arcade-trick-shot.webp", title: "Trick Shot", skill: "Angle facts", alt: "Trick Shot: the ball is potted after the student turns the cue to 30 degrees, and the commentator says “What. A. Shot.”" },
  { src: "/landing/arcade-laser.webp", title: "Laser Line", skill: "Straight-line graphs, y = mx + c", alt: "Laser Line: the beam y = 2x + 3 hits both drones on a graph, with “Clean hit. Command is impressed. Mildly.”" },
  { src: "/landing/arcade-pizza.webp", title: "Slice Wars", skill: "Equivalent fractions", alt: "Slice Wars: 9 of 12 slices served for an order of three quarters of a pizza, with “Perfetto!”" },
];

function Arcade() {
  return (
    <section className="lp-section lp-arcade" aria-labelledby="arcade-title">
      <div className="lp-wrap lp-arcade__grid">
        <div>
          <p className="lp-kicker">The Arcade</p>
          <h2 id="arcade-title">Not in the mood for a lesson? Play first.</h2>
          <p className="lp-arcade__lede">20 quick games where the maths is the cheat code, each one training a real exam question.</p>
        </div>
        <div className="lp-arcade__pair" aria-label="Example: the same maths in the game and in the exam">
          <div className="lp-arcade__card lp-arcade__card--game">
            <p className="lp-arcade__label">In the game</p>
            <p>Split £600 between the crew <b>3 : 2 : 1</b>.</p>
          </div>
          <span className="lp-arcade__arrow" aria-hidden="true">↓</span>
          <div className="lp-arcade__card">
            <p className="lp-arcade__label">In the exam</p>
            <p>Share £600 in the ratio <b>3 : 2 : 1</b>.</p>
          </div>
        </div>
      </div>
      <div className="lp-wrap">
        <ul className="lp-shots" aria-label="Arcade games">
          {ARCADE_SHOTS.map(shot => (
            <li key={shot.src}>
              <figure className="lp-phone">
                <img src={shot.src} alt={shot.alt} width={520} height={1056} loading="lazy" decoding="async" />
              </figure>
              <p className="lp-shots__title">{shot.title}</p>
              <p className="lp-shots__skill">{shot.skill}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Choice({ options, value, onChange, label }: { options: string[]; value: string; onChange: (value: string) => void; label: string }) {
  return (
    <div className="lp-choices" role="group" aria-label={label}>
      {options.map(opt => (
        <button key={opt} type="button" aria-pressed={value === opt} onClick={() => onChange(opt)}>{opt}</button>
      ))}
    </div>
  );
}

function SignupForm() {
  const [form, setForm] = useState({ email: "", role: "Parent", board: "Not sure", tier: "Not sure", target: "Get a 4", commitment: "Yes, we're in" });
  const [submitted, setSubmitted] = useState(false);
  const set = (key: keyof typeof form) => (value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, submittedAt: new Date().toISOString(), page: window.location.href };
    track("signup_submit", payload);
    try {
      const response = await fetch("https://formspree.io/f/xojbjvaj", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Form submission failed");
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="signup" className="lp-section lp-section--signup">
      <div className="lp-wrap lp-wrap--narrow">
        <header className="lp-head lp-head--center">
          <p className="lp-pill"><span aria-hidden="true">●</span> {ALPHA_PLACES_REMAINING} of {ALPHA_PLACES_TOTAL} Alpha places remaining</p>
          <h2>Join the Alpha.</h2>
          <p className="lp-head__sub">Tell us about your child&apos;s GCSEs. We&apos;ll email when places open.</p>
        </header>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="lp-form">
            <label className="lp-field">
              <span>Email</span>
              <input type="email" required value={form.email} onChange={e => set("email")(e.target.value)} placeholder="you@example.co.uk" autoComplete="email" />
            </label>
            <div className="lp-field"><span>I am a</span><Choice label="I am a" options={["Parent", "Student", "Tutor"]} value={form.role} onChange={set("role")} /></div>
            <div className="lp-form__two">
              <label className="lp-field">
                <span>Exam board</span>
                <span className="lp-select">
                  <select value={form.board} onChange={e => set("board")(e.target.value)}>
                    {["Edexcel", "AQA", "OCR", "Not sure"].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown aria-hidden="true" />
                </span>
              </label>
              <div className="lp-field"><span>Tier</span><Choice label="Tier" options={["Foundation", "Higher", "Not sure"]} value={form.tier} onChange={set("tier")} /></div>
            </div>
            <div className="lp-field"><span>Target</span><Choice label="Target" options={["Get a 4", "Get a 5", "Improve as much as possible"]} value={form.target} onChange={set("target")} /></div>
            <div className="lp-field">
              <span>Could your child do 10 minutes a day for the first 2 weeks of the Alpha (and tell us what&apos;s working)?</span>
              <Choice label="Daily commitment" options={["Yes, we're in", "Most days", "Not sure yet"]} value={form.commitment} onChange={set("commitment")} />
            </div>
            <button type="submit" className="lp-btn lp-btn--block">Join the Alpha <ArrowRight aria-hidden="true" /></button>
            <p className="lp-form__note">We&apos;ll only email you about Revily. Unsubscribe any time. You will not be charged today.</p>
          </form>
        ) : (
          <div className="lp-done" role="status">
            <span className="lp-done__tick"><Check aria-hidden="true" /></span>
            <h3>Application received.</h3>
            <p>Thanks. We&apos;ll email you as places in the first Alpha cohort open.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Is this live yet?", a: "There's a working preview with 23 Maths lessons and nearly 200 draft Science lessons. The Alpha opens to 30 students in small batches." },
    { q: "What's the Arcade?", a: "20 short maths games, from splitting a heist to lining up a trick shot. Each one trains a real GCSE exam question." },
    { q: "Will I be charged?", a: "No. Applying is free, and you won't be charged when the Alpha opens." },
    { q: "Is this an AI chatbot?", a: "No. Lessons follow experienced GCSE tutors' teaching, with reliable marking and original questions." },
    { q: "Can this guarantee a grade?", a: "No revision product can. Revily helps students practise the right topics, consistently, whatever grade they're aiming for." },
  ];
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="lp-section">
      <div className="lp-wrap lp-wrap--narrow">
        <header className="lp-head lp-head--center">
          <p className="lp-kicker">FAQ</p>
          <h2>Questions, answered honestly.</h2>
        </header>
        <div className="lp-faq">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className={`lp-faq__item${open ? " is-open" : ""}`}>
                <h3>
                  <button type="button" onClick={() => setOpenIndex(open ? -1 : i)} aria-expanded={open} aria-controls={`faq-${i}`}>
                    {item.q}<ChevronDown aria-hidden="true" />
                  </button>
                </h3>
                {open && <p id={`faq-${i}`}>{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer({ onOpenModal }: { onOpenModal: (key: ModalKey) => void }) {
  return (
    <footer className="lp-footer">
      <div className="lp-wrap lp-footer__inner">
        <div>
          <RevilyLogo href={null} size={22} />
          <p className="lp-footer__tag">Know what to revise next.</p>
          <p className="lp-footer__small">© {new Date().getFullYear()} Revily · Alpha · Not affiliated with any exam board</p>
        </div>
        <nav className="lp-footer__links" aria-label="Legal">
          {(["privacy", "terms", "contact"] as ModalKey[]).map(key => (
            <button key={key} type="button" onClick={() => onOpenModal(key)}>{key[0].toUpperCase() + key.slice(1)}</button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
