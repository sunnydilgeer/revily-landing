# Lesson 3 QA — 14 September 2026

Local draft: B-CELL-003 v0.1.0, `/preview/science/practical`, 30 screens. No deployment or account/production writes.

## Verified

- End-to-end browser flow through all 30 screens. Baseline deliberately answered incorrectly after opening Hint; submitted response retained, explanatory feedback and Continue available. Every other choice returned correct feedback.
- Every frame in all eight walkthroughs selected and heading checked; teaching scripts opened/closed. All three worked-example reasoning steps revealed, without gating Continue. Menu opening/closing preserved the selected coverslip frame; play/pause toggled.
- Opening hint survived reload without submitting. Written method survived reload verbatim, was saved and disabled, and remained pending teacher review. Summary distinguishes practical reasoning from actual equipment handling, and offers supervised lab practice rather than claiming practical completion.
- Actual 320px viewport: all 30 screens, every teaching frame, expanded worked reasoning and submitted feedback fit without document overflow. Drawing comparisons stack. Screenshots inspected opening onion observation and angled-coverslip explanation.
- Navigation from Lesson 2 to Lesson 3, then back to Lessons 2/1 and to Lesson 3 restored each lesson’s own state. Lesson 2 remained its unanswered opening screen; Lesson 1 resumed its original opening question. No existing lesson record was reset.
- 47 grouped automated checks pass: 20 scaffold, 11 existing session, 7 microscopy, 8 new practical, 1 typography. Covers all options, calculations, sources/menu/required IDs, safe content boundaries, teacher-only marking, hints/locks, all-screen summary, record isolation and next topic004.
- Repository typecheck passes. New-route types regenerate through the running dev server. An older browser tab initially retained pre-change menu code; deliberate reload showed the new links. A locator-specific read timed out for a textarea value; fresh AX/page-DOM read verified its exact persisted text. Neither was a lesson runtime failure.
- Final fresh-tab load returned no console errors. Lesson 3 was restarted to its opening screen with no selected answer and Hint collapsed. The normal restart retains QA exposure history; no permanent history deletion or reset of Lessons 1/2 was performed. Temporary viewport override reset; temporary test tabs closed.

## Alignment and limits

Current AQA 8464 required practical1/AT1/AT7 checked online; scope references and historical onion-example distinction are in the storyboard. Examples/questions/illustrations are original, not copied artwork or real/future past-paper questions. Prepared animal-slide observation is separate from onion teaching; no self-sampling instructions.

Safety follows teacher supervision and school risk assessment. No knife/scalpel method. Iodine/eye protection, glass/sharps reporting, side-view approach without contact, increasing lens–slide separation at low power and fine adjustment at high power are explicit.

Illustrations are not micrographs or equipment simulations. Scale bars use consistent real-size ratios; answers use supplied/calibrated dimensions, never screen measurements. Equal-cell field estimates state assumptions. Drawing magnification is distinct from observed lens magnification.

Qualified teacher review, hands-on practical assessment, learner usability/timing and full accessibility review remain required before publication. Written marking queue, delayed retrieval and fresh repair bank are not built. Guided understanding is practice only; secure practical reasoning is digital question evidence, not certified manipulative competence.
