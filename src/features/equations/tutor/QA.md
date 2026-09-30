# Lesson 19 (Algebra A5) QA

Run:

```bash
npm run verify:lesson19:tutor
npm run verify:step-chains
npm run verify:practice
npm run verify:exam-checklist
npm run build
```

Checked on 30 September 2026:

- Every verifier passes except `verify:revision-cards`, which already fails on `main` for a Science card (B-GEN-042-B). `next build` and `tsc --noEmit` pass.
- The verifier solves all 32 equations independently (written out as plain arithmetic) and puts each answer back in. It also checks that every row of every board is a true equation at the answer (236 rows, including the check lines), that each working ends on a labelled answer checked in the question, and that every move boxes the part it undoes.
- Typed answers: a number after "x =" (typing "x = 6" is fine too), or after "£" for money. Squares take two boxes, "x = ☐ or x = ☐", in either order; one root alone is marked wrong with "There are two answers".
- Wrong answers get specific messages, found by trying each slip on one move at a time: the number moved with the wrong sign (Nina), the x term moved with the wrong sign, the last division missed or upside down, only the first term in a bracket multiplied (Leo), the bottoms dropped (Zac), only one root, x² given for x, halved instead of square-rooted, √x not squared, one ticket or the whole bill instead of the share.
- All 41 screens at 320px wide, with the right answer checked, the working stepped through and every ⓘ opened, plus six wrong answers. No sideways scrolling except the known "Show the first step" overhang (on `main` too), a few pixels wider on the fraction questions because of the extra step dots.
