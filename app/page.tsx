"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  Zap,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Check,
  Calculator,
  GraduationCap,
  X,
} from "lucide-react";

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

  const display = { fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

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
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.35)] flex flex-col"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-7 pt-7 pb-5 border-b border-black/[0.07] flex-shrink-0">
          <div>
            <h2 id="legal-modal-title" style={display} className="text-2xl font-bold tracking-tight text-[#0B1015]">
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
            <X className="w-4 h-4 text-[#0B1015]" strokeWidth={2.5} />
          </button>
        </div>
        <div className="overflow-y-auto px-7 py-6 space-y-5 flex-1">
          {content.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h3 className="text-[13px] font-bold text-[#0B1015] uppercase tracking-wider mb-1.5" style={mono}>
                  {section.heading}
                </h3>
              )}
              <p className={`leading-relaxed ${section.highlight ? "text-[17px] font-semibold text-[#0B1015]" : "text-[15px] text-black/70"}`}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 px-7 py-5 border-t border-black/[0.07]">
          <button type="button" onClick={onClose}
            className="w-full bg-[#0B1015] hover:bg-black text-[#C2F751] font-semibold py-3 rounded-full text-sm transition-colors">
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

  const display = { fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" };
  const body = { fontFamily: "'Manrope', system-ui, sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

  return (
    <div style={{ ...body, backgroundColor: "#FAF7F2", color: "#0B1015" }}
      className="min-h-screen w-full antialiased selection:bg-[#C2F751] selection:text-[#0B1015]">
      <Nav display={display} mono={mono} />
      <Hero display={display} mono={mono} />
      <HowItWorks display={display} mono={mono} />
      <HonestState display={display} mono={mono} />
      <SignupForm display={display} />
      <FAQ display={display} />
      <Footer display={display} mono={mono} onOpenModal={setLegalModal} />
      {legalModal && <LegalModal modalKey={legalModal} onClose={closeLegal} />}
    </div>
  );
}

function Nav({ display, mono }: { display: React.CSSProperties; mono: React.CSSProperties }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF7F2]/80 border-b border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5" aria-label="Revily home">
          <div className="w-8 h-8 rounded-lg bg-[#0B1015] flex items-center justify-center">
            <span className="text-[#C2F751] font-bold text-sm leading-none" style={display}>R</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tracking-tight text-[15px]" style={display}>Revily</span>
            <span className="hidden sm:inline text-[12px] text-black/45 font-medium">GCSE Maths Revision</span>
          </div>
          <span className="ml-2 text-[10px] font-bold tracking-wider text-[#0B1015] bg-[#C2F751] px-2 py-0.5 rounded" style={mono}>
            ALPHA SOON
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-black/70">
          <a href="#how" className="hover:text-black transition-colors">How it works</a>
          <a href="#faq" className="hover:text-black transition-colors">FAQs</a>
        </nav>
        <button type="button"
          onClick={() => { track("nav_cta_click"); document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" }); }}
          className="inline-flex items-center gap-1.5 bg-[#0B1015] hover:bg-[#1F2A0F] text-[#C2F751] text-sm font-semibold px-4 py-2 rounded-full transition-colors">
          Join the Alpha
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}

function Hero({ display, mono }: { display: React.CSSProperties; mono: React.CSSProperties }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#0B1015 1px, transpa rent 1px), linear-gradient(90deg, #0B1015 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div aria-hidden className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #C2F751 0%, transparent 65%)", opacity: 0.35 }} />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0B1015] text-[#C2F751] px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <GraduationCap className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span style={mono}>JOIN ALPHA: HELP US TEST GCSE MATHS</span>
            </div>
            <h1 style={display} className="text-[44px] leading-[1.02] sm:text-[60px] sm:leading-[1] lg:text-[72px] lg:leading-[0.98] font-bold tracking-[-0.03em]">
              GCSE Maths revision that is {" "}
              <span className="relative inline-block">
                <span className="relative z-10">enjoyable</span>
                <span aria-hidden className="absolute left-0 right-0 bottom-1 sm:bottom-2 h-[14px] sm:h-[20px] -z-0 bg-[#C2F751] rounded-sm" />
              </span>.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-black/70 max-w-[580px] leading-relaxed">
              Revily is a 10-minute-a-day GCSE Maths revision app for Foundation students working toward a Grade 4/5.
              <span className="block text-black/85 font-medium">We&apos;re opening Alpha testing to our first 30 students.</span>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button type="button"
                onClick={() => { track("hero_cta_click"); document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group inline-flex items-center justify-center gap-2 bg-[#0B1015] hover:bg-black text-[#C2F751] font-semibold px-6 py-4 rounded-full text-base transition-all hover:scale-[1.02]">
                Join the Alpha
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </button>
            </div>
            <div className="mt-8 flex items-start gap-3 text-sm text-black/60 max-w-[520px]">
              <ShieldCheck className="w-5 h-5 text-[#0B1015] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p>Every lesson is built from the teaching framework of experienced GCSE and IB Maths tutors — the same method used in real lessons.
                <span className="block text-black/80 font-medium">No random AI answers. No irrelevant curriculum. No false confidence.</span>
              </p>
            </div>
          </div>
          <HeroMockup display={display} mono={mono} />
        </div>
      </div>
    </section>
  );
}

function HeroMockup({ display, mono }: { display: React.CSSProperties; mono: React.CSSProperties }) {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div className="absolute -top-4 -left-4 sm:-left-8 z-20 rotate-[-6deg]">
        <div className="bg-[#C2F751] rounded-2xl px-3 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#0B1015]" strokeWidth={2.5} />
          <span className="font-bold text-sm text-[#0B1015]" style={display}>From the prototype</span>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-2 sm:-right-6 z-20 rotate-[5deg]">
        <div className="bg-white border border-black/10 rounded-2xl px-3 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)] flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#0B1015]" strokeWidth={2.5} />
          <span className="font-bold text-sm text-[#0B1015]" style={display}>Alpha soon</span>
        </div>
      </div>
      <div className="relative bg-[#0B1015] rounded-[44px] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
        <div className="bg-[#FAF7F2] rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-4 pb-2 text-xs text-black/60" style={mono}>
            <span>9:41</span><span>•••</span>
          </div>
          <div className="px-5 pt-2 pb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-black/50 uppercase tracking-wider font-semibold" style={mono}>Foundation tier</div>
              <h3 className="text-xl font-bold mt-0.5" style={display}>Today&apos;s mission</h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0B1015] flex items-center justify-center text-[#C2F751] text-xs font-bold">S</div>
          </div>
          <div className="px-5">
            <div className="inline-flex items-center gap-1.5 bg-[#0B1015] text-[#C2F751] px-2.5 py-1 rounded-full text-[11px] font-semibold">
              <Target className="w-3 h-3" strokeWidth={2.5} />
              <span style={mono}>HARD · LINEAR EQUATIONS</span>
            </div>
          </div>
          <div className="mx-5 mt-3 bg-white border border-black/[0.07] rounded-2xl p-4 shadow-sm">
            <div className="text-[11px] text-black/50 font-semibold mb-2" style={mono}>Q3 OF 5</div>
            <p className="text-[15px] text-[#0B1015] leading-snug font-medium mb-3">Solve for x:</p>
            <div className="bg-[#FAF7F2] rounded-lg px-3 py-2 text-lg font-semibold text-[#0B1015]" style={mono}>3x + 7 = 22</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["x = 5", "x = 7", "x = 15", "x = 3"].map((opt, i) => (
                <div key={opt} className={`px-3 py-2 rounded-lg text-sm font-semibold border ${i === 0 ? "bg-[#C2F751] border-[#0B1015] text-[#0B1015]" : "bg-white border-black/10 text-black/70"}`}>
                  {opt}
                </div>
              ))}
            </div>
          </div>
          <div className="px-5 mt-4 mb-5">
            <div className="flex items-center justify-between text-[11px] text-black/60 mb-1.5" style={mono}>
              <span>MISSION PROGRESS</span><span>3 / 5</span>
            </div>
            <div className="h-1.5 bg-black/[0.08] rounded-full overflow-hidden">
              <div className="h-full bg-[#0B1015] w-3/5 rounded-full" />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-black/60">
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              <span>~10 minutes per mission</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function HonestState({ display, mono }: { display: React.CSSProperties; mono: React.CSSProperties }) {
  const rows = [
    {
      label: "LIVE TODAY",
      dot: "#C2F751",
      copy: "Two complete modules with 35+ Foundation sub-topics — daily missions and reliable marking with the working shown, running in the prototype now.",
    },
    {
      label: "COMING IN ALPHA",
      dot: "#FF8B6B",
      copy: "A stable multi-user platform, the ~5-minute diagnostic that surfaces weak topics, and the first version of parent progress updates — built with the first cohort.",
    },
    {
      label: "BUILDING TOWARD",
      dot: "rgba(11,16,21,0.25)",
      copy: "Full GCSE Maths Foundation coverage, then Higher tier — and eventually the same approach applied to English and Science.",
    },
  ];
  return (
    <section className="py-14 sm:py-18">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="mb-6">
          <h2 style={display} className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.05]">What&apos;s built and what&apos;s next.</h2>
        </div>
        <div className="rounded-3xl bg-white border border-black/[0.07] overflow-hidden divide-y divide-black/[0.06]">
          {rows.map((row) => (
            <div key={row.label} className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 p-5 sm:p-6">
              <div className="flex items-center gap-2.5 self-start">
                <span aria-hidden className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.dot }} />
                <span className="text-[11px] font-bold tracking-wider text-[#0B1015]" style={mono}>{row.label}</span>
              </div>
              <p className="text-[15px] text-black/70 leading-relaxed">{row.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



function HowItWorks({ display, mono }: { display: React.CSSProperties; mono: React.CSSProperties }) {
  const steps = [
    { icon: Calculator, title: "A short diagnostic", copy: "A 5 minute diagnostic finds the topics that'll cost the most marks if they aren't fixed. Alpha students will be the first to take it." },
    { icon: Target, title: "The 10-minute daily mission", copy: "Each day, a focused mission targeting weak topics — sized for an evening break, not a study marathon. Already running in the prototype." },
    { icon: BarChart3, title: "Practise, Feedback, Progress", copy: "Reliable instant marking with the working shown, a readiness view that climbs as gaps close, and an optional parent summary." },
  ];
  return (
    <section id="how" className="py-20 sm:py-28 bg-[#0B1015] text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">Three Step Learning. </h2>
          <p className="mt-4 text-white/60 max-w-xl">The first 30 Alpha students will pressure-test each step with us before wider launch.</p>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative rounded-3xl bg-white/[0.04] border border-white/10 p-7 hover:bg-white/[0.06] transition-colors">
                <div className="absolute top-7 right-7 text-7xl font-bold text-white/[0.06] tabular-nums leading-none" style={display}>{i + 1}</div>
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-[#C2F751] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#0B1015]" strokeWidth={2.25} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={display}>{step.title}</h3>
                  <p className="text-[15px] text-white/70 leading-relaxed">{step.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



function SignupForm({ display }: { display: React.CSSProperties }) {
  const [form, setForm] = useState({ email: "", role: "Parent", board: "Not sure", tier: "Not sure", target: "Get a 4", commitment: "Yes, we're in" });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

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
    <section id="signup" className="py-20 sm:py-28 bg-white border-y border-black/[0.06]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#0B1015] text-[#C2F751] px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
            <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />Alpha · {ALPHA_PLACES_REMAINING} of {ALPHA_PLACES_TOTAL} places remaining · GCSE Maths Foundation
          </div>
          <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">Join the Alpha.</h2>
          <p className="mt-4 text-lg text-black/65">Tell us a bit about your child&apos;s GCSE Maths. We&apos;ll email you as places in the first cohort open.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-6 bg-[#FAF7F2] border border-black/[0.07] rounded-3xl p-6 sm:p-8 space-y-5">
            <label className="block">
              <span className="text-[13px] font-semibold text-black/70 mb-2 block">Email</span>
              <input type="email" required value={form.email} onChange={handleChange("email")} placeholder="you@example.co.uk"
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0B1015] focus:ring-2 focus:ring-[#C2F751]/40 transition-shadow" />
            </label>
            <label className="block">
              <span className="text-[13px] font-semibold text-black/70 mb-2 block">I am a</span>
              <div className="flex flex-wrap gap-2">
                {["Parent", "Student", "Tutor"].map((opt) => (
                  <button key={opt} type="button" onClick={() => setForm((f) => ({ ...f, role: opt }))}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${form.role === opt ? "bg-[#0B1015] border-[#0B1015] text-[#C2F751]" : "bg-white border-black/10 text-black/70 hover:border-black/30"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </label>
            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-[13px] font-semibold text-black/70 mb-2 block">Exam board</span>
                <div className="relative">
                  <select value={form.board} onChange={handleChange("board")}
                    className="w-full appearance-none bg-white border border-black/10 rounded-xl px-4 py-3 pr-10 text-[15px] focus:outline-none focus:border-[#0B1015] focus:ring-2 focus:ring-[#C2F751]/40">
                    {["Edexcel", "AQA", "OCR", "Not sure"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/40" strokeWidth={2.5} />
                </div>
              </label>
              <label className="block">
                <span className="text-[13px] font-semibold text-black/70 mb-2 block">Tier</span>
                <div className="flex flex-wrap gap-2">
                  {["Foundation", "Higher", "Not sure"].map((opt) => (
                    <button key={opt} type="button" onClick={() => setForm((f) => ({ ...f, tier: opt }))}
                      className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${form.tier === opt ? "bg-[#0B1015] border-[#0B1015] text-[#C2F751]" : "bg-white border-black/10 text-black/70 hover:border-black/30"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </label>
            </div>
            <label className="block">
              <span className="text-[13px] font-semibold text-black/70 mb-2 block">Target</span>
              <div className="flex flex-wrap gap-2">
                {["Get a 4", "Get a 5", "Improve as much as possible"].map((opt) => (
                  <button key={opt} type="button" onClick={() => setForm((f) => ({ ...f, target: opt }))}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${form.target === opt ? "bg-[#0B1015] border-[#0B1015] text-[#C2F751]" : "bg-white border-black/10 text-black/70 hover:border-black/30"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </label>
            <label className="block">
              <span className="text-[13px] font-semibold text-black/70 mb-2 block">Could your child do 10 minutes a day for the first 2 weeks of the Alpha (and tell us what&apos;s working)?</span>
              <div className="flex flex-wrap gap-2">
                {["Yes, we're in", "Most days", "Not sure yet"].map((opt) => (
                  <button key={opt} type="button" onClick={() => setForm((f) => ({ ...f, commitment: opt }))}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${form.commitment === opt ? "bg-[#0B1015] border-[#0B1015] text-[#C2F751]" : "bg-white border-black/10 text-black/70 hover:border-black/30"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </label>
            <button type="submit"
              className="w-full bg-[#0B1015] hover:bg-black text-[#C2F751] font-semibold px-6 py-4 rounded-full text-base inline-flex items-center justify-center gap-2 transition-colors">
              Join the Alpha<ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <p className="text-xs text-black/50 text-center">We&apos;ll only email you about Revily. Unsubscribe any time. You will not be charged today.</p>
          </form>
        ) : (
          <div className="mt-6 bg-[#0B1015] text-white rounded-3xl p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-[#C2F751] mx-auto flex items-center justify-center mb-5">
              <Check className="w-7 h-7 text-[#0B1015]" strokeWidth={3} />
            </div>
            <h3 style={display} className="text-3xl font-bold tracking-tight">Application received.</h3>
            <p className="mt-3 text-white/70 max-w-md mx-auto">Thanks — we&apos;ll email you as places in the first Alpha cohort open.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function FAQ({ display }: { display: React.CSSProperties }) {
  const items = [
    { q: "Is this live yet?", a: "The prototype is working — two modules and 35+ sub-topics are built. We're moving it to a stable platform now and opening the Alpha to a first cohort of 30 students in small batches." },
    { q: "How many places are there?", a: "The first Alpha cohort is limited to 30 students. We're keeping it small so we can work closely with each family, fix issues fast, and shape the diagnostic and parent updates around real feedback." },
    { q: "Will I be charged today?", a: "No. Applying for the Alpha is completely free. You will not be charged today or when the Alpha opens." },
    { q: "Can this guarantee a Grade 4 or 5?", a: "No. No revision product can guarantee a grade. The goal is to help students practise the right topics more consistently." },
    { q: "Is this an AI chatbot?", a: "No. Revily is a revision engine — original questions, reliable marking logic, and daily missions structured around GCSE Maths skills. The curriculum comes from an experienced GCSE Maths tutor's teaching framework, not from unchecked AI generation." },
    { q: "How are the questions designed?", a: "Every module follows a structured teaching framework: diagnose the gap, explain the idea clearly, practise it step by step, then apply it independently. Lessons are reviewed against the GCSE Maths curriculum before they are released." },
    { q: "Is it exam-board specific?", a: "Content is mapped to GCSE Maths skills used across Edexcel, AQA, and OCR Foundation specs. We don't claim official endorsement from any exam board." },
    { q: "Is this for Foundation or Higher tier?", a: "We're starting with Foundation tier and the Grade 3 → 4/5 pass path. Higher-tier support is on the roadmap." },
    { q: "Is it suitable if my child is predicted a Grade 3?", a: "That's the core student we're designing for. Revily targets the topics most likely to lift a Grade 3 toward a 4 or 5." },
  ];
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05] text-center">Questions, answered honestly.</h2>
        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i} className={`rounded-2xl border transition-all ${open ? "border-[#0B1015] bg-white" : "border-black/[0.08] bg-white/60"}`}>
                <button type="button" onClick={() => setOpenIndex(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={open}>
                  <span className="font-semibold text-[16px] sm:text-lg tracking-tight" style={display}>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 text-[#0B1015] transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2.25} />
                </button>
                {open && <div className="px-6 pb-5 -mt-1 text-[15px] text-black/70 leading-relaxed">{item.a}</div>}
              </div>
            );
          })}
        </div>
        <div className="mt-14 rounded-3xl bg-[#0B1015] text-white p-8 sm:p-10 text-center">
          <h3 style={display} className="text-2xl sm:text-3xl font-bold tracking-tight">{ALPHA_PLACES_REMAINING} of {ALPHA_PLACES_TOTAL} places remaining. Real curriculum. Alpha opening soon.</h3>
          <p className="mt-3 text-white/70 max-w-md mx-auto">Apply for the first cohort. We&apos;ll email you as places open.</p>
          <button type="button"
            onClick={() => { track("faq_bottom_cta_click"); document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" }); }}
            className="mt-6 inline-flex items-center gap-2 bg-[#C2F751] text-[#0B1015] font-semibold px-6 py-3.5 rounded-full hover:bg-[#D2FF61] transition-colors">
            Join the Alpha<ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <p className="mt-4 text-xs text-white/50">You will not be charged today.</p>
        </div>
      </div>
    </section>
  );
}

function Footer({ display, mono, onOpenModal }: { display: React.CSSProperties; mono: React.CSSProperties; onOpenModal: (key: ModalKey) => void }) {
  return (
    <footer className="border-t border-black/[0.06] py-12">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0B1015] flex items-center justify-center flex-shrink-0">
            <span className="text-[#C2F751] font-bold text-base leading-none" style={display}>R</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold tracking-tight text-[15px]" style={display}>Revily</span>
              <span className="text-[13px] text-black/55 italic">Know what to revise next.</span>
            </div>
            <div className="text-[12px] text-black/45 mt-1" style={mono}>
              © {new Date().getFullYear()} Revily · Alpha · Not affiliated with any exam board
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-black/55">
          {(["privacy", "terms", "contact"] as ModalKey[]).map((key) => (
            <button key={key} type="button" onClick={() => onOpenModal(key)}
              className="hover:text-black transition-colors underline-offset-2 hover:underline capitalize">
              {key}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
