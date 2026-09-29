# Chemistry Lesson 4 storyboard — Filtration, crystallisation and distillation

Chapter C1a, Atoms, elements, compounds and mixtures. Folder `chemistry/lesson-4`, id `C-ATM-004-C`, skill `C-SEPARATION`. It follows the lesson on mixtures and chromatography, which introduced mixtures, solutions and "physical methods make no new substances" (referred to in one clause only).

Big idea: each separation method uses one physical difference between the parts of a mixture. Filtration uses "dissolves or not"; evaporation and crystallisation remove a solvent to leave a soluble salt; distillation uses different boiling points, so the liquid can be boiled off, cooled in a condenser and kept.

Flow note: solids first, then liquids, and each method is built on one drawing that changes frame by frame.
1. **How does filtration work?** Starts from the everyday idea of dissolving (sugar vs sand), because "insoluble" is what makes filtration work. One funnel drawing: paper cone → filtrate → residue → put together (with the limit: a dissolved solid passes through).
2. **How do you get a salt back?** Follows directly from that limit: a dissolved salt needs its solvent removed. Solvent (particle zoom) → evaporation on tripod, gauze and Bunsen → why it is not for every salt (with proportionate safety) → crystallisation → filter and dry → side-by-side comparison.
3. **How do you separate rock salt?** Only now can the two ideas be combined: a four-panel strip (grind, dissolve, filter, evaporate) that highlights one step per frame, after a magnified view of the mixture.
4. **How does simple distillation work?** Turns to keeping the liquid instead of losing it: one apparatus drawn once and highlighted heat → boiling (thermometer at the side arm, 100 °C) → condenser (water in at the bottom, out at the top) → collection, then the limit (similar boiling points).
5. **How does fractional distillation work?** Answers that limit with a fractionating column on the same style of apparatus: propanone (56 °C) and water (100 °C), lowest boiling point first, fractions, raise the temperature; crude oil in one clause.
6. **On your own**: numbered apparatus in assessment view, reading real boiling points against a thermometer, spot the error in a rock-salt plan, and a written explanation of distilling sea water.

Sections:
1. Start here (C4-01): sugar "disappearing" in tea has dissolved and is still there (everyday prior knowledge; sets up soluble).
2. How does filtration work? (C4-02–04): soluble → insoluble → filter paper cone in a funnel (filtration) → filtrate (keep the level below the paper top) → residue → put together. Checks: numbered filtration drawing (which part is the residue); which mixture can be filtered (chalk in water).
3. How do you get a salt back? (C4-05–07): solvent → evaporation (heat gently until dry crystals) → some salts break down when too hot; hot apparatus → crystallisation (heat gently, stop when crystals start, cool) → filter and dry in a warm place → comparison. Checks: method for a salt that breaks down; what to do once crystals start.
4. How do you separate rock salt? (C4-08–10): rock salt = salt + sand → grind and dissolve → filter off the sand → evaporate or crystallise → put together. Checks: what is left on the paper; why water is added before filtering.
5. How does simple distillation work? (C4-11–13): distillation keeps the liquid → lowest boiling point evaporates first, thermometer at the side arm → condenser, water in at the bottom → collection, salt left in the flask; simple distillation → put together and the similar-boiling-points limit. Checks: what happens in the condenser; where the salt ends up.
6. How does fractional distillation work? (C4-14–16): mixture of liquids, fractionating column → lowest boiling point first (column hotter at the bottom) → fractions → raise the temperature → put together, fractional distillation named, crude oil in one clause. Checks: why propanone reaches the top first; which method for liquids boiling at 80 °C and 84 °C.
7. On your own (C4-17–20): numbered distillation apparatus (which part condenses the gas); pentane/hexane/heptane boiling points with a 69 °C thermometer reading; spot the error in a rock-salt plan (filtering before dissolving); written: how simple distillation gives a ship's crew pure water from sea water.

No calculations in this lesson, so there is no worked-example route.

Practical framing: filtration, evaporation, crystallisation and distillation are taught as preparation for doing them in the lab (method, what each piece of apparatus is for, what to watch for). The lesson never claims the student has done the practical. Safety is kept proportionate: hot dish, tripod and gauze (let them cool), eye protection because hot solution can spit, and not heating to dryness when the salt breaks down.

Wording rules: one new term per frame, plain meaning first then "is called X"; the mixtures lesson is referred to in one clause; British spelling; no author notes in learner text.

Out of scope: chromatography (previous lesson); the particle model of boiling and condensing beyond "turns into a gas" and "turns back into a liquid"; anti-bumping granules, water baths and electric heaters; purity tests and melting points; crude oil fractions in detail (a later chemistry topic, named in one clause); Higher-tier or Chemistry-only content; the book's cartoons, jokes, side notes and exam questions (the crystallisation question and the propan-1-ol/methanol/ethanol fractions question).

Source boundary: supplied revision-guide pages 98–99 (scope only); AQA 8464 Chemistry 5.1.1.2. The sugar-in-tea opener, the sandy-water and chalk examples, the particle zoom, the rock-salt road-gritting context, the propanone and water mixture, the pentane/hexane/heptane data, the ship's-crew task, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- "Some salts break down if they get too hot" is left without a named example (hydrated copper sulfate losing its water would be the usual one, but it is not on the page or in the spec at this depth).
- Propanone (56 °C) and water (100 °C) is the teaching mixture for fractional distillation, chosen instead of ethanol and water because it separates cleanly and to keep away from the book's alcohol question. Pentane 36 °C, hexane 69 °C and heptane 98 °C are rounded real boiling points.
- The frame text says the fractionating column is "hottest at the bottom and cooler at the top" (the book's diagram labels this) but does not explain condensation on the beads.
- "Warm it a little to help the salt dissolve" (rock salt) comes from the page's side note.
- The condenser explanation gives the reason for water in at the bottom ("so the jacket stays full"), which the page asks students to know but does not explain.
- Filtration is also described with a beaker below (the page); a conical flask is equally correct.

## Diagram plan
- `components/SeparationVisuals.tsx`, focus prefix `sep-`, routed by `CellBiologyVisuals.tsx`. Imports the Chemistry `atomPalette` (ink, muted, panels) from `AtomVisuals.tsx` and `Arrow` from `InfectionVisuals.tsx`. Colour code: water blue, salt lavender (dissolved particles and crystals), sand tan, heat orange (also the highlight colour), gas dashed grey-blue arrows, cold condenser water blue arrows, propanone pale green, glassware very pale blue with a grey-blue line. Key rows use the house numbered style: active step filled, earlier steps plain, later steps faded.
- **Dissolving** (`sep-filter-soluble`, `-insoluble`): sugar-water and sand-water beakers side by side, one highlighted per frame.
- **Filtration** (`sep-filter-setup`, `-filtrate`, `-residue`, `-all`): one funnel with a filter-paper cone over a beaker; the paper cone, then the filtrate, then the sand residue is highlighted with a matching key row. `sep-filter-question` is the same drawing with pointers 1 paper, 2 filtrate, 3 residue; the key appears only outside assessment view.
- **Getting a salt back** (`sep-salt-*`): particle zoom of a salt solution (water = solvent, salt dissolved); evaporating dish on tripod, gauze and Bunsen with steam and dry crystals; a caution frame (salts that break down; hot apparatus); crystallisation with a small flame and crystals at the edge, then filtering the crystals, with a four-step key; a two-panel comparison.
- **Rock salt** (`sep-rock-*`): a lump with a magnified view (salt crystals and sand grains), then a four-panel strip (pestle and mortar, dissolving, filtering, evaporating) with one step highlighted per frame.
- **Simple distillation** (`sep-dist-*`): one apparatus: round flask of sea water on tripod and gauze over a Bunsen; thermometer bulb level with the side arm; sloping condenser with cold water in at the lower end (bottom) and out at the upper end (top); beaker under the end. Heat, gas and thermometer (100 °C), condenser, then collection are highlighted in turn.
- **Fractional distillation** (`sep-frac-*`): the same apparatus style with a bead-packed fractionating column; thermometer at the side arm reads 56 °C then 100 °C; fraction 1 (propanone, green) and fraction 2 (water, blue) in conical flasks. `sep-frac-data` is the boiling-point table with a 69 °C thermometer for C4-18.
- **Question** (`sep-question`): the simple apparatus with pointers 1 flask, 2 thermometer, 3 condenser, 4 collected water; water-flow words and the key are hidden in assessment view (arrows stay).

## States in full

### C4-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** You stir a spoonful of sugar into a cup of tea and it seems to disappear. What has happened to the sugar?
- 0 It has been destroyed · **1 It has dissolved and is still in the tea ✓** · 2 It has turned into water
- Hint: Does the tea taste sweet afterwards?
- Explanation: The tea still tastes sweet, so the sugar is still there. It has dissolved: it has broken into particles too small to see, spread all through the tea.

### C4-02 · teach "How does filtration work?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Dissolving | Some solids dissolve in water. | dissolves → soluble | You met solutions when you learned about mixtures. Stir sugar into water and the grains seem to vanish. The sugar has broken up into particles too small to see, spread all through the water. A solid that dissolves in a liquid is called soluble. | `sep-filter-soluble` |
| Not dissolving | Some solids do not dissolve. | does not dissolve → insoluble | Stir sand into water and the grains are still there. They make the water cloudy, then sink to the bottom. A solid that does not dissolve in a liquid is called insoluble. Sand, chalk and most rocks are insoluble in water. | `sep-filter-insoluble` |
| Paper and funnel | A paper cone in a funnel works like a very fine sieve. | filter paper cone → funnel → beaker | Fold a circle of filter paper into a cone and sit it in a funnel. Stand the funnel in a beaker. The paper is full of tiny holes, far too small to see. Separating an insoluble solid from a liquid like this is called filtration. | `sep-filter-setup` |
| The filtrate | The liquid passes through the paper. | liquid through the holes → filtrate | Pour the sandy water slowly into the paper cone. Keep the level below the top of the paper, or the mixture runs down the sides. The water is small enough to pass through the holes. The clear liquid that drips into the beaker is called the filtrate. | `sep-filter-filtrate` |
| The residue | The solid is left on the paper. | solid left on the paper → residue | The sand grains are much bigger than the holes in the paper. So they cannot get through, and they collect on the filter paper. The solid left behind on the paper is called the residue. | `sep-filter-residue` |
| Put it together | Filtration splits an insoluble solid from a liquid. | mixture → filtrate (liquid) + residue (solid) | Filtration works because the solid does not dissolve, so its grains are too big for the holes. The liquid passes through and becomes the filtrate. The solid stays on the paper as the residue. Filtration cannot remove a dissolved solid, because its particles pass through with the liquid. | `sep-filter-all` |

### C4-03 · choice · `understanding, guided, practice` · visual `sep-filter-question`
**Q:** Sandy water has been filtered. Look at the numbered parts. Which part is the residue?
- 0 Part 1 · 1 Part 2 · **2 Part 3 ✓**
- Hint: Which part could not get through the holes in the paper?
- Explanation: Part 1 is the filter paper and part 2 is the filtrate, the liquid that passed through. Part 3 is the sand left on the paper, so it is the residue.

### C4-04 · choice · `understanding, guided, practice`
**Q:** Which of these mixtures could you separate by filtration?
- **0 Chalk powder stirred into water ✓** · 1 Sugar dissolved in water · 2 Salt dissolved in water · 3 Blue ink mixed with water
- Hint: Which solid does not dissolve?
- Explanation: Sugar, salt and the dyes in ink dissolve, so their particles pass through the filter paper. Chalk is insoluble, so its grains stay on the paper as the residue.

### C4-05 · teach "How do you get a salt back?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| The solvent | A salt solution is salt dissolved in a liquid. | liquid the salt dissolves in → solvent | Filtration cannot get a dissolved salt back, because the salt passes through the paper. Salt water is a solution of salt dissolved in water. The liquid that a solid dissolves in is called the solvent. To get the salt back, you remove the solvent. | `sep-salt-solvent` |
| Evaporation | Heat the solution until only dry crystals are left. | heat → water evaporates → dry crystals | Pour the solution into an evaporating dish on a tripod and gauze. Heat it gently with a Bunsen burner. The water turns into a gas and escapes into the air, and crystals of salt form. Keep heating gently until only dry crystals are left. This is called evaporation. | `sep-salt-evaporate` |
| Quick, but not for every salt | Some salts break down when they get too hot. | salt breaks down when hot → use a gentler method | Evaporation is quick. But some salts break down into other substances if they get too hot. Heating these salts until dry would spoil them, so you use a gentler method instead. The dish, tripod and gauze stay hot for a long time, so let them cool before touching them. | `sep-salt-warning` |
| Crystallisation | Heat gently, then let crystals grow as it cools. | heat gently → stop when crystals start → cool | Heat the solution gently in an evaporating dish. Stop heating when some of the water has gone, or when crystals start to form at the edge. Leave the dish to cool, and more crystals grow in the solution. This is called crystallisation. | `sep-salt-crystallise` |
| Filter and dry | Filter the crystals out, then dry them. | filter → crystals on the paper → dry in a warm place | Some water is still left around the crystals. So filter the mixture, and the crystals stay on the filter paper. Then leave them somewhere warm to dry. Crystallisation also gives bigger, better-shaped crystals than evaporation. | `sep-salt-dry` |
| Put it together | Two ways to get a soluble salt back. | evaporation = quick; crystallisation = gentle, for salts that break down | Both methods remove the solvent and leave crystals of the salt. Evaporation heats until dry, so it is quick. Crystallisation stops early, then the crystals are cooled, filtered and dried. Use crystallisation when the salt breaks down on heating. Wear eye protection, because hot solution can spit. | `sep-salt-all` |

### C4-06 · choice · `understanding, guided, practice`
**Q:** A salt breaks down if it gets too hot. Which method should you use to get its crystals from a solution?
- 0 Evaporation until the dish is dry · **1 Crystallisation ✓** · 2 Filtration on its own
- Hint: Which method stops heating early?
- Explanation: Evaporation heats until dry, so the salt would get too hot. Filtration cannot remove a dissolved salt. Crystallisation only heats gently for a short time, so the salt does not break down.

### C4-07 · choice · `understanding, guided, practice`
**Q:** In crystallisation, what do you do once crystals start to form in the hot solution?
- 0 Keep heating until the dish is dry · 1 Add more water and stir · 2 Pour the hot solution away · **3 Stop heating and leave it to cool ✓**
- Hint: What makes more crystals grow?
- Explanation: Crystallisation stops heating once crystals start to form. So you leave the solution to cool, and more crystals grow. Then you filter and dry them.

### C4-08 · teach "How do you separate rock salt?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Rock salt | Rock salt is a mixture of salt and sand. | salt dissolves; sand does not | Rock salt is dug out of the ground and spread on icy roads in winter. It is a mixture of salt and sand. Salt is soluble in water, but sand is insoluble. You can use this difference to separate them. | `sep-rock-mix` |
| Grind and dissolve | Crush the lumps, then stir them into water. | grind → add water → stir | First, grind the rock salt with a pestle and mortar. Small pieces dissolve much faster than big lumps. Then stir it into water, and warm it a little to help the salt dissolve. The salt dissolves, but the sand does not. | `sep-rock-dissolve` |
| Filter off the sand | The sand is the residue; the salt water is the filtrate. | sand → residue; salt solution → filtrate | Next, filter the mixture. The sand grains are too big for the holes, so they are left on the paper as the residue. The salt is dissolved, so it passes through with the water. The filtrate is a salt solution. | `sep-rock-filter` |
| Get the salt back | Evaporate or crystallise the filtrate. | salt solution → evaporation or crystallisation → dry salt | Last, pour the filtrate into an evaporating dish. Use evaporation or crystallisation to remove the water. Dry crystals of salt are left behind. The sand is on the filter paper, so the two parts of the mixture are now apart. | `sep-rock-dry` |
| Put it together | Grind, dissolve, filter, evaporate. | grind → dissolve → filter → evaporate | Each step uses a difference between salt and sand: one dissolves, the other does not. No new substances are made, so this is a physical way of separating a mixture. The salt you end up with is much purer than the rock salt you started with. | `sep-rock-all` |

### C4-09 · choice · `understanding, guided, practice`
**Q:** Ground rock salt is stirred into water, then filtered. What is left on the filter paper?
- **0 Sand ✓** · 1 Salt crystals · 2 Salt solution · 3 Nothing, because everything passes through
- Hint: Which part of rock salt does not dissolve?
- Explanation: Salt dissolves, so it passes through the paper in the filtrate. Sand is insoluble, so its grains are left on the paper as the residue.

### C4-10 · choice · `understanding, guided, practice`
**Q:** Why do you stir rock salt into water before you filter it?
- 0 To wash the sand away · 1 To make the sand dissolve · **2 To dissolve the salt so it can pass through the paper ✓**
- Hint: Which part needs to get through the filter paper?
- Explanation: Dry salt crystals cannot pass through filter paper, and sand does not dissolve. So water is added to dissolve the salt. It passes through, while the sand stays behind.

### C4-11 · teach "How does simple distillation work?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Keeping the liquid | Distillation collects the liquid instead of losing it. | boil → gas → cool → liquid | Evaporation lets the water escape into the air. But sometimes the liquid is the part you want, like pure water from sea water. You can boil the liquid, then cool the gas so it turns back into a liquid. This is called distillation. | `sep-dist-heat` |
| Boiling off the water | The part with the lowest boiling point turns into a gas first. | lowest boiling point → evaporates first | Heat sea water in a flask. Water boils at 100 °C, but salt needs a far higher temperature. So only the water turns into a gas and rises up the flask. The thermometer bulb sits level with the side arm, so it reads the temperature of the gas. | `sep-dist-boil` |
| The condenser | A cold tube turns the gas back into a liquid. | gas cools → condenses → liquid | The gas passes along a tube surrounded by a jacket of cold water. It cools and turns back into a liquid: it condenses. This cold tube is called a condenser. Cold water goes in at the bottom and out at the top, so the jacket stays full. | `sep-dist-condense` |
| Collecting the water | Pure water drips out; the salt stays in the flask. | liquid drips out → collected; salt left behind | The liquid runs down the condenser and drips into a beaker. It is pure water, with no salt in it. The salt is left behind in the flask. The whole method is called simple distillation. | `sep-dist-collect` |
| Put it together | Heat, boil, condense, collect. | heat → gas → condenser → pure liquid | Simple distillation separates a liquid from a solution. The liquid boils, travels into the condenser as a gas, and is cooled back into a liquid. It works because water and salt have very different boiling points. It cannot separate liquids with similar boiling points, because both boil off together. | `sep-dist-all` |

### C4-12 · choice · `understanding, guided, practice`
**Q:** In simple distillation, what happens to the gas inside the condenser?
- 0 It is heated until it boils · **1 It cools and turns back into a liquid ✓** · 2 It turns into salt crystals · 3 It escapes into the air
- Hint: What does the cold water around the tube do?
- Explanation: The condenser is surrounded by cold water. So the gas cools and condenses back into a liquid, which drips out and is collected.

### C4-13 · choice · `understanding, guided, practice`
**Q:** You use simple distillation to get pure water from salty water. Where is the salt at the end?
- **0 Left behind in the flask ✓** · 1 In the beaker with the water · 2 Inside the condenser · 3 In the cold water flowing out
- Hint: Which part of salty water has the lower boiling point?
- Explanation: Only the water boils at 100 °C and travels into the condenser. The salt does not boil, so it is left behind in the flask.

### C4-14 · teach "How does fractional distillation work?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A mixture of liquids | Two liquids that mix completely can still be separated. | mixture of liquids → fractionating column | Propanone is a liquid used in some nail-varnish removers. It mixes completely with water. Propanone boils at 56 °C and water boils at 100 °C. To separate them, you fit a tall glass tube packed with glass beads on top of the flask. This is called a fractionating column. | `sep-frac-column` |
| Lowest boiling point first | The liquid with the lowest boiling point reaches the top first. | lowest boiling point → evaporates first → top of the column | Heat the flask gently. Propanone has the lower boiling point, so it evaporates first. The column is hottest at the bottom and cooler at the top. When the thermometer at the top reads 56 °C, propanone gas is passing into the condenser. | `sep-frac-first` |
| Fractions | Each liquid is collected on its own. | one liquid at a time → a fraction | The propanone gas condenses and drips into a flask. When it stops dripping, you swap to a new flask. Each liquid collected separately like this is called a fraction. | `sep-frac-fraction` |
| Raising the temperature | Heat more strongly to collect the next liquid. | raise the temperature → next boiling point → next fraction | Now heat the flask more strongly. The temperature at the top rises until it reaches 100 °C. Then water gas reaches the top, condenses, and is collected as the second fraction. With more liquids, you keep raising the temperature, one boiling point at a time. | `sep-frac-next` |
| Put it together | Fractional distillation separates liquids by their boiling points. | lowest boiling point first, then raise the temperature | This method is called fractional distillation. It separates a mixture of liquids with different boiling points. The liquid with the lowest boiling point is collected first. The column lets it work even when the boiling points are fairly close. The same idea is used to separate crude oil. | `sep-frac-all` |

### C4-15 · choice · `understanding, guided, practice`
**Q:** Propanone boils at 56 °C and water boils at 100 °C. Why does propanone reach the top of the column first?
- 0 It is heavier than water · 1 It sits on top, so it is heated first · **2 It has a lower boiling point, so it evaporates first ✓** · 3 It has a higher boiling point
- Hint: Compare 56 °C with 100 °C.
- Explanation: Propanone boils at 56 °C and water boils at 100 °C. So propanone evaporates at a lower temperature and reaches the top of the column first.

### C4-16 · choice · `understanding, guided, practice`
**Q:** Two liquids boil at 80 °C and 84 °C. Which method should you use to separate them?
- 0 Filtration · 1 Simple distillation · 2 Crystallisation · **3 Fractional distillation ✓**
- Hint: Are the boiling points far apart or close together?
- Explanation: Simple distillation cannot separate liquids with similar boiling points, because both boil off together. So you need fractional distillation, which uses a fractionating column.

### C4-17 · choice · `understanding, independent, independent` · visual `sep-question`
**Q:** Look at the numbered parts of this distillation apparatus. Which part turns the gas back into a liquid?
- 0 Part 1 · 1 Part 2 · **2 Part 3 ✓** · 3 Part 4
- Hint: Which part has cold water flowing around it?
- Explanation: Part 1 is the flask, part 2 is the thermometer and part 4 is the collected liquid. Part 3 is the condenser. Its cold water cools the gas, so it condenses back into a liquid.

### C4-18 · choice · `application, independent, independent` · visual `sep-frac-data`
**Q:** Pentane, hexane and heptane are separated by fractional distillation. The thermometer at the top reads 69 °C. Which liquid is being collected?
- 0 Pentane · **1 Hexane ✓** · 2 Heptane · 3 All three together
- Hint: Which liquid boils at the temperature on the thermometer?
- Explanation: The liquid reaching the top is the one whose boiling point matches the thermometer reading. Hexane boils at 69 °C, so hexane is being collected. Pentane (36 °C) has already come off.

### C4-19 · choice · `application, independent, independent`
**Q:** A student filters dry rock salt, then adds water, then evaporates the filtrate. What is wrong with this plan?
- **0 Water must be added before filtering, to dissolve the salt ✓** · 1 The sand should be evaporated, not filtered · 2 Rock salt should never be ground up · 3 Evaporating the filtrate will remove the sand
- Hint: What must happen to the salt before it can pass through filter paper?
- Explanation: Dry salt crystals cannot pass through filter paper, so nothing would separate. So the salt must be dissolved in water first. Then filtering leaves the sand behind.

### C4-20 · written · teacher-reviewed
**Q:** A ship’s crew needs drinking water, but they only have sea water. Explain how simple distillation could give them pure water.
- Hint: Follow the water: heat, gas, condenser, collect. Then say where the salt ends up.
- Model answer: Heat the sea water in a flask. Water has a much lower boiling point than salt, so the water boils at 100 °C and turns into a gas, but the salt does not. The gas passes into a condenser, where cold water cools it so it condenses back into liquid water. The pure water drips out and is collected. The salt is left behind in the flask.
- Rubric (4): Heat the sea water in a flask so the water boils. / Only the water turns into a gas, because it has a much lower boiling point than salt. / The gas passes into a condenser, where cold water cools it so it condenses back into a liquid. / The pure water is collected in a beaker, and the salt is left behind in the flask.
- Reject: Saying the salt evaporates or is collected with the water. / Saying filtration can remove the dissolved salt. / Saying the condenser heats the gas.

