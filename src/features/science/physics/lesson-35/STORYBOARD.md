# Physics Lesson 35 storyboard — Nuclear equations

Chapter P4, Atomic structure. Folder `physics/lesson-35`, id `P-ATM-035-P`, skill `P-NUCLEAR-EQ`, spec 6.4.2.2. It owns nuclear equations for alpha (mass number −4, atomic number −2, ⁴₂He), beta (neutron → proton, atomic number +1, ⁰₋₁e) and gamma (changes neither), with the two balancing rows. Nothing deeper.

Big idea: in a nuclear equation the top numbers balance and the bottom numbers balance. Alpha and beta decay change the nucleus in a fixed way, so you can fill in a missing nucleus.

Flow note: the layout and golden rule first, then the symbols, then alpha (the simpler change: subtract), then beta (needs the −1 idea and neutron → proton), then gamma (the "nothing changes" case). Calculation flow: worked example ²¹⁰₈₄Po → ²⁰⁶₈₂Pb + ⁴₂He (top row, then bottom row, then check) → near-identical guided items (Ra-226, Am-241 for alpha; Co-60, I-131 for beta) → independent (Rn-222; the decay of strontium-90 identified as beta; a missing atomic number in a diagram) → written (sodium-24 beta decay).

Sections:
1. Start here (P35-01): protons lost in alpha emission.
2. How is a decay written? (P35-02–04): before → after + radiation, golden rule, symbols. Checks: what must be equal; alpha symbol.
3. How does alpha decay change a nucleus? (P35-05–07): rule, worked example in three frames, two guided calculations.
4. How does beta decay change a nucleus? (P35-08–10): neutron to proton, mass number the same, worked carbon-14, two guided calculations.
5. What does gamma change? (P35-11–12): extra energy only; neither number changes.
6. On your own (P35-13–16): an alpha calculation, identify the radiation, a diagram with a missing number, a written beta equation.

Out of scope: naming the new element from its atomic number beyond what is given, decay chains, neutron emission, positron decay.

Source boundary: supplied revision-guide page 200 (scope only); AQA 8464 Physics 6.4.2.2. All wording, decays and diagrams are original (real isotopes, own numbers; the page's examples and exam questions are not reused). Draft pending teacher review.

Judgement calls for the teacher:
- The new element's name is given in the worked example (lead) and in questions; students are never asked to look up an element.
- Beta decay is stated as "a neutron turns into a proton" as on the page; nothing about the neutrino.
- Unicode super/subscripts are used in text; the diagrams draw the same numbers stacked.

## Diagram specs
Alpha ⁴₂He drawn as 2 coral protons and 2 grey neutrons; beta as a blue electron; gamma as a green wave. Nuclear symbols are drawn stacked (mass number over atomic number) in a clear 18px+ font; the top row colour and bottom row colour stay the same across the lesson (mass numbers in one tint, atomic numbers in another). Soft shapes, `physicsPalette`, text at least 12px, readable at 360px.

- `nucleq-form`: an equation strip with three boxes: "nucleus before decay" → "nucleus after decay" + "radiation given out", each with a small nucleus icon.
- `nucleq-rule`: an example equation with the mass numbers circled in one colour and the atomic numbers in another, and two brackets: "top numbers: left total = right total" and "bottom numbers: left total = right total".
- `nucleq-symbols`: three cards: alpha "⁴₂He" (helium nucleus icon), beta "⁰₋₁e" (electron icon), gamma "γ, no symbol needed" (wave icon), each with the two numbers labelled "mass number" and "atomic number".
- `nucleq-alpha-rule`: a nucleus emitting an alpha particle; two arrows: "atomic number −2" and "mass number −4"; label "new element formed".
Worked example frames share one drawing: the equation ²¹⁰₈₄Po → Pb + ⁴₂He (lead's two numbers as "?" boxes) drawn large with nucleus icons above each term, a step strip ("set up", "top row", "bottom row"), current step highlighted.
- `nucleq-alpha-work-1`: the equation with two question marks in gaps for lead's mass number and atomic number.
- `nucleq-alpha-work-2`: the top row highlighted: "210 = ? + 4, so ? = 206", the top number of lead filled in.
- `nucleq-alpha-work-3`: the bottom row highlighted: "84 = ? + 2, so ? = 82"; the full equation ²¹⁰₈₄Po → ²⁰⁶₈₂Pb + ⁴₂He with two ticks, one per row.
- `nucleq-beta-rule`: a nucleus with one grey neutron turning coral (a proton) and a blue electron shooting out; labels "neutron → proton" and "atomic number +1".
- `nucleq-beta-symbol`: the beta particle symbol ⁰₋₁e with the labels "mass number 0" and "atomic number −1", and a note "keeps the rows balanced".
- `nucleq-beta-work`: ¹⁴₆C → ¹⁴₇N + ⁰₋₁e with nucleus icons, the top row "14 = 14 + 0" and bottom row "6 = 7 + (−1)" highlighted, two ticks.
- `nucleq-gamma`: a nucleus glowing with a green wave leaving, labelled "extra energy leaves"; no particles leave.
- `nucleq-gamma-same`: the same nucleus before and after, identical numbers shown ("mass number 24, atomic number 12" as an example), equals sign between, captioned "nothing changes".
Question visual:
- `nucleq-q-missing` (assessment view): the equation ²¹⁸₈₄Po → ²¹⁴₍?₎Pb + ⁴₂He drawn stacked, with the lead's atomic number shown as a box containing "?". Mass numbers shown, atomic numbers shown for the others. No working, no ticks. Neutral accessible description: "A nuclear equation for alpha decay with one atomic number missing."
