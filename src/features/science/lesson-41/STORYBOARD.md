# Lesson 46 storyboard — Variation and mutation (folder lesson-41)

First lesson of chapter B6b, Variation, evolution and classification.

Big idea: individuals of one species differ because of their genes, their environment, or both; new forms of genes arise by random mutation, and most do little, but very rarely one gives a new phenotype that can spread.

Flow note: the lesson starts with something every learner can see (no two people in a class look the same) and answers "why?" in three steps.
1. **Why are no two the same?** Variation is named first, then its two causes, each with one clear example: genes alone (eye colour, cystic fibrosis) and environment alone (two mint plants with the same genes, one grown in the dark). The mixed case (height) comes after both causes, because it only makes sense once each cause is known. One three-panel drawing builds up, one panel per frame.
2. **What is a mutation?** Genetic variation needs different forms of genes, so the next question is where they come from: a gene is a section of DNA with a code (link to the genome lesson), a mutation is a random change to that code, and the new form is a genetic variant. One DNA drawing zooms into one gene and changes one part.
3. **What can a mutation do?** Most variants do little or nothing, some have a small effect (eye colour, controlled by several genes) and very rarely one gives a new phenotype (cystic fibrosis). The last frame says a new phenotype can spread if it suits a changed environment, and hands on to natural selection in the next lesson. Arrow thickness in the drawing shows "most / some / very rarely" without exact numbers.

1. Start here (B41-01): why children look a bit like each parent (prior knowledge: inheriting genes).
2. Why are no two the same? (B41-02–04): variation → genetic → environmental → both → put it together. Checks: two mint plants with the same genes; a characteristic set by genes alone.
3. What is a mutation? (B41-05–07): a code in the DNA → a random change → a new version (genetic variant). Checks: what a mutation is; what the new form is called.
4. What can a mutation do? (B41-08–10): most little or no effect → some a small effect → rarely a new phenotype → useful when things change. Checks: how often a new phenotype arises; when it spreads.
5. On your own (B41-11–15): identical twins with different body mass; an invented wheat chart read without over-claiming; three numbered examples (which is both genes and environment); a mutation in one of several fur-colour genes; teacher-reviewed written answer.

Wording rules: one new term per frame, plain meaning first; British spelling; no bases, alleles or protein synthesis detail beyond "the code tells the cell how to make a protein".

Out of scope: natural selection and evolution (next lesson); the structure of DNA and how proteins are made; what causes mutations (radiation, chemicals); continuous and discontinuous variation; variation data handling beyond reading one chart.

Source boundary: supplied page 69 used for scope only; AQA 8464 section 4.6.2.1. The class of people, the mint plants, the sunflowers, the twins, the wheat chart, the rabbit example and all questions are original. Draft pending teacher review.

## Diagram plan
- `components/EvolutionVisuals.tsx`, focus prefix `evolve-`. Chapter colour code: coral = genes, DNA and mutations; green = plants and the environment; blue = water.
- `evolve-var-people`: five people of different heights, hair, skin and eye colours on one ground line.
- `evolve-var-genes/env/both/all`: one three-panel drawing (genes: three eyes; environment: two mint plants, light and dark; genes + environment: two sunflowers under a dashed "greatest height" line, one with lots of water); one panel lit per frame, all lit in the last.
- `evolve-mut-code/change/variant`: a DNA double helix with one gene bracketed; below, the gene enlarged as a row of paired coloured parts; one pair changes and is circled; then original and variant rows compared.
- `evolve-mut-none/small/big/useful`: a variant with three arrows of decreasing thickness (most / some / very rarely) to "little or no effect" (two identical eyes), "a small effect" (eye colour a bit different) and "a new phenotype" (lungs with sticky mucus: cystic fibrosis); the last frame adds the natural-selection hand-on.
- Question diagrams: `evolve-var-question` (three numbered panels in a new order; the "genes" line and panel names hidden in assessment view) and `evolve-var-data` (bar chart, mean height in cm, fields A and B).

## States in full

### B41-01 · choice · `priorKnowledge`, `diagnostic`
**Q:** Why do children often look a bit like each of their parents?
- 0 They eat the same food as their parents · 1 They copy the way their parents look · 2 They live in the same house · **3 They inherit genes from both parents ✓**
- Hint: You met genes when you learned how characteristics are passed on.
- Explanation: Food and home can change how you grow, but they do not pass on features from parents. Children inherit genes from both parents, so they share some of their characteristics.

### B41-02 · teach "Why are no two the same?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Variation | Individuals of one species all differ a little. | same species, different individuals | Look around your class. Everyone is a human, so you all belong to one species. But no two people look exactly the same. Differences between individuals of the same species are called variation. | `evolve-var-people` |
| Caused by genes | Some differences come from the genes you inherit. | genes from your parents → genetic variation | You inherit genes from your parents. Some characteristics are set by genes alone, such as eye colour. Inherited disorders, such as cystic fibrosis, are too. Variation caused by genes is called genetic variation. | `evolve-var-genes` |
| Caused by conditions | Some differences come from the conditions an organism lives in. | same genes, different conditions | Two plants grown from pieces of one mint plant have exactly the same genes. One grows in a sunny spot and stays bushy and green. The other grows in the dark and becomes tall, thin and pale. Variation caused by living conditions is called environmental variation. | `evolve-var-env` |
| Genes and conditions | Most characteristics depend on both. | genes set the limit; conditions decide the rest | Most variation comes from a mix of genes and the environment. Genes set the greatest height a plant or animal could reach. How tall it actually grows depends on its environment, such as how much food or water it gets. | `evolve-var-both` |
| Put it together | Genes, the environment, or both. | genes / environment / both | Some characteristics, such as eye colour, are set by genes alone. Some differences, such as a pale plant grown in the dark, come from the environment. Most characteristics, such as height, depend on both. | `evolve-var-all` |

### B41-03 · choice
**Q:** Two plants grown from pieces of the same mint plant have the same genes. One is kept in the dark and grows pale and thin. What caused the difference?
- 0 Their genes · **1 Their environment ✓** · 2 Their parents
- Hint: Are their genes the same or different?
- Explanation: The two plants have exactly the same genes, so genes cannot explain the difference. The difference comes from the conditions they grew in, so it is environmental variation.

### B41-04 · choice
**Q:** Which characteristic is set by genes alone?
- **0 Eye colour ✓** · 1 A scar · 2 Body mass · 3 The language you speak
- Hint: Which one could not be changed by how or where you live?
- Explanation: A scar and the language you speak come from the environment, and body mass depends on genes and the environment. Eye colour is set by genes alone.

### B41-05 · teach "What is a mutation?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A code in the DNA | A gene is a small section of DNA. | gene = a section of DNA with a code | You met DNA and genes when you learned about the genome. A gene is a small section of DNA. The parts of the DNA are in a set order. This order is a code that tells the cell how to make a protein. | `evolve-mut-code` |
| A random change | A mutation is a random change to a gene. | mutation = random change | Sometimes the code in a gene changes by chance. A random change like this is called a mutation. Mutations happen all the time, in all living things. | `evolve-mut-change` |
| A new version | A mutation makes a new form of the gene. | new form of a gene = genetic variant | After a mutation, the gene is different. So there is now a new form of the gene. A different form of a gene made by a mutation is called a genetic variant. | `evolve-mut-variant` |

### B41-06 · choice
**Q:** What is a mutation?
- 0 A change caused by what an organism eats · 1 A new species · **2 A random change to a gene ✓** · 3 An infection caused by bacteria
- Hint: Think about what happens to the code in the DNA.
- Explanation: Food affects growth, but it does not change the code in a gene. A mutation is a random change to a gene.

### B41-07 · choice
**Q:** A mutation changes a gene. What is the new form of the gene called?
- **0 A genetic variant ✓** · 1 A species · 2 A phenotype · 3 A chromosome
- Hint: It is a different form, or version, of the gene.
- Explanation: A phenotype is the characteristics an organism has, not the gene itself. A new form of a gene made by a mutation is a genetic variant.

### B41-08 · teach "What can a mutation do?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Most: little or no effect | Most genetic variants make little or no difference. | most → no change you can see | Most genetic variants have very little effect, or none at all, on the phenotype. You met phenotype, the characteristics an organism has, when you learned about genetic diagrams. | `evolve-mut-none` |
| Some: a small effect | Some variants change a characteristic a little. | some → a slight change | Some characteristics, such as eye colour, are controlled by more than one gene. A mutation in one of those genes might change the eye colour a bit. But the difference is small. | `evolve-mut-small` |
| Rarely: a big effect | Very rarely, a variant gives a new phenotype. | very rarely → a new phenotype | Very rarely, a variant has such a big effect that it produces a new phenotype. Cystic fibrosis is one example. One variant of one gene causes the disorder. | `evolve-mut-big` |
| Useful when things change | A new phenotype can help if the environment changes. | suits the new conditions → spreads | Sometimes a new phenotype suits a changed environment better. Individuals with it survive and reproduce more, so the variant spreads through the species quite quickly. This is natural selection, which you will learn about in the next lesson. | `evolve-mut-useful` |

### B41-09 · choice
**Q:** How often does a mutation produce a completely new phenotype?
- 0 Every time · 1 Most of the time · **2 Very rarely ✓** · 3 Never
- Hint: Think about what most genetic variants do.
- Explanation: Most variants have little or no effect, and some have a small effect. Only very rarely does a variant produce a new phenotype.

### B41-10 · choice
**Q:** When is a new phenotype most likely to spread through a species?
- **0 When it suits a changed environment better ✓** · 1 When it makes the individual less likely to survive · 2 Only when the organism is fully grown
- Hint: Which individuals survive and reproduce more?
- Explanation: Individuals with a phenotype that suits the new conditions survive and reproduce more. So a new phenotype spreads when it suits a changed environment better.

### B41-11 · choice · `application`, independent
**Q:** Identical twins have exactly the same genes. By the age of 30, one twin is 8 kg heavier than the other. What is the best explanation?
- 0 A mutation in every cell of one twin · 1 Genetic variation · **2 Environmental variation, such as diet and exercise ✓**
- Hint: If the genes are the same, what else can be different?
- Explanation: The twins have the same genes, so genetic variation cannot explain the difference. Differences in diet and exercise are environmental variation.

### B41-12 · choice · `dataInterpretation`, independent · question diagram `evolve-var-data` (assessment version hides the answer)
**Q:** Seeds from one batch of wheat, with almost identical genes, were sown in two fields. The chart shows the mean height of the plants. Which conclusion fits?
- 0 The plants in field A have different genes · **1 The difference is probably environmental, but the chart does not show which condition caused it ✓** · 2 Field B had less water · 3 Wheat always grows taller in field A
- Hint: Were the genes different? Does the chart say anything about water?
- Explanation: The plants had almost identical genes, so the difference is probably caused by the conditions in each field. The chart does not show which condition, such as water or nutrients, made the difference.

### B41-13 · choice · `understanding`, independent · question diagram `evolve-var-question` (assessment version hides the answer)
**Q:** Look at the three numbered examples. Which one shows variation caused by both genes and the environment?
- 0 Example 1 · **1 Example 2 ✓** · 2 Example 3
- Hint: Which example has a limit set by genes, and a result set by conditions?
- Explanation: Example 1 has the same genes but different light, so it is environmental. Example 3, eye colour, is set by genes alone. Example 2, height, depends on genes and the environment together.

### B41-14 · choice · `application`, independent
**Q:** A mutation happens in one of several genes that control fur colour in rabbits. What is the most likely result?
- **0 The fur colour changes slightly, or not at all ✓** · 1 A completely new species forms · 2 Every rabbit in the population changes colour
- Hint: Fur colour is controlled by more than one gene.
- Explanation: Most variants have little or no effect, and a change to one of several genes usually has a small effect. So the fur colour changes slightly, or not at all.

### B41-15 · written · `teacherOnly`
**Q:** Explain the difference between genetic and environmental variation, with an example of each. Then explain why height depends on both.
- Hint: Say what causes each type, give one example of each, then say what genes set and what the environment decides.
- Model answer: Genetic variation is caused by the genes an organism inherits from its parents; eye colour is an example. Environmental variation is caused by the conditions an organism lives in; a plant grown in the dark turning pale is an example. Height depends on both: genes set the greatest height it could reach, but the food or water it gets decides how tall it actually grows.
- Marking points: Genetic variation is caused by inherited genes. · A correct example of genetic variation, such as eye colour or cystic fibrosis. · Environmental variation is caused by the conditions an organism lives in. · A correct example of environmental variation, such as a plant grown in the dark or a scar. · Genes set the greatest possible height, and the environment, such as food, decides the actual height.
- Common errors: Saying all variation is caused by genes. · Giving height or body mass as an example of genes alone. · Saying a mutation always produces a new phenotype. · Saying environmental differences are passed on to offspring.

---

## Checks
- 15 states: 3 teaching states (5 + 3 + 4 frames), 11 choice questions and 1 written task.
- Correct answer positions: 0 ×4, 1 ×3, 2 ×3, 3 ×1.
- Question diagrams: B41-12, B41-13, all shown in `assessment` form.
