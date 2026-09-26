# Lessons 10–12 QA — 22 September 2026

## Automated verification

- `npm run test:science`: pass, 175 grouped checks across the full Science package, including the anatomy-redraw and simplified-explanation-control checks.
- `./node_modules/.bin/tsc --noEmit --incremental false`: pass.
- `npm run build`: pass from the canonical checkout with 23 routes generated; the pre-existing multiple-lockfile workspace-root warning remains.
- Focused `lessons1012.test.tsx` coverage checks all option paths, explanations, written marking status, source/spec references, frame scripts, assessment-label suppression, full reducer flows, reloads, locks, recommendations, numerical examples and storage isolation.

## Browser verification

The stale process previously occupying port 3000 was stopped. This checkout now serves the revised lessons at `localhost:3000`.

Checked the Variant B hub and representative states from all three lessons:

- Hub exposes Lessons 1–12 and clearly marks Lessons 7–12 as easier-wording only.
- Lesson 10 airway and alveolus diagrams, including an unlabelled gas-direction assessment.
- Lesson 11 labelled heart teaching model and unlabelled vessel-X assessment.
- Lesson 12 artery/vein/capillary comparison and assessment labels.
- Lessons 9–12 share a persistent four-step transport story, with the current lesson highlighted.
- Lesson 9 shows a clear Part 1 Digestion / Part 2 Food tests marker.
- Teaching explanations use named step buttons and a single `Next` action; autoplay, teaching-script toggles and arrow-only previous/next controls have been removed.
- Lesson 10 contains 14 core screens after removing breathing-rate arithmetic, and bronchioles are no longer tested as required recall.
- Lesson 11 teaches the complete blood route before introducing the double-circulation label.
- Lesson 12 presents the vessel journey in artery, capillary, vein order.
- Wrong-answer flow retains the selected answer, reveals the correct answer and numbered explanation, and enables progression.
- Hint starts collapsed, opens without submitting and remains visible after grading.
- No browser console warnings or errors were recorded.
- Responsive checks covered a 390px viewport and a true 320px content viewport; no horizontal overflow occurred at 320px.

## Anatomy redraw verification

The redraw was inspected through the actual Lessons 10–12 screens on this checkout's isolated port 3100. Browser-measured desktop viewport: 1366 × 1000. Browser-measured narrow viewport: 320 × 740.

- Visually inspected enlarged airway/lung, alveolar mesh, gas barrier, heart cutaway, complete double circulation, valve action, coronary, natural/artificial pacemaker, three-vessel comparison, capillary-wall and capillary-network views.
- Review fixes included opening the atrioventricular passages, removing misleading closed tube ends, keeping one continuous colour transition across a capillary bed, connecting the schematic chamber openings, and avoiding label/arrow intersections.
- At 320px, checked B10-02, B10-05, B11-05, B11-16, B12-02, B12-07 and B12-03: document scroll width equals viewport width (320px) for all seven. Keys stack in a single column.
- The mobile dialog measures 296px across and contains a 780px drawing in its own scroll region; horizontal panning was verified (scrollLeft 320px). This is intentionally internal scrolling, not page overflow.
- There is no timed walkthrough playback. Escape closes the diagram dialog and restores focus to the initiating button. Close button receives focus when the dialog opens.
- Inspected assessment enlargement for the heart vessel-X and vessel A/B/C questions. No teaching key or vessel-name answer appears in the enlarged view. Automated tests also check the airway and gas questions, including accessible descriptions.
- Three additional grouped regression tests cover every anatomy teaching frame's inline/enlarged views, globally unique/resolvable SVG and dialog IDs, and answer-label suppression in both views.

The new controls have keyboard and browser accessibility-tree checks, not a complete screen-reader audit. Desktop/mobile checks are emulated browser checks, not physical-device testing.

## Remaining review

Qualified Science teacher review, learner testing, assistive-technology testing and production deployment are still pending. The code-native diagrams are simplified teaching models and not to scale. The localhost tab is a local preview only.
