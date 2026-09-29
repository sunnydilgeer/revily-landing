# Chemistry Lesson 5 storyboard — How the model of the atom changed

Chapter C1b, The periodic table. Folder `chemistry/lesson-5`, id `C-PER-005-C`, skill `C-ATOM-HISTORY`. It builds on the atoms lesson (protons, neutrons, electrons, nucleus, shells), which it refers to by topic only.

Big idea: scientists cannot see inside atoms, so they use models that fit the evidence, and change them when new evidence does not fit. Solid spheres → (electrons found) plum pudding → (gold foil experiment) nuclear model → (Bohr) electrons in shells at fixed distances → (protons, then Chadwick's neutrons) today's model.

Flow note: the lesson follows the evidence in time order, and each model is taught only after the evidence that broke the one before it. One timeline strip of the five models sits above every model drawing, with the current model highlighted, so the student always knows where they are in the story.
1. **What did early scientists think?** Starts with what a model is (the idea every later step depends on), then solid spheres, the discovery of electrons, and the plum pudding model that followed from it.
2. **What did the gold foil show?** The set-up, then the prediction from the plum pudding model, then the results, and then why the results broke the model. The prediction comes before the results so "more than expected" means something.
3. **What is the nuclear model?** Only now is the nucleus introduced, and the same gold foil drawing is redrawn with nuclear atoms so each result is explained on the picture the student already knows (most straight through = empty space; close pass = deflected; head-on = back, because positive charges repel). Ends with plum pudding and nuclear side by side.
4. **What came next?** Bohr's shells at fixed distances (supported by experiments), then protons, then Chadwick's neutrons about 20 years later, ending on the lithium-7 atom used in the atoms lesson, and a whole-story timeline.
5. **On your own** applies the story: order of the models, a numbered paths diagram in assessment view (nuclei hidden), invented computer-model data read without over-claiming, and a teacher-reviewed written explanation of how the gold foil experiment disproved the plum pudding model.

Sections:
1. Start here (C5-01): what scientists do when evidence does not fit a model (everyday idea of science; sets up the big idea).
2. What did early scientists think? (C5-02–04): models change with evidence → solid sphere model → electrons found → plum pudding model. Checks: which description is the plum pudding model; why the solid sphere model was dropped.
3. What did the gold foil show? (C5-05–07): alpha particles (small, positive) fired at very thin gold foil → prediction (almost all straight through, a few small changes of direction) → results (most straight, some deflected more than expected, a few bounced back) → the plum pudding model could not be right. Checks: which result was not predicted; what most alpha particles did.
4. What is the nuclear model? (C5-08–10): tiny positive nucleus with most of the mass, electrons around it → mostly empty space → like charges repel, so close passes are deflected and head-on ones bounce back → plum pudding vs nuclear comparison. Checks: why most went straight through; what bouncing back says about the nucleus.
5. What came next? (C5-11–13): Bohr: electrons orbit in shells at fixed distances, supported by experiments → protons share the nucleus's positive charge equally → Chadwick: neutrons, about 20 years after the nucleus was accepted → the whole story. Checks: what Bohr added; what Chadwick showed.
6. On your own (C5-14–17): order of the models; numbered alpha paths (which passed through empty space); computer-model data (9 978 / 20 / 2 of 10 000); written task on plum pudding and the gold foil experiment.

No calculations in this lesson.

Wording rules: one new term per frame (scientific model, solid sphere model, plum pudding model, alpha particles, prediction, deflected, nuclear model, repel, orbiting), plain meaning first then "is called X"; the atoms lesson referred to by topic in one clause; British spelling. "Gold foil experiment" is used as the everyday name alongside "alpha particle scattering experiment" (section detail and cards).

Out of scope: energy levels, spectra and Bohr's calculations (Foundation only asks that experiments supported him); the names Thomson, Rutherford, Geiger and Marsden and dates (not on the page or required); how alpha particles were detected; why alpha particles are emitted (radioactivity is Physics); isotopes and relative mass (atoms lesson); electronic structure rules (next lessons); the book's cartoons, "delicious pudding" drawing, jokes and exam question.

Source boundary: supplied revision-guide page 101 (scope only); AQA 8464 Chemistry 5.1.1.3. The timeline strip, all drawings (including the gold foil paths), the lithium atom continuation, the computer-model data, all questions and all wording are original. Draft pending teacher review.

Judgement calls for the teacher:
- The prediction is worded "almost all go straight through; a few might change direction by a small amount", as on the page and in AQA.
- The deflections are explained with "two positive charges repel" (one frame). The page only says particles near the nucleus change direction; repulsion is needed to make sense of it and to draw the paths correctly (they bend away from the nucleus).
- Protons are introduced as "the positive charge of a nucleus is shared between smaller particles, each with the same amount of positive charge" (AQA's wording in plain form). The proton frame draws the lithium nucleus with its neutrons pale (not yet known) rather than removing them.
- The C5-16 data are invented (computer model), with 20 "changed direction a lot" and 2 "bounced back" out of 10 000. Real proportions deflected back were far smaller; the numbers are kept readable and the explanation warns that the table does not give the size of the nucleus.
- "Electrons orbit" is used for Bohr's model, as AQA does; the drawing shows a lithium atom (2, 1) so it matches the atoms lesson.

## Diagram plan
- `components/AtomHistoryVisuals.tsx`, focus prefix `hist-`, routed by `CellBiologyVisuals.tsx`. Imports the Chemistry palette and `Electron`, `Nucleus`, `Shells` from `AtomVisuals.tsx`, so electrons, protons, neutrons and shells look exactly as in the atoms lesson. Added colours: solid sphere slate blue-grey; plum pudding pale coral (the positive hue); alpha particles purple; gold foil soft gold.
- **Timeline strip** (above `hist-early-*`, `hist-nuclear-atom`, `hist-later-*`): five small model icons with names; the current model sits in a highlighted card and later models are faded. `hist-story` is the full-width version with the evidence between each pair of models.
- **Early models** (`hist-early-*`): a "?" atom with a three-step "how a model changes" key; the solid sphere; the sphere with electrons found inside it; the plum pudding atom with numbered pointers (ball of positive charge, scattered electrons).
- **Gold foil** (`hist-alpha-setup`, `hist-alpha-*`, `hist-nuclear-straight`, `hist-nuclear-close`): source, beam and foil; then one scattering drawing reused: eight alpha paths through a gold band of three atoms. Predicted (plum pudding atoms; all through, three bent slightly) → observed (5 straight, 2 deflected a lot, 1 back) → the unexpected paths highlighted → the same paths over nuclear atoms, straight paths highlighted, then the close and head-on paths. Deflected paths always bend away from a nucleus.
- **Nuclear model** (`hist-nuclear-atom`, `hist-compare`): mostly empty atom with a tiny + nucleus and loose electrons (no shells yet), with pointers; then plum pudding and nuclear side by side with a three-row comparison.
- **Later** (`hist-later-*`): the lithium atom: plain + nucleus with orbit arrows and a fixed-distance line (Bohr), then protons shown, then neutrons (today's model).
- **Questions**: `hist-question` three numbered paths; in assessment view the foil is plain (no nuclei) and there is no key. `hist-data` the computer-model results table.

## States in full

### C5-01 · choice · `understanding, priorKnowledge, diagnostic`
**Q:** Scientists find new evidence that does not fit their model. What should they do?
- 0 Ignore the new evidence · **1 Change the model so it fits all the evidence ✓** · 2 Keep the model, because it came first
- Hint: What is a model for?
- Explanation: A model is only useful if it explains the evidence. So when new evidence does not fit, scientists change the model or replace it.

### C5-02 · teach "What did early scientists think?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Models change | Scientists use models to explain what they cannot see. | new evidence → new model | Atoms are far too small to see, so nobody could simply look inside one. Instead, scientists made a simple description that fitted the evidence they had. This is called a scientific model. When new evidence did not fit, the model was changed. The strip shows the models of the atom you will meet. | `hist-early-model` |
| Solid spheres | The first model: atoms were tiny solid balls. | atom → solid ball, nothing inside | At first, scientists thought atoms were tiny solid balls with nothing inside them. They thought atoms could not be split into anything smaller. A ball shape is called a sphere, so this is called the solid sphere model. | `hist-early-sphere` |
| Something smaller | Scientists found tiny negative particles inside atoms. | electrons found → atoms are not solid balls | Then scientists found that atoms contain even smaller particles. These particles have a negative charge. You already know them: they are electrons. So atoms could not be solid balls with nothing inside, and the model had to change. | `hist-early-electron` |
| The plum pudding model | A ball of positive charge with electrons scattered in it. | ball of positive charge + scattered electrons | Atoms have no overall charge, so something positive must balance the negative electrons. Scientists pictured the atom as a ball of positive charge. The electrons were scattered through this ball, like fruit in a pudding. This is called the plum pudding model. | `hist-early-pudding` |

### C5-03 · choice · `understanding, guided, practice`
**Q:** Which description matches the plum pudding model of the atom?
- 0 A tiny positive nucleus with electrons in shells around it · 1 A solid ball with nothing inside it · **2 A ball of positive charge with electrons scattered through it ✓** · 3 A ball of negative charge with protons scattered through it
- Hint: What was the “pudding”, and what was scattered in it?
- Explanation: In the plum pudding model, the whole atom is a ball of positive charge. The negative electrons are scattered through it, so there is no nucleus and there are no shells.

### C5-04 · choice · `understanding, guided, practice`
**Q:** Why did scientists stop using the solid sphere model of the atom?
- **0 They found electrons, so atoms have smaller particles inside ✓** · 1 They found that atoms are too small to see · 2 They found that atoms have an overall positive charge · 3 They found that atoms are shaped like cubes
- Hint: What did scientists find inside atoms?
- Explanation: The solid sphere model said atoms had nothing inside them. Scientists found electrons, much smaller particles inside atoms, so the model had to change.

### C5-05 · teach "What did the gold foil show?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Alpha particles | Scientists fired tiny positive particles at gold. | positive particles → very thin gold foil | Some substances give out tiny particles with a positive charge. These are called alpha particles. Scientists fired a narrow stream of them at a sheet of gold foil, far thinner than a hair. Then they looked at where the alpha particles went. | `hist-alpha-setup` |
| The prediction | The plum pudding model said almost nothing would change. | positive charge spread out → straight through | In the plum pudding model, the positive charge is spread thinly through each atom. So scientists expected almost all the alpha particles to go straight through the foil. A few might change direction by a small amount. What a model says should happen is called a prediction. | `hist-alpha-predict` |
| The results | Most went straight through, but not all. | most straight; some deflected a lot; a few back | Most alpha particles did go straight through the foil. But some changed direction far more than expected. A very small number even bounced back towards where they came from. When a particle is pushed off its path like this, it is called deflected. | `hist-alpha-results` |
| The model was wrong | The results did not match the prediction. | results ≠ prediction → change the model | Positive charge spread thinly through the atom could never push an alpha particle straight back. So the results did not match the prediction. This meant the plum pudding model could not be right. Scientists needed a new model that explained every result. | `hist-alpha-wrong` |

### C5-06 · choice · `understanding, guided, practice`
**Q:** Which result of the gold foil experiment did the plum pudding model not predict?
- 0 Most alpha particles went straight through · 1 Alpha particles passed through the thin foil · 2 Some alpha particles changed direction a little · **3 A few alpha particles bounced back ✓**
- Hint: Which result could spread-out positive charge never cause?
- Explanation: The plum pudding model predicted almost all alpha particles would go straight through, with small changes of direction. It could not explain alpha particles bouncing back, so this result showed the model was wrong.

### C5-07 · choice · `understanding, guided, practice`
**Q:** Scientists fired alpha particles at thin gold foil. What happened to most of the alpha particles?
- 0 They bounced back · **1 They went straight through ✓** · 2 They stuck to the foil · 3 They changed direction a lot
- Hint: Think about the first result on the list.
- Explanation: Most alpha particles went straight through the gold foil. Only some changed direction a lot, and a very small number bounced back.

### C5-08 · teach "What is the nuclear model?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| A tiny nucleus | The positive charge and most of the mass sit in a tiny centre. | positive charge + most of the mass → tiny centre | Scientists decided that the positive charge is not spread out. It is packed into a tiny centre, the nucleus, together with most of the mass. The electrons are found around the nucleus. This new picture is called the nuclear model. | `hist-nuclear-atom` |
| Mostly empty space | Most alpha particles never go near the tiny nucleus. | nucleus tiny → most go straight through | The nucleus is tiny compared with the whole atom. So most of the atom is empty space. Most alpha particles pass through this space without going near a nucleus. So they go straight through the foil. | `hist-nuclear-straight` |
| Pushed away | Two positive charges push each other away. | alpha (+) near nucleus (+) → pushed away | Alpha particles and the nucleus are both positive. Two positive charges push each other away: they repel. An alpha particle passing close to a nucleus is pushed off course, so it is deflected. One heading straight at a nucleus is pushed back the way it came. | `hist-nuclear-close` |
| Put it together | The nuclear model explains every result. | plum pudding → nuclear model | In the plum pudding model, positive charge and mass are spread through the whole atom. In the nuclear model, they are packed into a tiny nucleus. The rest of the atom is mostly empty space, with electrons around the nucleus. This explains why most alpha particles go straight through, but a few bounce back. | `hist-compare` |

### C5-09 · choice · `understanding, guided, practice`
**Q:** Why did most alpha particles go straight through the gold foil?
- **0 Most of each atom is empty space ✓** · 1 Gold atoms have no nucleus · 2 Alpha particles have no charge · 3 The positive charge is spread through each atom
- Hint: How big is the nucleus compared with the whole atom?
- Explanation: The nucleus is tiny, so most of the atom is empty space. So most alpha particles pass through without going near a nucleus.

### C5-10 · choice · `understanding, guided, practice`
**Q:** A few alpha particles bounced back from the gold foil. What does this tell you about the nucleus?
- 0 It is negative and very light · 1 It is spread through the whole atom · **2 It is positive and holds most of the mass ✓** · 3 It is made of empty space
- Hint: What could push a positive alpha particle straight back?
- Explanation: An alpha particle is positive, so only something positive pushes it away. To push it straight back, the nucleus must be positive and hold most of the mass in a tiny space.

### C5-11 · teach "What came next?"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Electron shells | Bohr suggested electrons orbit the nucleus at fixed distances. | electrons → orbit in shells at fixed distances | The scientist Niels Bohr changed the nuclear model. He suggested that electrons move around the nucleus in shells, each at a fixed distance from it. Moving round and round something like this is called orbiting. Many experiments agreed with Bohr’s idea, so scientists accepted it. | `hist-later-bohr` |
| Protons | The nucleus is made of smaller positive particles. | positive charge of the nucleus → protons | Later experiments showed that the positive charge of a nucleus is shared between smaller particles. Each of these particles has the same amount of positive charge. They were named protons. You met protons when you learned what is inside an atom. | `hist-later-proton` |
| Neutrons | Chadwick found particles with no charge in the nucleus. | Chadwick → neutrons in the nucleus | The scientist James Chadwick showed that the nucleus also contains particles with no charge. These particles are neutrons. This was about 20 years after scientists first agreed that atoms have a nucleus. It gave a model very close to the one scientists use today. | `hist-later-neutron` |
| Put it together | Each new piece of evidence changed the model. | sphere → pudding → nuclear → Bohr → today | Solid spheres were replaced when electrons were found, giving the plum pudding model. The gold foil results then led to the nuclear model. Bohr added electron shells, and later experiments found protons and neutrons. This is the model you used when you learned about protons, neutrons and electrons. Science builds on earlier work, so models may change again. | `hist-story` |

### C5-12 · choice · `understanding, guided, practice`
**Q:** What did Niels Bohr add to the nuclear model of the atom?
- 0 The atom is a ball of positive charge · 1 The nucleus contains neutrons · 2 Atoms are solid spheres · **3 Electrons orbit the nucleus at fixed distances ✓**
- Hint: Where did Bohr put the electrons?
- Explanation: Bohr suggested that electrons move around the nucleus in shells. Each shell is a fixed distance from the nucleus, and experiments agreed with this.

### C5-13 · choice · `understanding, guided, practice`
**Q:** What did the experiments of James Chadwick show?
- 0 Atoms contain electrons · **1 The nucleus also contains neutrons ✓** · 2 Most of the atom is empty space · 3 Electrons orbit in shells
- Hint: Which particle was found last?
- Explanation: Chadwick showed that the nucleus contains particles with no charge. These are neutrons. This was about 20 years after scientists agreed that atoms have a nucleus.

### C5-14 · choice · `understanding, independent, independent`
**Q:** Which list puts these models of the atom in the order scientists suggested them, earliest first?
- 0 plum pudding → solid sphere → nuclear → Bohr · 1 solid sphere → nuclear → plum pudding → Bohr · **2 solid sphere → plum pudding → nuclear → Bohr ✓** · 3 solid sphere → plum pudding → Bohr → nuclear
- Hint: Which was found first: the electron or the nucleus?
- Explanation: Solid spheres came first. Finding electrons led to the plum pudding model. The gold foil experiment led to the nuclear model, and Bohr then added shells to it.

### C5-15 · choice · `understanding, independent, independent` · visual `hist-question`
**Q:** Alpha particles were fired at gold foil. Which numbered path shows one that passed through empty space, far from any nucleus?
- 0 Path 1 · **1 Path 2 ✓** · 2 Path 3
- Hint: What happens to an alpha particle that meets nothing on its way?
- Explanation: Path 1 bounced back and path 3 changed direction a lot: both came close to a nucleus. Path 2 went straight through, so it passed through empty space, far from any nucleus.

### C5-16 · choice · `dataInterpretation, independent, independent` · visual `hist-data`
**Q:** A computer model fires 10 000 alpha particles at gold foil. What does the table suggest about the gold atoms?
- 0 The nucleus fills most of each atom · 1 Gold atoms are solid spheres · 2 Positive charge is spread through each atom · **3 Each atom is mostly empty space ✓**
- Hint: What did almost all of the alpha particles do?
- Explanation: 9 978 of the 10 000 alpha particles went straight through, so almost all met nothing in their way. This suggests each atom is mostly empty space. The table does not tell you exactly how big the nucleus is.

### C5-17 · written · teacherOnly
**Q:** Describe the plum pudding model of the atom. Explain how the gold foil experiment showed that it was wrong.
- Hint: Say what the model looked like, what it predicted for the alpha particles, and what actually happened.
- Model answer: In the plum pudding model, the atom is a ball of positive charge with electrons scattered through it. So scientists predicted that almost all alpha particles would go straight through the gold foil, with only small changes of direction. Instead, some changed direction much more than expected and a few bounced back. Spread-out positive charge cannot do this, so the positive charge and most of the mass must be in a tiny nucleus. The plum pudding model was replaced by the nuclear model.
- Rubric (4): (1) The plum pudding model is a ball of positive charge with electrons scattered through it. (2) It predicted that almost all alpha particles would go straight through, with only small changes of direction. (3) Instead, some alpha particles were deflected more than expected and a few bounced back. (4) So the positive charge and most of the mass must be in a tiny nucleus, and the nuclear model replaced it.
- Reject: Saying the plum pudding model has a nucleus or electron shells. Saying most alpha particles bounced back. Saying alpha particles are negative, or are attracted to the nucleus.

