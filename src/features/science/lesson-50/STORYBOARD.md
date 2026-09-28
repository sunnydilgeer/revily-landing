# Lesson 55 storyboard — The water and carbon cycles

Chapter B7, Ecology (part 2). Folder `lesson-50`, id `B-ECO-050-B`, skill `B-MATERIAL-CYCLES`.

Big idea: the materials living things are made of are not used up. Water and carbon go round and round between the air, the land and living things, and microorganisms return materials by decay so they can build new living things.

Flow note: the lesson moves from the most familiar cycle to the one that needs everything else first.
1. **Follow the water.** A physical cycle learners can see (puddles, clouds, rain). It reuses evaporation and condensation from everyday life and transpiration from the plant-transport lesson, so it is the easiest place to meet the idea of a cycle.
2. **Why living things need water.** Plants take it in and use it; animals get it by eating and drinking and return it in waste. This puts living things into a cycle before the carbon cycle asks them to do more.
3. **What happens to dead things.** Materials pass along a food chain and come back in waste and dead bodies; microorganisms break them down (decay) and return mineral ions to the soil. Decay must come before the carbon cycle, because "decay releases carbon dioxide" needs it.
4. **Follow the carbon.** Photosynthesis takes carbon dioxide in, eating passes carbon compounds on, and respiration, decay and burning return it. The same garden scene (plant, rabbit, soil microorganisms) runs through sections 3 and 4 so learners build one picture.

Sections:
1. Start here (B50-01): drops of water on a cold window (condensation), an everyday idea used in the water cycle.
2. Follow the water (B50-02–04): evaporation → transpiration → condensation → precipitation → run-off → the water cycle. Checks: a numbered water-cycle diagram (which arrow is condensation); how water gets into the air.
3. Why do living things need water? (B50-05–06): plants take it up for photosynthesis → water in plant tissues passes to animals → animals use water and return it in waste. Check: how a rabbit returns water.
4. What happens to dead things? (B50-07–09): made of materials → passed along the food chain → returned in waste and death → decay by microorganisms → recycled. Checks: what breaks down dead material; why decay matters to plants.
5. Follow the carbon (B50-10–12): photosynthesis → eating → respiration → decay → burning and fossil fuels → the carbon cycle. Checks: a numbered carbon-cycle diagram (which arrow removes carbon dioxide from the air); how microorganisms return carbon.
6. On your own (B50-13–16): fallen leaves disappearing (new scenario); the water-cycle diagram again with a new question; an invented leaf-bag bar chart read without over-claiming; a teacher-reviewed written answer tracing carbon through a rabbit.

Wording rules: one new term per frame, plain meaning first; photosynthesis, respiration and transpiration are referred to by topic in one clause; British spelling. No calculations: the pages set none.

Out of scope: the nitrogen cycle; conditions that affect the rate of decay, compost and biogas (biology-only content); oceans as carbon stores; greenhouse gases and global warming (the global-warming lesson); the book's cartoons and exam questions.

Source boundary: supplied revision-guide pages 85–86 (scope only); AQA 8464 section 4.7.2.2. The garden and rabbit scenes, the leaf-bag data, all questions and all wording are original. Draft pending teacher review.

## Diagram plan
- `components/EarthVisuals.tsx`, focus prefix `earth-`. Each walkthrough is one scene with numbered markers beside the arrows and a numbered key on the right (the pattern of the plant-transport lesson): the active step is filled in its colour and the rest fade.
- **Water cycle** (`earth-water-*`): Sun, sea, a hill with a tree, a cloud, rain and a river. Five numbered arrows; `earth-water-question` is the same scene with only the numbers (B50-03, B50-14).
- **Garden** (`earth-need-*`, `earth-decay-*`): a plant, a rabbit and soil. Water drops for the water frames; mineral ions (brown dots), droppings, fallen leaves and an enlarged circle of soil microorganisms for decay.
- **Carbon cycle** (`earth-carbon-*`): air band at the top, a tree, a rabbit, soil microorganisms, a fire and fossil fuels, six numbered arrows. Purple = carbon dioxide, amber = carbon compounds in food, olive = microorganisms. `earth-carbon-question` hides the key (B50-11).
- **Leaf-bag chart** (`earth-leaf-data`): invented bar chart, mass of leaves (g) against time (months).

## States in full

### B50-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** On a cold morning, tiny drops of water appear on the inside of a window. What is this change called?
- 0 Evaporation · **1 Condensation ✓** · 2 Melting · 3 Freezing
- Hint: The water was in the air as a gas before it hit the cold glass.
- Explanation: Water vapour in the air cools when it touches the cold glass. It turns back into liquid water. This change from gas to liquid is condensation.

### B50-02 · teach "Follow the water"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Evaporation | The Sun’s energy turns water into water vapour. | liquid water → water vapour (a gas) | Energy from the Sun heats water in the sea, in lakes and on the land. The water turns into a gas, called water vapour, and rises into the air. This is called evaporation. | `earth-water-evaporate` |
| Transpiration | Plants give off water vapour from their leaves. | roots → leaves → air | Plants take in water through their roots. Water evaporates from their leaves and escapes as water vapour. You met this when you learned how water moves through a plant. It is called transpiration. | `earth-water-transpire` |
| Condensation | Rising water vapour cools and forms clouds. | warm vapour rises → cools → droplets | The warm water vapour is carried up into the sky. High up, the air is colder, so the water vapour cools. It turns back into tiny droplets of liquid water, which form clouds. This is called condensation. | `earth-water-condense` |
| Precipitation | Water falls from the clouds. | clouds → ground | The droplets in a cloud join up and get bigger. When they are heavy enough, they fall to the ground. Water falling from clouds is called precipitation. It is usually rain, but it can be snow or hail. | `earth-water-precip` |
| Run-off | Water flows off the land and back to the sea. | land → streams and rivers → sea | Some precipitation soaks into the soil. Water that is not absorbed flows over the land into streams and rivers. This is called run-off. The rivers drain back into the sea. | `earth-water-runoff` |
| Round and round | The same water is used again and again. | no beginning, no end | Back in the sea, the water evaporates again. So the same water goes round and round, with no beginning or end. This is called the water cycle. Each time, precipitation brings fresh water to the land. | `earth-water-cycle` |

### B50-03 · choice · `understanding, guided` · question diagram `earth-water-question` (assessment view hides the names)
**Q:** Look at the numbered arrows on the water cycle. Which one shows condensation?
- 0 Arrow 1 · 1 Arrow 2 · **2 Arrow 3 ✓** · 3 Arrow 4
- Hint: Condensation happens where water vapour cools high up in the sky.
- Explanation: Arrows 1 and 2 show water vapour leaving the sea and a tree, and arrow 4 shows water falling. Arrow 3 shows rising water vapour cooling and forming a cloud, which is condensation.

### B50-04 · choice · `understanding, guided`
**Q:** How does water get from the land and sea into the air?
- **0 By evaporation and transpiration ✓** · 1 By precipitation · 2 By run-off into rivers · 3 By condensation
- Hint: Which steps turn liquid water into water vapour?
- Explanation: Precipitation and run-off move water down, and condensation turns vapour back into liquid. Evaporation from the land and sea, and transpiration from plants, put water vapour into the air.

### B50-05 · teach "Why do living things need water?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Water for plants | Plants take in water from the soil. | soil → roots → leaves | Rain soaks into the soil. Plants take up this water through their roots. They need it for photosynthesis, which you met when you learned how plants make glucose. | `earth-need-plant` |
| Water in food | Some water becomes part of the plant, and animals eat it. | plant eaten → water passed on | Some of the water becomes part of the plant’s tissues. When an animal eats the plant, it takes in that water too. Animals also get water by drinking. | `earth-need-food` |
| Water for animals | Animals need water, and they return it in their waste. | animal → soil and air | Animals need water for the chemical reactions in their bodies. They return water to the soil and the air in their waste, such as urine and sweat. Then the water carries on round the water cycle. | `earth-need-animal` |

### B50-06 · choice · `understanding, guided`
**Q:** How does a rabbit return water to the environment?
- 0 By photosynthesis · **1 In its waste, such as urine ✓** · 2 By eating plants
- Hint: Think about what an animal gets rid of.
- Explanation: Rabbits take in water by eating and drinking. They return water to the soil and air in their waste, such as urine.

### B50-07 · teach "What happens to dead things?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Made of materials | Living things are built from materials around them. | soil → plant | Living things are made of materials they take from the world around them. For example, plant roots take in mineral ions from the soil. The plant uses them to make the molecules it is built from. | `earth-decay-take` |
| Passed along | Eating passes the materials along the food chain. | plant → animal | When a rabbit eats the plant, the plant’s molecules pass into the rabbit. In this way, materials are passed along the food chain. | `earth-decay-eat` |
| Back to the ground | Materials return in waste and when living things die. | waste and dead things → ground | Materials go back to the environment in waste, such as droppings. They also go back when living things die, such as leaves that fall from a plant. | `earth-decay-return` |
| Decay | Microorganisms break down waste and dead material. | microorganisms break it down | Microorganisms, such as bacteria and fungi, live in the soil. They feed on waste and dead material, and break it down. This is called decay. | `earth-decay-microbes` |
| Recycled | Decay puts mineral ions back for plants to use again. | taken in → returned → used again | Decay puts mineral ions back into the soil. Plants take them in again and use them to grow. So the materials are recycled, and they build new living things. | `earth-decay-cycle` |

### B50-08 · choice · `understanding, guided`
**Q:** What breaks down dead leaves and animal waste in the soil?
- 0 Rain · 1 Plant roots · 2 Sunlight · **3 Microorganisms ✓**
- Hint: Decay is done by living things too small to see.
- Explanation: Rain, roots and sunlight do not feed on dead material. Microorganisms, such as bacteria and fungi, break it down. This is decay.

### B50-09 · choice · `understanding, guided`
**Q:** Why is decay important for plants?
- **0 It returns mineral ions to the soil for plants to take in ✓** · 1 It adds oxygen to the soil · 2 It makes the leaves fall off
- Hint: What does decay put back into the soil?
- Explanation: Microorganisms break down waste and dead material. This returns mineral ions to the soil, so plants can take them in again and grow.

### B50-10 · teach "Follow the carbon"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Into plants | Photosynthesis takes carbon dioxide out of the air. | carbon dioxide in the air → plant | Plants take in carbon dioxide from the air for photosynthesis. They use the carbon to make glucose. The glucose is used to make other substances that contain carbon, such as starch. These are called carbon compounds. | `earth-carbon-photo` |
| Into animals | Eating passes the carbon compounds on. | plant → animal | When an animal eats a plant, it takes in the plant’s carbon compounds. So the carbon passes along the food chain. | `earth-carbon-eat` |
| Back by respiration | Plants and animals release carbon dioxide when they respire. | plant and animal → carbon dioxide in the air | Plants and animals use glucose in respiration. Respiration releases carbon dioxide back into the air. You met respiration when you learned how living things transfer energy from glucose. | `earth-carbon-resp` |
| Back by decay | Microorganisms release carbon dioxide as they break things down. | dead things and waste → microorganisms → carbon dioxide | Plants and animals die, and animals produce waste. Microorganisms break these down and use the carbon compounds in their own respiration. So they release carbon dioxide back into the air. | `earth-carbon-decay` |
| Back by burning | Burning wood or fossil fuels releases carbon dioxide. | burning → carbon dioxide in the air | Coal and oil formed long ago from the remains of dead plants and animals. They are called fossil fuels. Burning fossil fuels, or wood, releases carbon dioxide into the air. | `earth-carbon-burn` |
| The carbon cycle | Carbon goes round between the air and living things. | out of the air: photosynthesis; back: respiration, decay, burning | Carbon moves from the air into plants, into animals, and back to the air again. This is called the carbon cycle. In this cycle, photosynthesis takes carbon dioxide out of the air. Respiration, decay and burning put it back. | `earth-carbon-cycle` |

### B50-11 · choice · `understanding, guided` · question diagram `earth-carbon-question` (assessment view hides the names)
**Q:** Look at the numbered arrows on the carbon cycle. Which one shows carbon dioxide being taken out of the air?
- **0 Arrow 1 ✓** · 1 Arrow 3 · 2 Arrow 5 · 3 Arrow 6
- Hint: Which arrow points down from the air into a living thing?
- Explanation: Arrows 3, 5 and 6 all carry carbon dioxide up into the air. Arrow 1 is photosynthesis, which takes carbon dioxide out of the air into the tree.

### B50-12 · choice · `understanding, guided`
**Q:** How do microorganisms return carbon to the air?
- 0 They photosynthesise · **1 They respire and release carbon dioxide ✓** · 2 They store it in the soil for ever
- Hint: What do all living things do with carbon compounds to release energy?
- Explanation: Microorganisms feed on dead material and waste. They use the carbon compounds in respiration, which releases carbon dioxide into the air.

### B50-13 · choice · `application, independent`
**Q:** Leaves fall onto a woodland floor in autumn. By the next summer, most of them have gone. What has happened to them?
- 0 The Sun made them evaporate · 1 Tree roots took in the whole leaves · **2 Microorganisms broke them down, returning carbon dioxide to the air and mineral ions to the soil ✓**
- Hint: What feeds on dead material in the soil?
- Explanation: Leaves do not evaporate, and roots take in water and mineral ions, not whole leaves. Microorganisms decayed the leaves. This returned carbon dioxide to the air and mineral ions to the soil.

### B50-14 · choice · `understanding, independent` · question diagram `earth-water-question` (assessment view hides the names)
**Q:** Look at the numbered arrows on the water cycle. Which one shows water vapour leaving plants?
- 0 Arrow 1 · **1 Arrow 2 ✓** · 2 Arrow 3 · 3 Arrow 5
- Hint: Find the arrow that starts at a plant.
- Explanation: Arrow 1 starts at the sea, arrow 3 goes into the cloud, and arrow 5 runs to the sea. Arrow 2 shows water vapour leaving the tree. This is transpiration.

### B50-15 · choice · `dataInterpretation, independent` · question diagram `earth-leaf-data` (assessment view hides the names)
**Q:** A mesh bag of leaves was left on a woodland floor for six months. Which conclusion fits the chart?
- 0 The leaves lost mass fastest between 4 and 6 months · 1 Leaves in every wood decay at exactly this rate · **2 In this bag, the mass of leaves went down over the six months ✓** · 3 The leaves gained mass as they decayed
- Hint: Only say what this one bag shows.
- Explanation: The mass fell from 40 g to 15 g; the smallest drop was between 4 and 6 months. One bag in one wood cannot show what happens everywhere. In this bag, the mass of leaves went down over the six months.

### B50-16 · written · `teacherOnly`
**Q:** Describe how carbon in the air can pass into a rabbit and then get back into the air.
- Hint: Start with the plant the rabbit eats. Then give two ways the carbon can get back to the air.
- Model answer: A plant takes in carbon dioxide from the air for photosynthesis and makes glucose and other carbon compounds. The rabbit eats the plant, so the carbon compounds pass into the rabbit. The rabbit respires and releases carbon dioxide into the air. When the rabbit dies, or produces waste, microorganisms break it down and release carbon dioxide as they respire.
- Marking points: A plant takes in carbon dioxide for photosynthesis. · The plant makes glucose or other carbon compounds. · The rabbit eats the plant, so the carbon compounds pass to the rabbit. · The rabbit respires, releasing carbon dioxide. · Microorganisms break down the dead rabbit or its waste and release carbon dioxide by respiration.
- Reject: Saying plants take in carbon dioxide by respiration. · Saying the rabbit takes in carbon dioxide from the air to make its food. · Saying microorganisms release oxygen, or photosynthesise, when they decay things.

## Checks
- 16 screens; correct answer positions: 0 ×3, 1 ×4, 2 ×3, 3 ×1 (largest share 36%).
