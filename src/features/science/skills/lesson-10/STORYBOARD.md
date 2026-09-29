# Working Scientifically Lesson 10 storyboard: Maths skills for science

Strand skills, chapter WS1 "Working scientifically". Folder `skills/lesson-10`, id `W-DAT-010-W`, spec WS 4.6 and the maths skills for science. It owns standard form, rearranging formulas, using a calculator correctly, and direct and inverse proportion.

Big idea: a few maths habits (standard form, doing the same to both sides, brackets, spotting proportion) make science calculations reliable.

Flow note: standard form first because it is pure number sense and links back to the units lesson (prefixes). Rearranging follows, with a worked example (kinetic energy, a fraction) then a near-identical guided practice, then an independent one. Calculator habits come next because they matter once formulas have several steps. Proportion comes last: it describes how two variables move together, and it is read from a table. Examples: Sun distance, cell width, virus size (Biology), gas mass (Chemistry), speed, force, kinetic energy, spring stretch (Physics).

Sections:
1. Start here (W10-01): why huge numbers need a shorter way to be written.
2. How do you write big and small numbers? (W10-02–04): big, small, the A × 10ⁿ pattern, going back. Checks: two conversions.
3. How do you rearrange a formula? (W10-05–07): do the same to both sides, s = v × t, Ek = ½mv² worked, formula triangles. Checks: rearrange for t; guided calculation of mass (near-identical).
4. How do you use a calculator well? (W10-08–09): brackets around the top, exact values. Check: key presses.
5. How are two variables related? (W10-10–11): direct, inverse, the symbol ∝. Check: doubling.
6. On your own (W10-12–16): standard form calculation, rearranging calculation, proportion from a table (assessment view), brackets error, written explanation of a wrong rearrangement.

Out of scope: rearranging with squares and square roots beyond the one worked example; logs; significant figures (the processing-data lesson); graph shapes for proportion beyond a straight line and a simple curve.

Source boundary: supplied revision-guide page 243 (scope only); AQA 8464 WS 4.6 and maths skills. All wording, examples, numbers and diagrams are original. Draft pending teacher review.

Judgement calls for the teacher:
- Rearranging is shown for Ek = ½mv² (multiply by 2, divide by v²) because the page does; the guided and independent items give the rearranged form m = 2 × Ek ÷ v² so learners practise substitution and arithmetic.
- The temperature and reaction time table in W10-14 is invented and simplified to show inverse proportion.
- Formula triangles are mentioned as an optional tool, with the point that proper rearranging is needed.

## Diagram specs
Same look as Science Lessons 17 and 18: soft flat fills, darker stroke of the same hue, generous white space, text at least 12px, readable on 360px, `role="img"` and a `<title>`. Use ⁻ and superscripts properly (real minus sign, real × sign).

- `wsmaths-big`: the number 6 000 000 J in a row of digit boxes; a curved arrow of six small hops from the end of the number back to just after the 6, counted 1 to 6; below it "6 × 10⁶ J".
- `wsmaths-small`: 0.00045 m in digit boxes; four hops right, counted 1 to 4, landing after the 4; below "4.5 × 10⁻⁴ m". Small cell outline labelled "cell width".
- `wsmaths-form`: large "A × 10ⁿ" with two callouts: "A: at least 1, less than 10" and "n: how many places the point moves; negative for numbers below 1". Below, a small tick row "3.2 × 10⁴" with a tick and "32 × 10³" with a cross labelled "A too big".
- `wsmaths-back`: two rows: "7.2 × 10³ → 7200" with three hops right, and "3 × 10⁻² → 0.03" with two hops left. Arrow directions labelled "positive: right" and "negative: left".
- `wsmaths-balance`: a balance scale, level, with "F" on the left and "m × a" on the right; a hand on each side adding "÷ m" to both pans. Label "Do the same to both sides".
- `wsmaths-divide`: three-line working: "s = v × t", "÷ t on both sides", "v = s ÷ t", with the "÷ t" highlighted on each side.
- `wsmaths-fraction`: five-line working for Ek = ½ × m × v² with values: "Ek = ½ × m × v²", "× 2: 2 × Ek = m × v²", "÷ v²: m = 2 × Ek ÷ v²", "m = 2 × 16 ÷ 16", "m = 2 kg". Highlight the step being done.
- `wsmaths-triangle`: two formula triangles: s over v and t (s at top), and a finger covering s, with "v × t" left showing. Small note "Cover what you want".
- `wsmaths-brackets`: a calculator display drawn simply with two rows: "(11.5 + 6.8) ÷ 3 = 6.1" with a tick, and "11.5 + 6.8 ÷ 3 = 13.77" with a cross. Brackets highlighted in the first.
- `wsmaths-ans`: a three-step chain of small boxes with an "Ans" button between steps, the exact value carried forward, and "round only at the end" beside the last box.
- `wsmaths-direct`: a straight-line graph through the origin, both axes labelled "A" and "B" (no numbers), dotted markers showing B doubling gives A doubling. Label "direct: A ∝ B".
- `wsmaths-inverse`: a simple downward curve on the same axes, dotted markers showing B doubling gives A halving. Label "inverse: A ∝ 1 ÷ B".
- `wsmaths-symbol`: a two-row table: Direct / Inverse, with "B doubles, A doubles" / "B doubles, A halves" and the ∝ forms.
- `wsmaths-q-table` (question, assessment view): a table titled "Reaction time at different temperatures" with columns Temperature (°C) 10, 20, 40 and Time (s) 120, 60, 30. No pattern labels, no arrows, no ratios shown.

## States in full

### W10-01 Guided choice: The Sun is about 150 000 000 000 m from Earth. How can scientists write a number like this more easily?
- Options: With a shorter unit name | In standard form, as a number times a power of ten | By rounding it to 150 m | By writing it in words each time
- Answer: In standard form, as a number times a power of ten
- Hint: Think about a way of writing very big or very small numbers with few digits.
- Why: Standard form writes a number as A × 10ⁿ, so this distance is 1.5 × 10¹¹ m. It is shorter and easier to compare than a long row of zeros.

### W10-02 Teach: How do you write big and small numbers?
- **Very big numbers** (`wsmaths-big`): Scientists often use numbers that are huge or tiny. Standard form makes them short. Take 6 000 000 J. Move the decimal point 6 places to the left to get 6. So 6 000 000 J is 6 × 10⁶ J.
- **Very small numbers** (`wsmaths-small`): A tiny number needs a negative power. Take 0.00045 m, the width of a cell. Move the decimal point 4 places to the right to get 4.5. So 0.00045 m is 4.5 × 10⁻⁴ m.
- **The pattern A × 10ⁿ** (`wsmaths-form`): Standard form always looks like A × 10ⁿ. A is at least 1 and less than 10. The power n is positive for numbers bigger than 10 and negative for numbers smaller than 1. So 45 × 10³ is not in standard form.
- **Going back again** (`wsmaths-back`): You can also go back. Take 7.2 × 10³. A positive power of 3 means move the point 3 places to the right. That gives 7200. For 3 × 10⁻² a negative power means move the point 2 places to the left. That gives 0.03.

### W10-03 Guided choice: A weight lifter pushes with a force of 50 000 N. What is this in standard form?
- Options: 50 × 10³ N | 5 × 10⁵ N | 0.5 × 10⁵ N | 5 × 10⁴ N
- Answer: 5 × 10⁴ N
- Hint: Move the decimal point until you have a number between 1 and 10.
- Why: Moving the point 4 places to the left gives 5. So 50 000 N is 5 × 10⁴ N.

### W10-04 Guided choice: A virus is 0.0000007 m across. What is this in standard form?
- Options: 7 × 10⁻⁷ m | 7 × 10⁷ m | 0.7 × 10⁻⁶ m | 7 × 10⁻⁶ m
- Answer: 7 × 10⁻⁷ m
- Hint: This is a small number, so the power of ten will be negative.
- Why: Move the decimal point 7 places to the right to get 7. So 0.0000007 m is 7 × 10⁻⁷ m.

### W10-05 Teach: How do you rearrange a formula?
- **Do the same to both sides** (`wsmaths-balance`): Sometimes a formula gives you the wrong quantity. You may need to rearrange it. This means getting the quantity you want on its own. Whatever you do to one side of the equals sign, you must do to the other. This keeps the formula balanced.
- **A first example** (`wsmaths-divide`): Take distance = speed × time, or s = v × t. Suppose you want the speed v. Time is multiplying v, so divide both sides by t. This gives s ÷ t = v. So v = s ÷ t. You met this when you worked out speed in Physics.
- **A worked example with a fraction** (`wsmaths-fraction`): Kinetic energy is Ek = ½ × m × v². Find m when Ek = 16 J and v = 4 m/s. Multiply both sides by 2: 2 × Ek = m × v². Divide both sides by v²: m = 2 × Ek ÷ v². So m = 2 × 16 ÷ 16 = 2 kg.
- **Formula triangles** (`wsmaths-triangle`): For simple formulas you can use a formula triangle. Cover up the quantity you want to find. What is left shows how to work it out. For example, cover s in the s, v, t triangle and you see v × t. Learn to rearrange properly too, because bigger formulas do not fit in triangles.

### W10-06 Guided choice: The formula is s = v × t. Which is the correct rearrangement to find t?
- Options: t = s × v | t = v ÷ s | t = s − v | t = s ÷ v
- Answer: t = s ÷ v
- Hint: Divide both sides by the quantity that multiplies t.
- Why: Divide both sides by v to get s ÷ v = t. So t = s ÷ v.

### W10-07 Guided choice: A ball has Ek = 45 J and v = 3 m/s. Find m using m = 2 × Ek ÷ v².
- Options: 5 kg | 10 kg | 30 kg | 15 kg
- Answer: 10 kg
- Hint: Work out v² first, then double Ek and divide.
- Why: v² = 3 × 3 = 9. m = 2 × 45 ÷ 9 = 90 ÷ 9 = 10 kg.

### W10-08 Teach: How do you use a calculator well?
- **Brackets on the calculator** (`wsmaths-brackets`): Your calculator follows the order of operations. Take (11.5 + 6.8) ÷ 3, which is 18.3 ÷ 3 = 6.1. If you type 11.5 + 6.8 ÷ 3 it divides only the 6.8. You would get 13.77 instead. Always put brackets around the top of a fraction. You can also use the fraction button.
- **Keep the exact value** (`wsmaths-ans`): A calculation often has several steps. Use the exact value from the step before, not a rounded one. Rounding early can make the final answer wrong. Most calculators have an Ans button that holds the last answer. Round only the final answer.

### W10-09 Guided choice: You need to find (8.5 + 3.5) ÷ 4 on a calculator. Which key presses are right?
- Options: (8.5 + 3.5) ÷ 4 | 8.5 + 3.5 ÷ 4 | 8.5 + (3.5 ÷ 4) | 8.5 ÷ 4 + 3.5
- Answer: (8.5 + 3.5) ÷ 4
- Hint: The top of the fraction needs to be worked out first.
- Why: Brackets make the calculator add 8.5 and 3.5 before dividing. (8.5 + 3.5) ÷ 4 = 12 ÷ 4 = 3.

### W10-10 Teach: How are two variables related?
- **Direct proportion** (`wsmaths-direct`): Two variables can be related by proportion. In direct proportion, when one increases the other increases in the same ratio. Double one and the other doubles too. A graph of these is a straight line through the origin. The stretch of a spring is directly proportional to the force pulling it, up to a limit.
- **Inverse proportion** (`wsmaths-inverse`): In inverse proportion, when one variable increases the other decreases in the same ratio. Double one and the other halves. Take a journey of 60 km. At double the speed the journey takes half the time. Speed and time are inversely proportional.
- **The proportional symbol** (`wsmaths-symbol`): The symbol ∝ means is proportional to. For direct proportion write A ∝ B. For inverse proportion write A ∝ 1 ÷ B. In a table, check how the numbers change. If B doubles and A doubles, it is direct. If B doubles and A halves, it is inverse.

### W10-11 Guided choice: Speed and time are inversely proportional. If the speed of a trolley is doubled, what happens to the time?
- Options: It doubles | It stays the same | It is four times bigger | It halves
- Answer: It halves
- Hint: In inverse proportion, one goes up as the other goes down.
- Why: Doubling one variable halves the other in inverse proportion. So the time is halved.

### W10-12 Independent choice: A gas has a mass of 0.00032 kg. What is this in standard form?
- Options: 3.2 × 10⁻⁴ kg | 3.2 × 10⁴ kg | 32 × 10⁻⁵ kg | 3.2 × 10⁻³ kg
- Answer: 3.2 × 10⁻⁴ kg
- Hint: Move the decimal point until the number is between 1 and 10, then count the places.
- Why: The point moves 4 places to the right to give 3.2. It is a number less than 1, so the power is −4: 3.2 × 10⁻⁴ kg.

### W10-13 Independent choice: A cyclist has Ek = 24 J and v = 2 m/s. Find m using m = 2 × Ek ÷ v².
- Options: 6 kg | 24 kg | 12 kg | 48 kg
- Answer: 12 kg
- Hint: Work out v² first, then use the formula.
- Why: v² = 2 × 2 = 4. m = 2 × 24 ÷ 4 = 48 ÷ 4 = 12 kg.

### W10-14 Independent choice: The table shows how the time for a reaction changes with temperature. Which describes the pattern?
- Options: Direct proportion | Inverse proportion | Neither, the time is constant | Neither, the time is random
- Answer: Inverse proportion
- Hint: Check what happens to the time each time the temperature doubles.
- Why: The temperature doubles from 20 to 40 °C and the time halves from 60 s to 30 s. One variable doubles as the other halves, so it is inverse proportion.
- Visual: `wsmaths-q-table` (assessment view)

### W10-15 Independent choice: A student types 12 + 6 ÷ 3 to find (12 + 6) ÷ 3. What is the problem?
- Options: The calculator cannot divide by 3 | The answer will be too small by a factor of 3 | The brackets are missing, so it divides only the 6 | Nothing, it gives the same answer
- Answer: The brackets are missing, so it divides only the 6
- Hint: The calculator divides before it adds unless brackets tell it not to.
- Why: Without brackets, 6 ÷ 3 is worked out first, giving 12 + 2 = 14. With brackets, 18 ÷ 3 = 6, so the answers differ.

### W10-16 Written task (teacher marked): A student rearranges F = m × a as a = m ÷ F. Explain the mistake and give the correct rearrangement.
- Hint: Say what to do to both sides to get a on its own.
- Model answer: The student has not done the same thing to both sides. Because m is multiplying a, both sides should be divided by m. This gives F ÷ m = a. So the correct rearrangement is a = F ÷ m.
- Points: Says that you must do the same to both sides. / Says to divide both sides by m, as m multiplies a. / Gives the correct rearrangement a = F ÷ m. / Explains that a = m ÷ F is wrong.
- Reject: Only giving the answer with no explanation. / Saying to subtract m from both sides. / Writing the answer a = F × m.

