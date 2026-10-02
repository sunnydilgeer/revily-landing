# Lesson 23 (Algebra A9) source map

A9 is written from the five PDF/video pairs `A9.1_Nth_Term_Of_Linear_Sequences`, `A9.2_Is_A_Value_Part_Of_A_Sequence`, `A9.3_Problems_With_Consecutive_Terms`, `A9.4_Geometric_Sequences` and `A9.5_Other_Types_Of_Sequences`, and the textbook's A9 pages (Sequences, with its Your Turn page). It is lesson 23 in the course (`?lesson=23`, progress key `L023`), and students see it as lesson 9 of the Algebra chapter.

Two zips came with the same PDFs and different videos; the videos are from the newer one (`A9_Sequences_1`, saved 20 minutes later), whose A9.1 and A9.4 are simpler and whose A9.4 has no label covering the 48 and 96.

Rungs run easiest first, not in the PDFs' order (agreed with Sunny, 2 Oct): carrying on a pattern ("term to term") comes before a rule for any term ("position to term"), then using the rule, then the two rungs that solve an equation like A5.

| Rung | Source | App coverage |
| --- | --- | --- |
| Special sequences | A9.5 | Video + worked example = Q1 (1, 3, 6, 10 → 15, 21); Q2 (25), Q3 (64), Q4a (21 and 34, two boxes), Q4b (11), Q5a (55), Q5b (64) typed; Q5c (Sam) as a choice; a term-to-term rule question (textbook, own numbers) as a choice |
| Geometric | A9.4 | Video + worked example = Q1 (3, 6, 12, 24 → 48, 96); Q2 (250), Q3 (3 and 1), Q4a (108 and 324), Q5a (£320) typed; Q5b (½) as a fraction; Q4b and Q5c (Mia) as choices; a decimal sequence (textbook, own numbers: 0.4, 1.2, 3.6 → 10.8, 32.4) and a term-to-term rule question as a choice |
| The nth term | A9.1 | Video + worked example = Q1 (5, 9, 13, 17 → 4n + 1); the first five terms of 3n − 2 in five boxes (textbook Your Turn 2a, own numbers); Q2 (17), Q3 (5n + 2), Q4a (−8n + 98, also 98 − 8n), Q4b (18 °C), Q5a (5n + 1), Q5b (101) typed; two nth terms with a minus (textbook, own numbers: 5, 11, 17, 23 → 6n − 1 and −2, 1, 4, 7 → 3n − 5); Q5c (Tom) as a choice |
| Is it in? | A9.2 | Video + worked example = 5n − 2 = 63 (the video's, not Q1's); Q1, Q2, Q3, Q4b, Q5a and Q5c (Zoe) as choices with the reason; Q4a (row 15) and Q5b (107) typed; "is 98 in 2, 7, 12, 17?", which needs the nth term first (textbook Example 2, own numbers) |
| Next to each other | A9.3 | Video + worked example = Q4 (3n + 2, two steps make 55 → 26 and 29); Q1 (19 and 21), Q3 (28 and 32), Q5b (38 and 43) in two boxes, either order; Q2 (3n + 4) typed with the letter keyboard; Q5a (n = 8) typed; Q5c (Dan) as a choice |

Every source answer was checked, and there were no slips in the answers. A9.5 Q5a prints its formula as `{n(n + 1)|2}`, a typesetting slip; the app writes n(n + 1) ÷ 2. The A9.3 video jumps straight to "next term 3n + 5"; the app writes 3(n + 1) + 2 first and expands it, as the PDF and the textbook do. A9.3 Q4a and Q4b are the video's worked example, so they aren't asked again. The A9.5 video only covers triangular numbers, though its title names square, cube and Fibonacci too; the questions cover all four.

Nothing is Higher tier: the nth term of linear sequences, square, cube, triangular and Fibonacci-type sequences, and geometric sequences with a positive whole-number or fraction ratio are all Foundation in AQA 8300. The textbook's geometric sequence with a surd ratio (√3, 3, 3√3, …) is Higher (bold) and is left out. The textbook's own numbers are not used, so nothing looks copied.

The workings, one move a step:
- **Special and geometric**: the terms in a row (`SequencePictures.tsx`), with the jumps between them drawn above (+2, +3, +4 or ×2) on every sequence, as Sunny asked on 2 Oct; Fibonacci shows its gaps (+1, +2, +3, +5) before adding the two terms before. The new terms carry on in the same row at the same spacing (on a phone they wrap onto the next line): the new jumps first, then the new terms in green, which are the answer. A geometric sequence draws its ratio as the jumps, with one division underneath (6 ÷ 3 = 2) to show where it comes from, then multiplies on. The square tiles use the question's own words (square 4 is 4 by 4, so square 5 is 5 by 5), and the cube is one multiplication, 4 × 4 × 4.
- **The nth term**: the gap between the terms, then that times table lined up under the terms (4, 8, 12, 16, with no 4n label), then what to add to each, in purple, ending in the green nth term. Using an nth term is lines of working: the multiply, then the add, which ends in the answer.
- **Is it in? and next to each other**: the A5 board. The nth term equal to the number, undo the number, divide: the answer box says whether n is whole. For two terms next to each other: the next term with n + 1 in place of n, expanded, collected, the two added to the total, then solved, and each term worked out in green.
Finished parts grey out.

Practice questions (`maths/practice/bank/sequences.ts`) use new sequences; their AQA weights are estimates until the 2022–25 papers are counted. The readiness statements are the Sequences topic in the exam map.
