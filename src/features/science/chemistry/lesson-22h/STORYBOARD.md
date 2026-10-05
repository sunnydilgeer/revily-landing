# Chemistry Lesson 22H storyboard — Strong and weak acids

Chapter C4, Chemical changes. A whole lesson that only Higher students get (catalogue entry in `higher/lessons.ts`; the badge is shown by the app, so no learner text names the tier). It sits after Lesson 22 (acids, alkalis and pH) and before Lesson 23 (salts). Folder `chemistry/lesson-22h`, id `C-ACID-022H-C`, skill `C-ACID-STRENGTH`. Visuals: `components/HigherAcidStrengthVisuals.tsx` (focus prefix `hacid-`).

Big idea: acids make H⁺ ions by ionising. A strong acid ionises completely and a weak acid only partly, in a reversible reaction. pH measures the concentration of H⁺ ions: each step down the scale means 10 times as many, so the factor is 10⁻ˣ. Strength (how much ionises) is a different idea from concentration (how much acid is in the volume).

Flow note: builds on "acids make H⁺ ions" and the pH scale (Lesson 22) and on concentration (Lesson 21) without re-teaching them. Particles come first, so strong and weak are seen before any number. The pH section then explains what "more H⁺" does to the number: counting steps first (× 10 each), then going up the scale, then the formula as a short way of writing the same count. Concentration comes last because it needs both ideas: same concentration with different strength gives different pH, and the four combinations separate the two words.

1. **Start here** (C22H-01): which ion all acids make (prior knowledge).
2. **Strong and weak acids** (C22H-02–05): two beakers built up over five frames: HCl ionising → strong (all ionised; HNO₃, H₂SO₄) → ethanoic acid, weak (1 in 8 ionised; citric, carbonic) → CH₃COOH ⇌ H⁺ + CH₃COO⁻ → both together (8 H⁺ vs 1 H⁺). Checks: which acid is weak; which beaker is weak (assessment view, neutral acid); what ⇌ means.
3. **pH and hydrogen ions** (C22H-06–11): one pH strip (0–7) with × 10 hops: more H⁺ means lower pH → one step × 10 → two steps 10 × 10 = 100 → one step up ÷ 10 → factor = 10⁻ˣ (4 → 2: X = −2, 100). Worked: 5 → 2 by counting (1000); 7 → 3 by the formula (10⁴ = 10 000). Practice: 6 → 4 (100); 6 → 1 (10⁵ = 100 000); 2 → 3 (10 times smaller).
4. **Strong is not concentrated** (C22H-12–14): dilute vs concentrated HCl (3 vs 8 particles) → same concentration, strong vs weak → about pH 1 vs about pH 3 → 2 × 2 grid → put together (more concentrated means lower pH, strong or weak). Checks: what "strong" means; same concentration, which has the lower pH.
5. **On your own** (C22H-15–19): dilution 1 → 3 (100 times smaller, calculation); four numbered beakers, which is dilute and strong (assessment view); four acids at one concentration, read without over-claiming; spot the wrong line in a 10⁻ˣ working; written task: why HCl has a lower pH than ethanoic acid at the same concentration.

Numbers (each checked twice): 5 → 2 is 3 steps, 10³ = 1000 · 6 → 4 is 2 steps, 100 · 7 → 3: X = −4, 10⁴ = 10 000 · 6 → 1: X = −5, 10⁵ = 100 000 · 4 → 2: X = −2, 100 · 1 → 3 is 2 steps up, 100 times smaller · HCl pH 1 vs ethanoic pH 3: 100 times · student's 5 → 2: 10 × 3 = 30 wrong, 10³ = 1000 right.

Out of scope: rates of reaction of strong and weak acids, the position of equilibrium, mol/dm³ and pH calculations from concentration, non-whole-number pH (spec says whole numbers only); reactions of acids and salts (Lesson 23); the book's examples, questions, cartoons and jokes.

Source boundary: supplied revision-guide page 130 (scope only); AQA 8464 Chemistry 5.4.2.5 (HT) (C22H-01 uses 5.4.2.4). All examples, numbers, questions, diagrams and wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- Beakers are schematic: a weak acid is drawn with 1 in 8 particles ionised (real ethanoic acid is nearer 1 in 100), and the dilute weak beaker shows 1 of 3 ionised so it still shows an ion.
- pH values at "the same concentration" (HCl and nitric 1, citric 2, ethanoic 3) are rounded whole numbers, about right for 0.1 mol/dm³ solutions; they are labelled "about" in teaching.
- The ⇌ frame says "most of the acid stays as whole molecules" rather than "the equilibrium lies to the left".
- Sulfuric acid is listed as strong without discussing its second ionisation.
- The formula is written factor = 10⁻ˣ with X = final pH − initial pH, as the spec-style rule; every formula answer is also checked by counting steps.

## Diagram plan
`components/HigherAcidStrengthVisuals.tsx`, focus prefix `hacid-`. H⁺ ions coral (as in Lesson 22), Cl⁻ soft green, ethanoic acid/ethanoate soft lilac, neutral slate acid in question beakers; pH strip in universal-indicator colours; amber for the idea in focus. Frames: `hacid-strong-ionise/-strong/-weak/-reversible/-together`, `hacid-ph-more/-ten/-steps/-up/-formula`, `hacid-conc-amount/-strength/-ph/-grid/-together`. Worked: `hacid-worked-steps`, `hacid-worked-formula`. Questions: `hacid-q-beakers`, `hacid-q-grid` (labels hidden in assessment view), `hacid-data-acids`, `hacid-question-error` (wrong line marked only after answering).

## States in full
See `lesson.ts` (19 screens: C22H-01 to C22H-19) and `teachingFrames.ts`.
