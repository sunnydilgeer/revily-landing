# Lesson 20 storyboard — Diseases people pass on (v2)

Big idea: four diseases pass between people, two caused by bacteria and two by viruses; for each one, you need to know the pathogen, the signs, how it spreads and how it is stopped. Every disease is taught with the same four questions, and they fill a disease card: *what causes it, what are the signs, how does it spread, how is it stopped?* The cards join into one grid at the end. The two bacterial diseases come first, so "toxins" (Lesson 19) is recapped straight away. HIV comes last, because it links forward to immune cells (Lesson 22).

1. Start here (B20-01): how do bacteria make you ill? (links to Lesson 19).
2. Salmonella (B20-02–04): a barbecue with undercooked chicken → signs (symptoms defined) → spread in food and on hands → control (poultry vaccination, kitchen hygiene). Checks: why chickens are vaccinated; why unwashed hands are a risk.
3. Gonorrhoea (B20-05–07): an STD caused by bacteria → signs (discharge defined) → penicillin → resistant strains → condoms and other antibiotics. Checks: why penicillin stopped working; what reduces spread.
4. Measles (B20-08–10): a virus spread like a cold → fever and rash → complications, so children are vaccinated. Checks: how it spreads; why children are vaccinated.
5. HIV (B20-11–12): spread by sexual contact and blood → flu-like start, then years without symptoms → antiretroviral drugs → uncontrolled, it damages immune cells (late stage, AIDS). Check: what antiretroviral drugs do.
6. Four diseases side by side (B20-13–14): the four cards join into one grid. Check: name a numbered column (names hidden).
7. On your own (B20-15–18): symptom card; original measles-vaccination data without over-claiming; a Salmonella outbreak in a kitchen; teacher-reviewed comparison of Salmonella and measles.

Wording rules: one new term per frame, plain meaning first. Neutral, factual wording for gonorrhoea and HIV, with no judgement about how anyone caught an infection. Out of scope: how antibiotics and resistance work (Lesson 24 and the evolution topic), how immune cells work (Lesson 22), how vaccines work (Lesson 23), and contraception beyond naming condoms as a barrier method.

Source boundary: supplied pages 37–38; AQA 8464 sections 4.3.1.2–4.3.1.3. Draft pending teacher review.

> **Build note:** the code in `teachingFrames.ts` and `lesson.ts` is the final wording. During the build, contractions were written out in full (for example, "isn't" became "is not"), and a few explanations were split into two shorter sentences.

---

## States in full

State and frame shapes match `lesson-18/lesson.ts` and `teachingFrames.ts`. ✓ marks the correct option.

### B20-01 · choice · `priorKnowledge`, `diagnostic`
**Q:** Bacteria and viruses make you ill in different ways. How do most bacteria do it?
- 0 They burst your cells from inside · **1 They make toxins that damage cells and tissues ✓** · 2 They block your blood vessels
- Hint: Think back to Lesson 19: which pathogen made poisons?
- Explanation: Bursting cells is how viruses cause harm. Bacteria make toxins, and the toxins damage your cells and tissues.

### B20-02 · teach "Salmonella" · `disease-card`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A barbecue goes wrong | Undercooked chicken can cause food poisoning. | food → illness | A family eats chicken that isn't cooked all the way through. Hours later, two of them feel very ill. The cause is Salmonella, a type of bacterium. | `disease-salmonella-cause` |
| Signs of Salmonella | Toxins from the bacteria cause the symptoms. | toxins → symptoms | Symptoms are the signs of an illness. Salmonella causes fever, stomach cramps, vomiting and diarrhoea. Toxins made by the bacteria cause these symptoms. You met toxins in Lesson 19. | `disease-salmonella-signs` |
| How it spreads | It spreads in food and on dirty hands. | in food, on hands | You can catch it by eating food that already contains Salmonella, such as chicken infected while alive. You can also catch it from food prepared in an unclean kitchen. | `disease-salmonella-spread` |
| How it is stopped | Farm birds are vaccinated, and kitchens stay clean. | vaccinate birds, clean kitchens | Poultry means chickens, turkeys and other farm birds. In the UK, most poultry are vaccinated against Salmonella. This controls the spread to people. Clean hands and kitchens help too. | `disease-salmonella-stop` |

### B20-03 · choice
**Q:** Why are most UK chickens vaccinated against Salmonella?
- 0 To cure people who already have food poisoning · 1 To make the meat cook faster · **2 To control the spread of Salmonella to people ✓**
- Hint: Think about what happens before the chicken reaches a plate.
- Explanation: Vaccinated chickens are less likely to carry Salmonella. So less of it reaches food, and fewer people catch it.

### B20-04 · choice
**Q:** A cook handles raw chicken and doesn't wash their hands. Why is this a risk?
- **0 Salmonella could get onto other food ✓** · 1 Their hands will start making toxins · 2 The chicken will lose its vaccine
- Hint: Where could bacteria on the hands go next?
- Explanation: Raw chicken can carry Salmonella bacteria. Unwashed hands can carry the bacteria onto other food.

### B20-05 · teach "Gonorrhoea" · `disease-card`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Another bacterial disease | Gonorrhoea is passed on by sexual contact. | STD = sexually transmitted disease | Gonorrhoea is caused by bacteria. It is a sexually transmitted disease, or STD. An STD is passed on by sexual contact, such as sex without a condom. | `disease-gonorrhoea-cause` |
| Signs of gonorrhoea | A thick discharge and pain when urinating. | discharge = fluid coming out | Discharge means fluid coming out of the body. Gonorrhoea can cause a thick yellow or green discharge from the vagina or penis. It can also cause pain when urinating. | `disease-gonorrhoea-signs` |
| Treating gonorrhoea | It used to be treated with penicillin. | antibiotics kill bacteria | Antibiotics are medicines that kill bacteria. Gonorrhoea used to be treated with an antibiotic called penicillin. You will find out more about antibiotics in Lesson 24. | `disease-gonorrhoea-treat` |
| Resistant strains | Penicillin no longer kills many types of gonorrhoea. | resistant = not killed | There are now many strains, or types, of gonorrhoea that are resistant to penicillin. Resistant means penicillin no longer kills them. So doctors use other antibiotics instead. | `disease-gonorrhoea-resistant` |
| How it is stopped | Condoms block the bacteria. | barrier → can't pass on | Barrier methods of contraception, such as condoms, stop the bacteria passing between people. Treating people with the right antibiotic also stops them passing it on. | `disease-gonorrhoea-stop` |

### B20-06 · choice
**Q:** Why is penicillin no longer used for most gonorrhoea infections?
- 0 Gonorrhoea is now caused by a virus · **1 Many strains are resistant to penicillin ✓** · 2 Penicillin only works on food poisoning
- Hint: What does "resistant" mean?
- Explanation: Penicillin used to kill the bacteria. Many strains are no longer killed by it, so doctors use other antibiotics.

### B20-07 · choice
**Q:** Which of these reduces the spread of gonorrhoea?
- 0 Wearing a face mask · 1 Vaccinating chickens · **2 Using condoms ✓** · 3 Sleeping under a mosquito net
- Hint: How does gonorrhoea pass between people?
- Explanation: Gonorrhoea is passed on by sexual contact. Condoms are a barrier, so the bacteria can't pass between people.

### B20-08 · teach "Measles" · `disease-card`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A viral disease | Measles spreads like a cold. | droplets → breathed in | Measles is caused by a virus. It spreads like a cold. People breathe in droplets from an infected person's coughs and sneezes. | `disease-measles-cause` |
| Signs of measles | A fever and a red rash. | fever = high temperature | People with measles get a fever. A fever is a high temperature. They also get a red skin rash. | `disease-measles-signs` |
| Why vaccination matters | Measles can be serious, so children are vaccinated. | serious → vaccinate young | Measles can lead to other problems, called complications. Complications can kill. So most young children are vaccinated against measles. | `disease-measles-stop` |

### B20-09 · choice
**Q:** How does measles spread from one person to another?
- 0 By sexual contact · 1 In undercooked food · **2 In droplets from coughs and sneezes ✓**
- Hint: Measles spreads the same way as a cold.
- Explanation: Measles is a virus carried in droplets. People nearby breathe the droplets in.

### B20-10 · choice
**Q:** Why are most young children vaccinated against measles?
- 0 Measles only affects adults · 1 Measles is caused by bacteria · 2 Vaccines cure a measles rash · **3 Measles can lead to serious complications ✓**
- Hint: Think about what can happen after catching measles.
- Explanation: Measles can lead to complications, and these can kill. Vaccination makes children much less likely to catch it.

### B20-11 · teach "HIV" · `disease-card`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Another viral disease | HIV spreads through sexual contact and blood. | body fluids | HIV is a virus. It spreads by sexual contact, or when body fluids such as blood pass between people. Sharing needles is one way this can happen. | `disease-hiv-cause` |
| The first weeks | A flu-like illness, then often no symptoms. | flu-like, then quiet | At first, HIV causes a flu-like illness for a few weeks. After that, a person may have no symptoms for several years. | `disease-hiv-signs` |
| Keeping HIV under control | Antiretroviral drugs stop the virus copying itself. | stop the copying | Antiretroviral drugs control HIV. They stop the virus copying itself in the body. People taking them can stay well for many years. | `disease-hiv-stop` |
| If HIV is not controlled | HIV attacks immune cells. | fewer defences → other illnesses | Without treatment, HIV attacks immune cells. These cells help fight pathogens. You will meet them in Lesson 22. If the immune system is badly damaged, the body can't cope with other infections or cancers. This late stage is called AIDS. | `disease-hiv-late` |

### B20-12 · choice
**Q:** What do antiretroviral drugs do?
- 0 Kill bacteria in the blood · **1 Stop HIV copying itself in the body ✓** · 2 Clear up a measles rash
- Hint: HIV is a virus. What must it do to spread inside the body?
- Explanation: HIV makes copies of itself inside the body. Antiretroviral drugs stop the copying, which controls the virus.

### B20-13 · teach "Four diseases side by side" · `disease-grid`
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Put the cards together | Two are bacteria, two are viruses, and each spreads its own way. | route → stop | Salmonella and gonorrhoea are caused by bacteria. Measles and HIV are caused by viruses. Each one spreads in its own way, so each is stopped in its own way. | `disease-grid` |

### B20-14 · choice · question diagram `disease-grid-question` (assessment: columns numbered 1–4 in the order Salmonella, gonorrhoea, measles, HIV; names hidden)
**Q:** Look at column 3 of the grid. Which disease is it?
- 0 Salmonella · 1 Gonorrhoea · 2 HIV · **3 Measles ✓**
- Hint: Read the pathogen and the route first. Which disease spreads like a cold?
- Explanation: Column 3 is caused by a virus, spreads in droplets and causes a fever and a rash. That matches measles.

### B20-15 · choice · `application`, independent · question diagram `disease-symptom-card` (assessment: a patient card with signs only; disease hidden)
**Q:** A patient has the signs on this card. Which disease fits best?
- 0 Measles · **1 Gonorrhoea ✓** · 2 Salmonella
- Hint: Which disease causes a discharge?
- Explanation: Measles causes a fever and a rash, and Salmonella causes vomiting and cramps. Pain when urinating and a discharge match gonorrhoea.

### B20-16 · choice · `dataInterpretation`, independent · question diagram `disease-measles-data` (original data: vaccination 95, 93, 89, 85%; cases 12, 20, 64, 140 over four years)
**Q:** Look at the results. Which conclusion fits them?
- 0 Vaccination causes measles · 1 Cases fell as vaccination fell · **2 In this region, cases rose as vaccination fell ✓** · 3 Vaccination stops every case of measles
- Hint: Describe what happened, without claiming more than the data shows.
- Explanation: Vaccination fell from 95% to 85%, and cases rose from 12 to 140. The data shows a pattern in one region; it can't show that vaccination stops every case.

### B20-17 · choice · `application`, independent
**Q:** A restaurant kitchen has a Salmonella outbreak. Which action would most directly reduce the spread?
- **0 Hand washing and cleaning between raw and cooked food ✓** · 1 Mosquito nets for the staff · 2 Face masks for the customers
- Hint: How does Salmonella get into food?
- Explanation: Salmonella spreads in food and on unwashed hands and surfaces. Hand washing and cleaning stop it reaching cooked food.

### B20-18 · written · `teacherOnly`
**Q:** Salmonella and measles spread in different ways. Describe how each spreads, and give one way to reduce the spread of each.
- Hint: Take one disease at a time. What carries the pathogen, and what would block that route?
- Model answer: Salmonella spreads in food, such as undercooked chicken, or from unwashed hands in an unclean kitchen. Vaccinating poultry and keeping kitchens and hands clean reduce its spread. Measles spreads in droplets from coughs and sneezes. Vaccinating children reduces its spread.
- Marking points: Salmonella spreads in food or from unclean kitchens · Salmonella: vaccinate poultry or keep hands and kitchens clean · measles spreads in droplets that are breathed in · measles: vaccination (or isolation).
- Common errors: says measles spreads in food · says Salmonella is a virus · suggests antibiotics to stop measles.

## Checks against 17–18
- 18 states: 5 teach states (4 + 5 + 3 + 4 + 1 = 17 frames), 12 choice questions and 1 written task.
- Correct answer positions: 0 ×2, 1 ×4, 2 ×4, 3 ×2. The largest share is 33%.
- Question diagrams: 3, all in `assessment` form (B20-14, B20-15, B20-16).
- Base scenes: `disease-card` (one four-part card, recoloured per disease, with the current part highlighted), `disease-grid`, the symptom card and the data chart.

> **Diagram revision (after build):** the teaching diagrams are now scenes (HumanDiseaseVisuals.tsx), not four-panel cards. See the QA note.
