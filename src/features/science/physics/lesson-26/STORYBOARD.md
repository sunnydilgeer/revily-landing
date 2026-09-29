# Physics Lesson 26 storyboard — The National Grid

Chapter P2, Electricity. Folder `physics/lesson-26`, id `P-ELE-026-P`, skill `P-GRID`, spec 6.2.4.3. It owns what the National Grid is, demand, why a high pd and low current, and step-up and step-down transformers. P = VI is recalled from the previous lesson; there are no transformer equations (Higher tier).

Big idea: the National Grid carries electrical power from power stations to consumers. It raises the pd with a step-up transformer so the current is low and the cables waste little energy as heat, then lowers the pd with a step-down transformer so it is safe in homes.

Flow note: what the grid is first (a picture of the whole route), then demand (why stations run below maximum), then the reason for high pd and low current (needs P = VI and the heating idea), then transformers, because "step-up" only makes sense once students know why the pd is raised. Only the last frame of section 5 puts the whole journey together.

Sections:
1. Start here (P26-01): how electricity reaches far-away homes.
2. What is the National Grid? (P26-02–04): network → power stations to consumers → cables and transformers. Checks: definition; who a consumer is.
3. How does it keep up with demand? (P26-05–07): demand changes → enough for everyone → room to spare → coping with surprises. Checks: meaning of demand; why below maximum.
4. Why a high pd and a low current? (P26-08–10): P = VI → hot cables → high pd, low current → cheaper and more efficient. Checks: why high pd; 1000 W at 100 V and 10 000 V.
5. What do transformers do? (P26-11–13): step-up → current down → step-down → whole journey. Checks: step-down; numbered diagram of the route.
6. On your own (P26-14–17): demand on a cold evening; two cables compared; ordering the route; a written explanation.

Out of scope: transformer turns ratio and Vp × Ip = Vs × Is (Higher tier); how power stations generate electricity (energy resources lessons); ac and dc (mains lesson). The exam questions on the page were not reused.

Source boundary: supplied revision-guide page 191 (scope only); AQA 8464 Physics 6.2.4.3. All wording, numbers, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The high-current point is explained through heating of the wires and wasted energy in the surroundings, as on the page, with no I²R calculation (that is the previous lesson's equation).
- The pd/current comparison uses P = VI with friendly numbers (1000 W at 100 V and 10 000 V), read as a comparison, not a rearrangement.
- Consumers are "anyone using electricity", as on the page.

## Diagram specs
Look as in Lessons 17 and 18: soft rounded shapes, gentle tints, hand-drawn feeling, text >= 12px, readable at 360px. Use `physicsPalette` from PhysicsKit; electrical energy arrows in one consistent colour. Same route picture reused across the lesson, left to right: power station (cooling towers, chimney), step-up transformer, pylons and cables, step-down transformer, houses. Not to scale.

Section 2 (one drawing, building up):
- `grid-network`: a simple outline of Great Britain with a few power stations and many houses/towns joined by a web of lines. Label "National Grid".
- `grid-consumers`: the route picture with an arrow "electrical power" from "power station" to "consumers" (a house and a factory).
- `grid-parts`: the route picture with cables highlighted and labelled "cables carry the power" and the two transformer boxes highlighted, labelled "transformers change the pd".

Section 3 (one drawing: a day graph):
- `grid-demand`: a simple demand-against-time curve for 24 h (axes "time of day", "demand"), peaks in the morning and evening, dip at night, with small icons (kettle at breakfast, a lamp in the evening). No numbers.
- `grid-enough`: the same graph with a second line "electricity produced" following the demand curve.
- `grid-spare`: a bar or gauge: "maximum power output" at the top, the station running at a lower level, the gap labelled "room to spare".
- `grid-cope`: three power stations; one crossed/faded with "shuts down", the other two with upward arrows "increase output", a house with lit windows.

Section 4 (one two-cable comparison):
- `grid-pvi`: the equation P = V × I as three linked tiles with a see-saw note "same power: pd up, current down".
- `grid-hotcable`: a thick cable with big arrows labelled "high current" and wavy heat lines rising, label "energy lost as heat to surroundings".
- `grid-highpd`: a thin cable with one small arrow "low current", label "very high pd", only one tiny heat wave.
- `grid-compare`: the two cables side by side: left "low pd, high current: hot cable, lots wasted"; right "high pd, low current: cool cable, little wasted" with a tick.

Section 5 (the route picture again):
- `grid-stepup`: the route picture with the step-up transformer highlighted; a small pd gauge showing "pd goes up" beside it.
- `grid-currentdown`: same, highlighting the cables with a small "current goes down" arrow and a cool cable.
- `grid-stepdown`: the step-down transformer near the houses highlighted; pd gauge showing "pd goes down: safe"; current arrow "goes up".
- `grid-journey`: the whole route with five numbered steps along it: power station, step-up transformer, cables, step-down transformer, consumers.

Question visual (assessment view):
- `grid-q-route` (P26-13): the route picture with two numbered pointers, 1 between the power station and the pylons, 2 between the pylons and the houses. Transformer boxes drawn as plain boxes with NO words ("step-up"/"step-down" hidden, no pd values). Neutral accessible description: "A power station, pylons and cables, and houses, with two numbered points along the route."

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
