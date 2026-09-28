# Lesson 56 storyboard — Biodiversity and waste

Chapter B7, Ecology (part 2). Folder `lesson-51`, id `B-ECO-051-B`, skill `B-BIODIVERSITY`.

Big idea: an ecosystem with many different species is more stable, and humans depend on that; but more people, each wanting more, use more resources and make more waste, and pollution and lost land reduce biodiversity.

Flow note: the lesson answers three questions in the order each needs the one before.
1. **What is biodiversity, and why does it matter?** One small wood with nine species, then its food web, then the conditions species keep right for each other, then what happens when one species is lost. "Stable" has to be understood before "falling biodiversity" can sound like a problem.
2. **Why is it falling?** A growing town: more people, a higher standard of living, more raw materials and energy, less room for other species. It ends with why humans need biodiversity and that action to protect it is recent.
3. **Where does the waste go?** The same idea carried on: more things made means more waste. Pollution is taught place by place (water, land, air) in one landscape, then linked back to biodiversity: pollution kills plants and animals.

Sections:
1. Start here (B51-01): a thrush, caterpillars and an oak tree depending on each other (interdependence, from the communities lesson).
2. What is biodiversity? (B51-02–04): variety of species → depending on each other → keeping conditions right → a stable ecosystem. Checks: the meaning of biodiversity; why high biodiversity gives stability.
3. Why is biodiversity falling? (B51-05–07): more people and resources → higher standard of living → resources used faster than replaced → human activities reduce biodiversity; humans depend on it; action is recent. Checks: why a higher standard of living uses more resources; why humans need biodiversity.
4. Where does pollution go? (B51-08–10): more waste and toxic chemicals → water (sewage, fertiliser, toxic chemicals) → land (landfill, pesticides and herbicides) → air (smoke, acidic gases) → pollution kills plants and animals. Checks: a numbered landscape (which place pollutes the air); fertiliser washed into a river.
5. On your own (B51-11–14): two ponds with different biodiversity (new scenario); an invented river survey read without over-claiming; a growing town; a teacher-reviewed written answer linking population to falling biodiversity.

Wording rules: one new term per frame, plain meaning first; interdependence and decay are referred to by topic; British spelling; factual and neutral. No calculations: the pages set none.

Out of scope: ways of protecting biodiversity (breeding programmes, hedgerows, recycling and so on, a later page); global warming, deforestation and peat bogs (the next lesson); acid rain chemistry; eutrophication; the book's cartoons and exam questions.

Source boundary: supplied revision-guide page 87 (scope only); AQA 8464 sections 4.7.3.1 and 4.7.3.2. The wood and its food web, the town, the landscape, the pond and river-survey data, all questions and all wording are original. Draft pending teacher review.

## Diagram plan
- `components/EarthVisuals.tsx`, focus prefix `earth-`.
- **Food web in a small wood** (`earth-bio-*`): nine species icons in circles (grass, flowers, oak, rabbit, mouse, caterpillar, fox, owl, thrush). Frame 1 shows only the species; frame 2 adds arrows (arrow points to the eater) and highlights the fox's two food sources; frame 3 adds the soil with microorganisms and marks the oak as shelter; frame 4 crosses out the rabbit and highlights mouse → fox.
- **A growing town** (`earth-people-*`): houses and people, a car and a laptop, a power station and a quarry, and a small wood at the edge, with a numbered key.
- **Pollution landscape** (`earth-pollution-*`): a factory with chimney smoke and a waste pipe, a sprayed field, a house with a sewage pipe, a river with fish, and a landfill site. The key is coloured by place (blue water, brown land, grey air); in the last frame the fish are dead. `earth-pollution-question` renumbers the sources 1–4 with no key (B51-09).
- **River survey chart** (`earth-survey-data`): invented bar chart, kinds of animal found at three places.

## States in full

### B51-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** A thrush eats caterpillars from an oak tree and nests in it. What is it called when species rely on each other?
- **0 Interdependence ✓** · 1 Photosynthesis · 2 Evaporation · 3 Decay
- Hint: You met this idea when you learned about communities.
- Explanation: The thrush needs the tree and the caterpillars, and the caterpillars need the tree. Species in a community relying on each other is called interdependence.

### B51-02 · teach "What is biodiversity?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Many kinds of living thing | Biodiversity is the variety of species. | more species → higher biodiversity | This small wood has nine different species living in it. The variety of different species on Earth, or in one ecosystem, is called biodiversity. An ecosystem with many species has high biodiversity. | `earth-bio-variety` |
| Depending on each other | Species depend on each other for food and shelter. | many species → many links | Species in an ecosystem depend on each other for things like food and shelter. When there are lots of species, each one has many others to depend on, not just a few. The fox eats both rabbits and mice. | `earth-bio-links` |
| Keeping conditions right | Species help keep the conditions right for each other. | living things help their surroundings | Different species also help keep the conditions in their environment right for each other. The oak tree gives shelter to other species. Microorganisms in the soil recycle mineral ions, which keeps the soil right for plants. | `earth-bio-conditions` |
| A stable ecosystem | High biodiversity helps an ecosystem stay stable. | one species lost → the others carry on | Suppose the rabbits disappear from the wood. The fox can still eat mice, so it survives. Because each species has many others to depend on, the ecosystem does not change much. We say it is stable. | `earth-bio-stable` |

### B51-03 · choice · `understanding, guided`
**Q:** What is biodiversity?
- 0 The number of individuals of one species · **1 The variety of different species on Earth or in an ecosystem ✓** · 2 The amount of food in an ecosystem
- Hint: Think about how many different kinds of living thing there are.
- Explanation: Biodiversity is about how many different species there are, not how many of one kind. It is the variety of different species on Earth or in an ecosystem.

### B51-04 · choice · `understanding, guided`
**Q:** Why is an ecosystem with high biodiversity more stable?
- **0 Each species has many others to depend on, not just a few ✓** · 1 Every animal eats only one kind of food · 2 There are no predators in it
- Hint: Think about the fox when the rabbits disappeared.
- Explanation: With many species, each one has several sources of food and shelter. So if one species is lost, the others can still survive, and the ecosystem stays stable.

### B51-05 · teach "Why is biodiversity falling?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| More people | The number of people in the world is growing quickly. | more people → more needs | The number of people in the world is increasing quickly. More people need more food, water, materials and energy to survive. The things people use like this are called resources. | `earth-people-more` |
| Wanting more | Many people also want more things. | more things each → even more resources | Many people also want things that make life more comfortable, such as cars and computers. This is called a higher standard of living. So each person uses more resources too. | `earth-people-living` |
| Used up faster | Resources are used faster than they are replaced. | used quickly, replaced slowly | Making things takes raw materials, such as rock from quarries, and energy from power stations. We are now using many resources more quickly than they are being replaced. | `earth-people-resources` |
| Less room for other species | Many human activities reduce biodiversity. | more for us → less for other species | Many human activities reduce biodiversity, for example by taking the land that other species live on. But humans depend on a good level of biodiversity to survive. People have only recently started taking action to stop biodiversity falling. | `earth-people-biodiversity` |

### B51-06 · choice · `understanding, guided`
**Q:** Why does a higher standard of living mean more resources are used?
- 0 People need less food · 1 Fewer things are made · **2 Each person wants more things, and making them uses raw materials and energy ✓**
- Hint: What does a higher standard of living mean people want?
- Explanation: A higher standard of living means people want more things, such as cars and computers. Making those things uses more raw materials and energy.

### B51-07 · choice · `understanding, guided`
**Q:** Why is it important for humans to keep a good level of biodiversity?
- 0 It makes the human population grow faster · 1 It stops all pollution · 2 It makes the weather warmer · **3 Humans depend on other species to survive ✓**
- Hint: What do humans get from other living things?
- Explanation: Humans rely on other species, for example for food. So humans depend on a good level of biodiversity to survive.

### B51-08 · teach "Where does pollution go?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| More waste | Making and using more things makes more waste. | more things made → more waste | As more things are made and used, more waste is produced. Some waste contains toxic chemicals, which are poisonous. If waste is not handled properly, it harms the environment. This is called pollution. | `earth-pollution-waste` |
| In water | Sewage, fertiliser and toxic chemicals can pollute water. | rivers, lakes and seas | Sewage is waste water from toilets and drains. Sewage and toxic chemicals from industry can pollute lakes, rivers and seas. Rain can also wash fertilisers from fields into the water. This harms the plants and animals that rely on that water. | `earth-pollution-water` |
| On land | Landfill and toxic chemicals can pollute land. | buried rubbish and farm sprays | Lots of household waste is dumped in big holes in the ground, called landfill sites. Toxic chemicals used on farms can also pollute the land. These include pesticides, which kill insects, and herbicides, which kill weeds. | `earth-pollution-land` |
| In the air | Smoke and acidic gases can pollute the air. | chimneys → air | Factory chimneys can release smoke and acidic gases into the air. This is air pollution. | `earth-pollution-air` |
| Biodiversity falls | Pollution kills plants and animals. | pollution → fewer species | Pollution in water, on land or in the air can kill plants and animals, such as the fish in a polluted river. When species are lost from an area, its biodiversity is reduced. | `earth-pollution-all` |

### B51-09 · choice · `understanding, guided` · question diagram `earth-pollution-question` (assessment view hides the names)
**Q:** Look at the numbered places. Which one shows a source of air pollution?
- 0 Place 1 · **1 Place 2 ✓** · 2 Place 3 · 3 Place 4
- Hint: Air pollution rises into the air.
- Explanation: Places 1, 3 and 4 show pipes, a landfill site and a sprayer, which pollute water and land. Place 2 is smoke from the factory chimney, which pollutes the air.

### B51-10 · choice · `understanding, guided`
**Q:** Rain washes fertiliser from a field into a river. What kind of pollution is this?
- 0 Air pollution · 1 Land pollution · **2 Water pollution ✓**
- Hint: Where does the fertiliser end up?
- Explanation: The fertiliser is carried off the field by rain. It ends up in the river, so this is water pollution.

### B51-11 · choice · `application, independent`
**Q:** Pond A has 4 species; Pond B has 30. One insect species dies in each. Which is more likely to stay stable?
- 0 Pond A, because it has fewer species to feed · **1 Pond B, because each species has more others to depend on ✓** · 2 Both ponds change by the same amount
- Hint: Which pond has higher biodiversity?
- Explanation: Pond B has higher biodiversity, so animals that ate the insect have other food. So Pond B is more likely to stay stable.

### B51-12 · choice · `dataInterpretation, independent` · question diagram `earth-survey-data` (assessment view hides the names)
**Q:** A pipe leaks sewage into a river. Students counted the kinds of small animal at three places. Which conclusion fits their results?
- 0 Sewage kills every animal in the river · 1 The same number of kinds was found at every place · 2 All rivers with pipes have low biodiversity · **3 In this survey, fewer kinds of animal were found at the pipe than upstream ✓**
- Hint: Only say what these three counts show.
- Explanation: They found 12 kinds upstream, 3 at the pipe and 7 further downstream; some animals were still found at the pipe. One survey of one river cannot show what happens in all rivers. In this survey, fewer kinds were found at the pipe than upstream.

### B51-13 · choice · `application, independent`
**Q:** A town’s population doubles, and people’s standard of living rises. What is most likely to happen?
- 0 Less waste is produced · 1 Resources are replaced faster than they are used · **2 More resources are used and more waste is produced ✓**
- Hint: More people, each wanting more things.
- Explanation: More people, each wanting more things, use more raw materials and energy. So more resources are used and more waste is produced.

### B51-14 · written · `teacherOnly`
**Q:** Explain how a growing human population can lead to a fall in biodiversity.
- Hint: Think about what more people need, what they throw away, and what that does to other species.
- Model answer: More people need more resources, and many want a higher standard of living, so even more raw materials and energy are used. People take more land for building and farming, leaving less space for other species. More waste is produced, and if it is not handled properly it pollutes water, land and air. Pollution and loss of land kill plants and animals, so the number of different species falls.
- Marking points: More people need more resources, such as food, materials and energy. · A higher standard of living means even more resources are used. · More land is used by people, leaving less for other species. · More waste is produced, which can cause pollution of water, land or air. · Pollution and loss of land kill plants and animals, so biodiversity falls.
- Reject: Saying biodiversity means the number of people. · Saying pollution only happens in the air. · Saying more people always increases biodiversity.

## Checks
- 14 screens; correct answer positions: 0 ×2, 1 ×3, 2 ×3, 3 ×2 (largest share 30%).
