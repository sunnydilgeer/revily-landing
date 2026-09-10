# Variant B QA

Checked in the running preview on 9 September 2026.

## Functional checks

- Confirmed interactive states render in DOM order as visual → complete question → answer controls.
- Confirmed the guided integer heading and prompt are combined into one question.
- Variant B opens on the integer-but-not-whole diagnostic and hides the question values’ placements before submission while retaining separate teaching examples.
- An incorrect choice on the diagnostic reveals the completed diagram, gives misconception-specific feedback, states `Correct answer: −3`, and enables `Continue`.
- The whole-number line starts at zero and points only to the right.
- The integer line includes negative values, zero and positive values, with arrows in both directions.
- The revised family diagram shows rational numbers containing integers and rational non-integers, integers containing whole numbers, and irrational numbers outside the rational set.
- The redundant non-integers summary strip and the secondary `Now classify these values` instruction are absent.
- The opening question now has one source of selectable answers: the standard answer area below the visual.
- The guided question was tested with `−2.1`; feedback explains why a negative decimal is not an integer, reveals `−6`, and allows progression.
- The independent question was tested with only `−4` selected; it reveals `0`, `8 ÷ 2` and `√9` as the complete answer and allows progression.
- Completing the number-family sequence advances into the shared factors/multiples comparison.
- Confirmed the replacement factors/multiples comparison uses 10, shows the multiplication pairs 1 × 10 and 2 × 5, the complete factor list, and the first four multiples of 10 as growing equal groups.
- Confirmed the prime grid contains exactly 50 controls, all 15 primes up to 50 are highlighted, and every control exposes its complete factor list plus prime/composite status.
- Switching to Variant A resets and displays its original opening question.
- Switching to Lesson 2 resets and displays its original opening question.

## Visual and accessibility checks

- Inspected the revised family model at desktop and mobile widths after removing the redundant summary and answer tray.
- Inspected the factors/multiples comparison and prime grid at desktop and mobile widths.
- Inspected the opening and longest number line at a 320 × 800 viewport.
- Corrected number-line sizing so both arrows and every value remain inside the card at 320 px.
- Centred each number-line marker precisely on the horizontal rule using explicit positioning rather than negative margins.
- Confirmed the new comparison stays within the lesson card at a standard mobile width. Tightened the prime grid to zero-minimum tracks and cells after browser QA exposed a few pixels of intrinsic-width overflow at 320 px.
- Confirmed the question placements remain absent from the accessible description before submission, while all teaching examples are described.
- Confirmed an incorrect answer places each question value in the correct region, reveals `−3`, and keeps `Continue` available.
- Confirmed feedback uses an alert region and the variant controls expose their selected state.
- Browser console: no errors.

## Build

- `npm run build` passes.
