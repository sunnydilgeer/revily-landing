import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
  Zap,
  BarChart3,
  ShieldCheck,
  ChevronDown,
  Check,
  Calculator,
  AlertCircle,
  GraduationCap,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Revily — EARLY-ACCESS VALIDATION LANDING PAGE
// Category: GCSE Maths Revision | Paid tier: Revision Sprint (£19 interest test)
// Single-file React + Tailwind component. No backend required.
// All CTAs log to console via track(). All pricing buttons are interest
// signals — they DO NOT initiate payment. Copy and confirmation flows are
// written to be transparent about prototype status.
// ---------------------------------------------------------------------------

const track = (event, payload = {}) => {
  // Replace with real analytics call (e.g. plausible(event, { props: payload }))
  // eslint-disable-next-line no-console
  console.log("[track]", event, payload);
};

// ---------------------------------------------------------------------------
// Legal modal content
// ---------------------------------------------------------------------------
const LEGAL_CONTENT = {
  privacy: {
    title: "Privacy Notice",
    updated: "19 May 2026",
    sections: [
      {
        heading: "What Revily is",
        body: "Revily is an early-access GCSE Maths Revision prototype. We are not a fully launched product.",
      },
      {
        heading: "What we collect",
        body: "When you submit the early-access form, we collect: your email address; whether you are a parent, student, or tutor; your exam board; tier; target grade; any pricing-interest option you selected; the page URL; and the time of submission.",
      },
      {
        heading: "Why we collect it",
        body: "We use this information to manage the early-access waitlist, understand what parents and students actually want, decide what to build first, and contact you about Revily when the product develops.",
      },
      {
        heading: "How we store it",
        body: "Form submissions are processed and stored through Formspree. We do not operate our own database at this stage.",
      },
      {
        heading: "Payments",
        body: "We do not take payments on this page. Pricing buttons are interest signals only — clicking them does not start a payment or subscription.",
      },
      {
        heading: "Sharing",
        body: "We do not sell your personal information. We do not share it with third parties except as needed to operate the service (e.g. Formspree for form processing).",
      },
      {
        heading: "Analytics and advertising",
        body: "We may use analytics and advertising tools — such as Meta Pixel — in future to understand how people find and use this page. We will update this notice before doing so.",
      },
      {
        heading: "Under-16s",
        body: "If a student under 16 is signing up, they should have a parent or guardian's permission before submitting their details.",
      },
      {
        heading: "Your rights",
        body: "You can ask us to delete your data at any time by emailing hello@revily.co.uk. We will action deletion requests promptly.",
      },
      {
        heading: "Contact",
        body: "hello@revily.co.uk",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    updated: "19 May 2026",
    sections: [
      {
        heading: "Early-access prototype",
        body: "Revily is currently an early-access prototype. It is not a fully launched product. The landing page exists for waitlist signup and pricing-interest testing only.",
      },
      {
        heading: "No payments",
        body: "Pricing buttons on this page do not start a payment or subscription. They are interest signals only, used to understand which offer parents and students would find most useful.",
      },
      {
        heading: "No grade guarantees",
        body: "Revily does not guarantee any GCSE grade or exam outcome. No revision product can do this. The goal is to help students practise the right topics more consistently.",
      },
      {
        heading: "Mock-ups and planned features",
        body: "Content shown on the page — including app screens, progress views, and feature descriptions — includes mock-ups and planned features. The final product may differ based on what we learn from early-access testing.",
      },
      {
        heading: "No exam-board affiliation",
        body: "Revily is independent and not affiliated with, endorsed by, or approved by any exam board, including AQA, Edexcel, OCR, or Pearson. Content is mapped to GCSE Maths Foundation skills but has no official status.",
      },
      {
        heading: "Educational guidance",
        body: "This site is for product validation and general educational interest only at this stage. Students should continue to use official school, teacher, and exam-board guidance for exam preparation.",
      },
      {
        heading: "Changes",
        body: "We may update these terms as the product develops. Continued use of the site after changes are posted means you accept the updated terms.",
      },
      {
        heading: "Contact",
        body: "hello@revily.co.uk",
      },
    ],
  },
  contact: {
    title: "Contact",
    updated: null,
    sections: [
      {
        heading: null,
        body: "For questions, feedback, or data deletion requests, get in touch at:",
      },
      {
        heading: null,
        body: "hello@revily.co.uk",
        highlight: true,
      },
      {
        heading: null,
        body: "Revily is currently an early-access prototype, so response times may vary. We'll always reply.",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// LegalModal component
// ---------------------------------------------------------------------------
function LegalModal({ modalKey, onClose }) {
  const content = LEGAL_CONTENT[modalKey];

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    // Prevent body scroll while modal is open
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
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "rgba(11, 16, 21, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      aria-label="Close modal"
    >
      {/* Dialog panel — stops click propagation so clicking inside doesn't close */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.35)] flex flex-col"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-7 pt-7 pb-5 border-b border-black/[0.07] flex-shrink-0">
          <div>
            <h2
              id="legal-modal-title"
              style={display}
              className="text-2xl font-bold tracking-tight text-[#0B1015]"
            >
              {content.title}
            </h2>
            {content.updated && (
              <p className="text-[11px] text-black/45 mt-1" style={mono}>
                LAST UPDATED: {content.updated.toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 w-8 h-8 rounded-full bg-black/[0.06] hover:bg-black/[0.12] flex items-center justify-center transition-colors mt-0.5"
          >
            <X className="w-4 h-4 text-[#0B1015]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-7 py-6 space-y-5 flex-1">
          {content.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h3
                  className="text-[13px] font-bold text-[#0B1015] uppercase tracking-wider mb-1.5"
                  style={mono}
                >
                  {section.heading}
                </h3>
              )}
              <p
                className={`leading-relaxed ${
                  section.highlight
                    ? "text-[17px] font-semibold text-[#0B1015]"
                    : "text-[15px] text-black/70"
                }`}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-7 py-5 border-t border-black/[0.07]">
          <button
            onClick={onClose}
            className="w-full bg-[#0B1015] hover:bg-black text-[#C2F751] font-semibold py-3 rounded-full text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------
export default function RevilyLanding() {
  const [legalModal, setLegalModal] = useState(null); // null | "privacy" | "terms" | "contact"
  const closeLegal = useCallback(() => setLegalModal(null), []);

  useEffect(() => {
    const id = "revily-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap";
    document.head.appendChild(link);
  }, []);

  const display = { fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" };
  const body = { fontFamily: "'Manrope', system-ui, sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };

  return (
    <div
      style={{ ...body, backgroundColor: "#FAF7F2", color: "#0B1015" }}
      className="min-h-screen w-full antialiased selection:bg-[#C2F751] selection:text-[#0B1015]"
    >
      <Nav display={display} mono={mono} />
      <Hero display={display} mono={mono} />
      <StatusBox display={display} mono={mono} />
      <TrustStrip />
      <ProductPreview display={display} mono={mono} />
      <HowItWorks display={display} />
      <Differentiation display={display} />
      <ParentPain display={display} />
      <Pricing display={display} mono={mono} />
      <SignupForm display={display} />
      <FAQ display={display} />
      <Footer display={display} mono={mono} onOpenModal={setLegalModal} />

      {/* Legal modals — rendered at root level so they overlay everything */}
      {legalModal && <LegalModal modalKey={legalModal} onClose={closeLegal} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------
function Nav({ display, mono }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF7F2]/80 border-b border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group" aria-label="Revily home">
          <div className="w-8 h-8 rounded-lg bg-[#0B1015] flex items-center justify-center">
            <span className="text-[#C2F751] font-bold text-sm leading-none" style={display}>
              R
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold tracking-tight text-[15px]" style={display}>
              Revily
            </span>
            <span className="hidden sm:inline text-[12px] text-black/45 font-medium">
              GCSE Maths Revision
            </span>
          </div>
          <span
            className="ml-2 text-[10px] font-bold tracking-wider text-black/55 bg-black/[0.06] px-2 py-0.5 rounded"
            style={mono}
          >
            EARLY ACCESS
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-black/70">
          <a href="#how" className="hover:text-black transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-black transition-colors">Early pricing</a>
          <a href="#faq" className="hover:text-black transition-colors">FAQs</a>
        </nav>
        <button
          onClick={() => {
            track("nav_cta_click", { cta: "early_access" });
            document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-1.5 bg-[#0B1015] hover:bg-[#1F2A0F] text-[#C2F751] text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          Join early access
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function Hero({ display, mono }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0B1015 1px, transparent 1px), linear-gradient(90deg, #0B1015 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #C2F751 0%, transparent 65%)", opacity: 0.35 }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0B1015] text-[#C2F751] px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
              <GraduationCap className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span style={mono}>EARLY ACCESS · GCSE MATHS FOUNDATION</span>
            </div>

            <h1
              style={display}
              className="text-[44px] leading-[1.02] sm:text-[60px] sm:leading-[1] lg:text-[72px] lg:leading-[0.98] font-bold tracking-[-0.03em]"
            >
              GCSE Maths revision shouldn't feel like{" "}
              <span className="relative inline-block">
                <span className="relative z-10">guesswork</span>
                <span
                  aria-hidden
                  className="absolute left-0 right-0 bottom-1 sm:bottom-2 h-[14px] sm:h-[20px] -z-0 bg-[#C2F751] rounded-sm"
                />
              </span>
              .
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-black/70 max-w-[580px] leading-relaxed">
              We're building Revily, a 10-minute-a-day GCSE Maths revision tool for Foundation students working toward a Grade 4/5 — especially students predicted around a Grade 3 who need a clearer plan.{" "}
              <span className="text-black/85 font-medium">Join early access and help shape the first version.</span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  track("hero_cta_click", { cta: "early_access" });
                  document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center justify-center gap-2 bg-[#0B1015] hover:bg-black text-[#C2F751] font-semibold px-6 py-4 rounded-full text-base transition-all hover:scale-[1.02]"
              >
                Join early access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </button>
              
            </div>

            <div className="mt-8 flex items-start gap-3 text-sm text-black/60 max-w-[520px]">
              <ShieldCheck className="w-5 h-5 text-[#0B1015] flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p>
                Built with world class GCSE Maths teachers. {" "}
                <span className="text-black/80 font-medium">No random AI answers. No irrelevant curriculum. No false confidence.</span>
              </p>
            </div>
          </div>

          <HeroMockup display={display} mono={mono} />
        </div>
      </div>
    </section>
  );
}

function HeroMockup({ display, mono }) {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div className="absolute -top-4 -left-4 sm:-left-8 z-20 rotate-[-6deg]">
        <div className="bg-[#C2F751] rounded-2xl px-3 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#0B1015]" strokeWidth={2.5} />
          <span className="font-bold text-sm text-[#0B1015]" style={display}>Product preview</span>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-2 sm:-right-6 z-20 rotate-[5deg]">
        <div className="bg-white border border-black/10 rounded-2xl px-3 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.2)] flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#0B1015]" strokeWidth={2.5} />
          <span className="font-bold text-sm text-[#0B1015]" style={display}>In development</span>
        </div>
      </div>

      <div className="relative bg-[#0B1015] rounded-[44px] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
        <div className="bg-[#FAF7F2] rounded-[32px] overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-4 pb-2 text-xs text-black/60" style={mono}>
            <span>9:41</span>
            <span>•••</span>
          </div>

          <div className="px-5 pt-2 pb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-black/50 uppercase tracking-wider font-semibold" style={mono}>
                Mock-up · Foundation tier
              </div>
              <h3 className="text-xl font-bold mt-0.5" style={display}>Today's mission</h3>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0B1015] flex items-center justify-center text-[#C2F751] text-xs font-bold">
              S
            </div>
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
            <div className="bg-[#FAF7F2] rounded-lg px-3 py-2 text-lg font-semibold text-[#0B1015]" style={mono}>
              3x + 7 = 22
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["x = 5", "x = 7", "x = 15", "x = 3"].map((opt, i) => (
                <div
                  key={opt}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                    i === 0
                      ? "bg-[#C2F751] border-[#0B1015] text-[#0B1015]"
                      : "bg-white border-black/10 text-black/70"
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 mt-4 mb-5">
            <div className="flex items-center justify-between text-[11px] text-black/60 mb-1.5" style={mono}>
              <span>MISSION PROGRESS</span>
              <span>3 / 5</span>
            </div>
            <div className="h-1.5 bg-black/[0.08] rounded-full overflow-hidden">
              <div className="h-full bg-[#0B1015] w-3/5 rounded-full" />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-black/60">
              <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              <span>~10 minutes per mission (planned)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status box
// ---------------------------------------------------------------------------
function StatusBox({ display, mono }) {
  return (
    <section className="pb-6 sm:pb-10 -mt-4 sm:-mt-8">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="relative rounded-2xl border border-[#0B1015]/15 bg-white p-5 sm:p-6 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08)] flex gap-4 sm:gap-5">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#0B1015] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#C2F751]" strokeWidth={2.25} />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-[#0B1015] tracking-wider" style={mono}>STATUS</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0B1015] bg-[#C2F751] px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B1015] animate-pulse" />
                Early-access prototype
              </span>
            </div>
            <p className="text-[15px] text-black/75 leading-relaxed">
              Revily is not fully launched yet. We're inviting parents and students to join the waitlist and help shape the first version — our GCSE Maths Revision product.{" "}
              <span className="text-[#0B1015] font-semibold">You will not be charged today.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Trust strip
// ---------------------------------------------------------------------------
function TrustStrip() {
  const items = [
    "Foundation-tier focused",
    "Mapped to GCSE Maths skills",
    "Teacher review planned",
    "Reliable marking logic",
    "Parent progress updates",
  ];
  return (
    <section className="border-y border-black/[0.06] bg-white/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-black/65">
              <CheckCircle2 className="w-4 h-4 text-[#0B1015]" strokeWidth={2.25} />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Product preview
// ---------------------------------------------------------------------------
function ProductPreview({ display, mono }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="text-[11px] font-bold text-black/50 tracking-wider uppercase mb-3" style={mono}>
            What we're building
          </div>
          <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">
            GCSE Maths revision without the guesswork.
          </h2>
          <p className="mt-4 text-lg text-black/65 max-w-xl">
            These are the four things Revily's GCSE Maths Revision is being designed around. Early-access members will help us decide what stays, what changes, and what ships first.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          <PreviewCard badge="TODAY" title="Today's mission" accent display={display} mono={mono}
            description="The first version is being designed around focused daily missions — around 10 minutes, hand-picked from each student's weak topics."
          >
            <div className="bg-[#0B1015] rounded-2xl p-5 text-white">
              <div className="text-[11px] text-[#C2F751] font-semibold mb-2" style={mono}>MISSION · PREVIEW</div>
              <div className="font-semibold text-lg mb-4" style={display}>Linear equations · 5 questions</div>
              <div className="space-y-2">
                {[
                  { q: "Solve 3x + 7 = 22", done: true },
                  { q: "Solve 5x − 4 = 21", done: true },
                  { q: "Solve 2(x + 3) = 14", done: true },
                  { q: "Solve x/4 + 1 = 6", done: false },
                  { q: "Form & solve from word problem", done: false },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${row.done ? "bg-[#C2F751] border-[#C2F751]" : "border-white/30"}`}>
                      {row.done && <Check className="w-2.5 h-2.5 text-[#0B1015]" strokeWidth={3} />}
                    </div>
                    <span className={row.done ? "text-white/50 line-through" : "text-white"}>{row.q}</span>
                  </div>
                ))}
              </div>
            </div>
          </PreviewCard>

          <PreviewCard badge="DIAGNOSTIC" title="Weak topics, surfaced" display={display} mono={mono}
            description="The planned diagnostic will surface the topics most likely to cost marks, so the mission engine can target those first."
          >
            <div className="space-y-3">
              {[
                { topic: "Fractions & percentages", level: 32, tag: "Priority" },
                { topic: "Ratio", level: 41, tag: "Priority" },
                { topic: "Linear equations", level: 48, tag: "Priority" },
                { topic: "Area & volume", level: 62, tag: null },
                { topic: "Averages", level: 78, tag: "Strong" },
              ].map((row) => (
                <div key={row.topic}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-[#0B1015]">{row.topic}</span>
                    <div className="flex items-center gap-2">
                      {row.tag === "Priority" && (
                        <span className="text-[10px] font-bold text-[#0B1015] bg-[#C2F751] px-1.5 py-0.5 rounded" style={mono}>PRIORITY</span>
                      )}
                      {row.tag === "Strong" && (
                        <span className="text-[10px] font-bold text-black/60 bg-black/[0.06] px-1.5 py-0.5 rounded" style={mono}>STRONG</span>
                      )}
                      <span className="text-xs text-black/50 tabular-nums" style={mono}>{row.level}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-black/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.level < 50 ? "bg-[#FF8B6B]" : row.level < 75 ? "bg-[#0B1015]" : "bg-[#C2F751]"}`}
                      style={{ width: `${row.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PreviewCard>

          <PreviewCard badge="FEEDBACK" title="Reliable marking, with the working shown" display={display} mono={mono}
            description="The plan: no random AI guesses. Every answer marked against reliable logic, with the working shown so students learn the method — not just the answer."
          >
            <div className="space-y-3">
              <div className="bg-[#FAF7F2] rounded-xl p-4 border border-black/[0.07]">
                <div className="text-xs text-black/55 mb-2 font-semibold" style={mono}>YOUR ANSWER</div>
                <div className="text-lg font-semibold text-[#0B1015]" style={mono}>x = 5</div>
              </div>
              <div className="bg-[#C2F751] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-[#0B1015] flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#C2F751]" strokeWidth={3} />
                  </div>
                  <div className="text-xs font-bold text-[#0B1015]" style={mono}>CORRECT</div>
                </div>
                <p className="text-sm text-[#0B1015] leading-snug font-medium">
                  Subtract 7 from both sides → <span style={mono}>3x = 15</span>. Divide by 3 → <span style={mono}>x = 5</span>.
                </p>
              </div>
            </div>
          </PreviewCard>

          <PreviewCard badge="PROGRESS" title="Progress, visible to parents" display={display} mono={mono}
            description="A planned readiness view that shows what's being practised and where progress is happening — with optional weekly summaries for parents."
          >
            <div className="bg-[#0B1015] rounded-2xl p-5 text-white">
              <div className="flex items-end gap-4 mb-5">
                <div>
                  <div className="text-[11px] text-white/60 font-semibold mb-1" style={mono}>READINESS (PREVIEW)</div>
                  <div className="text-5xl font-bold tabular-nums" style={display}>
                    62<span className="text-2xl text-white/50">%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#C2F751] text-sm font-semibold pb-2">
                  <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                  Trending up
                </div>
              </div>
              <div className="text-[11px] text-white/60 font-semibold mb-2" style={mono}>EXAMPLE TREND</div>
              <div className="flex items-end gap-1 h-16">
                {[35, 38, 42, 41, 45, 48, 47, 50, 53, 55, 54, 58, 60, 62].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ height: `${v}%`, backgroundColor: i === 13 ? "#C2F751" : "rgba(255,255,255,0.25)" }}
                  />
                ))}
              </div>
            </div>
          </PreviewCard>
        </div>

        <p className="mt-8 text-sm text-black/50 text-center max-w-2xl mx-auto">
          Screens shown are product mock-ups. The shipping version may differ as we test with early-access members.
        </p>
      </div>
    </section>
  );
}

function PreviewCard({ badge, title, description, children, display, mono, accent }) {
  return (
    <div className={`rounded-3xl p-6 sm:p-7 border ${accent ? "bg-[#FAF7F2] border-black/[0.08]" : "bg-white border-black/[0.07]"} hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] transition-shadow`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-[#0B1015] bg-[#C2F751] px-2 py-0.5 rounded" style={mono}>{badge}</span>
      </div>
      <h3 className="text-2xl font-bold tracking-[-0.01em]" style={display}>{title}</h3>
      <p className="mt-2 text-[15px] text-black/65 leading-relaxed mb-5">{description}</p>
      <div>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------
function HowItWorks({ display }) {
  const steps = [
    {
      icon: Calculator,
      title: "Start with a short diagnostic",
      copy: "Planned: a ~5-minute diagnostic to find the topics that'll cost the most marks if they aren't fixed — your priority list.",
    },
    {
      icon: Target,
      title: "Get a 10-minute daily mission",
      copy: "Planned: each day, a focused mission targeting weak topics — sized for an evening break, not a study marathon.",
    },
    {
      icon: BarChart3,
      title: "Practise, get feedback, track progress",
      copy: "Planned: reliable instant marking with the working shown, a readiness view that climbs as gaps close, and an optional parent summary.",
    },
  ];

  return (
    <section id="how" className="py-20 sm:py-28 bg-[#0B1015] text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="text-[11px] font-bold text-[#C2F751] tracking-wider uppercase mb-3 font-mono">
            How it'll work
          </div>
          <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">
            Three steps. No revision overwhelm.
          </h2>
          <p className="mt-4 text-white/60 max-w-xl">
            This is the shape we're building toward. Early-access members will help us pressure-test each step before it ships.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative rounded-3xl bg-white/[0.04] border border-white/10 p-7 hover:bg-white/[0.06] transition-colors">
                <div className="absolute top-7 right-7 text-7xl font-bold text-white/[0.06] tabular-nums leading-none" style={display}>
                  {i + 1}
                </div>
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

// ---------------------------------------------------------------------------
// Differentiation
// ---------------------------------------------------------------------------
function Differentiation({ display }) {
  const points = [
    {
      icon: ShieldCheck,
      title: "Reliable marking",
      copy: "Based on well-known GCSE marking principles, not AI slop.",
    },
    {
      icon: Target,
      title: "Foundation-first focus",
      copy: "The first beta is focused on the Grade 3 → 4/5 path, not every tier and every subject at once.",
    },
    {
      icon: GraduationCap,
      title: "No hallucinated Maths curriculum",
      copy: "Exercises are tailored to the national GCSE Maths curriculum, not whatever the AI thinks.",
    },
    {
      icon: BarChart3,
      title: "Parent visibility planned",
      copy: "Progress updates are planned so parents can see whether revision is actually happening — not just hope it is.",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">
            Why this isn't another revision app.
          </h2>
          <p className="mt-4 text-lg text-black/65 max-w-xl">
            Mapped to GCSE Maths Foundation skills. Built around the topics most likely to move a Grade 3 toward a 4 or 5.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="rounded-3xl bg-white border border-black/[0.07] p-7 flex gap-5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#0B1015] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#C2F751]" strokeWidth={2.25} />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight mb-1.5" style={display}>{p.title}</h3>
                  <p className="text-[15px] text-black/65 leading-relaxed">{p.copy}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-3 bg-[#0B1015]/[0.04] border border-[#0B1015]/10 rounded-2xl px-5 py-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0B1015] bg-[#C2F751] px-2 py-0.5 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B1015] animate-pulse" />
            Early-access prototype
          </span>
          <p className="text-sm text-black/65">
            None of this is fully live yet — we're building and testing it now.{" "}
            <span className="font-semibold text-[#0B1015]">You will not be charged today.</span> Early-access members shape what ships first.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Parent pain
// ---------------------------------------------------------------------------
function ParentPain({ display }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div
          className="relative rounded-[36px] overflow-hidden p-8 sm:p-14 lg:p-20"
          style={{ backgroundColor: "#FFEFE8" }}
        >
          <div
            aria-hidden
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, #FF8B6B 0%, transparent 65%)", opacity: 0.45 }}
          />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-[#0B1015] mb-6">
              <AlertCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
              For parents
            </div>
            <h2 style={display} className="text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-[-0.02em] leading-[1.05]">
              Your child may be revising —{" "}
              <span className="italic">but are they revising the right things?</span>
            </h2>
            <div className="mt-6 space-y-4 text-[17px] text-[#0B1015]/75 leading-relaxed">
              <p>
                GCSE Maths can feel overwhelming when your child doesn't know what to practise next. Revision lists run three pages long, and it's not obvious which topics will actually move their grade.
              </p>
              <p>
                We're building Revily to cut that guesswork. The plan: a short diagnostic picks the highest-impact weak topics, and a daily 10-minute GCSE Maths Revision mission is built around them — so the time put in is the time that counts.
              </p>
              <p className="text-[#0B1015] font-semibold">
                Early-access parents will help shape what the weekly progress updates look like, and what they actually need to see.
              </p>
            </div>
            <button
              onClick={() => {
                track("parent_pain_cta_click", { cta: "early_access" });
                document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-8 inline-flex items-center gap-2 bg-[#0B1015] text-[#C2F751] font-semibold px-6 py-4 rounded-full hover:bg-black transition-colors"
            >
              Join early access
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------
function Pricing({ display, mono }) {
  const plans = [
    {
      name: "Free beta",
      price: "£0",
      sub: "If you want to try it for free when it opens",
      cta: "I'd join the free beta",
      ctaEvent: "pricing_interest_free",
      features: [
        "Planned: daily 10-minute missions",
        "Planned: diagnostic & weak topics",
        "Foundation-tier content",
        "Limited beta spaces",
      ],
    },
    {
      name: "Revision Sprint",
      price: "£19",
      sub: "Hypothetical one-off price for the full version",
      cta: "I'd pay £19 one-off",
      ctaEvent: "pricing_interest_19",
      features: [
        "Everything in the free beta",
        "Full question bank (planned)",
        "Daily mission engine (planned)",
        "Reliable marking & worked solutions",
        "Readiness view & history (planned)",
      ],
    },
    {
      name: "Parent Pack",
      price: "£29",
      sub: "Hypothetical price — Sprint plus weekly parent updates",
      cta: "I'd pay £29 with updates",
      ctaEvent: "pricing_interest_29",
      features: [
        "Everything in Revision Sprint",
        "Weekly progress email to parents",
        "Topic-by-topic improvement view",
        "Priority early-access support",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <div className="text-[11px] font-bold text-black/50 tracking-wider uppercase mb-3" style={mono}>
            Early pricing test
          </div>
          <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">
            Help us land the right price.
          </h2>
          <p className="mt-4 text-lg text-black/65 max-w-xl">
            We're testing which offer parents actually want before we open the first beta.{" "}
            <span className="text-[#0B1015] font-semibold">You will not be charged today.</span>
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-3xl p-7 border bg-white text-[#0B1015] border-black/[0.07] hover:shadow-[0_16px_50px_-20px_rgba(0,0,0,0.18)] transition-shadow"
            >
              <div className="text-sm font-semibold opacity-70 mb-2">{plan.name}</div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-5xl font-bold tracking-tight" style={display}>{plan.price}</span>
              </div>
              <div className="text-[13px] mb-6 text-black/55">{plan.sub}</div>
              <button
                onClick={() => {
                  track(plan.ctaEvent, { plan: plan.name, price: plan.price });
                  const params = new URLSearchParams(window.location.search);
                  params.set("plan", plan.name);
                  params.set("price", plan.price);
                  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
                  document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full font-semibold px-5 py-3.5 rounded-full transition-colors bg-[#0B1015] text-[#C2F751] hover:bg-black"
              >
                {plan.cta}
              </button>
              <div className="mt-6 pt-6 border-t border-black/[0.07] space-y-2.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-[14px]">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0B1015]" strokeWidth={3} />
                    <span className="text-black/75">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 max-w-2xl mx-auto bg-[#0B1015]/[0.04] border border-[#0B1015]/10 rounded-2xl p-4">
          <ShieldCheck className="w-5 h-5 text-[#0B1015] flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-black/70 leading-relaxed">
            These buttons help us understand demand.{" "}
            <span className="text-[#0B1015] font-semibold">They do not start a payment or subscription.</span> Pricing may change before launch.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Signup form
// ---------------------------------------------------------------------------
function SignupForm({ display }) {
  const [form, setForm] = useState({
    email: "",
    role: "Parent",
    board: "Not sure",
    tier: "Not sure",
    target: "Get a 4",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const payload = {
      ...form,
      selectedPlan: params.get("plan") || "",
      selectedPrice: params.get("price") || "",
      submittedAt: new Date().toISOString(),
      page: window.location.href,
    };
    track("signup_submit", payload);
    try {
      const response = await fetch("https://formspree.io/f/xojbjvaj", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Form submission failed");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="signup" className="py-20 sm:py-28 bg-white border-y border-black/[0.06]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#0B1015] text-[#C2F751] px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
            <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
            Early access · GCSE Maths Foundation
          </div>
          <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05]">
            Join the early access list.
          </h2>
          <p className="mt-4 text-lg text-black/65">
            Tell us a bit about your child's GCSE Maths. We'll email you when the first diagnostic beta opens and ask for your feedback on the product.
          </p>
          <p className="mt-3 text-sm text-black/50 max-w-lg mx-auto">
            Early-access members will help us test whether the marking, missions, and progress views are actually useful before we open wider access.
          </p>
        </div>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mt-10 bg-[#FAF7F2] border border-black/[0.07] rounded-3xl p-6 sm:p-8 space-y-5"
          >
            <Field label="Email">
              <input
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.co.uk"
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0B1015] focus:ring-2 focus:ring-[#C2F751]/40 transition-shadow"
              />
            </Field>

            <Field label="I am a">
              <Segmented
                value={form.role}
                onChange={(v) => setForm((f) => ({ ...f, role: v }))}
                options={["Parent", "Student", "Tutor"]}
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Exam board">
                <Select
                  value={form.board}
                  onChange={handleChange("board")}
                  options={["Edexcel", "AQA", "OCR", "Not sure"]}
                />
              </Field>
              <Field label="Tier">
                <Segmented
                  value={form.tier}
                  onChange={(v) => setForm((f) => ({ ...f, tier: v }))}
                  options={["Foundation", "Higher", "Not sure"]}
                />
              </Field>
            </div>

            <Field label="Target">
              <Segmented
                value={form.target}
                onChange={(v) => setForm((f) => ({ ...f, target: v }))}
                options={["Get a 4", "Get a 5", "Improve as much as possible"]}
              />
            </Field>

            <button
              type="submit"
              className="w-full bg-[#0B1015] hover:bg-black text-[#C2F751] font-semibold px-6 py-4 rounded-full text-base inline-flex items-center justify-center gap-2 transition-colors"
            >
              Join the early access list
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <p className="text-xs text-black/50 text-center">
              We'll only email you about Revily. Unsubscribe any time. You will not be charged today.
            </p>
          </form>
        ) : (
          <div className="mt-10 bg-[#0B1015] text-white rounded-3xl p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-[#C2F751] mx-auto flex items-center justify-center mb-5">
              <Check className="w-7 h-7 text-[#0B1015]" strokeWidth={3} />
            </div>
            <h3 style={display} className="text-3xl font-bold tracking-tight">You're on the list.</h3>
            <p className="mt-3 text-white/70 max-w-md mx-auto leading-relaxed">
              We'll email <span className="text-[#C2F751]">{form.email}</span> when the first diagnostic beta opens. If enough parents want the £19 Revision Sprint, we'll prioritise that version first.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-black/70 mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
              active
                ? "bg-[#0B1015] border-[#0B1015] text-[#C2F751]"
                : "bg-white border-black/10 text-black/70 hover:border-black/30"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white border border-black/10 rounded-xl px-4 py-3 pr-10 text-[15px] focus:outline-none focus:border-[#0B1015] focus:ring-2 focus:ring-[#C2F751]/40 transition-shadow"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/40" strokeWidth={2.5} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
function FAQ({ display }) {
  const items = [
    {
      q: "Is this live yet?",
      a: "Not fully. We're opening early access in small batches so we can test the diagnostic, missions, and marking before wider launch. Joining the waitlist puts you in line for those early batches.",
    },
    {
      q: "Will I be charged today?",
      a: "No. The pricing buttons are interest signals only — they help us understand which offer parents actually want. We'll ask clearly before taking any payment.",
    },
    {
      q: "Can this guarantee a Grade 4 or 5?",
      a: "No. No revision product can guarantee a grade. The goal is to help students practise the right topics more consistently — and to make the time they put in count.",
    },
    {
      q: "Is this an AI chatbot?",
      a: "No. Revily is being built as a revision engine — original questions, reliable marking logic, and daily missions structured around GCSE Maths skills. No chatbot freestyling answers.",
    },
    {
      q: "How is Revily different from generic AI revision tools?",
      a: "Revily is being built as a structured GCSE Maths revision engine, not an open-ended chatbot. The first version focuses on Foundation Grade 4/5 skills, reliable marking logic, worked solutions, and daily missions. AI may help explain mistakes, but it should not be the source of truth for marking.",
    },
    {
      q: "Is it exam-board specific?",
      a: "Content is mapped to GCSE Maths skills used across Edexcel, AQA, and OCR Foundation specs. We don't claim official endorsement from any exam board. At signup you can flag your board so we can prioritise familiar question styles.",
    },
    {
      q: "Is this for Foundation or Higher tier?",
      a: "We're starting with Foundation tier and the Grade 3 → 4/5 pass path. Higher-tier support is on the roadmap — early-access members will be the first to hear when it's ready.",
    },
    {
      q: "Is it suitable if my child is predicted a Grade 3?",
      a: "That's the core student we're designing for. Revily's GCSE Maths Revision is being built to target the topics most likely to lift a Grade 3 toward a 4 or 5. We can't promise a grade — the aim is to make the practice go into the right topics.",
    },
    {
      q: "What if my child is in Year 10, not Year 11?",
      a: "Early access is open to Year 10 parents too. Tell us at signup and we'll keep you posted — and if pricing changes before next year's cycle, we'll prioritise the early-access list.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <h2 style={display} className="text-4xl sm:text-5xl font-bold tracking-[-0.02em] leading-[1.05] text-center">
          Questions, answered honestly.
        </h2>

        <div className="mt-12 space-y-3">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all ${open ? "border-[#0B1015] bg-white" : "border-black/[0.08] bg-white/60"}`}
              >
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="font-semibold text-[16px] sm:text-lg tracking-tight" style={display}>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-[#0B1015] transition-transform ${open ? "rotate-180" : ""}`}
                    strokeWidth={2.25}
                  />
                </button>
                {open && (
                  <div className="px-6 pb-5 -mt-1 text-[15px] text-black/70 leading-relaxed">{item.a}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-14 rounded-3xl bg-[#0B1015] text-white p-8 sm:p-10 text-center">
          <h3 style={display} className="text-2xl sm:text-3xl font-bold tracking-tight">
            Help us build something parents actually want.
          </h3>
          <p className="mt-3 text-white/70 max-w-md mx-auto">
            Join the early-access list. We'll email you when the first diagnostic beta opens — and ask for your feedback as we build.
          </p>
          <button
            onClick={() => {
              track("faq_bottom_cta_click", { cta: "early_access" });
              document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-6 inline-flex items-center gap-2 bg-[#C2F751] text-[#0B1015] font-semibold px-6 py-3.5 rounded-full hover:bg-[#D2FF61] transition-colors"
          >
            Join early access
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <p className="mt-4 text-xs text-white/50">You will not be charged today.</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer — links now open modals via onOpenModal prop
// ---------------------------------------------------------------------------
function Footer({ display, mono, onOpenModal }) {
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
              © {new Date().getFullYear()} Revily · Early-access prototype · Not affiliated with any exam board
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-black/55">
          <button
            onClick={() => onOpenModal("privacy")}
            className="hover:text-black transition-colors underline-offset-2 hover:underline"
          >
            Privacy
          </button>
          <button
            onClick={() => onOpenModal("terms")}
            className="hover:text-black transition-colors underline-offset-2 hover:underline"
          >
            Terms
          </button>
          <button
            onClick={() => onOpenModal("contact")}
            className="hover:text-black transition-colors underline-offset-2 hover:underline"
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}