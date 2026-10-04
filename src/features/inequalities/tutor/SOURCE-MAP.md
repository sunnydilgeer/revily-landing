# Lesson 24 (Algebra A10) source map

A10 is written from the two PDF/video pairs `A10.1_Inequalities_On_A_Number_Line` and `A10.2_Two_Sided_Inequalities_On_A_Number_Line` (one zip, `A10_Inequalities`). It is lesson 24 in the course (`?lesson=24`, progress key `L024`), and students see it as lesson 10 of the Algebra chapter. No textbook pages came with it.

The rungs keep the PDFs' order, which is already easiest first: one sign, then two signs.

| Rung | Source | App coverage |
| --- | --- | --- |
| One sign | A10.1 | Video + worked example = Q1 (at least 120 cm → h ≥ 120); Q2 (x < 3), Q3 (p ≤ 8), Q4a (t < −18), Q5a (x ≥ −2), Q5b (x ≥ 5) typed as inequalities; Q5a's smallest integer (−2) typed; Q3's number line, Q4b (is −18 allowed?) and Q5c (Leo) as choices |
| Two signs | A10.2 | Video + worked example = Q1 (fridge, 1 ≤ t < 5); Q2 (−2 < x < 3), Q3 (500 ≤ w ≤ 520), Q4a (−4 ≤ x < 1), Q5a (5 ≤ a < 12) typed; Q4b (largest integer, 0) typed; Q3's number line, Q5b (describe the number line) and Q5c (Amara) as choices |

Every source answer was checked, and there were no slips. Two PDF questions ask for two things at once (write the inequality, then show it, or read it, then give the smallest integer); the app asks them as two screens, so each answer box asks one thing. Drawing a number line is asked as a choice of descriptions, worded like the mark scheme ("A filled circle at 8, and an arrow pointing left"), because there is no drawing box.

Both videos match their PDFs: the same contexts and numbers (the ride at 120 cm, the fridge from 1 °C to 5 °C). The A10.1 video also shows a strict sign with x < 8, which the app doesn't need to repeat.

Nothing is Higher tier: writing and showing inequalities on a number line, with one or two signs, is Foundation in AQA 8300 (A22). Set notation, the Higher part of A22, isn't in the PDFs.

The workings, one move a step, on a number line (`InequalityPictures.tsx`):
- **Words to a number line**: the circle (filled if that number is allowed, open if not), then the arrow or the line joining two circles, then the inequality in green.
- **A number line to words**: the question's own number line is there from the start. Each step reads one end, boxed in purple: the arrow's direction or the first circle gives a purple halfway line ("smaller than 3", "−4 ≤ x"), then the last circle gives the answer.
- **Largest or smallest integer**: the circle read, then the whole number marked with a green dot.
Finished parts grey out.

Answers are typed the way they're written on paper: "x ☐ ☐" or "☐ ☐ x ☐ ☐", with the signs from four keys (<, ≤, >, ≥). Any way of writing the same inequality is right (3 > x for x < 3, <= for ≤).

Practice questions (`maths/practice/bank/inequalities.ts`) use new numbers; their AQA weights are estimates until the 2022–25 papers are counted. Inequalities is a new topic in the exam map (an estimated 30 marks across 30 papers).
