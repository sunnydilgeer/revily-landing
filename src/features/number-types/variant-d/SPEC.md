# Lesson 1 — Anushka

## Scope

This is the sole, source-led Lesson 1 path. The former Lesson 1 A and B definitions, selector, B-only visuals and legacy explanations are removed. The existing Anushka Integers & non-integers teaching sequence (`D-I-01`…`D-I-10`) is locked: its wording, answers, visuals and order stay unchanged. The N1.1 worksheet exercises (`D-I-11`, `D-P-01`…`D-P-07`) keep their existing interactions and order, with their question and explanation wording source-locked to the PDF. `D-P-07` leads to Special Integers.

The remaining lesson contains four further sections: Special Integers, Rational Numbers, Irrational Numbers, and Multiples & Factors.

Each question retains the submitted response after grading. Correct and incorrect attempts reveal the same complete worked explanation and enable Continue. Demonstrations are learner-controlled but optional. Five optional section-introduction videos precede the existing activities, as described in the video integration update below.

## Sources and adaptations

- `N1.2_Special_Integers.pdf`: all tasks Q1–Q5c.
- `N1.3_Rational_Numbers.pdf`: all tasks Q1–Q5c. Q4b and Q5c move into the Irrational Numbers section so the required idea is taught first.
- `N1.4_Irrational_Numbers.pdf`: all tasks Q1–Q5c.
- `N1.5_Multiples_and_Factors.pdf`: all tasks Q1–Q5c.
- Four WhatsApp teaching videos dated 14 September 2026: adapted into square/cube construction, fraction-to-decimal models, recurring-decimal reasoning, exact/non-exact root comparisons, the `√20` interval, `√45` simplification, number-line multiples, factor-pair rectangles, and HCF/LCM comparisons.
- Historical Lesson 1 work at commit `7beec6f`: restored the original interactive 1–50 prime grid, including highlighted primes and complete factor lists on hover or keyboard focus.

Difficulty badges, mark allocations, teacher-only marking annotations, subtitles and video chrome are omitted. PDF-derived question wording and answer wording remain source-locked, including the PDFs' middle-dot decimal notation, except for the recurring-dot display simplification requested by the lesson owner. Interactive answer controls and video-derived teaching screens remain UI adaptations. Explanation wording follows the PDFs except for the mathematical corrections and later owner-approved child-friendly presentation changes documented below.

### Transparent source corrections

1. Special Integers Q5a becomes “Show that 12 is not a prime number by writing it as a product of prime factors.” The source says “two prime factors” but its correct factorisation is `12 = 2 × 2 × 3`.
2. Multiples & Factors Q5a becomes “Find one possible pair.” Both `12 and 18` and `18 and 24` are accepted because each pair lies between 10 and 30 and has HCF 6.
3. The multiplication rule is taught as “a non-zero rational number multiplied by an irrational number is irrational.” Zero is stated as the exception: `0 × √5 = 0`.

### Owner-approved copy simplifications

- Square-root teaching uses decimal values and plain sentences: `√11 = 3.316…`; 3 squared is 9; 4 squared is 16; therefore √11 is between 3 and 4. The same pattern is used for √20, without chained less-than notation in the teaching visuals.
- The square definition is “A number multiplied by itself is a square number.” The cube definition is “A number multiplied by itself three times is a cube number.”
- The superseded 6/7-counter prime teaching state is removed. Cube teaching routes directly to the recovered 1–50 prime grid.
- D-SI-05 keeps only the comma-separated 21–29 list in the green card. Its explanation checks 21, 22, 24, 25, 26, 27 and 28 on separate lines.
- D-SI-08 expands the answer with separate `1 × 1 × 1`, `2 × 2 × 2` and `3 × 3 × 3` calculations.
- Recurring decimals are displayed without a top-right dot (`0·6`, `0·7`, `0·18`). The wording still identifies them as recurring, and the repeated digits remain visible in the worked examples.
- D-R-04 separates `π, √10, 0·6, √12` with commas and extra spacing in the green card.
- The √20 placement interaction shows `√20 = 4.472…` as soon as the root is placed, before the learner reveals more digits.
- D-IR-08 and D-IR-12 show every answer option as a decimal or exact value on its own explanation line.
- Across Lesson 1, separate calculations and separate reasoning points must render on separate lines. Centred dots, semicolons and conjunctions must not be used to compress independent working into one line.
- The approved line-by-line pass covers D-I-07, D-P-01–03, D-R-07, D-IR-01, D-IR-03–04, D-IR-06–07, D-IR-09, D-MF-01, D-MF-05 and D-MF-07–08.

## Screen map

### Existing locked section

| IDs | Source | Outcome |
| --- | --- | --- |
| D-I-01…D-I-10 | Original Anushka integer teaching | Explore and classify integers by value; unchanged. |
| D-I-11, D-P-01…D-P-07 | N1.1 integer worksheet | Complete all existing integer/non-integer practice using source-locked wording. D-P-07 continues to D-SI-01. |

### Special Integers

| ID | Adaptation / exercise | Correct outcome |
| --- | --- | --- |
| D-SI-01 | Switch 9/8 counters after the simple definition, “A number multiplied by itself is a square number.” | `3 × 3 = 9`; 8 cannot be made by multiplying a whole number by itself. |
| D-SI-02 | Add two `2 × 2` layers after the simple cube definition. | One `2 × 2` layer; then `2 × 2 × 2 = 8`. |
| D-SI-03A | Recovered legacy “Explore prime numbers to 50” screen. Hover or focus any cell to inspect its factors. | All primes to 50 are highlighted; every value reveals its complete factor list. |
| D-SI-04 / Q1 | Classify 64. | Square and cube: `8² = 64`, `4³ = 64`. |
| D-SI-05 / Q2 | Select primes from 20–30. Keep working out of the green card and show each composite calculation on a separate explanation line. | 23 and 29. |
| D-SI-06 / Q3 | Explain why 51 is not prime. | `51 = 3 × 17`. |
| D-SI-07 / Q4a | Odd square between 30 and 50. | 49. |
| D-SI-08 / Q4b | First three positive cube numbers, with one full three-factor calculation per line. | 1, 8, 27. |
| D-SI-09 / Q5a | Corrected prime-factor product task. | `12 = 2 × 2 × 3`. |
| D-SI-10 / Q5b | Decide whether 1 is prime. | No; it has one positive factor. |
| D-SI-11 / Q5c | Two-digit square and multiple of 5. | 25. |

### Rational Numbers

| ID | Adaptation / exercise | Correct outcome |
| --- | --- | --- |
| D-R-01 | Shade 5 of 8 equal parts, then connect division to the decimal. | `5/8 = 5 ÷ 8 = 0.625`. |
| D-R-02 | Switch recurring fraction and integer forms. | `1/3 = 0.333…`; `4 = 4/1`; `−2 = −2/1`. |
| D-R-03 / Q1 | Show 0.45 is rational. | `0.45 = 45/100 = 9/20`. |
| D-R-04 / Q2 | Identify the rational value. Display the list with commas and without recurring-dot marks. | `0.6 recurring`. |
| D-R-05 / Q3 | Convert `0.7 recurring`, displayed without its recurring-dot mark. | `7/9`. |
| D-R-06 / Q4a | Show 5/8 is rational and terminating. | `5 ÷ 8 = 0.625`. |
| D-R-07 / Q5a | Convert `0.181818…`; the short display is `0·18` without recurring-dot marks. | `2/11`. |
| D-R-08 / Q5b | Decide whether every integer is rational. | Yes; `n = n/1`. |

### Irrational Numbers

| ID | Adaptation / exercise | Correct outcome |
| --- | --- | --- |
| D-IR-01 | Compare square areas 16, 20, 25; place √20 and immediately show `4.472…`, then reveal more digits. | `4 < √20 < 5`; decimal is non-terminating and non-recurring. |
| D-IR-02 | Switch exact/non-exact roots. | `√16 = 4` is rational; `√20` is irrational. |
| D-IR-03 | Build `√45 = √(9 × 5) = 3√5`; state the corrected product rule. | A non-zero rational times an irrational is irrational; zero is the exception. |
| D-IR-04 / Q1 | Show √20 is irrational. | It lies between exact roots and has no exact rational value. |
| D-IR-05 / Q2 | Identify the irrational value. | `√17`. |
| D-IR-06 / Q3 | Explain why √30 is irrational. | `25 < 30 < 36`, so `5 < √30 < 6`. |
| D-IR-07 / Q4a | Simplify and classify √45. | `3√5`, still irrational. |
| D-IR-08 / Q4b | Irrational value between 3 and 4, with every option calculated on a separate explanation line. | Any of `√10`…`√15`. |
| D-IR-09 / Q5a | Show `4 + √13` is irrational. | Adding 4 shifts the value; it does not terminate or recur. |
| D-IR-10 / Q5b | Test “every square root is irrational”. | False: `√16 = 4`. |
| D-IR-11 / Q5c | Disprove irrational × irrational is always irrational. | `√5 × √5 = 5`. |
| D-IR-12 / Rational Q4b | Irrational value between 2 and 3, taught after irrational numbers, with every option calculated on a separate explanation line. | Any of `√5`…`√8`. |
| D-IR-13 / Rational Q5c | Disprove irrational + irrational is always irrational. | `√2 + (−√2) = 0`. |

### Multiples & Factors

| ID | Adaptation / exercise | Correct outcome |
| --- | --- | --- |
| D-MF-01 | Add hops of 6 on a number line. | 6, 12, 18, 24, 30. |
| D-MF-02 | Switch rectangles for 24 counters. | 1×24, 2×12, 3×8, 4×6. |
| D-MF-03 | Compare factor sets for 12 and 18. | Common factors 1, 2, 3, 6; HCF 6. |
| D-MF-04 | Compare multiples of 8 and 12. | First shared landing point and LCM is 24. |
| D-MF-05 / Q1 | List every factor of 42. | 1, 2, 3, 6, 7, 14, 21, 42. |
| D-MF-06 / Q2 | First four positive multiples of 9. | 9, 18, 27, 36. |
| D-MF-07 / Q3 | HCF of 24 and 36. | 12. |
| D-MF-08 / Q4a | LCM of 8 and 12. | 24. |
| D-MF-09 / Q4b | Common factor of 18 and 27 other than 1. | 3 or 9. |
| D-MF-10 / Q5a | Corrected “one possible pair” task. | 12 and 18, or 18 and 24. |
| D-MF-11 / Q5b | Is every number a factor of itself? | Yes; any number divided by itself gives 1, with no remainder. |
| D-MF-12 / Q5c | Disprove “LCM is always bigger than both”. | `LCM(4, 8) = 8`. |

## Architecture

- `variantDLesson.ts` owns all Lesson 1 screen data, stable state IDs, answers and routes.
- `VariantDConceptVisual.tsx` provides the Lesson 1 interactive teaching and evidence visuals.
- `IntegerValueVisual.tsx` retains the existing integer modes and delegates the new `concept` mode.
- `VariantDActivity.tsx` continues to preserve submitted choices/input and render identical worked feedback for both outcomes.
- `lessonExplanations.ts` contains a complete explanation entry for every D question.
- `types.ts` includes the four source-led micro-skill IDs and a typed concept visual union.
- `NumberTypesLessonView.tsx` derives its five-section journey from the canonical lesson.
- The segmented progress control is clickable. A section becomes available only once the learner has reached its first state. Learners may then jump backward or forward among reached sections; locked later sections cannot be opened.
- Navigating with the progress control opens the first state of the selected section, preserves recorded attempts and mastery, resets only the on-screen response, and never advances the furthest-reached boundary.
- Choosing Start lesson again clears answers, attempts and activity state but preserves the furthest-reached boundary, so every completed section remains available from the progress control. A browser refresh still starts a fresh lesson until persistent user sessions are implemented.

## Verification contract

- Every ID is unique and reachable from `D-I-01`.
- Every non-teaching screen has a valid correct answer and a worked explanation.
- Correct and incorrect routes are identical and resolve to an existing next state.
- Exact multi-select tasks reject incomplete subsets.
- One-of tasks accept every documented alternative.
- The recovered D-SI-03A screen retains the historical title, body, prompt, 1–50 range and exact highlighted-prime set.
- PDF-derived question strings match N1.1–N1.5 exactly, apart from the three documented source corrections and the documented owner-approved recurring-dot display simplification. Worked explanations also include the documented owner-approved child-friendly formatting and elaborations.
- Lesson 1 contains no shared post-integer `L1-*` states. The former A/B lesson definitions and Lesson 1 variant selector do not exist.
- The progress control contains five labelled segments, unlocks sections only after they are reached, and remains usable at 320px with accessible button names and keyboard focus.
- Desktop and 320px rendering have no horizontal overflow; arrays, number lines, fraction cells, roots and explanations remain legible.
- TypeScript and the production build pass. No deployment.
# Section videos — 16 September 2026

Five optional, silent tutor animations introduce the current canonical sections. `lessonVideos.ts` inserts video states and redirects section-entry transitions without changing existing questions or marking. `LessonVideoActivity.tsx` is the reusable player; assets live in `public/lessons/lesson-1/videos/`.

| Video | Placement | Length |
| --- | --- | --- |
| Integers and non-integers | Before D-I-01 | 0:58 |
| Squares, cubes and primes | Before D-SI-01 | 0:53 |
| Rational numbers | Before D-R-01 | 0:38 |
| Irrational numbers | Before D-IR-01 | 0:38 |
| Multiples and factors | Before D-MF-01 | 0:39 |

Visual first: an inline 16:9 player, native playback/seeking/fullscreen controls, speed selector, collapsed written summary and Continue. No autoplay, compulsory viewing or automatic progression. Replay appears on completion. Text is already embedded in these silent clips, so no duplicate caption track is supplied.

Original files are unchanged. Visible clarifications correct the integer clip's generalisation about fractions/negative whole numbers, the rational clip's whole-number wording, and the irrational clip's “never repeat” shorthand. Summaries use mathematically precise definitions.

References: [Cognito's topic videos and practice](https://www.cognito.org/) and [Khan Academy's video controls](https://support.khanacademy.org/hc/en-us/articles/204794840-What-features-does-the-video-player-have). These inform optional short-video placement and learner-controlled playback, rather than claiming measured learning outcomes.
