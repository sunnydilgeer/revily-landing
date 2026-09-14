# Per-question BIDMAS reference — source review

Reviewed 13 September 2026 at the user's request. This is a targeted public-source review, not a claim to have inspected authenticated product lessons or measured learning outcomes.

## Sources and findings

- [Atom Learning: challenging maths topics](https://www.atomlearning.com/blog/11-plus-challenging-topics-maths), published 24 June 2026. Its order-of-operations section explicitly presents four levels and groups division/multiplication and addition/subtraction. It describes a pyramid to counter the misleading six-item-list interpretation. The article and diagram description were accessible; the standalone diagram asset could not be retrieved.
- [Cognito: How to use BODMAS](https://www.youtube.com/watch?v=70cAYYCJBuQ), official verified channel, 17 February 2020. Public indexed description/chapters identify the BODMAS/BIDMAS explanation, special treatment of D/M and A/S, worked examples, and recap. The video itself could not be fetched, so no claims about its exact animation or interface are made. [Cognito's public guide](https://cognito.org/blog/11-plus-challenging-maths-topics) also explains shared tiers and left-to-right evaluation.
- [BBC Bitesize: Order of operations transcript](https://bam.files.bbci.co.uk/bam/live/content/z9sg9qt/transcript), official BBC source, 2015. Uses a concrete ticket/snack calculation to connect multiplication, brackets and addition, then groups multiplication/division and addition/subtraction. This introductory clip does not cover indices; it is not our full rule source. BBC's main web pages were robots-blocked. Search results included unofficial mirrors, which were not used as BBC evidence.
- [Duolingo: developing Math](https://blog.duolingo.com/developing-math/). Describes matching visuals and exercise forms to the mathematical concept, context and difficulty. No public BIDMAS-specific lesson was verified, so this informs the contextual visual design only.

## Revily design synthesis

Use a compact four-group reference inside every question's expression panel. Visible BIDMAS label and B / I / DM / AS controls include operation symbols. Tapping a group reveals a short rule and marks corresponding symbols in the displayed expression. This is our design synthesis, not a copied or verified interface used by these providers.

Keep all groups neutral initially. The learner chooses which rule to consult; selecting one neither submits an answer nor asserts that the selected operation is next. Explanations retain the shared-priority and within-brackets conditions. An absent-operation note helps the learner scan the hierarchy. No final numerical result is revealed by this control.

Fraction bars cross-reference grouping and eventual division, with the numerator-only task limiting highlights to its requested group. Completed annotations remain unhighlighted. The question still sits immediately above its answer controls. Reference remains usable after grading; consulting it beforehand uses the existing hint bookkeeping. Changing questions resets its local selection; opening the Lesson menu preserves it.
