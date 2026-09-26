# Lesson 26 QA note — Photosynthesis and what plants do with glucose (first B4 lesson)

Status: prototype draft, `draftNeedsTeacherReview`, content version `0.1.0`. Not deployed. Built from the storyboard you approved. The code was checked against it string by string, and every question, option, hint, explanation, marking point and frame matches.

## New chapter
- `scienceChapters` now has `{ code: 'B4', title: 'Bioenergetics', lessonNumbers: [26] }`. B3 still runs from 19 to 25.
- There is a new lesson-ID family: `B-BIO-026-B`. The engine chain continues `B-INF-025 → B-BIO-026`.
- There is a new `bioenergeticsSequence` in `curriculum.ts`.
- **Fix to an existing bug:** the "Where this lesson fits" panel used to show the Organisation list for every lesson after Lesson 6. It now shows the list for the lesson's own chapter: B1 up to Lesson 6, B2 up to Lesson 18, B3 up to Lesson 25, then B4.
- **Integration fix:** the live breadcrumb and lesson eyebrow now derive their code and title from `scienceChapters`, so Lesson 26 correctly says `B4 Bioenergetics` instead of `B2 Organisation`.

## Checked (automated, `lesson26.test.tsx`)
All 12 Lesson 26 checks ran and passed in the repository, including the full-flow, repair-route and storage-isolation checks.

The checks cover:
- **Metadata:** lesson `B-BIO-026-B`, AQA 4.4.1.1 and 4.4.1.3, skill `B-PHOTOSYNTHESIS`, prerequisite `B-PLANT-TISSUE`.
- **Grading:** all answer paths grade correctly. The written task is `teacherOnly`.
- **Answer spread:** 0 ×3, 1 ×3, 2 ×3, 3 ×2. The largest share is 27%.
- **Plain language:** a guard bans Lesson 27–28 terms (limiting factor, inverse square, metabolism, aerobic and anaerobic) and detail beyond Foundation (mitochondria in the text, thylakoid, stroma, magnesium, iodine).
- **Rendering:** teaching frames render through the real `TeachingChunk` and `CellBiologyVisual`.
- **Hidden answers:** the three question diagrams keep the answer hidden until submission. In B26-04 the arrows are drawn in plain ink until the answer is submitted, so their colours do not give the answer away.
- **Scope:** Lessons 6, 17 and 18 are brief links. The text includes all four symbols and all five uses of glucose, and nothing says that photosynthesis gives out energy or that light is a reactant.
- **Flow:** one sunflower; inputs and outputs before chloroplasts; glucose made before it is used; starch before "why starch".
- **Navigation:** the new B4 chapter, the hub, the parser and the Lesson 25 → 26 recommendation.

Regression runs in the same sandbox:
- `npm run test:science`: the complete science suite passed, including Lessons 1–25, navigation, variants, exam preparation, Science Coach and revision.
- `npx tsc --noEmit`: passed for the complete repository.
- `npm run build`: passed with all 23 routes generated. Next.js reported only the pre-existing multiple-lockfile workspace-root warning.
- The exam-preparation storage-key assertion was updated from 34 to 35 for the new isolated Lesson 26 record.
- One fix to my own sandbox runner: it was skipping any check whose name contains "flow", which dropped this lesson's sunflower check by mistake. The filter now matches only "complete flow". This does not affect the repo.

## Checked (visual): a more detailed, scientific style, as requested
- All 20 rendered diagram states (19 unique visuals, including before/after answer states) were checked at 540px and 330px: 40 geometry checks in total, with 0 viewBox escapes, text overlaps or container overflows. The four supplied reference sheets and representative live narrow-screen renders were also reviewed. I fixed:
  - text crowding the equation card;
  - two labels cut off by zoom circles;
  - a plus sign overlapping "carbon dioxide";
  - one epidermis cell outside the frame.
- What makes these diagrams more scientific:
  - **Molecule glyphs** (CO₂, H₂O, O₂, a glucose ring, nitrate), used in the equation, the stoma, the xylem and the chloroplast.
  - **Lesson 17's leaf cross-section**, reused, with one palisade cell boxed and zoomed: cell wall, nucleus, vacuole and chloroplasts.
  - **A single chloroplast zoomed further**, with its green stacks (chlorophyll) and light coming in.
  - **Plant structures:** a stoma between guard cells, and xylem tubes with water moving up.
  - **Cellulose** drawn as glucose units joined in chains; **protein** as glucose + nitrate → amino acid → a chain.
  - **Storage:** oil droplets in a seed cut open, starch grains at night, and osmosis shown with two cells.
- The one grid screen is the equation-and-symbols card. It notes that molecules are simple symbols, not their real shapes.

## Needs a qualified Science teacher
- "Most of the new plant is made from carbon dioxide and water" is true of dry mass, but check you're happy with the wording.
- The respiration diagram labels mitochondria (from Lesson 1). The frame text keeps to "respiration transfers energy from glucose".
- **Invented data:** the starch-over-a-day graph (B26-14) is illustrative.
- **Written-answer rubric** for B26-15, which has 5 marking points.

## Repository verification
- Full lesson flow and recommendation chain verified by automated tests.
- B4 breadcrumb and eyebrow verified in the live preview.
- All 40 responsive geometry checks passed with no browser console errors.
- Production TypeScript and build checks passed.
