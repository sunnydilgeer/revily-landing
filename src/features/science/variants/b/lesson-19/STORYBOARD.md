# Lesson 19 storyboard — Pathogens and how disease spreads (v2)

Big idea: tiny living things called pathogens cause diseases that pass from one living thing to another; if you know how a pathogen travels, you know how to stop it. The lesson follows one cold from sneeze to sneeze, and how to stop it, before widening out to the other pathogens and routes. Viruses and cell damage come before bacteria and toxins, so "toxins" arrives as a contrast, not a list item.

1. Start here (B19-01): which disease is communicable? (links to Lesson 15).
2. Follow the cold (B19-02–04): a cold goes round a class → a pathogen (a virus) → out in droplets → breathed in → zoom in: it copies itself in cells, which burst (cell damage). Checks: how it travels; what makes you ill.
3. Stopping the cold (B19-05–06): hygiene (tissues, hand washing), isolation, vaccination (named only, Lesson 23). Check: why the tissue routine helps.
4. Other pathogens (B19-07–09): zoom back out — viruses aren't cells; bacteria are cells that make toxins; fungi; protists. Checks: numbered line-up (labels hidden); what causes Salmonella symptoms.
5. Other ways in (B19-10–12): direct contact, dirty water, vectors (and destroying them); then a match-the-stop-to-the-route summary. Checks: numbered scenes (labels hidden); stopping mosquitoes.
6. On your own (B19-13–16): flies on food; original hand-gel data without over-claiming; dirty-water village; teacher-reviewed flu explanation.

Wording rules: one new term per frame, plain meaning first. Out of scope: named diseases beyond passing examples (Lessons 20–21), how immunity works (22–23), antibiotics (24).

Source boundary: supplied pages 36–38 (opening lines of 37–38 only); AQA 8464 section 4.3.1.1. Draft pending teacher review.

> **Build note:** the code in `teachingFrames.ts` and `lesson.ts` is the final wording. During the build, contractions were written out in full (for example, "isn't" became "is not"), and a few explanations were split into two shorter sentences.

---

## States in full (for approval)

State and frame shapes match `lesson-18/lesson.ts` and `teachingFrames.ts`. ✓ marks the correct option. Question explanations are two steps, like 17–18.

### B19-01 · choice · `priorKnowledge`, `diagnostic`
**Q:** Which of these is a communicable disease?
- 0 Coronary heart disease · **1 A cold ✓** · 2 Lung cancer caused by smoking
- Hint: Communicable means it can pass from person to person. (Lesson 15.)
- Explanation: Heart disease and smoking-related cancer can't be caught from someone else. A cold can pass from person to person, so it is communicable.

### B19-02 · teach "Follow the cold" · diagram `pathogen-class`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A cold goes round the class | Something passes from person to person. | tiny and alive | A cold can spread through a whole class in a week. Something too small to see is passing from person to person. Tiny living things like this are called microorganisms. | `pathogen-class-overview` |
| Meet the pathogen | A pathogen is a microorganism that causes disease. | pathogen = causes disease | A cold is caused by a pathogen called a virus. Diseases caused by pathogens are communicable. They can pass from one living thing to another. You met this in Lesson 15. | `pathogen-class-virus` |
| Out in droplets | A sneeze sprays tiny drops into the air. | sneeze → droplets | When someone with a cold sneezes, they spray tiny drops of liquid called droplets. The droplets carry viruses through the air. | `pathogen-class-droplets` |
| Into a new person | Someone nearby breathes the droplets in. | breathed in → infected | A classmate breathes in the droplets. The viruses land inside their nose and throat. | `pathogen-class-breathe` |
| Zoom in: inside a cell | The virus copies itself inside a cell. | copies → cell bursts | A virus is not a cell. It gets inside one of your cells and makes lots of copies of itself. The cell bursts and releases them. This cell damage makes you feel ill. | `pathogen-class-cells` |

### B19-03 · choice
**Q:** How does a cold virus get from one person to the next?
- **0 In droplets from coughs and sneezes ✓** · 1 Through the soil · 2 It forms on its own inside each person
- Hint: Think about what a sneeze sends out.
- Explanation: A sneeze sprays droplets that carry viruses through the air. Someone nearby breathes them in.

### B19-04 · choice
**Q:** Why does a cold virus make you feel ill?
- 0 Cold weather damages your nose · 1 The virus makes toxins · **2 Your cells are damaged when new viruses burst out ✓**
- Hint: Zoom in on what happens inside the cell.
- Explanation: The virus makes copies of itself inside your cells. The cells burst, and this cell damage makes you feel ill.

### B19-05 · teach "Stopping the cold" · diagram `pathogen-class`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Catch it, bin it, wash | Keeping clean stops viruses reaching others. | clean hands → fewer viruses passed on | Hygiene means keeping clean to stop pathogens spreading. Sneezing into a tissue, binning it and washing your hands stops viruses reaching other people. | `pathogen-class-hygiene` |
| Stay apart | Keeping an ill person away from others stops them passing it on. | apart → can't pass it on | Keeping an infected person away from other people is called isolation. Staying at home with a bad illness is a simple version of this. | `pathogen-class-isolation` |
| Vaccination | A vaccine makes people less likely to catch a disease. | vaccinated → less likely to catch it or pass it on | Vaccination makes people less likely to catch a disease. So they are also less likely to pass it on. You will see how it works in Lesson 23. | `pathogen-class-vaccine` |

### B19-06 · choice
**Q:** A pupil sneezes into a tissue, bins it and washes their hands. Why does this help?
- **0 It stops the virus reaching other people ✓** · 1 It cures the pupil's cold · 2 It makes the pupil immune
- Hint: Who does hygiene protect?
- Explanation: The tissue and hand washing remove viruses. So fewer viruses reach anyone else.

### B19-07 · teach "Other kinds of pathogen" · diagram `pathogen-types`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Four kinds of pathogen | Viruses are one of four kinds of pathogen. | virus, bacteria, fungi, protists | There are four main kinds of pathogen. You have met viruses. Viruses are much smaller than the others, and they are not cells. | `pathogen-types-virus` |
| Bacteria | Bacteria are very small living cells. | cells that multiply fast | Bacteria are very small living cells. You met bacterial cells in Lesson 1. Inside the body, bacteria can reproduce very quickly. | `pathogen-types-bacteria` |
| Toxins | Many bacteria make poisons called toxins. | toxins, not bursting cells | Many bacteria make toxins. A toxin is a poison made by a pathogen. Toxins damage your cells and tissues, and this makes you feel ill. | `pathogen-types-toxin` |
| Fungi | Some fungi cause disease, especially in plants. | moulds and mushrooms | Fungi include moulds and mushrooms. One of them is called a fungus. Some fungi cause disease, especially in plants. | `pathogen-types-fungus` |
| Protists | A protist is a living thing made of one cell. | one bigger cell | A protist is a living thing made of one cell. It is larger and more complex than a bacterium. One protist causes malaria. | `pathogen-types-protist` |

### B19-08 · choice · question diagram `pathogen-types-question` (assessment: four shapes numbered 1–4, names hidden; order bacterium, fungus, protist, virus)
**Q:** Look at the four pathogens. Which one is not a cell?
- 0 Number 1 · 1 Number 2 · 2 Number 3 · **3 Number 4 ✓**
- Hint: Look for the smallest one. How does it copy itself?
- Explanation: Numbers 1 to 3 are a bacterium, a fungus and a protist, which are all living cells. Number 4 is a virus: it is much smaller and is not a cell.

### B19-09 · choice
**Q:** Salmonella bacteria cause vomiting. What causes this symptom?
- 0 The bacteria burst out of your cells · **1 Toxins made by the bacteria ✓** · 2 The bacteria are too big to digest
- Hint: Bacteria and viruses harm you in different ways.
- Explanation: Bursting out of cells is what viruses do. Bacteria make toxins, and the toxins damage cells and cause symptoms.

### B19-10 · teach "Other ways in" · diagram `pathogen-routes`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| By touch | Some pathogens spread by touching. | touch → picked up | Some pathogens spread by direct contact. You pick them up by touching an infected person, or a surface they have touched. | `pathogen-routes-contact` |
| In dirty water | Some pathogens live in dirty water. | drink or wash → infected | Some pathogens live in dirty water. People catch them by drinking it or bathing in it. Clean water stops this route. | `pathogen-routes-water` |
| Carried by an animal | A vector carries a pathogen from one living thing to another. | vector = carrier | A vector is a living thing that carries a pathogen to another living thing. Mosquitoes are vectors. Killing vectors, or destroying the places where they breed, stops the spread. | `pathogen-routes-vector` |
| Match the stop to the route | Each route has its own way to stop it. | route → stop | Air: tissues, isolation and vaccination. Touch: hand washing. Water: clean drinking water. Vectors: insecticides and destroying breeding places. | `pathogen-routes-summary` |

### B19-11 · choice · question diagram `pathogen-routes-question` (assessment: three scenes numbered 1–3, captions hidden: 1 sneeze, 2 handshake then eating, 3 drinking from a stream)
**Q:** Which scene shows a pathogen spreading by direct contact?
- 0 Scene 1 · **1 Scene 2 ✓** · 2 Scene 3
- Hint: Which scene involves touching?
- Explanation: Scene 1 shows droplets in the air, and scene 3 shows dirty water. Scene 2 shows a handshake, which is direct contact.

### B19-12 · choice
**Q:** Mosquitoes carry a pathogen between people. Which action would most directly reduce the spread?
- 0 Isolate people who are ill · 1 Wash hands before eating · **2 Destroy the places where mosquitoes breed ✓** · 3 Use tissues when sneezing
- Hint: Mosquitoes are vectors. What stops vectors?
- Explanation: The mosquitoes carry the pathogen, so they are vectors. Destroying their breeding places means fewer mosquitoes to pass it on.

### B19-13 · choice · `application`, independent
**Q:** Flies land on rubbish, then on food. Why might killing the flies reduce disease?
- 0 Flies make toxins in the food · **1 Flies carry pathogens from rubbish to food ✓** · 2 Flies are a type of pathogen
- Hint: What do we call a living thing that carries pathogens?
- Explanation: Flies pick up pathogens from rubbish and carry them to food. They are acting as vectors, so killing them stops this route.

### B19-14 · choice · `dataInterpretation`, independent · question diagram `pathogen-handgel-data` (bar chart: weeks 1–2 = 24, 22 cases; gel added; weeks 3–4 = 9, 7)
**Q:** Look at the results. Which conclusion fits them?
- 0 Hand gel proves nobody will catch a stomach bug · 1 Cases went up after the gel was added · 2 Colder weather caused the change · **3 In this school, fewer cases followed the gel stations ✓**
- Hint: Only say what these results show.
- Explanation: Cases fell from 24 and 22 a week to 9 and 7 after the gel stations went in. One school's results can't prove what causes every case, or what happens everywhere.

### B19-15 · choice · `application`, independent
**Q:** A disease spreads through the dirty drinking water in a village. Which step would reduce the spread most directly?
- 0 Give out mosquito nets · 1 Ask people to wear masks · **2 Provide clean drinking water ✓**
- Hint: Match the stop to the route.
- Explanation: The pathogen travels in dirty water. Clean drinking water removes that route.

### B19-16 · written · `teacherOnly`
**Q:** Flu spreads easily in schools. Describe two ways a school could reduce the spread of flu, and explain how each works.
- Hint: Flu travels in droplets. For each idea, say how it stops the virus reaching someone new.
- Model answer: Pupils could catch sneezes in tissues and wash their hands. This removes viruses before they reach anyone else. Pupils with flu could stay at home. Then they can't pass the virus on in school. Vaccination also makes people less likely to catch flu and pass it on.
- Marking points: hygiene (tissues, hand washing) removes viruses · isolation (staying home) stops passing it on · vaccination makes catching and passing it on less likely · each method is linked to how it stops spread.
- Common errors: says hand washing cures flu · says flu spreads through dirty water or vectors · names a method with no explanation.

## Checks against 17–18
- 16 states: 4 teach states (5 + 3 + 5 + 4 = 17 frames), 11 choice questions and 1 written task. Lesson 17 has 16 states; Lesson 18 has 19.
- Correct answer positions: 0 ×2, 1 ×4, 2 ×3, 3 ×2. The largest share is 36%.
- Question diagrams: 3, all in `assessment` form (B19-08, B19-11, B19-14).
- Base scenes: `pathogen-class` (8 focus states), `pathogen-types` (5 + question), `pathogen-routes` (4 + question), and the data chart.
