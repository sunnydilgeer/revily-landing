# Lesson 16 (Algebra A2) QA

Run:

```bash
npm run verify:lesson16:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run build
```

Checked on 28 September 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` passes.
- "Write as a single power" answers use a base box and a raised power box, marked by the `power` rule: 10⁷ is right, 10000000 or 100⁷ is not the power asked for.
- Algebra answers use the order-free `collectedExpression` rule, which now reads any power (a⁻⁴, p⁷) and a whole-number bottom (x²/9, 8x³/125). The xⁿ key raises the digits typed next.
- The verifier works every typed answer out again with plain arithmetic (algebra answers are compared with the question at three sets of letter values), and checks each choice has a message for every wrong option.
- Wrong answers get specific messages: powers multiplied instead of added (and the reverse), the base changed (9⁶, 1⁵, 100⁷), powers subtracted the wrong way round, a lone letter taken as power 0, a lost minus, the numbers added instead of multiplied, a power left unworked, a square root taken as half, a square root used for a cube.
- The workings are pictures first (EXPLANATIONS.md): powers written out as copies (matching pairs cross out when dividing), numbers and letters sorted into colours, area squares for (2/3)² and square roots, and lines of working built up one heading at a time.
- Powers in titles, choices, messages and workings are drawn as raised digits (`Powers.tsx`), because the app font's ¹ ² ³ are much smaller than the ⁴–⁹ it borrows from another font.
- All 71 screens at 320px wide, with the right answer checked, the working stepped through and every ⓘ opened: no sideways scrolling. Wrong answers and the xⁿ key checked in the browser too.
