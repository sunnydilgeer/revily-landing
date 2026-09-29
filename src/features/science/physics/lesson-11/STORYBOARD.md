# Physics Lesson 11 storyboard: Wind, solar and geothermal power

Topic P1 Energy. Folder `physics/lesson-11`, id `P-RES-011-P`, skill `P-WINDSOL`, prefix `windsol-`. It owns wind, solar cells and geothermal power: how each works, where it is used, pros and cons, and their reliability. Renewable versus non-renewable lists and uses for transport and heating belong to the previous lesson; water power, bio-fuels and trends belong to the next three.

Big idea: three renewable resources that never run out, but each has a catch. Wind and solar depend on the weather or the time of day, so their supply cannot be increased on demand. Geothermal power is always available, but only in a few places and at a high cost.

Flow note: wind first because it is the most familiar and gives the pros-and-cons routine (what it is, pros, cons). Solar repeats the routine and adds where it is used. Geothermal repeats it again and ends with a side-by-side comparison, because "which is more reliable and why" is the question students meet most. The repeated shape means students build one checklist and reuse it.

Sections:
1. Start here (P11-01): a wind farm on a day with no wind.
2. How does wind power work? (P11-02–04): blades → pros → view and noise → wind changes. Checks: a disadvantage; land after removal.
3. What about solar power? (P11-05–07): solar cells → uses → pros → cons. Checks: why solar suits a remote sign; a true statement.
4. What is geothermal power? (P11-08–10): hot rocks → two uses → pros → cons → compare the three. Checks: source of the energy; why more reliable than wind.
5. On your own (P11-11–15): three numbered pictures; a weather-proof choice; a shared disadvantage; renewable recall; a written two-and-two answer.

Out of scope: how a generator works, cost figures, photovoltaic physics, solar water heaters (met under heating), geothermal heat pumps, Higher-tier content.

Source boundary: supplied revision-guide page 175 (scope only; page 179 is the topic test, quiz ideas only); AQA 8464 Physics 6.1.3. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The page's side note "wind turbines produce electricity 70-85% of the time on average" is kept as one sentence.
- Solar cells are described as transferring energy from the Sun by light, then electrically, using the course energy-transfer wording.
- The "water pumped down to the hot rocks" sentence in geothermal uses is a simple original explanation, not on the page.

## Diagram specs
Organic, soft and slightly hand-drawn, as in Science Lessons 17 and 18: rounded shapes, gentle tints with a darker stroke of the same hue, generous white space, no more detail than Foundation needs, readable at 360px. Use PhysicsKit (physicsPalette, energy-store badges, transfer arrows) and the course colours: yellow = energy from the Sun, blue = water, green = plants, amber = fuels. Text in the SVG at least 12px. Every SVG has role="img" and a title; assessment views hide the answer-giving words but keep the numbers. One hillside scene is reused through the wind frames, one sunny landscape through the solar frames and one cut-away of the ground through the geothermal frames.

- `windsol-turbine`: three wind turbines on a grassy moor and a sea edge, with curved wind arrows turning the blades and a small lightning-bolt "electricity" arrow to a pylon. Labels "wind", "blades turn", "electricity". Note "open spaces: moors, out at sea".
- `windsol-wind-pros`: same scene, tick badges: "no pollution once built", "no lasting damage: turbines removed, land goes back to normal" (a faded turbine-less hill on the right).
- `windsol-wind-noise`: same scene from a house window: a turbine on the horizon with a small "spoils the view" callout and sound waves near a house labelled "noisy for people nearby".
- `windsol-wind-limits`: three small panels in a row: a still day (limp flag, stopped blades) "little wind: stops", a windy day (bent tree, stopped blades with a warning) "too strong: stopped to avoid damage", a demand bar with a locked upward arrow "cannot increase supply on demand". Bottom note "on average 70-85% of the time".
- `windsol-cell`: a tilted solar panel in a sunny field, yellow rays from a sun landing on it, an arrow to a lamp or house. Labels "light from the Sun", "solar cell", "electricity". Small note "no blades to turn".
- `windsol-uses`: three round vignettes: remote weather station on a mountain, road sign, satellite. Labels "remote places", "road signs", "satellites".
- `windsol-solar-pros`: sunny country scene with three tick badges: "no pollution once built", "reliable in sunny countries", "free energy, running costs almost zero". Small cloud with weak sun "fairly reliable even in cloudy Britain".
- `windsol-solar-cons`: a day-and-night pair: a bright panel with sun "daytime: works", a dark panel with moon "night: no electricity". Below: a factory badge "lots of energy used to build" and locked demand arrow "cannot increase on demand".
- `windsol-hotrock`: ground cut-away with the surface, layers of rock getting warmer (soft pale to warm orange), a thermal energy-store badge on the hot rocks. Labels "Earth's surface", "hot rocks", "thermal energy store".
- `windsol-geouses`: same cut-away with a pipe going down and coming up, a small power plant and a row of houses. Two arrows: "generate electricity" to the plant and "heat buildings directly" to the houses.
- `windsol-geopros`: same cut-away with a sun-and-cloud strip above showing weather changes and the rocks unchanged. Tick badges "reliable: rocks always hot" and "little damage to the environment".
- `windsol-geocons`: a small map/landscape strip with only one or two marked suitable spots among many crossed-out places "not many suitable locations", and a coin badge "high cost to build".
- `windsol-compare`: a three-column comparison card: wind turbine, solar panel, geothermal plant, each with a small row "works: when the wind blows / in daylight / all the time". Geothermal column highlighted, footnote "only in a few places".
- `windsol-q-resources` (question, assessment view): three numbered pictures side by side: 1 a geothermal plant on the ground, 2 wind turbines, 3 a solar panel. No names, no words about day or night. Neutral description: "Three energy resource pictures, numbered 1 to 3."

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
