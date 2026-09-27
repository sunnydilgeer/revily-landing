# Lesson 41 storyboard — Contraception (v1)

Chapter B5, Homeostasis and response. Folder `lesson-36`, lesson id `B-HOM-036-B`, skill `B-CONTRACEPTION`.

Big idea: a pregnancy can start if a sperm reaches an egg. Every contraceptive stops this somewhere: hormones stop eggs maturing or being released, an IUD stops a fertilised egg implanting, barriers and spermicide stop sperm reaching the egg, and sterilisation, natural methods and abstinence stop sperm and egg meeting. Each has pros and cons that can be weighed up.

Flow note: the lesson is factual, neutral and age-appropriate, at the depth of the source pages. It starts from the menstrual cycle, which learners have just met (FSH), and uses the same simple front-view drawing of the organs throughout.
1. **Hormones and IUDs.** Fertility (sperm reaches an egg) → the pill (stops FSH) → the implant (progesterone) → patch and injection → the IUD and IUS. The pill comes first because it builds directly on FSH.
2. **Barrier methods.** Barriers and condoms → protection against STIs → the diaphragm → spermicide. The diaphragm comes before spermicide because they are used together.
3. **Other ways.** Female sterilisation → male sterilisation → natural methods (linked back to the cycle timeline) → abstinence.
4. **Weigh them up.** Five questions to ask of any method → the pill compared with the implant → condoms compared with sterilisation. Evaluation comes last because it needs every method.

1. Start here (B36-01): what does FSH do? (from the menstrual cycle lesson).
2. Hormones and IUDs (B36-02–04): five frames on `hormone-method-*`. Checks: how the pill works; which method is T-shaped and in the uterus.
3. Barrier methods (B36-05–07): four frames on `hormone-barrier-*`. Checks: how barriers work; the only method that protects against STIs.
4. Other ways (B36-08–10): four frames (`hormone-sterile-*`, `hormone-cycle-natural`, `hormone-organs-abstinence`). Checks: which tubes are cut in female sterilisation; why natural methods are not very effective.
5. Weigh them up (B36-11–12): three frames on `hormone-weigh-*`. Check: a method that needs no daily thought.
6. On your own (B36-13–17): choosing a method that also protects against STIs; a numbered organs diagram (where an IUD goes); a summary table of dose lengths read without over-claiming (it says nothing about effectiveness or STIs); a disadvantage of sterilisation; a teacher-reviewed written evaluation of the pill and condoms.

Wording rules: neutral, with no recommendation of any method; pros and cons only as the source pages give them; "sexual intercourse" rather than informal words; simple schematic organs, never graphic; one new term per frame; British spelling.

Out of scope: emergency contraception; effectiveness figures other than those on the pages (pill over 99%, spermicide alone about 70–80%); hormones used to treat infertility and IVF (Higher only); STIs in detail (HIV is covered with viral diseases).

Source boundary: supplied pages 58–59 (for scope only); AQA 8464 section 4.5.3.4. All wording, the scenarios (Sofia, the couple), the icons and every diagram are original. The dose-length table restates the durations on the page; it is not invented data. Draft pending teacher review.

---

## Diagram plan
- `components/HormoneVisuals.tsx`. Colour code: indigo = hormones and the selected method card, copper = the IUD, teal = the diaphragm, green = spermicide, grey-blue = sperm, cream = egg.
- **Hormonal methods** (`hormone-method-*`, B36-02): five method cards on the left (the pill, implant, patch, injection, IUD/IUS), one highlighted per frame. On the right, the female organs show the effect: sperm reaching an egg in the oviduct (fertility), crosses on the ovaries ("no egg matures" or "is released"), or a copper T in the uterus.
- **Barrier methods** (`hormone-barrier-*`, B36-05): three cards (condoms, diaphragm, spermicide), with the effect on the organs: sperm held back below a barrier line at the vaginal opening, a shield for STI protection, a cup over the entrance to the uterus, and spermicide dots with faded sperm. Condoms are shown only as a packet icon and a barrier line, never drawn in use.
- **Sterilisation** (`hormone-sterile-*`, B36-08): female organs with the oviducts cut and tied, and a simplified male diagram of the testes and sperm ducts only (cut and tied), with an arrow "to the penis". Each frame highlights one side.
- **Natural methods** reuse the cycle timeline from Lesson 40 with the days around ovulation shaded (`hormone-cycle-natural`); **abstinence** reuses the organs with an egg and no sperm.
- **Weighing up** (`hormone-weigh-*`, B36-11): five question chips, then two pros-and-cons cards per frame (+ in green, − in red).
- **Dose lengths** (`hormone-dose-data`, B36-15): a plain table; no conclusion written on it.

## States in full

### B36-01 · choice · `priorKnowledge`, `diagnostic`
**Q:** In the menstrual cycle, what does the hormone FSH do?
- **0 It causes an egg to mature in an ovary ✓** · 1 It causes the lining to break down · 2 It stimulates sperm production · 3 It controls blood glucose
- Hint: You met FSH when you learned about the menstrual cycle.
- Explanation: Testosterone stimulates sperm production, and insulin helps control blood glucose. FSH causes an egg to mature in an ovary.

### B36-02 · teach "Hormones and IUDs"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Fertility | A pregnancy can start if a sperm reaches an egg. | sperm + egg → pregnancy | After sexual intercourse, sperm swim up through the uterus and into the oviducts. If a sperm reaches and fertilises an egg, a pregnancy can start. How easily a woman can get pregnant is called her fertility. | `hormone-method-fertility` |
| The pill | The pill stops FSH being released, so no eggs mature. | pill → no FSH → no egg matures | Ways of preventing pregnancy are called contraception. Some contraceptives contain hormones. The pill is taken by mouth every day. It stops FSH being released, so no eggs mature. It is over 99% effective, but it can cause side effects such as headaches and feeling sick. | `hormone-method-pill` |
| The implant | An implant slowly releases progesterone. | implant → progesterone → no egg | Some hormonal methods slowly release progesterone. This stops eggs maturing or being released. An implant is a small, flexible rod placed under the skin of the arm. It can last for three years. | `hormone-method-implant` |
| Patch and injection | A patch and an injection also release hormones. | patch: 1 week; injection: 2–3 months | A contraceptive patch is stuck on the skin. It contains oestrogen and progesterone, and each patch lasts one week. A contraceptive injection of progesterone lasts 2 to 3 months. | `hormone-method-patch-injection` |
| IUDs | An IUD in the uterus stops a fertilised egg implanting. | IUD → no implanting | An intrauterine device, or IUD, is a small T-shaped device placed inside the uterus. It stops a fertilised egg implanting in the uterus wall. Copper IUDs contain no hormones and also stop sperm surviving. Intrauterine systems (IUS) release progesterone. | `hormone-method-iud` |

### B36-03 · choice
**Q:** How does the contraceptive pill prevent pregnancy?
- 0 It kills sperm · **1 It stops FSH being released, so no eggs mature ✓** · 2 It forms a barrier in the vagina · 3 It removes the uterus lining
- Hint: Which hormone does the pill stop being released?
- Explanation: The pill contains hormones, not spermicide, and it is not a barrier. It stops FSH being released, so no eggs mature.

### B36-04 · choice
**Q:** Which method is a small T-shaped device placed inside the uterus?
- 0 An implant · 1 A patch · **2 An IUD ✓** · 3 A diaphragm
- Hint: Its name means “inside the uterus”.
- Explanation: An implant goes under the skin of the arm, a patch goes on the skin, and a diaphragm covers the entrance to the uterus. An IUD, an intrauterine device, is placed inside the uterus.

### B36-05 · teach "Barrier methods"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Barrier methods | Barrier methods stop sperm reaching an egg. | barrier = sperm cannot get through | Non-hormonal methods do not use hormones. Many of them stop sperm reaching an egg, and these are called barrier methods. A condom is worn over the penis during sexual intercourse. A female condom is worn inside the vagina. | `hormone-barrier-condom` |
| Protection from infections | Condoms also protect against sexually transmitted infections. | condoms → also stop STIs | Some infections can be passed on during sexual intercourse. These are called sexually transmitted infections, or STIs. Condoms are the only contraceptive that also protects against STIs. | `hormone-barrier-sti` |
| Diaphragm | A diaphragm covers the entrance to the uterus. | diaphragm = cup over the entrance | A diaphragm is a shallow plastic cup. It fits over the entrance to the uterus, so sperm cannot get in. It has to be used together with spermicide. | `hormone-barrier-diaphragm` |
| Spermicide | Spermicide kills or disables sperm. | spermicide = kills or disables sperm | A chemical that kills or disables sperm is called spermicide. It is used with a diaphragm. Used on its own, spermicide is only about 70 to 80% effective. | `hormone-barrier-spermicide` |

### B36-06 · choice
**Q:** How do barrier methods prevent pregnancy?
- 0 They stop eggs maturing · **1 They stop sperm reaching an egg ✓** · 2 They release progesterone · 3 They stop the lining building up
- Hint: What does a barrier block?
- Explanation: Stopping eggs maturing and releasing progesterone are what hormonal methods do. Barrier methods stop sperm reaching an egg.

### B36-07 · choice
**Q:** Which is the only contraceptive that also protects against sexually transmitted infections?
- 0 The pill · 1 A diaphragm · **2 Condoms ✓** · 3 An implant
- Hint: Which method covers the penis, or lines the vagina?
- Explanation: The pill and the implant use hormones, and a diaphragm only covers the entrance to the uterus. Condoms are the only contraceptive that also protects against STIs.

### B36-08 · teach "Other ways"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Female sterilisation | The oviducts are cut or tied. | sterilisation = permanent | An operation can cut or tie the oviducts, which are also called the fallopian tubes. Then eggs and sperm cannot meet. This is called sterilisation, and it is permanent. | `hormone-sterile-female` |
| Male sterilisation | The sperm ducts are cut or tied. | sperm ducts cut → no sperm out | In males, sterilisation cuts or ties the sperm ducts. These are the tubes that carry sperm from the testes towards the penis. It is also permanent. | `hormone-sterile-male` |
| Natural methods | Avoiding intercourse when pregnancy is most likely. | natural = timing, not very reliable | Some people avoid sexual intercourse around ovulation, when an egg may be in the oviduct. These are called natural methods. Some people choose them because they feel other methods are unnatural. But cycles vary, so natural methods are not very effective. | `hormone-cycle-natural` |
| Abstinence | Not having intercourse is the only certain way. | abstinence = certain | Not having sexual intercourse at all is called abstinence. With no intercourse, sperm cannot reach an egg. It is the only way to be sure of avoiding pregnancy. | `hormone-organs-abstinence` |

### B36-09 · choice
**Q:** In female sterilisation, which tubes are cut or tied?
- **0 The oviducts (fallopian tubes) ✓** · 1 The sperm ducts · 2 The blood vessels to the uterus · 3 The vagina
- Hint: Which tubes carry eggs from the ovaries to the uterus?
- Explanation: The sperm ducts are cut or tied in male sterilisation. In female sterilisation, the oviducts are cut or tied, so eggs and sperm cannot meet.

### B36-10 · choice
**Q:** Why are natural methods not very effective?
- 0 They use hormones that stop working · 1 They only block sperm for one day · 2 They cause side effects such as headaches · **3 Cycles vary, so the time when an egg may be in the oviduct is hard to predict ✓**
- Hint: Natural methods rely on timing. Is the timing always the same?
- Explanation: Natural methods use no hormones and no barrier. Cycles vary, so it is hard to predict exactly when an egg may be in the oviduct.

### B36-11 · teach "Weigh them up"
| Label | Summary | Think: | Text | Focus |
|---|---|---|---|---|
| Questions to ask | Compare methods using the same questions. | how well, how often, side effects, STIs, reversible | Every method has pros and cons. To compare them, ask: how well does it work, and how often must you think about it? Can it cause side effects? Does it protect against STIs, and can it be stopped or reversed? | `hormone-weigh-criteria` |
| Hormonal methods | Very effective, but no protection against STIs. | the pill compared with the implant | The pill is over 99% effective, but it must be taken every day and can cause side effects. An implant lasts three years, so there is nothing to remember each day. Neither protects against STIs. | `hormone-weigh-hormonal` |
| Non-hormonal methods | Condoms protect against STIs; sterilisation is permanent. | condoms compared with sterilisation | Condoms protect against STIs and contain no hormones, but they must be used every time. After sterilisation there is nothing to remember, but it is permanent. The best choice depends on the person and their situation. | `hormone-weigh-barrier` |

### B36-12 · choice
**Q:** Sofia wants a contraceptive that she does not need to think about every day. Which is the best choice for this?
- 0 The pill · **1 An implant ✓** · 2 Condoms · 3 Spermicide on its own
- Hint: Which method lasts for years once it is in place?
- Explanation: The pill is taken every day, and condoms and spermicide are used every time. An implant lasts three years, so there is nothing to remember each day.

### B36-13 · choice · `application`, independent
**Q:** A couple want to prevent pregnancy and also protect themselves against sexually transmitted infections. Which method should they use?
- **0 Condoms ✓** · 1 The pill · 2 An IUD · 3 Sterilisation
- Hint: Which method is the only one that protects against STIs?
- Explanation: The pill, an IUD and sterilisation can prevent pregnancy, but none of them protects against STIs. Condoms prevent pregnancy and also protect against STIs.

### B36-14 · choice · `understanding`, independent · question diagram `hormone-organs-question` (assessment version hides the answer)
**Q:** Look at the numbered parts. Where is an IUD placed?
- 0 Part 1 · 1 Part 2 · **2 Part 3 ✓** · 3 Part 4
- Hint: An IUD stops a fertilised egg settling into a wall. Which part has that wall?
- Explanation: Part 1 is an ovary, part 2 an oviduct and part 4 the vagina. An IUD is placed inside the uterus, part 3.

### B36-15 · choice · `dataInterpretation`, independent · question diagram `hormone-dose-data` (assessment version hides the answer)
**Q:** The table shows how long one dose of four hormonal methods lasts. Which conclusion does the table support?
- **0 The implant needs replacing least often ✓** · 1 The implant is the most effective method · 2 The patch protects against STIs · 3 The pill lasts longer than the injection
- Hint: The table only shows how long each dose lasts. What can it tell you?
- Explanation: The table says nothing about how effective a method is or about STIs, and one pill lasts one day while an injection lasts months. The implant lasts about 3 years, so it needs replacing least often.

### B36-16 · choice · `application`, independent
**Q:** Which of these is a disadvantage of sterilisation?
- 0 It must be remembered every day · **1 It is permanent, so it cannot easily be undone ✓** · 2 It is only about 70 to 80% effective · 3 It releases hormones that cause headaches
- Hint: Think about how long sterilisation lasts.
- Explanation: Sterilisation needs no daily action and uses no hormones. It is permanent, so a person who later wants children cannot easily undo it.

### B36-17 · written · `teacherOnly`
**Q:** Evaluate the pill and condoms. For each, say how it works and give one advantage and one disadvantage.
- Hint: For each method, say how it works, then give a pro and a con. Finish by comparing them.
- Model answer: The pill contains hormones that stop FSH being released, so no eggs mature. It is over 99% effective, but it must be taken every day, it can cause side effects such as headaches, and it does not protect against STIs. Condoms are a barrier that stops sperm reaching an egg. They are the only method that protects against STIs and they contain no hormones, but they must be used every time. So condoms are the better choice for protection against STIs, while the pill is very effective against pregnancy.
- Marking points: The pill stops FSH being released, so no eggs mature. · An advantage of the pill, such as being over 99% effective. · A disadvantage of the pill, such as side effects, taking it every day or no STI protection. · Condoms are a barrier that stops sperm reaching an egg. · An advantage and a disadvantage of condoms, such as STI protection and needing to be used every time.
- Common errors: Saying the pill protects against STIs. · Saying condoms contain or release hormones. · Saying the pill kills sperm. · Giving only advantages, or only disadvantages.

---

## Checks
- 17 states: 4 teaching states (5 + 4 + 4 + 3 = 16 frames), 12 choice questions and 1 written task.
- Correct answer positions: 0 ×4, 1 ×4, 2 ×3, 3 ×1. The largest share is 33%.
- Question diagrams: 2, all shown in `assessment` form (B36-14, B36-15).
