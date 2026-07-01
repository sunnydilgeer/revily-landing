"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
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
    const unescaped = (text ?? "").replace(/\\\\/g, "\\");
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
        // also catches the literal two-character form defensively).
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