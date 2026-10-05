# Lesson 25 (Algebra A11) source map

A11 is written from the four PDF/video pairs `A11.1_Listing_Integers_In_An_Inequality`, `A11.2_Solving_Linear_Inequalities`, `A11.3_Inequalities_With_Two_Signs` and `A11.4_Multiplying_Or_Dividing_By_A_Negative` (one zip, `A11_Solving_Inequalities`). It is lesson 25 in the course (`?lesson=25`, progress key `L025`), and students see it as lesson 11 of the Algebra chapter. No textbook pages came with it.

The rungs keep the PDFs' order, which is already easiest first: list the whole numbers, solve with one sign, solve with two signs, then the one new rule (dividing by a negative flips the sign).

| Rung | Source | App coverage |
| --- | --- | --- |
| List integers | A11.1 | Video + worked example = Q1 (2 < n ≤ 6 → 3, 4, 5, 6); Q2, Q3, Q5a typed as a list in one box; Q4a (smallest and largest) in two boxes; Q4b (7) and Q5b (6) typed; Q5c (Ravi) as a choice |
| Solve | A11.2 | Video + worked example = Q1 (4a − 5 > a + 7 → a > 4); Q2, Q3, Q4a, Q5a typed as inequalities; Q4b (4) typed; Q5b (number line) and Q5c (Noor) as choices |
| Two signs | A11.3 | Video + worked example = Q1 (3 < 2x + 1 < 11 → 1 < x < 5); Q2, Q3, Q4a, Q5a typed as inequalities; Q4b and Q5b typed as lists; Q5c (Jude) as a choice |
| Negatives | A11.4 | Video + worked example = Q1 (−3x > 12 → x < −4); Q2, Q3, Q4a, Q5a typed as inequalities; Q4b (3) typed; Q5b (number line) and Q5c (Mia) as choices |

Every source answer was checked, and there were no wrong answers. Small things:
- A11.1 Q1 says a "five-a-side team" can have up to 6 players; the app says "squad", so 6 makes sense.
- A11.1 Q4a's mark scheme prints "Smallest −2" twice (once for each mark); the answer, −2 and 4, is right.
- The A11.2 PDF is titled "Unknown on Both Sides", but its Q2 has the unknown on one side only. The rung is called "Solve".
- A11.4 Q5a ends at 3 > x; the app writes the answer as x < 3, which is the same, with the letter first.

The videos match their PDFs (the same worked examples and numbers). The A11.3 video's first picture shows a thermometer from 0 to 6 while the text is about 3 to 11, and the A11.4 video's balance picture for "2 < 6" is caught mid-tip. Neither changes the maths, so the videos are used as they are.

Nothing is Higher tier: listing integers, solving linear inequalities in one variable (with one or two signs) and showing the answer on a number line are Foundation in AQA 8300 (A22). Set notation and solving two separate inequalities together are Higher (bold) and aren't in the PDFs. Dividing by a negative isn't bold in the specification, and it's in the PDFs, so it stays as the last rung.

The workings, one move a step:
- **Listing**: the number line (`InequalityPictures.tsx`): each end's circle, the line joining them, then the whole numbers as green dots, which are the answer. When the question starts as an equation (2x ≤ 9), the division is a purple line first.
- **Solving**: the A5 board with the inequality sign in place of =. The part each move works on is boxed in purple, the move is written on both sides, what cancels is struck out, and the last row is the green answer.
- **Two signs**: the same board in three parts, lined up down the board, with each move written on all three.
- **Negatives**: the divide or multiply by the negative number, with the flipped sign boxed in purple on that same row.
Finished rows grey out.

Inequality answers are typed as on paper with the sign keys (from A10). Lists of whole numbers go in one box, in any order, so the number of boxes doesn't give the answer away.

Practice questions (`maths/practice/bank/inequalities.ts`) use new numbers; their AQA weights are estimates until the 2022–25 papers are counted. The four "I can…" statements sit in the Inequalities topic of the exam map, with A10's.
