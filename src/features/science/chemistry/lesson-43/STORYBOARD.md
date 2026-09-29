# Chemistry Lesson 43 storyboard — Rf values

Chapter C8, Chemical analysis. Folder `chemistry/lesson-43`, id `C-ANA-043-C`, skill `C-RF-VALUES`. It owns the Rf formula, calculating an Rf value to 2 significant figures, and using reference spots to identify substances. How a chromatogram is set up and read is taught in the earlier chromatography lessons and is only recalled here.

Big idea: an Rf value compares how far a spot moved with how far the solvent moved. It is spot distance divided by solvent distance, has no units, and is never more than 1. Matching Rf values against pure references shows what a mixture could contain.

Flow note: meaning first (two distances, the front, the ratio, further means larger), then the calculation as four small steps with one worked example, then guided practice with new numbers, then identification, because students need to trust the number before they use it to compare. Calculation flow: worked example → near-identical guided item → independent calculation on your own.

Sections:
1. Start here (C43-01): two inks on one paper move different distances.
2. What is an Rf value? (C43-02–04): two distances → solvent front → the ratio → further means larger. Checks: the formula; what a larger Rf means.
3. How do you work one out? (C43-05–07): measure the spot (7.3 cm) → measure the solvent (9.6 cm) → divide → round to 0.76. Checks: 4.4 cm and 7.2 cm gives 0.61; why no units.
4. How do you identify a substance? (C43-08–10): reference → compare → read a whole chromatogram → different solvent. Checks: what a reference is; conclusion from matches.
5. On your own (C43-11–15): repeating with another solvent; an independent Rf calculation (2.8 and 8.0); which references match a numbered chromatogram; what a single match shows; a written method.

Out of scope: how to set up and run chromatography (earlier lessons); Higher-tier ideas about why substances move at different rates (mobile and stationary phase detail); the exam question on the page was not reused.

Source boundary: supplied revision-guide page 150 (scope only); AQA 8464 Chemistry 5.8.1.3. All wording, numbers, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Rf is quoted to 2 significant figures as the page does; a value with a trailing zero (for example 0.70) would be kept as written.
- "Never more than 1" and "no units" are stated simply so students can sanity-check answers.
- A match is described as "could be" present, and the different-solvent check is included, following the page.

## Diagram specs
Same look as Lessons 17 and 18: soft, rounded, gentle tints, hand-drawn feeling. Chromatography paper is a pale rounded rectangle with a pencil baseline near the bottom; the solvent front is a dashed line near the top with a wet tint below it. Spots are soft coloured blobs (use the chromatography colours from `atomPalette` tints). Dimension lines are thin arrows with the label beside them. Text in the SVG ≥ 12px.

- `rfval-two-distances`: one paper with baseline, one spot and the solvent front. Two vertical dimension arrows: a short one from baseline to spot labelled "distance moved by the spot", a long one from baseline to front labelled "distance moved by the solvent". Labels "baseline" and "solvent front".
- `rfval-front`: the same paper with the solvent front line highlighted and the wet tint below it; a small pencil marking the line. Label "solvent front: mark it before the paper dries".
- `rfval-formula`: the paper with both distances as before, beside a fraction card: "Rf = distance moved by spot ÷ distance moved by solvent", spot distance on top, solvent distance below, coloured to match the two arrows.
- `rfval-bigger`: paper with three spots at low, middle and high positions, each with its Rf shown as a small tag (0.2, 0.5, 0.8); an arrow "further = larger Rf". A note "no units, never more than 1".
- Section 3 frames share one drawing with a step row along the top (1 spot, 2 solvent, 3 divide, 4 round; the current step in amber). The worked chromatogram is drawn to scale (22 px = 1 cm), so the ruler reads 7.3 cm to the spot centre and 9.6 cm to the front, matching the text.
- `rfval-measure-spot`: paper with a ruler alongside (0 on the baseline); the spot's centre marked with a small cross; a highlighted dimension "7.3 cm".
- `rfval-measure-front`: the same, now with the solvent front dimension "9.6 cm" highlighted and the 7.3 cm kept faded.
- `rfval-divide`: the paper faded to one side; on the other side "Rf = 7.3 ÷ 9.6 = 0.7604…" on the fraction card.
- `rfval-round`: the fraction card with the answer "0.7604… → 0.76 (2 s.f.)" and a small tick; note "no units".
- Section 4 uses one wide chromatogram: mixture spots at Rf 0.72 (blue) and 0.28 (pink); A 0.72 blue, B 0.50 yellow, C 0.28 pink.
- `rfval-reference`: paper with four lanes: one labelled "mixture" (two spots) and reference lanes labelled A, B, C (one spot each), with the baseline shared. Label "pure samples (references)".
- `rfval-compare`: the same paper; a light dotted horizontal line joins reference A's spot to a spot in the mixture, with the words "same Rf".
- `rfval-read`: the same paper with dotted lines for both matches (A and C) and a small cross beside B's spot ("no match"). Conclusion box: "possibly A and C, probably not B".
- `rfval-solvent`: two small papers side by side labelled "solvent 1" and "solvent 2", the same mixture and reference with different heights; in each the mixture spot and reference spot are joined by a dotted line. Note "Rf values change with the solvent; a match in both is likely the same substance".
- `rfval-q-chromatogram` (question, assessment view): a paper with four lanes labelled "mixture", "1", "2", "3". The mixture has two spots (at heights matching references 1 and 3); reference 2 sits at a different height. Spot colours match their heights (a Foundation reader can use colour and height together). No dotted lines, no words like "match", no Rf numbers. Neutral accessible description: "A chromatogram with a mixture lane and three numbered reference lanes."
