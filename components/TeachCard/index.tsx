"use client";

import MathText from "@/components/MathText";
import { MathSpan } from "@/components/MathText";

import type { TeachContent } from "./types";
import { resolveVisualModel } from "./registry";

export type { TeachContent } from "./types";
export type { VisualModel, VisualBarRow, BarColor } from "./types";

// ── VisualModelRenderer ───────────────────────────────────────────────────
// Looks up the right component for this visual_model's shape via the
// registry and renders it. If nothing matches (bad/unexpected DB data),
// renders nothing rather than crashing the page — same fallback behavior
// the old inline if-chain had.

function VisualModelRenderer({ visualModel }: { visualModel: NonNullable<TeachContent["visual_model"]> }) {
  const entry = resolveVisualModel(visualModel);
  if (!entry) return null;
  const { Component, mapProps } = entry;
  return <Component {...mapProps(visualModel)} />;
}

// ── TeachCard ────────────────────────────────────────────────────────────
// Renders the "Key Point" teaching interstitial (doc section 2.3-equivalent)
// that sits before a concept_check question. Non-quiz — no options, single
// "Got it" button to advance. Only ever rendered for question_type = 'teach'.
//
// This file is intentionally thin: every visual_model style lives in its
// own file under models/, wired up in registry.tsx. Adding a new style
// never means editing this file — see the comment at the top of
// registry.tsx for the three-step process.

export default function TeachCard({
  content,
  onContinue,
  continueLabel = "Got it →",
}: {
  content: TeachContent;
  onContinue: () => void;
  continueLabel?: string;
}) {
  return (
    <div>
      {((content.key_point_steps && content.key_point_steps.length > 0) ||
        (content.key_point && content.key_point.trim() !== "")) && (
        <>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-[#8a8fa8]">Key Point</div>
          </div>
          {content.key_point_steps && content.key_point_steps.length > 0 ? (
            <ol
              className="mb-4 list-decimal space-y-1 pl-5 text-xl leading-snug text-[#f1f0ee]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
            >
              {content.key_point_steps.map((step, i) => (
                <li key={i}>
                  <MathText text={step} />
                </li>
              ))}
            </ol>
          ) : (
            <div
              className="mb-4 text-xl leading-snug text-[#f1f0ee]"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}
            >
              <MathText text={content.key_point} />
            </div>
          )}
        </>
      )}
      {content.rule && content.rule.trim() !== "" && (
        <div className="mb-4 flex justify-center">
          <div className="inline-block rounded-lg border border-[#2e3248]/80 bg-[#22263a] px-3 py-1.5 text-sm font-medium text-[#f1f0ee]">
            <MathText text={content.rule} />
          </div>
        </div>
      )}
      {content.formula && content.formula.trim() !== "" && (
        <div className="mb-6 flex justify-center rounded-xl border border-[#2e3248] bg-[#818cf80d] px-4 py-4 text-[#f1f0ee]">
          <MathSpan latex={content.formula} display />
        </div>
      )}
      {content.visual_model && (
        <div className="mb-6 rounded-xl border border-[#2e3248] bg-[#22263a] p-4">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-[#8a8fa8]">
            Visual model
          </div>
          <VisualModelRenderer visualModel={content.visual_model} />
          <div className="mt-3 text-center text-xs leading-relaxed text-[#8a8fa8]">
            <MathText text={content.visual_model.caption} />
          </div>
        </div>
      )}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onContinue}
          className="rounded-full bg-[#f9c74f] px-7 py-2.5 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}