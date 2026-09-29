# Lesson 58 storyboard — Protecting ecosystems and biodiversity

Chapter B7, Ecology (part 2). Folder `lesson-53`, id `B-ECO-053-B`, skill `B-PROTECT-BIODIVERSITY`.

Big idea: human activity reduces biodiversity and damages ecosystems, but people can set up programmes that reduce the damage. Each one either keeps a species alive, gives species somewhere to live, leaves land alone, or slows global warming, and each has costs that some people object to.

Flow note: the lesson moves from the smallest scale to the largest, so each section adds one idea to the last.
1. **How can we save an endangered species?** One species at a time: three panels (wild, captivity, back in the wild) built up frame by frame. It comes first because it is the most concrete programme, and it introduces "endangered" before habitats are discussed.
2. **How can farms hold more species?** One field edge in side view: a single crop, then a field margin, then a hedgerow, then the species that use them. It uses the biodiversity idea from the Start here question, and shows that giving species a habitat raises biodiversity.
3. **How can we look after habitats?** One landscape: a rare wetland, the same wetland protected as a nature reserve, a damaged wood being regenerated, and a town that recycles so its landfill site needs less land. It widens "give species a habitat" from a field edge to whole areas of land.
4. **What can governments do?** One scene with the carbon dioxide band from the global warming lesson: a law limiting tree felling, a law limiting a factory's carbon dioxide, then the people who object (cost, jobs). It comes last because it depends on deforestation and global warming, and it ends the lesson with the balanced view the page gives.

Sections:
1. Start here (B53-01): the biodiversity of a field that grows only wheat (prior knowledge from the biodiversity lesson; it sets up field margins and hedgerows).
2. How can we save an endangered species? (B53-02–04): few left in the wild, endangered → bred in captivity → a back-up population → released to boost or replace → breeding programme. Checks: what an endangered species is; a frog population wiped out from a lake.
3. How can farms hold more species? (B53-05–07): one crop, low biodiversity → field margin → hedgerow → food and shelter for many species. Checks: what a field margin is; how hedgerows raise biodiversity.
4. How can we look after habitats? (B53-08–10): rare habitats → protecting them (nature reserve) → regenerating damaged habitats → recycling means less land for landfill → put together. Checks: naming regeneration from a tree-planting example; how recycling helps.
5. What can governments do? (B53-11–13): laws to reduce deforestation → laws on carbon dioxide from businesses, slowing global warming → some people object (cost, jobs) → put together. Checks: why limiting carbon dioxide helps; why some local people object to a forest law.
6. On your own (B53-14–17): otters returning to a cleaned river (new scenario); the farm edge in assessment view with three numbered areas; an invented insect survey read without over-claiming; a teacher-reviewed written answer on helping a rare wetland bird.

Wording rules: one new term per frame, plain meaning first; pollution, deforestation, global warming, landfill and biodiversity are referred to by topic in one clause; British spelling; objections are stated neutrally, as the page does. No calculations: the page sets none.

Out of scope: named conservation schemes, seed banks, quotas and international agreements; the detail of how recycling works; farming subsidies or economics beyond "cost" and "jobs"; Higher-tier or Triple-only content; the book's cartoons, jokes and exam questions.

Source boundary: supplied revision-guide page 90 (scope only; page 91 is a revision test and was not used); AQA 8464 section 4.7.3.6. The tortoise panels, the field-edge scene, the wetland landscape, the laws scene, the otter, frog and wetland-bird scenarios, the insect-survey data, all questions and all wording are original. Draft pending teacher review.

Judgement calls for the teacher: "nature reserve" is named as one way of protecting a habitat; the page only says "protecting". "A rule made by a government is called a law" is added as the one new term in the government section. The objections frame adds "Protecting ecosystems has to be balanced against people's needs", following the AQA wording about conflicting pressures. The written task uses two programmes (breeding and habitat protection) rather than the field-margin example, so it does not repeat a guided question.

## Diagram plan
- `components/EarthVisuals.tsx`, focus prefix `earth-`. Colours: green = programmes that help species, red = at risk, purple = carbon dioxide, blue-grey = people and laws, amber = the crop, brown = soil and landfill.
- **Breeding programme** (`earth-breed-*`): three panels in a row joined by two arrows: (1) a wild area with two tortoises; (2) a fenced enclosure in captivity with adults and young; (3) the wild area with released tortoises. Each frame highlights one panel; the back-up frame shows "none left" in the wild and "the species survives" in captivity.
- **Field edge** (`earth-farm-*`): side view of a wheat field up to a fence; then a strip of wild flowers and grasses (field margin); then a hedgerow replaces the fence; then a bird, a bee, a butterfly and a mouse appear. `earth-farm-question` numbers hedgerow 1, crop 2 and margin 3 with leader lines and no key (B53-15).
- **Habitats** (`earth-habitat-*`): a wetland with a pond, reeds and old trees; a dashed "nature reserve" boundary; tree stumps with young trees planted; a house with a recycling bin and a landfill site that shrinks, with the old outline dashed.
- **Laws** (`earth-rules-*`): carbon dioxide band at the top; a forest with one stump and a law note; a factory whose carbon dioxide arrow is thinner than before ("less"), with a law note; two people and a coin for the objections.
- **Insect survey** (`earth-insect-data`): invented bar chart, kinds of insect at the edges of three wheat fields.

## States in full

### B53-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** A large field grows nothing but wheat. What is its biodiversity likely to be?
- 0 High, because it has lots of plants · **1 Low, because very few different species live there ✓** · 2 High, because wheat grows quickly
- Hint: Biodiversity is about how many different species there are.
- Explanation: Lots of wheat plants are still only one species. Very few different species live there, so its biodiversity is low. You met biodiversity when you learned about waste and pollution.

### B53-02 · teach "How can we save an endangered species?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Only a few left | Some species have so few individuals left that they could die out. | fewer individuals → risk of dying out | Human activity can reduce biodiversity and damage ecosystems, as you saw with pollution and deforestation. Some species now have only a few individuals left in the wild. A species that is at risk of dying out is called an endangered species. | `earth-breed-wild` |
| Bred in captivity | Some of the animals are kept safe by people and allowed to breed. | kept safe → young are born → numbers grow | Some individuals can be kept in a safe place, such as a zoo, and allowed to breed. Being kept and cared for by people like this is called captivity. The young are protected, so the number of animals grows. | `earth-breed-captive` |
| A back-up population | If the wild ones die out, the species still survives in captivity. | wild ones lost → captive ones still alive | Suppose the last wild animals die, for example because their habitat is destroyed. Some individuals are still alive in captivity. So the species has not died out completely. | `earth-breed-backup` |
| Back into the wild | Animals bred in captivity can be released into the wild. | released → wild population bigger or back again | Some animals bred in captivity can be released into the wild. This can make a small wild population bigger. It can also replace a wild population that has been wiped out. | `earth-breed-release` |
| Put it together | Breeding in captivity and releasing animals helps endangered species. | wild → captivity → released | Breeding an endangered species in captivity, then sometimes releasing it, is called a breeding programme. It keeps the species alive and can help wild numbers recover. | `earth-breed-all` |

### B53-03 · choice · `understanding, practice`
**Q:** What is an endangered species?
- **0 A species that is at risk of dying out ✓** · 1 A species that only lives in zoos · 2 A species that eats other animals
- Hint: Think about how many are left in the wild.
- Explanation: An endangered species has so few individuals left that it could die out. Breeding programmes help species like this survive.

### B53-04 · choice · `understanding, practice`
**Q:** A kind of frog has been wiped out from one lake. How could a breeding programme help?
- 0 Move the lake’s fish to a zoo · 1 Stop all frogs from breeding · **2 Release frogs bred in captivity into the lake ✓**
- Hint: What can happen to animals bred in captivity?
- Explanation: Frogs of that species can be bred safely in captivity. Some can then be released into the lake to replace the population that was wiped out.

### B53-05 · teach "How can farms hold more species?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A field of one crop | A field that grows only one crop has very low biodiversity. | one crop → very few species | Many farms grow one crop across a whole field, such as wheat. Almost nothing else is allowed to grow there. So very few species can live in the field, and it has very low biodiversity. | `earth-farm-crop` |
| Field margins | Wild flowers and grasses are left to grow around the edge. | strip at the edge → wild plants grow | A farmer can leave a strip of land around the edge of a field. Wild flowers and grasses are left to grow there. This strip is called a field margin. | `earth-farm-margin` |
| Hedgerows | A line of bushes is planted along the edge of the field. | bushes planted in a line → hedgerow | A farmer can also plant bushes close together along the edge of a field. As they grow, they form a hedge. A long line of hedge like this is called a hedgerow. | `earth-farm-hedge` |
| Homes for many species | Field margins and hedgerows give food and shelter to many species. | more habitats → more species → higher biodiversity | Field margins and hedgerows give food and shelter to many different species, such as bees, butterflies, birds and small mammals. They are habitats that the crop field cannot provide. So adding them back to farmland raises biodiversity on the farm. | `earth-farm-all` |

### B53-06 · choice · `understanding, practice`
**Q:** What is a field margin?
- 0 A line of bushes planted in a garden · **1 A strip at the edge of a field where wild flowers and grasses grow ✓** · 2 A field that grows only one crop
- Hint: Where on the field is it, and what grows there?
- Explanation: A line of bushes along a field is a hedgerow, not a margin. A field margin is a strip at the edge of a field where wild flowers and grasses are left to grow.

### B53-07 · choice · `understanding, practice`
**Q:** How do hedgerows help to increase biodiversity on a farm?
- **0 They give food and shelter to many different species ✓** · 1 They make the crop grow faster · 2 They stop any animals from reaching the field
- Hint: What do birds and insects find in a hedge?
- Explanation: A field of one crop gives few species anywhere to live. Hedgerows give food and shelter to many species, so biodiversity goes up.

### B53-08 · teach "How can we look after habitats?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Rare habitats | Some habitats are only found in a few places. | few places left → species there at risk | Some habitats are only found in a few places, such as an old woodland or a wetland. Many species live only in habitats like these. A habitat that is found in only a few places is called a rare habitat. | `earth-habitat-rare` |
| Protecting habitats | A protected area is kept safe from building and farming. | protected → habitat stays → species stay | An area of rare habitat can be protected so that nobody builds on it or farms it. The species that live there keep their habitat. A protected area like this is called a nature reserve. | `earth-habitat-protect` |
| Regenerating habitats | A damaged habitat can be rebuilt. | rebuild habitat → species move back | A damaged habitat can be rebuilt, for example by planting young trees where a wood was cut down. Rebuilding a habitat like this is called regenerating it. As the habitat grows back, species can move back in. | `earth-habitat-regrow` |
| Recycling | Recycling means less land is needed for landfill. | recycle → less landfill → land left alone | You met landfill sites when you learned about waste. Turning used materials into new things is called recycling. It means less waste is dumped, so less land is taken for landfill. More ecosystems can be left alone. | `earth-habitat-recycle` |
| Put it together | Protecting, rebuilding and saving land all help other species. | more habitat left → more species survive | Protecting rare habitats keeps them safe, and regenerating damaged habitats brings them back. Recycling means less land is taken for landfill. Each one leaves more habitat for other species, so it helps protect biodiversity. | `earth-habitat-all` |

### B53-09 · choice · `understanding, practice`
**Q:** Young trees are planted where an old wood was cut down. What is this called?
- 0 Recycling a habitat · 1 Protecting a species in captivity · **2 Regenerating a habitat ✓**
- Hint: Is the habitat being kept, or being rebuilt?
- Explanation: Planting trees rebuilds the wood, so its habitat grows back. Rebuilding a damaged habitat is called regenerating it.

### B53-10 · choice · `understanding, practice`
**Q:** How can recycling help to protect ecosystems?
- 0 It makes more waste to bury · **1 Less land is taken for landfill, so more ecosystems are left alone ✓** · 2 It turns landfill sites into forests straight away
- Hint: Where does waste go if it is not recycled?
- Explanation: Recycling means less waste is dumped in landfill sites. So less land is needed for landfill, and more ecosystems can be left alone.

### B53-11 · teach "What can governments do?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Rules on forests | Some governments limit how many trees can be cut down. | fewer trees cut → less carbon dioxide added | Cutting down forests adds carbon dioxide to the air and destroys habitats, as you saw with deforestation. Some governments have made rules to reduce deforestation. A rule made by a government is called a law. | `earth-rules-forest` |
| Rules on businesses | Some governments limit the carbon dioxide that businesses release. | less carbon dioxide → global warming slows | Some governments have also made rules to cut the carbon dioxide released by businesses, such as factories. Carbon dioxide is a greenhouse gas. So releasing less of it could help to slow global warming. | `earth-rules-carbon` |
| Not everyone agrees | Some people object because of the cost or their jobs. | protect ecosystems ↔ money and jobs | Programmes like these can cost a lot of money. Some can affect people’s jobs, such as people who are paid to cut down trees. So not everyone agrees with them. Protecting ecosystems has to be balanced against people’s needs. | `earth-rules-object` |
| Put it together | Rules on forests and carbon dioxide help protect ecosystems. | fewer trees cut + less carbon dioxide → ecosystems protected | Rules on forests keep habitats, and the trees left keep taking in carbon dioxide. Rules on businesses cut the carbon dioxide they release. Both could help slow global warming, but some people object because of the cost or lost jobs. | `earth-rules-all` |

### B53-12 · choice · `understanding, practice`
**Q:** Why could limiting the carbon dioxide released by businesses help ecosystems?
- **0 It could help slow global warming ✓** · 1 It makes forests grow faster straight away · 2 It stops all pollution of rivers
- Hint: What does carbon dioxide do in the atmosphere?
- Explanation: Carbon dioxide is a greenhouse gas, so it traps energy and warms the Earth. Releasing less of it could help slow global warming, which threatens many species.

### B53-13 · choice · `understanding, practice`
**Q:** A new law stops a forest being cut down. Why might some local people object?
- 0 The forest will release more carbon dioxide · 1 Trees cannot grow without being cut · 2 Biodiversity in the forest will fall · **3 People paid to cut down trees could lose their jobs ✓**
- Hint: Who earns money from cutting down the trees?
- Explanation: The law protects the forest, which is good for biodiversity. But people who are paid to cut down trees could lose their jobs, so some may object.

### B53-14 · choice · `application, independent`
**Q:** Otters died out along a river when it was polluted. The river is now clean. Which programme could bring otters back?
- 0 Plant more wheat beside the river · 1 Recycle more plastic · **2 Release otters bred in captivity along the river ✓**
- Hint: Which programme puts animals back into the wild?
- Explanation: Otters bred in captivity can be released into the wild. Released along the clean river, they could replace the population that was wiped out.

### B53-15 · choice · `understanding, independent` · question diagram `earth-farm-question` (assessment view)
**Q:** Look at the numbered areas of the farm. Which one is a field margin?
- 0 Area 1 · 1 Area 2 · **2 Area 3 ✓**
- Hint: Find the strip of wild flowers and grasses at the field’s edge.
- Explanation: Area 1 is a line of bushes, a hedgerow, and area 2 is the wheat crop. Area 3 is the strip of wild flowers and grasses at the edge of the field, so it is the field margin.

### B53-16 · choice · `dataInterpretation, independent` · question diagram `earth-insect-data` (assessment view)
**Q:** Students counted kinds of insect at the edges of three wheat fields. Which conclusion fits their results?
- 0 Insects only live in hedgerows · 1 No insects were found where there was no margin · 2 Every hedgerow has 23 kinds of insect · **3 In this survey, more kinds of insect were found where fields had a margin and a hedgerow ✓**
- Hint: What do these three counts show, and no more?
- Explanation: They found 5 kinds with no margin or hedgerow, 14 with a margin and 23 with a margin and a hedgerow. Three fields cannot show what happens on every farm, and insects were found at all three. In this survey, more kinds were found with a margin and a hedgerow.

### B53-17 · written · `explanation, independent` · teacher-reviewed
**Q:** A rare bird nests only in one wetland, and very few are left. Explain two programmes that could help it survive.
- Hint: Think about the birds themselves, and about the place they live.
- Model answer: The bird is endangered, because it is at risk of dying out. In a breeding programme, some birds are bred in captivity, so the species survives even if the wild birds die. Some can be released into the wetland to make the wild population bigger. The wetland is a rare habitat, so it could be protected as a nature reserve so nobody builds on it or drains it. Damaged parts could be regenerated, so there is more habitat for the birds.
- Rubric (5 points): (Breed some birds in captivity in a breeding programme.) (So the species survives even if the wild birds die out.) (Release captive-bred birds to make the wild population bigger.) (Protect the wetland, for example as a nature reserve, so it is not built on or drained.) (Regenerate damaged parts of the wetland, so there is more habitat.)
- Reject: Saying the birds should all be moved to a zoo for ever, with no reason given. Saying recycling makes the birds breed faster. Saying an endangered species is one that is dangerous to people.

