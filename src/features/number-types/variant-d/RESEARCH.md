# Rethinking Variant D — research and design decisions

Reviewed 13 September 2026. Sources below are official product documentation, public product interfaces and teaching guidance. This is design research, not an efficacy comparison. No claim is made that these products teach this exact micro-skill in the same sequence.

## Findings

**Duolingo Math.** Its published design explains that visuals and inputs depend on the mathematical context, with virtual tools manipulated by the learner. Its learning-method report describes connecting concrete/pictorial and symbolic representations, using contrast and progressively reducing scaffolding. The implication for Revily is a diagram that changes because of a meaningful learner action, with an explicit connection between position and number value. This is stronger than putting an answer grid underneath a static illustration. Sources: [math design](https://blog.duolingo.com/developing-math/), [learning-method report, maths section](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_duolingo_method_2023.pdf).

**Cognito.** Directly inspected the public AQA Foundation Rational & Irrational Numbers lesson. It begins with a types-of-numbers video and proceeds to a multiple-selection integer question. After selecting a partly wrong set, the interface retained choices, identified both correct answers and the incorrect selection, displayed an explanation, and offered Continue. This supports preserving the learner's answer context during feedback. Cognito's loose “integers are whole numbers” wording is not adopted because Revily distinguishes the whole-number subset from integers. Sources: [observed lesson](https://cognito.org/courses/gcse/maths/aqa/foundation/lessons/MS4yNA/1.2-rational-irrational-numbers), [public product overview](https://cognito.org/).

**Atom Learning.** Official materials describe question difficulty responding to prior answers, alongside teacher explanations, help sheets and videos. Atom's indexed Home learning-plan guide specifically describes explanations after both right and wrong answers. Its adaptive-learning article describes a balance of challenge and confidence. For this small controlled experiment, the useful design principle is gradual challenge with clear explanations; this implementation does not claim to be adaptive or implement an algorithm. Atom's logged-in question player was not inspected. Sources: [adaptive learning](https://www.atomlearning.com/blog/what-is-adaptive-learning), [exam-plan resources](https://www.atomlearning.com/features/exam-plan), [Home learning-plan guide, search-indexed text](https://resources.atomlearning.co.uk/hubfs/Make%20the%20most%20of%20your%20Atom%20Home%20learning%20plan.pdf?hsLang=en). The guide's direct PDF fetch failed, so no visual claims are based on it.

**Teaching cross-check.** EEF's KS2/3 summary recommends purposeful representations, examples/non-examples, clear specific feedback and worked examples. It also treats representations as scaffolds that can be removed as independence develops. This is relevant to prerequisite number understanding, although the guidance is not a GCSE product specification. Source: [EEF recommendations](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/maths-ks-2-3).

## Diagnosis of the rejected version — our judgement

- The same six-number set appeared twice: once as a visual and again as choices.
- Large panels treated all examples as equally important and made the learner scan too much.
- The worked example showed every conclusion immediately, rather than modelling the decision process.
- Most interactions were the same selection task, regardless of the mathematical idea.
- Feedback removed the choices and introduced another large block, losing the answer context.
- Inverse-root and midpoint reasoning widened the opening beyond the integer/non-integer distinction.
- Passing maths/layout checks did not establish a convincing teaching experience.

## Revised principles — design proposals, not competitor claims

1. Use one number-line language throughout: integer ticks versus points between integer ticks.
2. Begin with a controllable point and immediate explanation of its value. Include negatives and zero explicitly.
3. Model “expression → value → classification” in small replayable steps.
4. Make binary checks quick: one tap submits, feedback appears, Continue remains learner-controlled.
5. Keep choices visible and mark accepted answers during feedback; explain the actual misconception.
6. Remove scaffolding for the final mixed question, without duplicating the given numbers in another visual.
7. Keep colour, movement and controls tied to the maths. No punitive guessing loop, hearts, rewards, forced animation delays or adaptive claims.

The revised screen-by-screen implementation is specified in SPEC.md. A/B and all Lesson 1 states from L1-F01 onward are preserved.

## Minimal study chrome — 13 September 2026

The user requested less on-screen navigation and metadata while studying. Applied [NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/): retain essential task controls and defer secondary choices to an obvious, labelled control. Also reviewed [Duolingo's explanation of its guided learning path](https://blog.duolingo.com/new-duolingo-home-screen-design/), which describes reducing uncertainty about what to do next; this is a home-screen principle, not a claim about its current lesson-player layout.

D's study view now has a small topic heading, one slim progress bar and the activity. Lesson tabs and variant selectors sit behind Lesson menu; the large lesson title, level/variant metadata, part counter, six-topic strip and habit footer are omitted. The menu does not remount the lesson, so opening/closing it preserves answers and demo state. A/B remain available through the menu. Lesson content and feedback are unchanged. This reduces visible competing elements; measured learning or cognitive-load improvements are not claimed.
