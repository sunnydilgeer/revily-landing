# Physics Lesson 37 storyboard — Irradiation and contamination

Chapter P4, Atomic structure. Folder `physics/lesson-37`, id `P-ATM-037-P`, skill `P-IRRAD`, spec 6.4.2.4. It owns irradiation versus contamination, how to protect against each, and how dangerous alpha, beta and gamma are outside versus inside the body. It uses the properties taught in the alpha, beta and gamma lesson; it does not re-teach them.

Big idea: irradiation is radiation reaching you from outside; contamination is radioactive atoms getting on or in you. Which radiation is the worst depends on whether the source is outside or inside.

Flow note: irradiation first because it is the simpler idea (distance and barriers), then contamination (atoms stay and keep decaying), then the comparison, because the alpha reversal (safest outside, worst inside) only makes sense once both ideas are clear. Peer review is one clause at the end.

Sections:
1. Start here (P37-01): why sources are kept in a lead-lined box.
2. What is irradiation? (P37-02–04): exposed → distance → not made radioactive → protection. Checks: what happens to the block; best protection.
3. What is contamination? (P37-05–07): atoms on or in → keep decaying → inside the body → protection. Checks: definition; protection for powder.
4. Which sources are most dangerous? (P37-08–10): types matter → outside → inside → beta → whole picture. Checks: least dangerous outside; most dangerous inside.
5. On your own (P37-11–15): spilt dust; gamma versus alpha irradiation; error spotting; least dangerous inside; written explanation of the alpha reversal.

Out of scope: half-life choices for sources, medical uses, dose units, detailed types of protective equipment, risk versus benefit discussion, background radiation.

Source boundary: supplied revision-guide page 202 (scope only); AQA 8464 Physics 6.4.2.4. All wording and examples are original; no CGP characters. Draft pending teacher review.

Judgement calls: the properties of alpha, beta and gamma are used as already taught (alpha stopped by skin or air gap, gamma passes out of the body); peer review is one clause.

## Diagram specs
Look as in Lessons 17 and 18: soft rounded shapes, gentle tints, hand-drawn feeling, text >= 12px, readable at 360px. Use `physicsPalette` and PhysicsKit helpers (graph axes, energy-store badges, transfer arrows). Walkthrough frames in one section reuse one drawing and change the highlight. Radiation is drawn as thin wavy rays or dots leaving a source. Use one consistent colour for radioactive atoms (for example an orange-red nucleus dot).

Section 2:
- `irrad-exposed`: a radioactive source (trefoil symbol) on the left with rays reaching a small object on the right; label "irradiated = exposed to radiation" and "source stays outside".
- `irrad-distance`: three objects at increasing distance from a source, the rays reduce in number; last one has no rays; labels "near", "further", "far enough: no radiation reaches".
- `irrad-notradioactive`: an object after the rays, with a tick and the label "not radioactive afterwards" (no trefoil on the object).
- `irrad-protect`: three small panels: lead-lined box with the source inside, a barrier between person and source, a person holding tongs at arm's length; labels "lead-lined box", "barrier", "arm's length".

Section 3:
- `irrad-contaminated`: an object (a glove or hand) with several orange-red radioactive atoms on its surface, arrow from a spilled container; label "contaminated: radioactive atoms on or in it".
- `irrad-decay`: the same atoms with rays coming from each; label "atoms stay and keep decaying".
- `irrad-inside`: a simple person outline (head and chest only) with atoms inside the chest, rays going out in all directions; label "atoms inside the body".
- `irrad-suits`: a person in protective suit, mask and gloves holding a source with tongs; labels "gloves and tongs", "suit and face mask".

Section 4 (one comparison layout, two rows: outside the body / inside the body, three columns alpha, beta, gamma; the frame highlights parts):
- `irrad-compare`: the empty grid with the three column headings and two row headings; small alpha, beta, gamma symbols.
- `irrad-outside`: top row filled: alpha stopped by skin ("stopped by skin and air gap", least dangerous), beta and gamma pass into the body ("can damage organs"); ranking labels.
- `irrad-inside-compare`: bottom row filled: alpha does all damage in a tiny area (small dense burst, "most ionising, most dangerous"), gamma mostly passes out ("least dangerous").
- `irrad-beta`: beta highlighted in the bottom row: damage spread over a wider area, "less ionising than alpha".
- `irrad-table`: the whole grid filled with a simple ranking (outside: alpha least; inside: alpha most, gamma least) and a small speech tag "research is published and peer reviewed".
