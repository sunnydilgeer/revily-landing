"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

export default function MathText({ text, className }: MathTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Supabase double-escapes backslashes — unescape before parsing
    const unescaped = text.replace(/\\\\/g, "\\");
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
        fragment.appendChild(document.createTextNode(part));
      }
    });

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(fragment);
  }, [text]);

  return <span ref={containerRef} className={className} />;
}