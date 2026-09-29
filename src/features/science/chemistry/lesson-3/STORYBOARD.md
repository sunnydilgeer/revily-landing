# Chemistry Lesson 3 storyboard — Mixtures and chromatography

Chapter C1a, Atoms, elements, compounds and mixtures. Folder `chemistry/lesson-3`, id `C-ATM-003-C`, skill `C-MIXTURES`. It follows the lesson on compounds, formulas and equations and hands on to the lesson on filtration, crystallisation and distillation.

Big idea: a mixture is two or more elements or compounds that are together but not chemically combined. With no bonds between the parts, each part keeps its own properties, so physical methods can separate them without making new substances. Paper chromatography is one such method: each dye in an ink keeps its own properties, so each moves up the paper at its own speed.

Flow note: the lesson keeps one pair of substances, iron and sulfur, for the whole first half (element, compound, mixture, magnet, heating), so "mixture" is always seen next to the compound the student already knows. Chromatography comes last because it needs all three earlier ideas.
1. **What is a mixture?** Starts from element and compound (recap, one clause) so the mixture can be defined against them; then "no bonds"; then two standard mixtures from the page, air (elements and a compound together) and crude oil (many compounds).
2. **Does each part change?** "Properties" is defined first, because "each part keeps its properties" needs it. The magnet shows it; heating to make iron sulfide gives the contrast (a new substance with new properties).
3. **How can you separate a mixture?** Unchanged properties and no bonds are why physical methods work, so this follows section 2. The five methods are only named (the next lesson teaches the first four); a compound cannot be split this way.
4. **Set up paper chromatography.** One set-up drawing built step by step: pencil line, ink spot, shallow solvent below the line, lid, solvent rising. Each step comes with its reason. Treated as preparation for the class practical, with proportionate safety.
5. **Read a chromatogram.** Different speeds → one spot per dye (chromatogram) → an insoluble dye stays on the line → the solvent front → put together. Speeds come first because they explain why there are separate spots.
6. **On your own** applies each idea to something new: a numbered green-ink chromatogram in assessment view, sea water, a three-ink chromatogram read without over-claiming ("at least three dyes"), and a written explanation of why chromatography separates the dyes in black ink.

Sections:
1. Start here (C3-01): steel paper clips in rice come out with a magnet (everyday; sets up "mixed, not joined" and the magnet test).
2. What is a mixture? (C3-02–04): element and compound recap → mixture → no bonds → air → crude oil. Checks: which particle box is a mixture; mixture vs compound.
3. Does each part change? (C3-05–07): properties → each part keeps its properties (magnet) → heating makes iron sulfide, a compound with different properties. Checks: stirred iron and sulfur; oxygen in air still helps things burn.
4. How can you separate a mixture? (C3-08–09): physical methods make no new substances → the five methods named → a compound needs a chemical reaction. Check: why filtration is a physical method.
5. Set up paper chromatography (C3-10–12): chromatography → pencil line → ink spot → solvent (shallow, below the line) → lid → let it run, dry, safety. Checks: why pencil; why the solvent is below the line.
6. Read a chromatogram (C3-13–15): different speeds → one spot per dye, chromatogram → insoluble dye on the line → solvent front → put it together. Checks: three spots means three dyes; why a spot stays on the line.
7. On your own (C3-16–19): numbered chromatogram (which part did not dissolve); sea water separated by a physical method; three inks on one sheet; written task on black ink.

No calculation in this lesson (Rf values are not on the source page and are left out).

Wording rules: one new term per frame, plain meaning first then "is called X"; compounds are referred to in one clause ("You met compounds when you learned about formulas and equations"); the next lesson is named by topic; British spelling.

Out of scope: Rf values and identifying substances by comparing with reference spots (not on the page; they belong to chemical analysis later); pure substances and formulations; how filtration, crystallisation and the two distillations work (next lesson); what crude oil's compounds are called or how they are separated (fractional distillation is only named); stationary and mobile phases; Higher-tier or Chemistry-only content; the book's cartoons, jokes, sweets analogy, exam questions and its air and crude-oil artwork.

Source boundary: supplied revision-guide pages 96–97 (scope only); AQA 8464 Chemistry 5.1.1.2 (with 5.1.1.1 for the compound contrast). The iron and sulfur example is the standard one named on the page; the paper clips, particle boxes, air box, crude-oil chains, magnet and heating pictures, set-up build, black-ink and green-ink chromatograms, the three-ink sheet, sea water, all questions, all diagrams and all wording are original. Draft pending teacher review.

Judgement calls for the teacher: iron sulfide is drawn as an alternating 1 : 1 block of iron and sulfur atoms and the iron and sulfur powders as small grains of atoms (a schematic, not a crystal structure); sulfur is drawn as single atoms, not S₈ rings. The air box has 8 N₂, 2 O₂, 1 Ar and 1 CO₂: nitrogen and oxygen are roughly in proportion, argon and carbon dioxide are over-represented so they can be seen (the caption says "mainly nitrogen and oxygen"). Iron sulfide is said to have "different properties" without claiming it is non-magnetic. The frame on heating iron and sulfur states the reaction only; it is not a practical instruction. Safety is kept to "follow your teacher's safety rules" and "ethanol catches fire easily, keep it away from flames". C3-18's correct answer says "at least three dyes", because two dyes could land in the same place.

## Diagram plan
- `components/MixtureVisuals.tsx`, focus prefix `mix-`, routed by `CellBiologyVisuals.tsx`. Ink, muted greys, panels and the amber "active" highlight match `AtomVisuals.tsx` (palette imported). Atoms are soft circles with their symbol inside: iron grey, sulfur yellow, hydrogen white, oxygen soft red, nitrogen soft blue, argon lavender, carbon dark grey. Solvent pale blue, filter paper cream, pencil graphite grey; dyes yellow, pink, blue, purple (green for the question ink).
- **Particle boxes** (`mix-kinds-*`): three boxes, 1 element (iron), 2 compound (iron sulfide), 3 mixture (grains of iron and sulfur); recap, mixture and bonds frames change the highlight and captions.
- **Examples** (`mix-examples-air`, `-crude`): air box (N₂, O₂, Ar, CO₂) beside a crude-oil box of four carbon chains (3, 5, 6 and 9 carbons, each with the right number of hydrogens); one panel highlighted at a time.
- **Iron and sulfur** (`mix-props-*`): a dish of the mixture with a property key; a magnet lifting the iron filings and leaving the sulfur; heating to make iron sulfide.
- **Separating** (`mix-sep-physical`, `-compare`, `-methods`): mixture → magnet → iron + sulfur ("nothing new"), with the compound row (a crossed-out physical method) added in the last frame; a list of the five methods with small icons, chromatography marked "this lesson".
- **Set-up** (`mix-chrom-*`): one beaker drawing (rod and clip, lid, shallow solvent, paper strip) with a five-step numbered key and numbered pointers, built up one step per frame.
- **Chromatogram** (`mix-gram-*`): three strips (start, part way, finished) of a black ink with four dyes (yellow, pink, blue, and purple on the line); each frame highlights speeds, spots, the insoluble dye, the solvent front, then labels everything.
- **Question visuals:** `mix-boxes-question` (Box 1 water, Box 2 oxygen, Box 3 hydrogen + oxygen; names hidden in assessment view), `mix-gram-question` (green ink; pointers 1 solvent front, 2 spot on the line, 3 blue spot; key hidden in assessment view), `mix-pens` (inks A, B, C on one sheet).

## States in full

### C3-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Some steel paper clips fall into a tub of dry rice. What is the quickest way to get them out?
- **0 Pull them out with a magnet ✓** · 1 Cook the rice until the clips melt · 2 You cannot, because the clips and rice have joined together
- Hint: Is steel or rice attracted to a magnet?
- Explanation: The clips and the rice are only mixed. They have not joined together. Steel is attracted to a magnet and rice is not, so a magnet can pull the clips out.

### C3-02 · teach "What is a mixture?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Elements and compounds | You have already met elements and compounds. | element → one kind of atom; compound → different atoms bonded | An element is made of only one kind of atom, like iron. You met compounds when you learned about formulas and equations. In a compound, atoms of different elements are joined by chemical bonds. Iron sulfide is a compound of iron and sulfur. | `mix-kinds-recap` |
| Mixed, not joined | Substances can be mixed without joining together. | together but not chemically combined → mixture | Stir iron powder and sulfur powder together. The iron and sulfur are now mixed, but they have not joined. Two or more elements or compounds that are together but not chemically combined are called a mixture. | `mix-kinds-mixture` |
| No bonds | Nothing holds the parts of a mixture together. | mixture → no chemical bonds between the parts | In a compound, chemical bonds hold the different atoms together in a fixed pattern. In a mixture, there are no chemical bonds between the different parts. The grains of iron and grains of sulfur just sit side by side. So the parts of a mixture can be separated quite easily. | `mix-kinds-bonds` |
| Air | Air is a mixture of gases. | air → nitrogen, oxygen, argon, carbon dioxide | Air is a mixture of different gases. It is mainly nitrogen and oxygen, with a little argon and carbon dioxide. Nitrogen, oxygen and argon are elements, and carbon dioxide is a compound. So a mixture can hold elements and compounds together. | `mix-examples-air` |
| Crude oil | Crude oil is a mixture of many compounds. | crude oil → many different compounds | Crude oil is a thick, dark liquid found underground. It is a mixture of many different compounds. Most of them are made of carbon and hydrogen atoms, in chains of different lengths. These compounds are not bonded to each other, so they can be separated. | `mix-examples-crude` |

### C3-03 · choice · `understanding, guided, practice` · visual `mix-boxes-question`
**Q:** Each box shows the particles in a substance. Which box shows a mixture?
- 0 Box 1 · 1 Box 2 · **2 Box 3 ✓**
- Hint: Look for different particles that are not joined to each other.
- Explanation: Box 1 has hydrogen and oxygen atoms bonded together, so it is a compound. Box 2 has only one kind of atom, so it is an element. Box 3 has hydrogen particles and oxygen particles that are not joined to each other, so it is a mixture.

### C3-04 · choice · `understanding, guided, practice`
**Q:** What is the difference between a mixture and a compound?
- 0 A mixture contains only elements, never compounds · **1 Only a compound has chemical bonds between its parts ✓** · 2 The parts of a mixture are held together by chemical bonds · 3 A compound contains only one kind of atom
- Hint: Which one has chemical bonds holding its parts together?
- Explanation: In a compound, atoms of different elements are joined by chemical bonds. In a mixture, the parts are together but not chemically combined, so there are no bonds between them.

### C3-05 · teach "Does each part change?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Properties | Every substance has its own features. | what it is like + how it behaves → properties | Iron is grey and is attracted to a magnet. Sulfur is yellow and is not attracted to a magnet. What a substance is like and how it behaves are called its properties. Melting point and hardness are properties too. | `mix-props-look` |
| Each part stays the same | In a mixture, each part keeps its own properties. | mixture → each part unchanged | Mixing iron and sulfur does not change either of them. You can still see grey bits of iron and yellow bits of sulfur. A magnet still picks out the iron and leaves the sulfur behind. So each part of a mixture keeps its own properties. | `mix-props-magnet` |
| A compound is different | A compound has new properties of its own. | heat → reaction → new substance, new properties | If iron and sulfur are heated strongly, they react. They make iron sulfide, a new substance. It is a compound, and its properties are different from those of iron and of sulfur. This is not a mixture any more. | `mix-props-react` |

### C3-06 · choice · `understanding, guided, practice`
**Q:** Iron filings and sulfur powder are stirred together. Which statement is true?
- 0 A new substance has formed · 1 The iron and sulfur are now joined by chemical bonds · **2 The iron is still attracted to a magnet ✓** · 3 The iron has lost its own properties
- Hint: Does stirring change the iron itself?
- Explanation: Stirring only mixes the iron and sulfur. No new substance forms and no bonds are made. So the iron keeps its own properties, and it is still attracted to a magnet.

### C3-07 · choice · `understanding, guided, practice`
**Q:** Air is a mixture. Why can the oxygen in air still help things burn?
- **0 The oxygen keeps its own properties in the mixture ✓** · 1 The oxygen is bonded to the nitrogen in air · 2 Air is a compound of oxygen and nitrogen
- Hint: What happens to the properties of each part of a mixture?
- Explanation: Air is a mixture, so the oxygen is not bonded to the other gases. So the oxygen keeps its own properties, including helping things burn.

### C3-08 · teach "How can you separate a mixture?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Getting the parts back | A mixture can be separated without a reaction. | no reaction, no new substances → physical method | There are no bonds between the parts of a mixture. So you can separate them without a chemical reaction. Pulling iron out with a magnet is one example. Ways of separating that make no new substances are called physical methods. | `mix-sep-physical` |
| Five main methods | Chemists choose a physical method to suit the mixture. | filtration, crystallisation, simple and fractional distillation, chromatography | Different mixtures need different physical methods. The main ones are filtration, crystallisation, simple distillation, fractional distillation and chromatography. You will learn the first four in the next lesson. The rest of this lesson is about chromatography. | `mix-sep-methods` |
| Put it together | A physical method cannot split up a compound. | mixture → physical method; compound → only a reaction | The iron and sulfur in iron sulfide are held together by chemical bonds. So a magnet cannot pull the iron out of it. Physical methods cannot separate a compound into its elements. Only a chemical reaction can do that. | `mix-sep-compare` |

### C3-09 · choice · `understanding, guided, practice`
**Q:** Why is filtration called a physical method?
- 0 It breaks chemical bonds · 1 It uses a chemical reaction · 2 It turns a mixture into a compound · **3 It makes no new substances ✓**
- Hint: What do all the ways of separating a mixture have in common?
- Explanation: A physical method separates the parts of a mixture without a chemical reaction. So no new substances are made: you get back the same substances that were mixed.

### C3-10 · teach "Set up paper chromatography"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Paper chromatography | Ink is often a mixture of coloured dyes. | dyes carried up paper → chromatography | Many inks are a mixture of different coloured dyes. One way to separate the dyes is to let a liquid carry them up a sheet of paper. This method is called paper chromatography. You will do it in class, and this lesson helps you get ready. | `mix-chrom-intro` |
| A pencil line | The start line is drawn in pencil. | pencil → does not dissolve, so it stays put | Draw a line near the bottom of a sheet of filter paper. Use a pencil, not a pen. Pencil marks do not dissolve, so the line will not run up the paper. | `mix-chrom-line` |
| A spot of ink | The ink goes on the pencil line. | small spot of ink → on the line | Put a small spot of the ink on the middle of the pencil line. A small, neat spot gives the clearest result. | `mix-chrom-spot` |
| The solvent | A shallow layer of liquid goes in the beaker. | liquid that dissolves things → solvent; keep it below the line | A liquid that dissolves other substances is called a solvent. Pour a shallow layer of solvent into a beaker. Water often works, but sometimes another solvent, like ethanol, is needed. Hang the paper so it dips in, with the ink above the solvent. Otherwise the ink would dissolve into the pool of solvent. | `mix-chrom-solvent` |
| A lid | A lid goes on top of the beaker. | lid → solvent does not evaporate | Put a lid on the beaker. The lid stops the solvent evaporating, so it can soak steadily up the paper. | `mix-chrom-lid` |
| Let it run | The solvent moves up and carries the ink with it. | solvent soaks up → dyes carried up → take out, dry | The solvent slowly soaks up the paper and carries the ink with it. When the solvent has nearly reached the top, take the paper out and let it dry. In class, follow your teacher’s safety rules. Some solvents, like ethanol, catch fire easily, so keep them away from flames. | `mix-chrom-run` |

### C3-11 · choice · `understanding, guided, practice`
**Q:** Why is the start line drawn in pencil, not in pen?
- 0 Pencil is easier to see · **1 Pencil does not dissolve in the solvent ✓** · 2 Pen ink would stop the solvent moving · 3 Pencil helps the dyes dissolve
- Hint: What would happen to a line of pen ink when the solvent reached it?
- Explanation: Pen ink could dissolve in the solvent and run up the paper with the dyes. Pencil does not dissolve, so the line stays where it is.

### C3-12 · choice · `understanding, guided, practice`
**Q:** Why must the solvent be below the pencil line when the paper goes in?
- 0 So the lid fits on the beaker · 1 So the solvent evaporates faster · 2 So the dyes move faster · **3 So the ink does not dissolve into the pool of solvent ✓**
- Hint: Where would the ink go if it sat under the solvent?
- Explanation: If the spot were under the solvent, the ink would dissolve into the liquid in the beaker. With the solvent below the line, the solvent soaks up to the ink and carries it up the paper.

### C3-13 · teach "Read a chromatogram"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Different speeds | Each dye moves up the paper at its own speed. | different speeds → dyes spread apart | As the solvent moves up, it carries the dyes with it. Each dye moves at a different speed. So the dyes spread apart and separate from each other. | `mix-gram-speeds` |
| One spot per dye | Each dye ends up as a spot in its own place. | one spot for each dye → chromatogram | When the paper dries, each dye is left as a spot in a different place. There should be one spot for each dye in the ink. The pattern of spots on the paper is called a chromatogram. | `mix-gram-spots` |
| A dye that stays put | A dye that does not dissolve stays on the line. | does not dissolve → insoluble → stays on the line | Sometimes a dye does not dissolve in the solvent. A substance that does not dissolve is called insoluble. The solvent cannot carry an insoluble dye, so it stays on the pencil line. It still counts as one of the dyes. | `mix-gram-insoluble` |
| The solvent front | The solvent reaches a highest point. | furthest the solvent got → solvent front | The solvent keeps soaking up until you take the paper out. The furthest point the solvent reaches is called the solvent front. Every dye that dissolved is somewhere below it. | `mix-gram-front` |
| Put it together | The chromatogram shows the dyes in the ink. | count every spot, including any on the line | This black ink gave four spots, so it contains four dyes. Three dyes dissolved and moved up at different speeds. The yellow dye moved fastest, so it is nearest the solvent front. One dye is insoluble in this solvent, so it stayed on the pencil line. | `mix-gram-all` |

### C3-14 · choice · `application, guided, practice`
**Q:** A brown food colouring gives three spots, with nothing left on the pencil line. How many dyes does it show?
- 0 1 · 1 2 · **2 3 ✓** · 3 4
- Hint: How many spots does each dye make?
- Explanation: Each dye makes one spot in its own place. There are three spots and none on the line, so the chromatogram shows three dyes.

### C3-15 · choice · `understanding, guided, practice`
**Q:** After chromatography, one spot of a red ink is still on the pencil line. Why?
- **0 That dye is insoluble in the solvent ✓** · 1 That dye moved the fastest · 2 The pencil soaked up that dye · 3 The solvent front stopped that dye
- Hint: Which dyes are carried up by the solvent?
- Explanation: The solvent carries up only the dyes that dissolve in it. A dye that is insoluble in the solvent is not carried up, so it stays on the pencil line.

### C3-16 · choice · `understanding, independent, independent` · visual `mix-gram-question`
**Q:** This chromatogram is from a green ink. Which numbered part is a dye that did not dissolve in the solvent?
- 0 Part 1 · **1 Part 2 ✓** · 2 Part 3
- Hint: Where does a dye stay if the solvent cannot carry it?
- Explanation: Part 1 is the solvent front and part 3 is a dye that moved up the paper. Part 2 is still on the pencil line, so it is a dye that did not dissolve in the solvent.

### C3-17 · choice · `application, independent, independent`
**Q:** Sea water is a mixture of water and dissolved salts. Which statement about separating it is correct?
- 0 The salts are bonded to the water, so a reaction is needed · 1 Separating it makes new substances · 2 It is a compound, because it contains more than one substance · **3 The water can be separated by a physical method, making no new substances ✓**
- Hint: Are the salts and the water chemically combined?
- Explanation: Sea water is a mixture, so the salts and the water are not bonded to each other. So they can be separated by a physical method, and no new substances are made.

### C3-18 · choice · `dataInterpretation, independent, independent` · visual `mix-pens`
**Q:** Three inks, A, B and C, were tested on one sheet. Which conclusion does this chromatogram support?
- 0 Ink A contains no dyes · **1 Ink B contains at least three different dyes ✓** · 2 All the dyes in ink C dissolve in the solvent · 3 Ink B is a compound of three dyes
- Hint: Count the spots for each ink, including any on the pencil line.
- Explanation: Ink B gives three spots, and each dye makes its own spot, so ink B contains at least three dyes. Ink A gives one spot, so it has a dye. Ink C has a spot left on the line, so one of its dyes did not dissolve.

### C3-19 · written · `explanation, transfer, independent`
**Q:** Black ink is a mixture of dyes. Explain why paper chromatography can separate the dyes, and what the chromatogram shows.
- Hint: Think about bonds between the dyes, how fast each dye moves, and what each spot means.
- Model answer: The dyes in the ink are mixed, not chemically combined, so there are no bonds between them and a physical method can separate them without making new substances. Each dye keeps its own properties, so each one moves up the paper with the solvent at its own speed. The dyes end up in different places, with one spot for each dye. A dye that is insoluble in the solvent is not carried up, so it stays on the pencil line.
- Rubric (4): The dyes are mixed, not chemically combined, so a physical method can separate them and no new substances form. / Each dye keeps its own properties, so each moves up the paper at a different speed. / The dyes end up in different places: one spot for each dye. / A dye that is insoluble in the solvent stays on the pencil line.
- Reject: Saying the dyes react with the solvent to make new substances. / Saying black ink is a compound of dyes. / Saying an insoluble dye moves furthest up the paper.
