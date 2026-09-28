# Lesson 57 storyboard — Global warming, deforestation and land use

Chapter B7, Ecology (part 2). Folder `lesson-52`, id `B-ECO-052-B`, skill `B-LAND-AND-CLIMATE`.

Big idea: greenhouse gases keep the Earth warm, but rising carbon dioxide and methane are heating it up, with effects on seas and species; the way humans use land, especially destroying peat bogs and forests, adds carbon dioxide to the air and reduces biodiversity.

Flow note: the lesson answers four questions in the order each needs the one before.
1. **What keeps the Earth warm?** One picture of the Sun, the atmosphere and the Earth, built up frame by frame: energy in, energy out, some trapped by greenhouse gases, more gas traps more, the Earth heats up. Global warming has to be understood before its effects, or the reasons why land use and deforestation matter.
2. **What could global warming do?** Four small panels in one drawing, one effect at a time (sea level, distribution, extinction, migration), then all four together. Kept factual and calm: "could", "may", and scientists are still working out the size of each effect.
3. **How do humans use land?** One landscape (building, quarrying, farming, dumping waste, a small patch left for other species), then a peat bog in cross-section, intact and drained. The bog uses decay and respiration from the carbon cycle lesson, so it follows the general land-use idea.
4. **Why is cutting down forests a problem?** One forest scene: why forests are cleared (farming, biofuels), then less carbon dioxide taken in, more released by burning and decay, fewer species, and the link back to global warming. It comes last because it pulls together photosynthesis, decay, biodiversity and global warming.

Sections:
1. Start here (B52-01): which process trees use to take carbon dioxide out of the air (photosynthesis, from the carbon cycle lesson).
2. What keeps the Earth warm? (B52-02–04): energy from the Sun and the atmosphere → greenhouse gases trap energy → carbon dioxide and methane rising → global warming. Checks: why the Earth would be cold without greenhouse gases; which two gases are increasing.
3. What could global warming do? (B52-05–07): rising sea level and low-lying land → distribution → extinction and biodiversity → migration → put together. Checks: why low-lying land floods; a cool-loving mountain plant losing area.
4. How do humans use land? (B52-08–10): building and quarrying → farming and waste → less land for other species → peat bogs store carbon → draining and burning bogs releases carbon dioxide and removes a habitat. Checks: a housing estate on a meadow; why a drained bog adds carbon dioxide.
5. Why is cutting down forests a problem? (B52-11–13): deforestation for farming → biofuels → less carbon dioxide taken in and less carbon locked up → burning and decay release carbon dioxide → fewer species → put together. Checks: a reason for deforestation; a numbered forest diagram (which arrow is decay).
6. On your own (B52-14–17): a seaside town on low-lying land (new scenario); the greenhouse diagram with numbered arrows in assessment view; an invented bird survey read without over-claiming; a teacher-reviewed written answer on how deforestation adds to global warming.

Wording rules: one new term per frame, plain meaning first; the carbon cycle, pollution and extinction are referred to by topic in one clause; British spelling; global warming is described factually and calmly, with no alarmist language. No calculations: the pages set none.

Out of scope: the physics of the greenhouse effect (wavelengths, absorption and re-emission); other greenhouse gases such as water vapour; sources of methane; ways of reducing global warming or protecting biodiversity (a later page); the carbon footprint and chemistry of the atmosphere (chemistry topics); the book's cartoons, characters and exam questions.

Source boundary: supplied revision-guide pages 88–89 (scope only); AQA 8464 sections 4.7.3.3, 4.7.3.4 and 4.7.3.5. The Earth and atmosphere picture, the four effect panels, the landscape, the bog cross-sections, the forest scene, the seaside town and bird-survey data, all questions and all wording are original. Draft pending teacher review.

Judgement calls for the teacher: peat bogs are included because they are on page 89 and in spec point 4.7.3.3, although the lesson brief did not list them. "Most scientists agree that human activity has caused most of the recent warming" is stated once, as on the page. The bog frame explains that microorganisms cannot fully break down plants in wet, acidic conditions; the page only says the plants do not fully decay.

## Diagram plan
- `components/EarthVisuals.tsx`, focus prefix `earth-`. Colours: yellow = energy from the Sun, orange = energy given off by the Earth, purple = carbon dioxide (and the greenhouse gas dots), blue = water, green = plants, olive = microorganisms, brown = soil and peat.
- **Greenhouse** (`earth-green-*`): the Sun, a thin atmosphere and a curved Earth. Frame 1 highlights energy arriving (1) and some escaping (2); frame 2 adds purple gas dots and a trapped arrow (3); frame 3 adds more gas and a second trapped arrow, with a thinner escaping arrow; frame 4 turns the Earth warm-coloured ("the Earth heats up"). `earth-green-question` shows arrows 1–3 with no key or gas label (B52-15).
- **Effects** (`earth-effect-*`): four panels, each highlighted in turn: a house on low-lying land with the sea level raised; a mountain where the warm-loving zone moves uphill and the cool-loving zone shrinks; three species with one crossed out; a bird's migration arrow, before and now.
- **Land use** (`earth-land-*`): houses, a quarry, a field and barn, a landfill site, and a small patch of trees (dashed outline in the last frame: less land for other species).
- **Peat bog** (`earth-bog-*`): cross-section with living bog plants, waterlogged peat in layers and "carbon stored"; then the same bog drained by a ditch, with compost sacks, a flame and microorganisms sending carbon dioxide up.
- **Forest** (`earth-forest-*`): carbon dioxide in the air at the top; standing forest with animals; stumps, logs with microorganisms and a fire; a cow, crops and a fuel can. Arrows: photosynthesis down into the trees (a crossed-out arrow over the cleared land), burning and decay up. `earth-forest-question` renumbers only the three arrows (burning 1, decay 2, photosynthesis 3) with no key (B52-13).
- **Bird survey** (`earth-bird-data`): invented bar chart, kinds of bird in three areas of one forest.

## States in full

### B52-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Trees take carbon dioxide out of the air. Which process do they use to do this?
- 0 Respiration · **1 Photosynthesis ✓** · 2 Decay · 3 Burning
- Hint: Which process makes glucose in the leaves?
- Explanation: Respiration, decay and burning all put carbon dioxide into the air. Plants take it out of the air by photosynthesis. You met this in the carbon cycle.

### B52-02 · teach "What keeps the Earth warm?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Energy from the Sun | The Sun warms the Earth, and the Earth gives off energy. | Sun → Earth → back towards space | Energy from the Sun reaches the Earth and warms its surface. The warm Earth then gives off energy back towards space. The Earth is wrapped in a layer of gases. This layer is called the atmosphere. | `earth-green-sun` |
| Trapped by gases | Some gases stop energy escaping into space. | energy trapped → Earth stays warm | Some gases in the atmosphere trap energy, so not all of it is lost into space. This keeps the Earth warm. Gases that do this are called greenhouse gases. Without them, the Earth would be very cold. | `earth-green-trap` |
| More greenhouse gases | Levels of carbon dioxide and methane are rising. | more gas → more energy trapped | Carbon dioxide is a greenhouse gas. Another one is a gas called methane. The levels of both gases in the atmosphere are increasing. Burning fossil fuels is one cause, as you saw in the carbon cycle. More of these gases trap more energy. | `earth-green-more` |
| Global warming | The Earth is getting warmer. | rising gas levels → Earth heats up | Because more energy is trapped, the Earth is heating up. This is called global warming. Most scientists agree that human activity has caused most of the recent warming. They are still working out exactly what the effects will be. | `earth-green-warming` |

### B52-03 · choice · `understanding, practice`
**Q:** Why would the Earth be very cold without greenhouse gases?
- **0 Much more of the energy would be lost into space ✓** · 1 No energy from the Sun would reach the Earth · 2 The Earth would move further from the Sun
- Hint: What do greenhouse gases do to energy leaving the Earth?
- Explanation: Greenhouse gases trap energy, so not all of it escapes into space. Without them, much more energy would be lost into space, so the Earth would be very cold.

### B52-04 · choice · `understanding, practice`
**Q:** Which two greenhouse gases are increasing in the atmosphere?
- 0 Oxygen and nitrogen · **1 Carbon dioxide and methane ✓** · 2 Oxygen and hydrogen
- Hint: Which gas is released when fossil fuels burn?
- Explanation: Oxygen, nitrogen and hydrogen are not the gases causing global warming. Carbon dioxide and methane are greenhouse gases, and the levels of both are increasing.

### B52-05 · teach "What could global warming do?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Rising seas | Sea levels rise, so low land floods more often. | warmer → ice melts, seawater expands → sea rises | Higher temperatures make ice melt and make seawater expand. So the sea level rises. Land that is only just above the sea is called low-lying land. It floods more often as the sea rises, so habitats and homes there could be lost. | `earth-effect-sea` |
| Species on the move | Some species spread, and others have less room. | warmer → warm-lovers spread, cool-lovers squeezed | Global warming is changing the temperature and rainfall in some areas. Species that do well in warm conditions can spread into new areas. Species that need cooler conditions are left with a smaller area. Where a species is found is called its distribution. | `earth-effect-spread` |
| Some species lost | Some species may not survive, so biodiversity falls. | cannot cope → extinct → less biodiversity | Some species may not be able to survive the change in climate. They could die out completely. This is called extinction. Each species lost reduces biodiversity. | `earth-effect-extinct` |
| Changing journeys | Some animals are changing where they migrate. | warmer north → birds fly further north | Some animals travel to different places at different times of year. This is called migration. As areas further north get warmer, some birds may now migrate further north than before. | `earth-effect-migrate` |
| Put it together | Global warming could have several serious effects. | flooding, spreading, extinction, migration | So global warming could cause flooding, change where species live, reduce biodiversity and change migration patterns. Scientists are still working out how large each effect will be. | `earth-effect-all` |

### B52-06 · choice · `understanding, practice`
**Q:** Why could global warming make low-lying land flood more often?
- 0 The land sinks as it warms up · 1 Rain only falls on mountains · **2 Ice melts and seawater expands, so the sea level rises ✓**
- Hint: What happens to ice and seawater when it gets warmer?
- Explanation: Higher temperatures melt ice and make seawater expand. So the sea level rises, and low-lying land floods more often.

### B52-07 · choice · `understanding, practice`
**Q:** A plant only grows in cool conditions near a mountain top. The mountain warms up. What most likely happens to its area?
- **0 Its area gets smaller ✓** · 1 Its area gets bigger · 2 It spreads down the mountain
- Hint: Where on the mountain will it still be cool enough?
- Explanation: As the mountain warms, only the highest parts stay cool enough for the plant. So it is left with a smaller area to live in. Its distribution changes.

### B52-08 · teach "How do humans use land?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Building and quarrying | People build on land and dig rock out of it. | houses and roads, rock to build with | Humans use land to build houses, roads and factories. They also dig rock out of the ground to build with. Digging rock out like this is called quarrying. | `earth-land-build` |
| Farming and waste | Land is also used for farms and for dumping waste. | fields for food, holes for rubbish | Large areas of land are used for farming, to grow crops and keep animals. Land is also used for dumping waste in landfill sites. You met landfill when you learned about pollution. | `earth-land-farm` |
| Less land for other species | Each use leaves less land for other organisms. | more land for us → less for other species | Every time people use land like this, there is less land left for other organisms. Some uses also harm the environment, for example by causing pollution. So biodiversity can fall. | `earth-land-less` |
| Peat bogs | In a bog, dead plants build up to form peat. | wet, acidic → plants only partly rot → peat | Some land is bog, which is wet and acidic. When bog plants die, microorganisms cannot break them down fully there. The partly rotted plants build up over many years. This is called peat, and the carbon from the plants is stored in it. | `earth-bog-store` |
| Draining bogs | Destroying bogs releases carbon dioxide and harms wildlife. | drained or burnt peat → carbon dioxide | Bogs are drained so peat can be dug up and sold as garden compost or as fuel. Then microorganisms can break the peat down, and they release carbon dioxide as they respire. Burning peat releases carbon dioxide too. Destroying a bog also removes a habitat, so biodiversity falls. | `earth-bog-drain` |

### B52-09 · choice · `understanding, practice`
**Q:** A meadow is covered with a new housing estate. Why does this reduce biodiversity there?
- 0 The houses take in carbon dioxide · 1 More food grows on the land · **2 There is less land left for other organisms to live on ✓**
- Hint: Where do the meadow’s plants and animals live now?
- Explanation: Building takes the land that the meadow’s plants and animals lived on. So there is less land left for other organisms, and biodiversity falls.

### B52-10 · choice · `understanding, practice`
**Q:** Why does draining a peat bog add carbon dioxide to the air?
- **0 Microorganisms can now break down the peat, and they respire ✓** · 1 The peat starts to photosynthesise · 2 The water in the bog turns into carbon dioxide
- Hint: What stopped the dead plants rotting in the wet bog?
- Explanation: In a wet, acidic bog, microorganisms cannot break down dead plants fully. Once it is drained, they break down the peat and release carbon dioxide as they respire.

### B52-11 · teach "Why is cutting down forests a problem?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Clearing forests | Forests are cut down to make space for farms. | trees cut → land for cattle and crops | Cutting down forests is called deforestation. Often the land is cleared for farming, such as keeping cattle or growing rice, to provide more food. It often happens on a large scale in tropical rainforests. | `earth-forest-clear` |
| Crops for fuel | Some land is cleared to grow crops for fuel. | crops → fuel | Forests are also cleared to grow crops that are made into fuel. Fuels made from crops like this are called biofuels. | `earth-forest-fuel` |
| Less carbon dioxide taken in | Fewer trees take in less carbon dioxide. | fewer trees → less photosynthesis | Trees take in carbon dioxide from the air for photosynthesis. Some of the carbon is locked up in their wood for many years. So when trees are cut down, less carbon dioxide is removed from the air, and less carbon is locked up. | `earth-forest-less` |
| More carbon dioxide released | Burning and decay release carbon dioxide. | burning and decay → carbon dioxide in the air | Trees are often burnt to clear the land, and this releases carbon dioxide. Microorganisms also feed on the dead wood that is left behind. They release carbon dioxide as they respire, just as in the carbon cycle. | `earth-forest-release` |
| Fewer species | Forests have high biodiversity, so a lot can be lost. | forest gone → habitats gone → species lost | Forests are home to many species of plants and animals, so they have high biodiversity. When a forest is destroyed, those species lose the place where they live. Some may become extinct, so biodiversity falls. | `earth-forest-species` |
| Put it together | Deforestation adds carbon dioxide to the air and reduces biodiversity. | less taken in + more released → more global warming | After deforestation, less carbon dioxide is taken in and more is released. So the level of carbon dioxide in the air rises, and this adds to global warming. Deforestation also reduces biodiversity. | `earth-forest-all` |

### B52-12 · choice · `understanding, practice`
**Q:** Give one reason why tropical rainforests are cut down.
- 0 To make the air cleaner · **1 To clear land for farming, such as growing rice ✓** · 2 To increase biodiversity
- Hint: What is the cleared land used for?
- Explanation: Cutting down forests does not clean the air or increase biodiversity. Forests are cleared for farming, such as cattle or rice, and to grow crops for biofuels.

### B52-13 · choice · `understanding, practice` · question diagram `earth-forest-question` (assessment view)
**Q:** Look at the numbered arrows. Which one shows carbon dioxide released by microorganisms feeding on dead wood?
- 0 Arrow 1 · **1 Arrow 2 ✓** · 2 Arrow 3
- Hint: Find the arrow that starts at the fallen logs.
- Explanation: Arrow 1 rises from the fire, and arrow 3 carries carbon dioxide down into the trees. Arrow 2 rises from the microorganisms on the logs, which release carbon dioxide as they respire.

### B52-14 · choice · `application, independent`
**Q:** A town is built on flat land just above the sea. Why could global warming be a problem for it?
- **0 Rising sea levels could flood the town more often ✓** · 1 The sea could freeze over more often · 2 The town would have fewer greenhouse gases
- Hint: What is happening to the sea level?
- Explanation: Global warming melts ice and makes seawater expand, so the sea level rises. The town is on low-lying land, so it is likely to flood more often.

### B52-15 · choice · `understanding, independent` · question diagram `earth-green-question` (assessment view)
**Q:** Look at the numbered arrows. Which one shows energy that gases in the atmosphere stop from escaping into space?
- 0 Arrow 1 · 1 Arrow 2 · **2 Arrow 3 ✓**
- Hint: Which arrow from the Earth does not reach space?
- Explanation: Arrow 1 is energy arriving from the Sun, and arrow 2 escapes into space. Arrow 3 is turned back by gases in the atmosphere, so this energy is trapped and keeps the Earth warm.

### B52-16 · choice · `dataInterpretation, independent` · question diagram `earth-bird-data` (assessment view)
**Q:** Students counted the kinds of bird in three areas of one forest. Which conclusion fits their results?
- 0 Cutting down forests makes every bird species extinct · 1 Every farm has 8 kinds of bird · 2 The cleared area had the most kinds of bird · **3 In this survey, fewer kinds of bird were found where more forest was cleared ✓**
- Hint: What do these three counts show, and no more?
- Explanation: They found 42 kinds in untouched forest, 25 where it was partly cleared and 8 where it was cleared for farming. One survey cannot show what happens in every forest, and some birds were still found. In this survey, fewer kinds were found where more forest was cleared.

### B52-17 · written · `explanation, independent` · teacher-reviewed
**Q:** Explain how cutting down and burning a large area of rainforest can add to global warming.
- Hint: Think about photosynthesis, burning, decay, and what carbon dioxide does in the atmosphere.
- Model answer: Trees take in carbon dioxide for photosynthesis, so with fewer trees less carbon dioxide is removed from the air, and less carbon is locked up in wood. Burning the trees releases carbon dioxide. Microorganisms feeding on the dead wood release carbon dioxide as they respire. So the level of carbon dioxide in the atmosphere rises. Carbon dioxide is a greenhouse gas, so more energy is trapped and the Earth heats up.
- Rubric (5 points): (Fewer trees means less carbon dioxide is taken in for photosynthesis.) (Less carbon is locked up in wood.) (Burning the trees releases carbon dioxide.) (Microorganisms decaying the dead wood release carbon dioxide as they respire.) (Carbon dioxide is a greenhouse gas, so more energy is trapped and the Earth warms.)
- Reject: Saying trees give out carbon dioxide by photosynthesis. Saying cutting down trees makes a hole in the atmosphere that lets heat in. Saying global warming is caused by oxygen.
