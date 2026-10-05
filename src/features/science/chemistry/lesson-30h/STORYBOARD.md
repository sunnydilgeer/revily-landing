# Chemistry Lesson 30H storyboard — Bond energies

Chapter C5, Energy changes. A whole lesson that only Higher students get (catalogue entry in `higher/lessons.ts`; the badge is shown by the app, so no learner text names the tier). It sits after Lesson 30 (reaction profiles) and before Lesson 31 (rates). Folder `chemistry/lesson-30h`, id `C-BOND-030H-C`, skill `C-BOND-ENERGY`. Visuals: `components/HigherBondEnergyVisuals.tsx` (focus prefix `hbond-`).

Big idea: in a reaction, bonds in the reactants break (energy taken in, endothermic) and bonds in the products form (energy given out, exothermic). Which is bigger decides the overall energy change. With bond energies in kJ/mol, overall energy change = bonds broken − bonds made: negative means exothermic, positive means endothermic. To compare two reactions you need the actual numbers, not just which has less to break.

Flow note: builds on exothermic and endothermic (Lesson 28), reaction profiles (Lesson 30) and covalent bonds and displayed formulae (Lesson 14), without re-teaching them. The idea comes first with one familiar reaction, hydrogen burning, drawn as ball models: rearrange → break (energy in) → make (energy out) → compare the two bars → energy diagram (up to separate atoms, down to products), which links to the profile students know. The calculation then uses the same reaction, so the only new thing is the numbers. Comparing comes last because it needs the calculation.

1. **Start here** (C30H-01): what happens to the atoms when hydrogen burns (bonds break, new bonds form).
2. **Breaking and making bonds** (C30H-02–05): ball models of 2H₂ + O₂ → 4H + 2O → 2H₂O built up: rearrange → bonds break, energy in (blue) → bonds form, energy out (coral) → two bars, more out than in → energy-level diagram. Checks: which statement is correct; 1200 in / 1500 out is exothermic; what is true for an endothermic reaction.
3. **Calculating the energy change** (C30H-06–10): one board with displayed formulae and a bond-energy table: bond energies → bonds broken (2 × 436) + 498 = 1370 → bonds made 4 × 464 = 1856 → 1370 − 1856 = −486 kJ/mol → sign rule. Worked: methane burning (−818). Practice: N₂ + O₂ → 2NO (+229, endothermic); count the C–H bonds in propane (8, displayed formula); what +60 kJ/mol tells you.
4. **Comparing reactions** (C30H-11–13): H₂ + Br₂ beside H₂ + I₂: same pattern → iodine needs less to break (587 v 629) → but releases less too (598 v 732) → −103 v −11 kJ/mol. Checks: what else you need to know to compare; reactions A and B from totals (A gives out more though B releases more making bonds).
5. **On your own** (C30H-14–18): 2H₂O₂ → 2H₂O + O₂ calculation (−206, careful counting); numbered arrows on an energy diagram (assessment view); first mistake in a student’s working for 2CO + O₂ → 2CO₂ (counted 2 C=O instead of 4); which of three reactions is endothermic from totals; written task: H₂ + F₂ → 2HF, calculate (−542) and explain.

Numbers (each checked twice; bond energies in kJ/mol: H–H 436, O=O 498, O–H 464, C–H 413, C=O 805, N≡N 945, N=O 607, H–Br 366, Br–Br 193, H–I 299, I–I 151, O–O 146, C≡O 1077, H–F 568, F–F 158):
2 × 436 + 498 = 1370 · 4 × 464 = 1856 · 1370 − 1856 = −486 · CH₄: 4 × 413 + 2 × 498 = 1652 + 996 = 2648; 2 × 805 + 4 × 464 = 1610 + 1856 = 3466; 2648 − 3466 = −818 · NO: 945 + 498 = 1443; 2 × 607 = 1214; +229 (distractors: −229 sign, +2657 added, +836 one NO) · propane 8 C–H, 2 C–C · HBr: 436 + 193 = 629; 2 × 366 = 732; −103 · HI: 436 + 151 = 587; 2 × 299 = 598; −11 · A: 600 − 700 = −100, B: 900 − 950 = −50 · H₂O₂: 2 × (2 × 464 + 146) = 2148; 4 × 464 + 498 = 2354; −206 (distractors: +206 sign, −1280 reactants not doubled, +292 O=O left out) · CO: 2 × 1077 + 498 = 2652; 4 × 805 = 3220; −568 (student’s 2 × 805 = 1610 gives +1042) · P −400, Q +200, R −100 · HF: 436 + 158 = 594; 2 × 568 = 1136; −542.

Out of scope: why bond energies are averages (the page mentions it varies with the compound; left out to keep one idea per frame); enthalpy notation (ΔH); Hess’s law; linking the activation energy to bond breaking; state symbols; the book’s examples, questions, cartoons and jokes.

Source boundary: supplied revision-guide page 141 (scope only); AQA 8464 Chemistry 5.5.1.3 (HT), with 5.5.1.1 for the opening question. The book’s H₂ + Cl₂ worked example, its bromine comparison and its ammonia question were replaced by hydrogen burning, methane burning, N₂ + O₂, propane, H₂ + Br₂ against H₂ + I₂, invented totals, H₂O₂, CO and H₂ + F₂. All wording, numbers, questions and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Bond energies are typical textbook mean values; exam boards give their own values in questions. Calculated answers (e.g. +229 for N₂ + O₂) differ from measured enthalpy changes, which is normal for mean bond energies and not mentioned.
- The energy diagram (reactants → separate atoms → products) is described as "a bit like a reaction profile"; it deliberately does not say the top level is the activation energy.
- The comparison uses bromine and iodine, a pair the page hints at, with original numbers and iodine in place of chlorine.
- Propane, carbon monoxide and nitrogen monoxide appear only as formulae to count bonds; their chemistry is in other lessons.

## States in full

(See `lesson.ts` for every state, option, hint and explanation, and `teachingFrames.ts` for every frame.)
