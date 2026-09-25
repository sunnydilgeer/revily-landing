# Lessons 17–18 QA note — Plant organisation

Status: prototype draft, `draftNeedsTeacherReview`. Not deployed.

## Checked (automated, `lessons1718.test.tsx`, 20 checks)
- Metadata, unique state/context IDs, AQA 4.2.3 source links and spec references, sections map to real states.
- Every choice option grades correctly; written answers are `teacherOnly`, save as `pendingTeacherReview`, and never award explanation evidence.
- Correct answers spread across option positions (no position holds more than 45%).
- Plain-language guard: bans technical terms outside Foundation scope (turgid, flaccid, lignin, concentration gradient, etc.) and caps sentence length on teaching screens.
- Every teaching frame renders through `TeachingChunk` with its copy and an accessible, titled SVG; worked example renders.
- Question diagrams hide answers until submission (numbered leaf layers, student drawing correction, rate data).
- Full flow: locked answers, reload/restore, 100% progress, 16 → 17 → 18 recommendation chain, repair route after a wrong independent answer.
- Storage isolation; hub, chapter (B2c), parser and canonical links include Lessons 17–18.

## Checked (visual)
- All 33 diagram states rendered in Chromium at 540px and 330px. Automated check: every text and shape sits inside its viewBox; no overlapping text labels. Leader lines start beside their label and end on the named feature.
- Known limit shared with existing diagrams: at phone width, label text scales down to roughly 8–9px.

## Needs a qualified Science teacher
- Scientific judgement calls: sugar transport attributed to phloem only; light increases transpiration via stomata opening; guard-cell wording "swell"/"go floppy" without turgid/flaccid; "most stomata underneath because it is cooler and shaded".
- Whether the sealed-pot balance example and the still/moving-air data are appropriate illustrative contexts (they are invented model results, not observations).
- Written-answer rubrics for B17-16 and B18-19.
- Whether 16 and 19 screens suit your learners.
