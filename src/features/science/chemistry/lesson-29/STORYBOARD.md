# Chemistry Lesson 29 storyboard — Measuring energy changes

Chapter C5, Energy changes. Folder `chemistry/lesson-29`, id `C-NRG-029-C`, skills `C-NRG-TEMP-CHANGE`, `C-NRG-CUP-APPARATUS`, `C-NRG-VARIABLES`. AQA 8464 5.5.1.1, including the required practical on temperature changes in reacting solutions.

Big idea: you can measure how much a reaction heats up or cools down with a thermometer, and an insulated polystyrene cup with a lid, standing in cotton wool, cuts the energy lost so the measured change is closer to the true one.

Flow note: reading and calculating a temperature change comes first (the measurement); then the apparatus, drawn once and built up (the problem, lid, cotton wool, labelled); then the acid-concentration investigation, which reuses the apparatus and adds variables, method and results.

Sections:
1. Start here (C29-01): a temperature rise means energy was given out (prior knowledge).
2. Measuring a temperature change (C29-02–04): start and highest or lowest → change = end − start (worked: 21.0 to 27.5) → rise or fall. Checks: 21.0 to 29.5 °C; a fall from 23.0 to 18.0 °C.
3. The polystyrene-cup apparatus (C29-05–07): energy loss → lid → cotton wool → labelled. Checks: why a lid; which numbered part insulates.
4. Testing acid concentration (C29-08–11): variables → method (two halves) → example results. Checks: what is changed; what is kept the same; why every 30 seconds.
5. On your own (C29-12–15): numbered apparatus; calculation from two thermometers; conclusion from a table; written improvements to an open beaker.

Out of scope: definitions of exothermic and endothermic and their examples and uses (previous lesson, recapped in one frame only); reaction profiles and activation energy (next); calculating energy in joules, specific heat capacity, bond energies (Higher); safety and hazard details beyond the method on the page.
Source boundary: supplied revision-guide page 133 (scope only; its test question was not used); AQA 8464 5.5.1.1. All examples, wording and diagrams are original. The online lesson prepares for the practical and does not replace doing it. Draft pending teacher review.

Judgement calls for the teacher:
- Method values (25 cm³, 25 °C water bath, 10, 20 and 30 g/dm³, every 30 seconds) follow the page. The example results are invented and only used to say a bigger concentration gave a bigger rise in these results; the lesson makes no claim that the change is proportional. In a real test the sodium hydroxide amount is fixed, so the rise levels off once the acid is in excess.
- Cotton wool is explained as trapped air (a poor conductor). The lid explanation covers the top only.
- The names independent, dependent and control variable are given in one sentence; the frames use plain words.

## Diagram plan
`components/EnergyMeasureVisuals.tsx`, focus prefix `calor-`. Coral = rise/energy out, electron-blue = fall/energy in. Frames: `calor-change-both/-calc`, `calor-sign`, `calor-cup/-lid/-cotton/-labelled` (one drawing built up), `calor-vars`, `calor-method-a/-b`, `calor-results`. Question visuals: `calor-q-cup` (numbered parts, no names), `calor-q-thermo`, `calor-q-table`.

## States in full
See `lesson.ts` (15 screens: C29-01 to C29-15) and `teachingFrames.ts`.
