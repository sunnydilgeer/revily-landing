"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

// ── splitMathClauses ─────────────────────────────────────────────────────
// Long sentences with 2+ inline math segments (e.g. "Complete the
// equivalent fractions: $\frac{3}{4}$ = $?/20$ and $\frac{2}{5}$ = $?/20$.")
// render as one dense wrapped paragraph. This breaks them onto separate
// logical lines at natural clause boundaries — after an instruction colon,
// and around " and " when it's joining two equations — before the string
// hits the existing $...$ splitter below. Short strings (MCQ option rows,
// single-fraction sentences) are left untouched via the length + math-count
// gates, so this only fires on the run-on question-stem case it's meant for.
function splitMathClauses(str: string): string {
  const mathCount = (str.match(/\$[^$\n]+?\$/g) || []).length;
  if (mathCount < 2) return str;
  if (str.length < 40) return str;

  return str
    .replace(/:\s*(?=\$)/g, ":\n")
    .replace(/\$\s+and\s+(?=\$)/g, "$\nand ")
    // break once, right before "answer =" — absorb any comma/space before it
    .replace(/,?\s*(?=answer\s*=)/g, "\n")
    // safety net: collapse any line that's just a stray comma (in case another rule left one)
    .replace(/\n,\s*\n/g, "\n")
    .replace(/^\s*,\s*\n/gm, "");
}

// ── MathText ───────────────────────────────────────────────────────────────
// Renders a string that may contain $...$ (inline) or $$...$$ (display)
// delimiters mixed with plain text. Plain text segments also have literal
// "\n" escape sequences converted to real <br> line breaks — without this,
// a string like "Work out X.\n\nGive your answer..." renders the literal
// backslash-n characters instead of a paragraph break.
export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Supabase double-escapes backslashes — unescape before parsing
    const unescapedRaw = (text ?? "").replace(/\\\\/g, "\\");
    // Insert clause-break newlines for long multi-equation sentences
    const unescaped = splitMathClauses(unescapedRaw);
    const parts = unescaped.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g);

    const fragment = document.createDocumentFragment();

    parts.forEach((part) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const latex = part.slice(2, -2);
        const el = document.createElement("span");
        el.style.display = "block";
        el.style.overflowX = "auto";
        try {
          katex.render(latex, el, { displayMode: true, throwOnError: false });
        } catch {
          el.textContent = part;
        }
        fragment.appendChild(el);
      } else if (part.startsWith("$") && part.endsWith("$")) {
        const latex = part.slice(1, -1);
        const el = document.createElement("span");
        try {
          katex.render(latex, el, { displayMode: false, throwOnError: false });
        } catch {
          el.textContent = part;
        }
        fragment.appendChild(el);
      } else {
        // Plain text segment — convert literal "\n" escape sequences into
        // real line breaks. Handles both an actual newline character and
        // the two-character literal backslash-n (which is what we get when
        // a JSON string like "...\n\nGive your answer..." has already been
        // parsed, since JSON.parse converts \n to a real newline char — but
        // if a double-escaped \\n slips through anywhere upstream, this
        // also catches the literal two-character form defensively). This
        // also picks up the \n inserted by splitMathClauses above.
        const normalised = part.replace(/\\n/g, "\n");
        const lines = normalised.split("\n");

        lines.forEach((line, i) => {
          if (line) fragment.appendChild(document.createTextNode(line));
          if (i < lines.length - 1) fragment.appendChild(document.createElement("br"));
        });
      }
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(fragment);
  }, [text]);

  return <span ref={containerRef} className={className} />;
}

// ── MathSpan ───────────────────────────────────────────────────────────────
// Renders a *raw LaTeX string* (no $...$ delimiters) directly via KaTeX.
// Use this when you already have the latex content extracted — e.g. inside
// TransformTile where the parser has already stripped the delimiters.
export function MathSpan({
  latex,
  display = false,
  className,
}: {
  latex: string;
  display?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Unescape Supabase double-escaped backslashes
    const unescaped = (latex ?? "").replace(/\\\\/g, "\\");
    try {
      katex.render(unescaped, ref.current, {
        displayMode: display,
        throwOnError: false,
      });
    } catch {
      ref.current.textContent = unescaped;
    }
  }, [latex, display]);

  return <span ref={ref} className={className} />;
}