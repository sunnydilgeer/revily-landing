# Physics Lesson 50 storyboard — Stopping distance and thinking distance

Chapter P5, Forces (motion). Folder `physics/lesson-50`, id `P-MOT-050-P`, skill `P-STOPPING`, spec 6.5.4.3.1 and 6.5.4.3.2. It owns stopping distance = thinking distance + braking distance, typical stopping distances, safety, and the factors that change thinking distance (speed, tiredness, drugs, alcohol, distractions). Factors that change braking distance and the reaction-time test belong to the next two lessons.

Big idea: a car keeps moving while the driver reacts and keeps moving while the brakes work. Stopping distance adds the two. Anything that slows the driver's reactions, or raises the speed, makes it longer and the journey less safe.

Flow note: the two parts of stopping distance first (with one addition), then typical values and safety, then thinking distance, because the causes of a longer thinking distance make most sense once the definition and the risk are clear. Calculation flow: worked example (9 m + 15 m = 24 m) → near-identical guided item (12 m + 24 m = 36 m) → independent calculation (14 m + 38 m = 52 m). It is an addition, so no rearranging and no unit conversion.

Sections:
1. Start here (P50-01): what "stopping distance" means in an emergency.
2. What is stopping distance? (P50-02–04): emergency stop → total distance → equation → thinking distance → braking distance → worked addition. Checks: which distance is travelled while reacting; a guided addition.
3. How far does a car take to stop? (P50-05–07): heavier and faster → typical values → risk → speed limits. Checks: about 73 m at 60 mph; why lower speed limits.
4. What changes thinking distance? (P50-08–10): two things → speed → tired, drugs and alcohol → distractions → longer stopping distance. Checks: which factor increases it; why speed does.
5. On your own (P50-11–15): independent addition; reading a small table; a tired driver; texting; a written explanation of a tired driver.

Out of scope: braking distance factors (wet roads, worn tyres, mass) and the energy explanation; measuring reaction time; converting mph to m/s; the exam question on the page (not reused).

Source boundary: supplied revision-guide page 217 (scope only); AQA 8464 Physics 6.5.4.3.1 and 6.5.4.3.2. All wording, numbers and diagrams are original; the page's typical stopping distances (23 m, 73 m, 96 m) are standard spec-level values. Draft pending teacher review.

Judgement calls for the teacher:
- Typical distances are given as "about" values with mph units, as on the page; no conversion to m/s is asked for.
- The small table in the question P50-12 uses invented round numbers and asks only for the direction of the change, not for proportionality.
- Alcohol and drugs are stated factually as slowing reactions and being unsafe for driving.

## Diagram specs
Look as in Lessons 17 and 18 and the other Physics lessons: soft flat fills with a darker stroke of the same hue, `physicsPalette`, text >= 12px, readable at 360px. Distances are drawn on a straight road strip viewed from above or the side, with one colour for thinking distance (blue) and one for braking distance (amber) used in every frame.

Section 2 (one road strip with a car, a hazard sign at the right, and a distance bar under the road that grows frame by frame):
- `stopdist-emergency`: a car braking hard (brake lights, "maximum braking force" arrow) with a hazard ahead; label "emergency stop: shortest possible distance".
- `stopdist-total`: the road strip with one long bracket from where the driver sees the hazard to where the car stops, labelled "stopping distance".
- `stopdist-equation`: the bracket split into a blue part and an amber part, with the equation card "stopping distance = thinking distance + braking distance".
- `stopdist-thinking`: only the blue part highlighted, with the label "thinking distance: car keeps going while the driver reacts" and a small eye-to-pedal timeline "see hazard → press brake".
- `stopdist-braking`: only the amber part highlighted, with the car slowing (speed lines getting shorter) and a backwards force arrow; label "braking distance".
- `stopdist-w`: the road strip with the blue part labelled "9 m", the amber part "15 m" and the total "24 m", with a small card "9 + 15 = 24 m".

Section 3:
- `stopdist-factors`: a small car and a heavy lorry, and a slow and a fast car, each with a bracket where the heavier or faster one has a longer bracket; labels "heavier: longer", "faster: longer".
- `stopdist-typical`: three road strips stacked, one per speed, with total lengths in proportion 23 : 73 : 96; labels "30 mph: about 23 m", "60 mph: about 73 m", "70 mph: about 96 m".
- `stopdist-risk`: a car stopping just short of a person or car in one strip ("short stopping distance: safe") and hitting it in another ("longer than the gap: crash").
- `stopdist-limit`: a school-zone sign with "20" and a school, and a motorway sign with "70", each with a short and a long bracket; caption "lower speed limit, shorter stopping distance".

Section 4:
- `stopdist-think-two`: the blue bar with two arrows feeding it: "speed of the car" and "driver's reactions".
- `stopdist-think-speed`: two cars for the same reaction time (a clock icon "same time"); the slow car has a short blue bar and the fast car a longer blue bar.
- `stopdist-think-tired`: a driver with drooping eyes, a bottle and a pill icon (kept neutral, no brand), and a long reaction-time bar; the blue distance bar longer than in a normal driver.
- `stopdist-think-phone`: a driver holding a phone, looking away, with a "hazard spotted late" arrow; a longer blue bar.
- `stopdist-think-crash`: two roads: normal blue bar and the car stops in time; longer blue bar and the car reaches the hazard; label "longer thinking distance, longer stopping distance".

Question visual (assessment view):
- `stopdist-q-table` (P50-12): a table with columns "speed (mph)", "thinking distance (m)", "braking distance (m)" and rows 20 / 6 / 6, 40 / 12 / 24, 60 / 18 / 54. No arrows, no totals, no trend words.
