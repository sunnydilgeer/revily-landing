# Physics Lesson 12 storyboard: Hydro-electricity, waves and tides

Topic P1 Energy. Folder `physics/lesson-12`, id `P-RES-012-P`, skill `P-WATERPOW`, prefix `waterpow-`. It owns hydro-electric power, wave power and tidal barrages: how each works, pros, cons and reliability.

Big idea: three ways of using moving water to turn turbines. Each has no pollution once running, but each has a catch: flooding and cost for hydro-electric, unreliable waves and upkeep for wave power, and habitats and few suitable estuaries for tidal barrages.

Flow note: hydro-electric first, because falling water turning a turbine is the easiest picture, and it links to the gravitational potential store from earlier energy lessons. Wave power is the shortest and comes second. Tidal barrages come last because they combine the dam idea from hydro with the sea from wave power, and finish on why tides are reliable. Every resource follows the same shape: how it works, pros, cons.

Sections:
1. Start here (P12-01): why store water high behind a dam.
2. How does hydro-electric power work? (P12-02–04): dam and flooded valley → turbines → pros → cost and flooding → needs rain. Checks: what happens to the valley; an advantage.
3. What about wave power? (P12-05–07): turbines in the sea → pros → cons. Checks: why unreliable; where it suits.
4. How do tidal barrages work? (P12-08–10): barrage across an estuary → reliable tides → habitats and places → tide size. Checks: what an estuary is; why tides are reliable.
5. On your own (P12-11–15): three numbered schemes; weather and reliability; drought choice; a shared disadvantage; a written description.

Out of scope: turbine design, pumped storage, costs in numbers, Higher-tier content.

Source boundary: supplied revision-guide page 176 (scope only; page 179 is the topic test, quiz ideas only); AQA 8464 Physics 6.1.3. All wording, examples and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- The energy-store sentence for hydro (gravitational potential store to kinetic store) goes slightly beyond the page but uses the course store wording and only what Lesson 4 taught.
- "Global warming" and "greenhouse gases" are used as terms in the flooding con, exactly as the page does, and explained fully in the next lesson.
- "Twice a day" for tides is kept as on the page.

## Diagram specs
Organic, soft and slightly hand-drawn, as in Science Lessons 17 and 18: rounded shapes, gentle tints with a darker stroke of the same hue, generous white space, no more detail than Foundation needs, readable at 360px. Use PhysicsKit (physicsPalette, energy-store badges, transfer arrows) and the course colours: yellow = energy from the Sun, blue = water, green = plants, amber = fuels. Text in the SVG at least 12px. Every SVG has role="img" and a title; assessment views hide the answer-giving words but keep the numbers. One valley-and-dam scene is reused through the hydro frames, one coastline scene through the wave frames, and one estuary through the tidal frames.

- `waterpow-dam`: cut-away side view of a valley with a curved dam wall, a lake filled behind it, and a small gravitational potential energy store badge on the high water. Labels "dam", "flooded valley", "water stored high up".
- `waterpow-turbines`: same scene; an arrow of water falling through a pipe to a turbine house and pylon. Store badges: gravitational potential to kinetic, then a lightning arrow "electricity". Labels "water flows out through turbines", "turbine".
- `waterpow-hydro-pros`: same scene with two tick badges "no pollution when running" and "flow can be controlled": a small tap or gate on the pipe with an up arrow to a demand bar labelled "responds straight away to extra demand".
- `waterpow-hydro-cons`: same scene with the lake tinted and three callouts: coin badge "high initial costs"; rotting plants under the water with small gas puffs "plants rot and release greenhouse gases"; a fish and bird leaving "animals and plants lose their habitats".
- `waterpow-rain`: a pair of small panels: rainy hills with a full lake "high rainfall: reliable" and a sun over dry cracked ground with a low lake "dry climate or drought: not suitable".
- `waterpow-wave`: sea and coast scene with two or three small floating turbines on waves, an arrow "waves turn the turbines" and a cable to a pylon on the coast. Labels "waves", "turbines in the sea", "coast".
- `waterpow-wave-pros`: a small island with a long coastline ringed by turbines; tick badges "no pollution" and "useful on islands".
- `waterpow-wave-cons`: three panels: seabed with a disturbed fish "disturbs seabed and habitats"; a windy sea then a calm sea "waves die out when the wind drops: unreliable"; a spanner and coin "difficult and expensive to maintain".
- `waterpow-barrage`: plan view of an estuary: a river widening into the sea with a dam line across it containing turbines, arrows for tide in and out through the turbines, a pylon on the bank. Labels "river", "estuary", "tidal barrage", "sea".
- `waterpow-tides`: a small sea-level strip at four times of the day showing high, low, high, low and a small Moon and Sun with a gravity pull arrow. Labels "high tide", "low tide", "twice a day". Tick badge "no pollution once running".
- `waterpow-barrage-cons`: the estuary scene with birds and crabs on the mud and a caution badge "changes habitats", and a small map with one suitable estuary among unsuitable ones "not many suitable estuaries".
- `waterpow-tide-size`: two sea-level strips: a big tide with a tall energy bar and a small tide with a short energy bar. Labels "bigger tide, more energy", "smaller tide, less energy".
- `waterpow-q-schemes` (question, assessment view): three numbered sketches: 1 turbines floating on waves by a coast, 2 an estuary with a barrage across it, 3 a valley with a dam and lake. No names. Neutral description: "Three water power schemes, numbered 1 to 3."

## States in full
Read the states in `lesson.ts` and the frames in `teachingFrames.ts`; they are the single source for wording, answers and hints.
