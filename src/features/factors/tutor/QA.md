# Lesson 7 QA

## Content

- All 21 practice parts and all three PDF worked examples are retained.
- The factor-tree video’s separate example for 60 is retained before the PDF Q1 example for 84.
- Dependent wording is restated so questions about 60², the LCM of 90 and 105, and the LCM of p and q are self-contained.
- Factorisations, HCFs, LCMs, square-number reasoning and contextual answers are independently verified.
- The repaired N7.1 Q5b wording tests the intended exponent misconception without asserting a false premise.

## Interaction and visuals

- Factor trees reveal one split at a time and distinguish prime end nodes.
- Listing screens build complete factor lists, highlight common values, and extend multiples only to the first match.
- Venn screens reveal factorisations, the intersection, remaining regions, HCF and LCM progressively.
- HCF uses only the intersection; LCM uses every region exactly once.
- Answer feedback is compact: correctness plus an optional expandable progressive visual, without the separate numbered explanation block.
- The three conceptual reasoning questions do not show an unrelated calculation walkthrough button.
- Each video’s walkthrough appears only in its Step by step tab and is not duplicated on the following screen.
- Video tabs, Back/Next, replay, progress navigation, focus and feedback use the shared Lessons 4-5 shell.

## Verification

- `npm run verify:lessons67:tutor`
- `npm run verify:arithmetic:tutor`
- `npm run verify:lesson2:tutor`
- `npm run verify:lesson3:tutor`
- `npx tsc --noEmit`
- `npm run build`
