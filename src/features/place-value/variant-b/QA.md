# Lesson 3 Variant B — QA

Verified locally on 13 September 2026 at `/preview`. No deployment performed.

## Content and grading

- 26 unique, reachable screens; 17 questions, each with a hint and explanations for correct and incorrect responses.
- All accepted answers pass the shared grader. Comma-formatted whole numbers and equivalent decimal inputs are accepted; an incorrect decimal place and incomplete multiple selections are rejected.
- Completed all 17 questions incorrectly in the desktop browser: every response shows an Explanation and Answer, and unlocks Continue. Completed the lesson and restarted.
- Completed all 26 screens with correct answers at 320 × 740, including multiple selection and ordering.
- Ordering retains the submitted sequence after grading and gives the accepted sequence in the explanation. Up/down controls can produce the correct order.

## Hints and interaction

- Opened and closed every question's Hint; all begin collapsed, and next questions reset the disclosure.
- Checked all three final transfer hint methods. Tables fit the available stage width.
- Typed answers survive opening/closing Hint and the lesson menu. Enter submits numeric answers and preserves the submitted value.
- Exploratory digit selection survives opening/closing the menu. The first 3 in 3,333 gives 3 × 1,000 = 3,000; the last 4 in 4.444 gives 4 × 0.001 = 0.004.
- Large-number worked example advances to 400,000 and replays from its initial state. Examples do not gate Continue.
- Placeholder explorer fills both empty columns and can reset.
- Equivalent-decimal explorer keeps the decimal point at the same horizontal position when switching from 3.4 to 3.400.
- Comparison example aligns 3.450 and 3.405, advances through matching tenths and unequal hundredths, and marks the deciding column.
- Lesson 3 A/B switching works. Lesson 2 B still shows the BIDMAS reference only inside Hint.

## Layout and build

- No document-level horizontal overflow across the complete lesson and all hints at 320px.
- Visually inspected desktop introduction and placeholder exploration; mobile introduction, large-number guide, equivalent-decimal explorer and comparison example. Long expanded examples scroll vertically.
- `npx tsc --noEmit` passed.
- `git diff --check` passed.
- Production build passed in an isolated copy at `/private/tmp/revily-lesson2-build`, preserving the running development preview; all 17 routes generated.

Automated and browser checks cover the implemented flows. This is not a formal accessibility audit or a record of classroom testing.
