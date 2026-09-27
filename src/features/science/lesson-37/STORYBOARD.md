# Lesson 42 storyboard — DNA, genes and the genome (folder lesson-37)

First lesson of chapter B6, Inheritance, variation and evolution.

Big idea: every cell carries its instructions as DNA, packed into chromosomes; a gene is one small section of that DNA which codes for one protein, and all of it together is the genome.

Flow note: the lesson zooms in, then out again.
1. **Where is the DNA?** From a whole cell into the nucleus, to a chromosome, to the double helix, and finally to one strand as a polymer. One drawing is reused and one level lights up per frame, ending with a "put it together" frame.
2. **What does a gene do?** Out along one chromosome: a gene is a small section, it codes for a sequence of amino acids, and they are joined to make a protein.
3. **The whole genome.** All the genetic material together, then the three reasons knowing the human genome matters (genes linked to disease, inherited disorders and treatments, human migration).

Why this order: the gene only makes sense once learners can picture DNA on a chromosome, and the genome is simply "all of it", so it comes last. Mitosis is referred to by topic only (learners met chromosomes there). The next lesson uses chromosomes and genes to explain gametes and meiosis.

1. Start here (B37-01): which part of an animal cell holds the genetic material (links to cell structure).
2. Where is the DNA? (B37-02–04): DNA → chromosomes → double helix → polymer → put it together. Checks: the name of the shape; a numbered zoom diagram (which number is a chromosome).
3. What does a gene do? (B37-05–07): genes → amino acids → proteins → put it together. Checks: what a gene is; what a gene codes for.
4. The whole genome (B37-08–10): a genome → reading the genome → genes and disease → inherited disorders → human migration. Checks: what a genome is; one use in medicine.
5. On your own (B37-11–15): DNA in a carrot root cell; a numbered chromosome-to-protein diagram (which number is a gene); correct a wrong claim about genes; invented data on one gene version in people with and without a disease, read without over-claiming; teacher-reviewed written answer.

Wording rules: one new term per frame, plain meaning first, then "this is called X"; British spelling; no base letters (A, T, C, G) because they are not needed here.

Out of scope: the structure of nucleotides and base pairing, protein synthesis in detail, the history of the Human Genome Project, genetic testing of individuals, mutation (a later lesson).

Source boundary: supplied page 61 used for scope only; AQA 8464 section 4.6.1.4. All wording, examples, questions, the invented gene data and the diagrams are original. Draft pending teacher review.

## Diagram plan
- `components/InheritanceVisuals.tsx`, focus prefix `inherit-`. Colour code for the chapter: violet = DNA and chromosomes, amber = a gene, rose = from the mother (or the first parent in a cross), blue = from the father (or the second parent), terracotta = a disorder allele.
- **Zoom strip** (`inherit-dna-*`): cell → nucleus → chromosome → double helix, with a polymer strip in the last two frames. The question version numbers the four levels and hides their names.
- **Gene strip** (`inherit-gene-*`): a banded chromosome with one amber gene, zoomed to a helix section, then a bead chain of amino acids folding into a protein. The question version numbers the chain, chromosome, gene and protein.
- **Genome** (`inherit-genome-*`): a nucleus holding 23 pairs, genes marked once the genome is "read", beside three cards lit one at a time. Bar chart `inherit-genome-data` for B37-14.

## States in full

### B37-01 · choice · `priorKnowledge`, `diagnostic`
**Q:** In an animal cell, which part holds the genetic material and controls what the cell does?
- 0 Cell membrane · 1 Cytoplasm · **2 Nucleus ✓** · 3 Mitochondria
- Hint: You met this part when you learned about animal and plant cells.
- Explanation: The membrane controls what goes in and out, and most reactions happen in the cytoplasm and mitochondria. The nucleus holds the genetic material and controls the cell.

### B37-02 · teach "Where is the DNA?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Instructions for life | DNA carries the instructions for building an organism. | DNA = the instructions | Every cell carries instructions for building an organism and keeping it working. These instructions are stored in a chemical called DNA. All the genetic material in a cell is made of DNA. In animal and plant cells, it is kept in the nucleus. | `inherit-dna-cell` |
| Chromosomes | In the nucleus, DNA is packed into long structures. | nucleus → chromosomes | Inside the nucleus, the DNA is not loose. It is packed into very long, thin structures. These structures are called chromosomes. You met chromosomes when you learned how cells divide by mitosis. | `inherit-dna-chromosome` |
| Double helix | A DNA molecule is two strands twisted together. | two strands, one spiral | Each chromosome holds one very long DNA molecule, tightly coiled. The molecule is made of two strands wound around each other. This twisted, two-stranded spiral is called a double helix. | `inherit-dna-helix` |
| A polymer | Each DNA strand is a long chain of small units. | many small units → one long chain | Each strand of DNA is made by joining lots of small molecules together in a chain. A long molecule made from many small units joined together is called a polymer. So DNA is a polymer. | `inherit-dna-polymer` |
| Put it together | Cell, then nucleus, then chromosome, then DNA. | biggest → smallest | Start with the whole cell. Its nucleus holds the chromosomes. Each chromosome is one long DNA molecule, coiled up tightly. The DNA is a double helix of two polymer strands. | `inherit-dna-all` |

### B37-03 · choice
**Q:** What is the shape of a DNA molecule called?
- 0 A single strand · **1 A double helix ✓** · 2 A chromosome pair · 3 A nucleus
- Hint: How many strands are there, and how are they arranged?
- Explanation: A DNA molecule has two strands, not one. The two strands coil around each other, so the shape is a double helix.

### B37-04 · choice · question diagram `inherit-dna-question` (assessment version hides the answer)
Diagram: the cell-to-DNA zoom with four numbered parts: 1 the cell, 2 the nucleus, 3 a chromosome, 4 the DNA double helix. Names hidden in assessment view.

**Q:** Look at the numbered parts. Which number shows a chromosome?
- 0 Part 1 · 1 Part 2 · **2 Part 3 ✓** · 3 Part 4
- Hint: A chromosome is DNA packed into a long structure inside the nucleus.
- Explanation: Part 1 is the cell, part 2 is its nucleus and part 4 is the DNA double helix. Part 3 is a chromosome: DNA packed into a long structure.

### B37-05 · teach "What does a gene do?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Genes | A gene is a small section of DNA on a chromosome. | chromosome → many genes | A chromosome carries one long DNA molecule. Along it are many short sections, and each one does its own job. A small section of DNA on a chromosome is called a gene. | `inherit-gene-section` |
| Amino acids | Each gene codes for amino acids in a set order. | gene → which amino acids, in which order | A gene works like a code. It tells the cell which small molecules to use, and in which order. These small molecules are called amino acids. Each gene codes for its own sequence of amino acids. | `inherit-gene-code` |
| Proteins | The amino acids are joined to make a protein. | amino acids joined → protein | The cell joins the amino acids together in the order the gene sets. The chain then folds up to make a protein. So each gene codes for a particular protein. You met proteins such as enzymes when you learned about digestion. | `inherit-gene-protein` |
| Put it together | Gene, then amino acids in order, then protein. | gene → sequence → protein | A gene is a small section of DNA on a chromosome. It codes for a particular sequence of amino acids. The amino acids are joined to make a specific protein. Different genes code for different proteins. | `inherit-gene-all` |

### B37-06 · choice
**Q:** What is a gene?
- 0 A whole chromosome · 1 A protein made in the nucleus · 2 A type of cell · **3 A small section of DNA on a chromosome ✓**
- Hint: Is a gene bigger or smaller than a chromosome?
- Explanation: A chromosome carries many genes, and a gene codes for a protein rather than being one. A gene is a small section of DNA on a chromosome.

### B37-07 · choice
**Q:** What does a gene code for?
- **0 A particular sequence of amino acids, which makes a protein ✓** · 1 A new nucleus for the cell · 2 Glucose for respiration · 3 A chromosome
- Hint: What does the cell join together to make a protein?
- Explanation: A gene sets which amino acids are used, and in which order. So it codes for a particular sequence of amino acids, which makes a protein.

### B37-08 · teach "The whole genome"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A genome | All of an organism’s genetic material is its genome. | genome = all the genetic material | Now think about every chromosome in a cell, with every gene on them. All of the genetic material in an organism is called its genome. Most human cells keep their genome on 46 chromosomes. | `inherit-genome-set` |
| Reading the genome | Scientists have worked out the whole human genome. | the full set, worked out | Scientists have worked out the whole human genome. They now know where many genes are on each chromosome. This is very useful for science and medicine, in three main ways. | `inherit-genome-map` |
| Genes and disease | Some genes are linked to diseases. | find the gene → spot the risk | Scientists can search the genome for genes that are linked to different diseases. People with a certain version of one of these genes may be more likely to get the disease. Knowing this can help doctors see who is at risk. | `inherit-genome-disease` |
| Inherited disorders | Knowing the genes can lead to treatments. | understand → treat | Some disorders are passed from parents to their children in their genes. These are called inherited disorders. When scientists know which genes are involved, they can understand a disorder better. This could help them develop treatments. | `inherit-genome-treat` |
| Human migration | Tiny differences in genomes show how people moved. | tiny differences → where ancestors went | Human genomes are almost the same, but there are tiny differences between people. Scientists compare these differences in people living in different places. This shows how groups of humans moved around the world in the past. Movement like this is called migration. | `inherit-genome-migration` |

### B37-09 · choice
**Q:** What is an organism’s genome?
- 0 One of its genes · **1 All of the genetic material in the organism ✓** · 2 The nucleus of one cell · 3 All the proteins in the organism
- Hint: Is a genome a part, or the whole set?
- Explanation: A gene is one small section of DNA, and proteins are what genes code for. The genome is all of the genetic material in the organism.

### B37-10 · choice
**Q:** Which is one way that understanding the human genome helps medicine?
- **0 Scientists can find genes linked to diseases ✓** · 1 It makes everyone’s genome the same · 2 It stops cells from making proteins · 3 It makes the nucleus bigger
- Hint: Think of the three uses: disease, inherited disorders and migration.
- Explanation: Knowing where genes are lets scientists search for the ones linked to diseases. This helps doctors see who is at risk, and could lead to treatments.

### B37-11 · choice · `application`, independent
**Q:** A student looks at a cell from a carrot root under a microscope. Where is most of the cell’s DNA?
- 0 In the cell wall · **1 In the nucleus, packed into chromosomes ✓** · 2 In the vacuole · 3 Root cells have no DNA
- Hint: Is DNA kept in the same place in plant cells and animal cells?
- Explanation: The cell wall and the vacuole do not hold DNA, and root cells need DNA like any other cell. Most of the DNA is in the nucleus, packed into chromosomes.

### B37-12 · choice · `understanding`, independent · question diagram `inherit-gene-question` (assessment version hides the answer)
Diagram: a banded chromosome with one amber band, a chain of eight amino-acid beads and a folded protein. Numbers: 1 the bead chain, 2 the chromosome, 3 the amber band (a gene), 4 the protein. Names hidden.

**Q:** The diagram shows a chromosome and what its DNA codes for. Which number shows one gene?
- 0 Part 1 · 1 Part 2 · **2 Part 3 ✓** · 3 Part 4
- Hint: A gene is a small section of DNA on a chromosome.
- Explanation: Part 1 is the whole chromosome, part 2 is its DNA double helix and part 4 is a protein. Part 3 is one small section of the DNA: a gene.

### B37-13 · choice · `understanding`, independent
**Q:** Sam writes: “A gene is a protein found in the nucleus.” Which sentence corrects Sam?
- **0 A gene is a section of DNA that codes for a protein ✓** · 1 A gene is a whole chromosome that codes for a cell · 2 A gene is one amino acid · 3 Sam is correct
- Hint: Is a gene the protein itself, or the code for it?
- Explanation: A gene is not a protein; the protein is made from amino acids in the order the gene codes for. A gene is a section of DNA that codes for a protein.

### B37-14 · choice · `dataInterpretation`, independent · question diagram `inherit-genome-data` (assessment version hides the answer)
Diagram: invented bar chart: 42% of 500 people with a disease and 12% of 500 people without it have one version of a gene. No conclusion text.

**Q:** Scientists looked at one gene in 500 people with a disease and 500 people without it. The graph shows the percentage with one version of the gene. Which conclusion fits?
- 0 Everyone with this version of the gene gets the disease · **1 This version of the gene is more common in people with the disease ✓** · 2 This gene has nothing to do with the disease · 3 This gene is the only cause of the disease
- Hint: Compare the two bars. Did everyone in either group have it?
- Explanation: 42% of people with the disease had this version, compared with 12% of people without it; most people with the disease did not have it. So it is more common in people with the disease, but the data cannot show it is the only cause.

### B37-15 · written · `teacherOnly`
**Q:** Explain what a gene is and how it leads to a protein. Then describe one way that studying the human genome is useful.
- Hint: Say where a gene is and what it codes for, then give one use of the genome.
- Model answer: A gene is a small section of DNA on a chromosome, in the nucleus. It codes for a particular sequence of amino acids. The cell joins these amino acids together to make a specific protein. Knowing the human genome helps scientists find genes linked to diseases, so doctors can see who is at risk.
- Marking points: A gene is a small section of DNA. · Genes are on chromosomes, in the nucleus. · A gene codes for a particular sequence of amino acids. · The amino acids are joined to make a specific protein. · One correct use: finding genes linked to disease, understanding and treating inherited disorders, or tracing human migration.
- Common errors: Saying a gene is a protein or an amino acid. · Saying a gene is a whole chromosome, or the whole genome. · Saying DNA is found in the cell membrane or cytoplasm. · Saying the genome shows exactly which diseases a person will get.

---

## Checks
- 15 states: 3 teaching states (5 + 4 + 5 frames), 11 choice questions and 1 written task.
- Correct answer positions: 0 ×3, 1 ×4, 2 ×3, 3 ×1. The largest share is 36%.
- Question diagrams: 3, all shown in `assessment` form.
