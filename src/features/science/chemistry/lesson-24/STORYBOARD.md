# Chemistry Lesson 24 storyboard — The reactivity series and extracting metals

Chapter C4, Chemical changes. Folder `chemistry/lesson-24`, id `C-CHG-024-C`, skill `C-METAL-REACTIVITY`. It builds on ions (metal atoms lose electrons), Group 1 reactivity and balanced equations.

Big idea: the reactivity series orders metals by how easily they lose electrons to form positive ions. Getting a metal out of its oxide is reduction (loss of oxygen). Carbon can reduce the oxides of metals below it; metals above carbon need electrolysis; the least reactive metals are found uncombined.

Flow note: the series comes first, with the electron reason, so "reactive" means something. Oxidation and reduction (oxygen only) come next because extraction is a reduction. Extraction last: carbon reduction, the cut at carbon, why the cut is there, then gold.
1. **What is the reactivity series?** ladder with three bands → why the order (electron loss) → carbon and hydrogen are non-metals used for comparison.
2. **Oxidation and reduction** metal + oxygen → oxide, ore → oxidation = gain of oxygen (Mg) → reduction = loss of oxygen (CuO + C).
3. **How are metals extracted?** iron oxide + carbon (blast furnace) → above/below carbon → why carbon only works below → gold.
4. **On your own**: numbered ladder question, data table of four oxides, lithium oxide explanation, balanced ZnO + C equation, written comparison of iron and sodium.

Sections:
1. Start here (C24-01)
2. What is the reactivity series? (C24-02–04)
3. Oxidation and reduction (C24-05–07)
4. How are metals extracted? (C24-08–11)
5. On your own (C24-12–16)

Out of scope: acids and water with metals, ordering by observation and displacement (next lesson); electrolysis itself (only named, with its cost); electron definition of oxidation and reduction, half equations (Higher); detail of the blast furnace.

Source boundary: supplied revision-guide page 128 (scope only). AQA 8464 Chemistry 5.4.1.2 to 5.4.1.4. Examples, diagrams and wording are original apart from the standard spec examples (iron oxide and carbon, copper oxide and carbon, magnesium and oxygen). The book's lead oxide and calcium exam questions were replaced by zinc oxide and lithium. Draft pending teacher review.

Judgement calls for the teacher:
- The series is the page's list (K, Na, Li, Ca, Mg, C, Zn, Fe, H, Cu); aluminium is not on it, so it is not in the lesson. Gold is added below copper only for the "found as the metal" point.
- The three bands (very, fairly, not very reactive) follow the page.
- Copper is shown as losing two electrons (Cu²⁺), magnesium two, potassium one, using charges met in the ions lessons.
- Electrolysis is only named, with the cost reason from the page.

## Diagram plan
`components/ReactivityVisuals.tsx`, prefix `react-`. Ladder with bands (`react-series`), electron-loss rows (`react-ions`), non-metals outlined (`react-nonmetals`), ore and word equation (`react-oxide`), particle equations for oxidation and reduction (`react-oxidation`, `react-reduction`, oxygen in teal), iron oxide and carbon (`react-carbon`), ladder cut at carbon (`react-cut`), tick and cross panels (`react-why`), gold (`react-gold`). Question visuals: `react-question-series` (numbered ladder, no band labels) and `react-question-data`.

## States in full
Read `lesson.ts` and `teachingFrames.ts`; they are the single source for wording and answers.
