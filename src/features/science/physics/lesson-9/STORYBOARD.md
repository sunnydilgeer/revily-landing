# Physics Lesson 9 storyboard — Efficiency

Chapter P1, Energy. Folder `physics/lesson-9`, id `P-ENE-009-P`, skill `P-EFFICIENCY`, spec 6.1.2.2. It owns efficiency as useful output ÷ total input (energy and power forms), decimal ↔ percentage, and one worked rearrangement for the useful power output.

Big idea: efficiency compares the useful energy that comes out with the total energy that goes in. It is a decimal between 0 and 1 (or a percentage), and never reaches 100% because some energy is always wasted.

Flow note: split the input into useful and wasted first, then say what efficiency measures, then calculate with energy, then show the same equation with power, and only then rearrange for the useful output. Calculation flow: worked example → near-identical guided item → independent calculations on your own.

Sections:
1. Start here (P9-01): two devices with different waste.
2. What is efficiency? (P9-02–04): input, useful and wasted → what efficiency measures → never 100 per cent. Checks: waste from 500 J and 350 J; why no device is 100% efficient.
3. How do you calculate it? (P9-05–08): the equation → a decimal from 0 to 1 → percentage → three steps. Worked: 350 J useful from 500 J = 0.7 = 70%. Guided: 300 J from 400 J = 75%; an answer of 1.2.
4. What about power? (P9-09–11): power in and power out → same idea (20 W in, 5 W out) → finding the useful output. Worked: 60% of 500 W = 300 W. Guided: 40% of 200 W = 80 W.
5. On your own (P9-12–16): 200 J from 250 J = 80%; 300 W from 500 W = 0.6; 25% of 800 W = 200 W; efficiency of a lamp from a diagram (20%); a written explanation.

Out of scope: Sankey diagrams as a topic; efficiency of real named devices beyond the simple examples; any cost or payback discussion; rearranging for the total input.

Source boundary: supplied revision-guide page 173 (scope only); AQA 8464 Physics 6.1.2.2. All wording, numbers, examples and diagrams are original; the page's television, blender, motor and exam questions are not reused. Draft pending teacher review.

Judgement calls for the teacher:
- The equation is given in words (as on the page); symbols are not introduced.
- "Never more than 1" is stated as a check on answers; the 1.2 question builds the habit.
- The power version is included with a single rearrangement shown as a worked example, as the brief allows.

## Diagram specs
Same look as Science Lessons 17 and 18 and the other Physics lessons: soft flat fills with a darker stroke of the same hue, PhysicsKit `physicsPalette`, energy-store badges and transfer arrows. Text in the SVG ≥ 12px, readable on 360px. Useful energy in the "useful" colour, wasted energy in the "wasted/thermal" colour, total input in a neutral tone.

- `effic-split`: a simple machine box. One arrow in "total input 100 J", two arrows out: a wide one "useful output 70 J" and a narrower one "wasted 30 J". Equation strip underneath: "input = useful + wasted".
- `effic-measure`: two machine boxes side by side with the same input arrow: one wastes little ("efficient"), one wastes a lot ("not efficient"). Each shows a bar with the useful part shaded.
- `effic-never`: a machine box with a small but visible wasted arrow and the caption "some energy is always wasted", and a dial that reaches just below "100%".
- `effic-eq`: a fraction card "efficiency = useful output energy transfer ÷ total input energy transfer", useful on top in the useful colour, total below in the neutral tone.
- `effic-decimal`: a number line from 0 to 1 with markers at 0.2, 0.5 and 0.8; an area beyond 1 crossed out with "cannot happen". Caption "0.8 = 80 out of every 100 J useful".
- `effic-percent`: two chips "0.8 × 100 = 80%" and "80% ÷ 100 = 0.8" with a two-way arrow.
- `effic-steps`: a three-step ladder: "1 write down useful and total", "2 divide", "3 × 100 for a percentage". Same colours as the fraction card.
- `effic-worked-energy` (worked example, teaching view): a motor box with 500 J in, 350 J useful, 150 J wasted; the three steps listed on the right with 0.7 and 70%.
- `effic-power`: a machine box with arrows in watts: "total power input" and "useful power output", plus a small wasted arrow.
- `effic-power-eq`: a lamp with "20 W in" and "5 W of light out" and the sum "5 ÷ 20 = 0.25 = 25%".
- `effic-rearrange`: two-line algebra: "efficiency = useful power output ÷ total power input", an arrow "× total power input on both sides", then "useful power output = efficiency × total power input". Note "use the decimal".
- `effic-worked-power` (worked example, teaching view): a machine box "500 W in", "60% = 0.6", "0.6 × 500 = 300 W out"; the three steps listed on the right.
- `effic-q-lamp` (question, assessment view): an energy transfer diagram for a lamp: an arrow "200 J electrical energy in", one arrow "40 J light" and one arrow "160 J thermal energy to the surroundings". No efficiency shown, no "useful" or "wasted" words on the arrows beyond what the values say (label the arrows "light" and "thermal" only). Neutral description: "An energy transfer diagram for a lamp with the energy in and the energy out."
