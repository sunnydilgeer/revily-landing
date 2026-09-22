# Lesson 8 QA

## Source and mathematics

- All 16 PDF pages and eight complete video timelines were reviewed.
- All eight PDF Q1 examples, all eight video examples and all 56 source practice parts are represented.
- Every authored calculation is independently recomputed by `npm run verify:lesson8:tutor`.
- The verifier checks 72 screens, exact source references, eight source-identical MP4 SHA-256 hashes and valid JPEG posters.
- N8.5 Q2's source formatting artefact is not copied. N8.6 reciprocal teaching is mathematically explicit.

## Interaction

- Structured fraction input accepts exact proper, improper and mixed values without floating-point grading.
- Simplest-form questions reject equivalent unsimplified responses; live QA checked 4/6 against the expected 2/3.
- Mixed-number questions reject an equivalent improper form and accept the requested whole/numerator/denominator entry; live QA checked both paths on 17/6.
- N8.1 Q5b requires denominator 96 rather than merely an equivalent value.
- Submitted values remain visible and disabled after grading. Correct and incorrect paths both unlock Continue and the same progressive walkthrough.
- Reached-section progress, video tabs, calculation Next/Back/Replay, lesson Back and compact feedback follow the shared Lessons 6-7 shell.

## Visual and accessibility

- Browser QA covers the opening local video, Step by step tab, fraction bars, correct and incorrect grading, section transition and mixed-number entry.
- At an actual 320 × 800 viewport, the mixed-number response and expanded fraction walkthrough report `scrollWidth === clientWidth === 320`.
- Fraction inputs have individual accessible labels. Video speed, replay and tab controls retain the shared accessible implementation.
- Browser console reports no warnings or errors during tested flows.

## Verification

- `npm run verify:lesson8:tutor`
- `npm exec tsc -- --noEmit --pretty false`
- `npm run build`
- `git diff --check`
- Local preview: `http://127.0.0.1:3000/preview` on the requested port 3000.
