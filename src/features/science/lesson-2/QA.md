# Microscopy QA — 14 September 2026

Local draft only. Route: `/preview/science/microscopy`. Lesson ID B-CELL-002, version 0.1.0, 34 screens. No deployment or account/production writes.

## Verified

- Browser completed all 34 screens in order. Baseline deliberately answered incorrectly; all other choice responses returned correct feedback. Every frame in all ten teaching walkthroughs selected and its heading verified. Scripts opened/closed. Each of the four worked examples revealed all three steps.
- Opening hint survived reload without submitting an answer. Final written draft survived reload, saved its original text, locked submission and remained pending teacher review. Summary separated independent recall/understanding/application/calculation from pending explanation; practical reasoning and data interpretation were not assessed.
- Light-microscope keys changed the selected explanation. Menu opening/closing preserved the selected frame. Play/pause toggled correctly. Navigation to Lesson 1 resumed its original state, then navigation back resumed Lesson 2's own record.
- Actual 320px viewport: every screen, expanded worked examples, focused light microscope, magnification/resolution diagrams, electron schematic, stacked microscope comparison, formulas, conversions and standard form reported a document width of 320px without horizontal overflow. The capability initially targeted the older preview tab; tests were repeated on that tab after navigating it to Lesson 2 and verifying actual clientWidth.
- Automated: 20 existing scaffold + 11 existing session + 7 new microscopy + 1 typography policy = 39 grouped checks. New checks cover instrument/concept order, scripts matching displayed frames, every answer path, independently calculated numerical values, correct recommendations, lesson isolation and legacy Lesson 1 snapshot compatibility.
- Repository and strict UI typechecks pass. The running development server regenerated initially stale Next route types. Hot editing dependency-array shapes caused transient Fast Refresh warnings in an already-open development tab; fresh-page checking distinguishes these from runtime failures.
- Final fresh-page load returned no console errors. Lesson 2 was restarted to screen 1 with no selected answer and the hint collapsed. Historical QA exposure records were retained using the normal restart option; no practice history was permanently deleted. Lesson 1 progress was not reset.

## Scope and limitations

Official AQA 8464 4.1.1.5 rechecked; content is not marked HT-only. All examples/questions/SVGs are original Revily drafts, not copied CGP artwork or official/future past-paper questions. Magnification is dimensionless; both dimensions must use matching units. Missing-size answers carry length units. Supplied image measurements are explicit numbers, never measurements of responsive artwork.

Instrument/cell/resolution pictures are schematics/illustrations, not genuine micrographs. They do not simulate physical resolution, equipment operation or experimental results. Slide preparation, safe microscope technique and biological drawing belong to the planned next lesson. This digital lesson does not complete required practical 1.

Qualified teacher review, learner usability/timing and full accessibility review remain necessary before publication. Delayed retrieval bank/scheduler, fresh repair items and a teacher-marking queue are not implemented.
