# Lessons 4–6 QA — 17 September 2026

## Port 3000 follow-up

At the user's request, the six-lesson Science changes and test command were transferred from the isolated worktree into `/Users/sunnyd/Documents/Revily`, the checkout already serving port 3000. Both checkouts shared the same baseline commit; the patch was conflict-checked before application. Unrelated Maths/tutor edits and the additional place-value tutor test command were preserved. Lesson 1–3 content versions/storage keys remain unchanged; no browser records were moved or cleared. The same port-3000 origin continues to use the user's existing records. The new hub and Lessons 4–6 were smoke-checked on port 3000. Earlier full QA below describes the isolated port-3100 authoring run.

All content remains draftNeedsTeacherReview. Official Foundation boundaries, inspected assessment evidence and unavailable-source limitations are recorded in [alignment](./LESSONS-4-6-ALIGNMENT.md). Storyboards and original visual briefs preceded implementation. Lesson 4 has 24 activities; Lesson 5 has 31; Lesson 6 has 45. B5-31 and B6-45 are later authoring additions with stable IDs; their position, not numeric suffix order, defines the sequence.

## Automated verification

`npm run test:science` passes 62 grouped checks: 20 scaffold/evidence policies, 11 session, 7 microscopy, 8 practical, 1 six-lesson navigation, 14 new lesson groups and 1 typography policy. Every new choice option is graded and has an explicit accepted answer; written rubrics stay pending; all frames and assessment visuals render without NaN or malformed markup. Complete flows, locked submissions, hints, draft restore, skipped completion, requirements, numerical examples and lesson-specific record isolation are checked. Lessons 1–3 identities/versions/key contracts remain unchanged. All existing Science suites pass.

Type checking and isolated production build pass. Final build: `REVILY_BUILD_DIR=.next-science-build npm run build`, all 21 pages generated; lint/type validation successful. The existing multiple-lockfiles/workspace-root warning is non-fatal and was not addressed by changing unrelated configuration. Build-generated type configuration changes were restored; verification output is ignored. Existing dependency installation was reused via a local ignored node_modules symlink, with no dependency upgrade. The optional build directory defaults to the existing `.next` behaviour.

## Browser activity checks

- Lesson 4: all 24 activities, all specialised cells/frames and script disclosures, three worked steps, guided and independent choices, pending written answer and summary. Wrong opening answer remained selected/locked with explicit numbered explanation and answer; Continue worked. Hint expansion survived reload without submission. Written draft survived reload before saving. Actual 390px traversal had no horizontal overflow; sperm also inspected at desktop width. Tail/root/phloem/muscle/nerve pointer endpoints were checked and corrected where needed.
- Lesson 5: all initial 30 activities at actual 320px, plus added independent B5-31 pair calculation completed subsequently, reaching 31/31 summary. All chromosome/cycle/stem-cell frames, scripts, worked steps and choices exercised. Wrong opening answer/expanded hint and written draft survived reload; written save stayed pending. The four-chromosome worked example now has a matching starting diagram rather than the two-chromosome teaching schematic. Added readable DNA/gene HTML key and clearer stem-branch equivalent.
- Lesson 6: all 45 activities including repeat/anomaly reasoning, all diffusion/osmosis/active/exchange frames, practical preparation, signed percentages/ratios, graph interpretation and pending final method. Actual 360px traversal had no horizontal overflow. Optional plotting gave corrective feedback for −5 and the expected point for +5; keyboard Enter worked and Continue was available without plotting. Written draft survived reload; save is explicitly browser-only with no connected marking queue. Final summary points to supervised RPA2 and does not certify practical completion.

Later authoring refinements were rendered/inspected separately: the practical setup schematic at 390px, practical graph/table at 320px, and matching chromosome model through automated render checks. Full browser traversal preceded these bounded visual wording refinements; no claim of a second full traversal after every edit.

## Routing, responsive and safety checks

All six deep links and reloads render the correct lesson. All six menu switches/current indicators work at desktop and actual 320px. Browser back from 6 restores 5 and forward restores 6. `/microscopy`, `/practical`, `/revision` retain redirects to 2, 3, 1. Queries `lesson=7`, repeated `lesson=4&lesson=5` and `lesson=nope` return the picker. Saved completion and pending written answers survive switches without a reset. Fresh route-test console has no errors.

Menu and practical graph/table measured at actual widths 320, 360, 390, 430, 768, 820, 1280, 1366 and 1440: document width never exceeds viewport. Viewport changes are verified against DOM geometry; screenshots are captured after layout settles. Readable table values accompany the compact graph. Keyboard menu opening focuses Close; reverse wrap reaches Lesson sources, forward wrap returns to Lesson menu; Escape closes and returns focus. Hidden links inside collapsed details are excluded. Activity remains inert while exploring the menu. This is a targeted keyboard/layout check, not a full assistive-technology audit.

No account/server writes, production mastery update, deployment, Maths/tutor content edits, new equipment simulator, marking service or prospective cofounder review role. Original checkout/browser-origin records are untouched. QA used a separate localhost:3100 origin; no local records were reset/deleted. Sharp-tool/solution preparation is teacher-supervised and risk-assessed, never assigned as a home activity.

## Remaining review

Qualified Biology teacher review of scientific wording, original diagrams, Foundation depth and draft AO/mark judgements is still required. No learner-validated timing, recorded media, clinical evidence, full screen-reader/accessibility audit, hands-on practical completion or whole-topic mastery is claimed. The illustrative results are deliberately simple, not real experimental measurements. Delayed retrieval, fresh repair items and a marking queue remain unimplemented as previously scoped.
