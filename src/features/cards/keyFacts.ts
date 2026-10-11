/*
 * Key-fact revision cards, two or three per rung.
 * DRAFT: written for the preview and awaiting a maths teacher's review before any student alpha.
 * Plain text only (² ³ √ π and "3/4" style fractions) so they read the same everywhere.
 * Keys are lesson number → rung (micro-skill) id → cards [front, back].
 */
export type KeyFact = [front: string, back: string]

export const KEY_FACTS: Record<number, Record<string, KeyFact[]>> = {
  1: {
    'whole-values': [
      ['What is an integer?', 'A whole number. It can be positive, negative or zero: … −2, −1, 0, 1, 2 …'],
      ['Is 6.5 an integer?', 'No. It is between 6 and 7, so it is not a whole number.'],
    ],
    'special-integers': [
      ['What is a prime number?', 'A number with exactly two factors: 1 and itself. 2, 3, 5, 7, 11, 13 … (1 is not prime: it has only one factor.)'],
      ['What are the first five square numbers?', '1, 4, 9, 16, 25. They are 1², 2², 3², 4² and 5².'],
      ['What are the first five cube numbers?', '1, 8, 27, 64, 125. They are 1³, 2³, 3³, 4³ and 5³.'],
    ],
    'rational-numbers': [
      ['What is a rational number?', 'A number you can write as a fraction of two integers, like 3/4, 0.5 = 1/2 or 5 = 5/1.'],
      ['Is 0.333… (recurring) rational?', 'Yes. 0.333… recurring is exactly 1/3.'],
    ],
    'irrational-numbers': [
      ['Give an example of an irrational number.', 'π or √2. Their decimals go on forever and never repeat, so they cannot be written as a fraction.'],
      ['Is √9 irrational?', 'No. √9 = 3, which is an integer, so it is rational.'],
    ],
    'multiples-factors': [
      ['What is the difference between a factor and a multiple?', 'A factor divides into a number exactly (factors of 12: 1, 2, 3, 4, 6, 12). A multiple is in its times table (multiples of 12: 12, 24, 36 …).'],
      ['List the factors of 18.', '1, 2, 3, 6, 9, 18. Find them in pairs: 1 × 18, 2 × 9, 3 × 6.'],
    ],
  },
  2: {
    'bidmas-ladder': [
      ['What does BIDMAS stand for?', 'Brackets, Indices, Divide and Multiply, Add and Subtract. Four steps, from the top of the ladder down.'],
      ['In BIDMAS, which goes first: × or ÷?', 'Neither. They share a step, so work from left to right.'],
      ['What does 3² mean?', '3 × 3 = 9. Not 3 × 2.'],
    ],
    'operation-priority': [
      ['Work out 3 + 4 × 2.', '11. Multiply first: 4 × 2 = 8, then 3 + 8 = 11.'],
      ['Work out (3 + 4) × 2.', '14. Brackets first: 3 + 4 = 7, then 7 × 2 = 14.'],
    ],
    'equal-priority': [
      ['Work out 10 − 3 + 2.', '9. Add and subtract share a step, so go left to right: 10 − 3 = 7, then 7 + 2 = 9.'],
      ['Work out 20 ÷ 4 × 5.', '25. Divide and multiply share a step, so go left to right: 20 ÷ 4 = 5, then 5 × 5 = 25.'],
    ],
    'fraction-grouping': [
      ['What does a fraction bar do in a calculation?', 'It groups the top and the bottom. Work out the whole top and the whole bottom, then divide.'],
    ],
    mixed: [
      ['Simplify 2x × 3x.', '6x². Multiply the numbers (2 × 3 = 6) and the letters (x × x = x²).'],
      ['Simplify 6x² + x².', '7x². They are like terms, so add the numbers in front: 6 + 1 = 7.'],
    ],
  },
  3: {
    'digit-place-value': [
      ['What is the value of the 7 in 4,721?', '700. It is in the hundreds column.'],
      ['What is the value of the 5 in 250,000?', '50,000 (fifty thousand). It is in the ten thousands column.'],
    ],
    'decimal-places': [
      ['What is the value of the 4 in 3.47?', '4 tenths, which is 0.4.'],
      ['Which is bigger: 0.5 or 0.45?', '0.5. Compare the tenths first: 5 tenths is more than 4 tenths.'],
    ],
  },
  4: {
    'long-multiplication-layout': [
      ['How do you start 42 × 18 with the grid method?', 'Split both numbers: 42 = 40 + 2 and 18 = 10 + 8. Multiply each pair, then add the four answers.'],
    ],
    'long-multiplication-carrying': [
      ['In column multiplication, what do you do when a column makes 10 or more?', 'Write the units digit and carry the tens into the next column.'],
    ],
    'long-multiplication-tens': [
      ['Why does the second row of 42 × 18 start with a 0?', 'You are multiplying by 10, not 1. The place-holder zero keeps the digits in the right columns.'],
      ['Work out 42 × 18.', '756. 42 × 8 = 336 and 42 × 10 = 420, then 336 + 420 = 756.'],
    ],
  },
  5: {
    'long-division-layout': [
      ['How does bus-stop division start?', 'Divide the first digit by the divisor, write the answer on top, and carry any remainder to the next digit.'],
    ],
    'long-division-remainders': [
      ['250 buns go into boxes of 8. How many boxes do you need to pack every bun?', '32. 250 ÷ 8 = 31 remainder 2, so you need one more box for the 2 left over.'],
    ],
    'long-division-check': [
      ['How can you check that 624 ÷ 8 = 78?', 'Multiply back: 78 × 8 = 624.'],
    ],
  },
  6: {
    'decimal-addition': [
      ['How do you add 12.08 + 5.9?', 'Line up the decimal points. Write 5.9 as 5.90, then add column by column: 17.98.'],
    ],
    'decimal-subtraction': [
      ['Work out 40 − 17.85.', '22.15. Write 40 as 40.00 so every column has a digit, then subtract.'],
    ],
    'decimal-multiplication': [
      ['How do you work out 5.2 × 3.4?', 'Work out 52 × 34 = 1768. The question has 2 decimal places altogether, so the answer is 17.68.'],
    ],
    'decimal-division': [
      ['How do you work out 12.6 ÷ 0.3?', 'Multiply both numbers by 10 so you divide by a whole number: 126 ÷ 3 = 42.'],
    ],
  },
  7: {
    'prime-factorisation': [
      ['Write 60 as a product of prime factors.', '2² × 3 × 5. Check: 2 × 2 × 3 × 5 = 60.'],
    ],
    'hcf-lcm-listing': [
      ['What is the HCF of two numbers?', 'The highest common factor: the biggest number that divides into both. The HCF of 8 and 12 is 4.'],
      ['What is the LCM of two numbers?', 'The lowest common multiple: the smallest number in both times tables. The LCM of 4 and 6 is 12.'],
    ],
    'hcf-lcm-venn': [
      ['In a Venn diagram of prime factors, how do you find the HCF and the LCM?', 'HCF: multiply the numbers in the middle. LCM: multiply every number in the diagram.'],
    ],
  },
  8: {
    'simplifying-fractions': [
      ['How do you simplify a fraction fully?', 'Divide the top and bottom by their highest common factor. 18/24: divide both by 6 to get 3/4.'],
    ],
    'mixed-improper-fractions': [
      ['Write 3 1/4 as an improper fraction.', '13/4. 3 × 4 = 12, then add the 1 to get 13.'],
      ['Write 17/6 as a mixed number.', '2 5/6. 17 ÷ 6 = 2 remainder 5.'],
    ],
    'adding-fractions': [
      ['Work out 3/8 + 1/6.', '13/24. Use a common denominator of 24: 9/24 + 4/24 = 13/24. Add only the tops.'],
    ],
    'subtracting-fractions': [
      ['Work out 7/9 − 2/3.', '1/9. 2/3 = 6/9, so 7/9 − 6/9 = 1/9.'],
    ],
    'multiplying-fractions': [
      ['How do you multiply fractions?', 'Multiply the tops and multiply the bottoms, then simplify: 1/4 × 2/3 = 2/12 = 1/6.'],
    ],
    'dividing-fractions': [
      ['How do you divide by a fraction?', 'Flip the second fraction and multiply: 1/3 ÷ 2/5 = 1/3 × 5/2 = 5/6.'],
    ],
    'mixed-fraction-calculations': [
      ['What do you do first to work out 2 1/2 × 1 1/5?', 'Change the mixed numbers to improper fractions: 5/2 × 6/5 = 30/10 = 3.'],
    ],
    'fractions-of-amounts': [
      ['Find 3/5 of 40.', '24. Divide by the bottom (40 ÷ 5 = 8), then multiply by the top (8 × 3 = 24).'],
    ],
  },
  9: {
    'fraction-to-decimal': [['Write 3/4 as a decimal.', '0.75. Work out 3 ÷ 4.']],
    'decimal-to-fraction': [['Write 0.35 as a fraction in its simplest form.', '7/20. 0.35 = 35/100, then divide the top and bottom by 5.']],
    'decimal-to-percentage': [['Write 0.4 as a percentage.', '40%. Multiply by 100.']],
    'percentage-to-decimal': [['Write 9% as a decimal.', '0.09. Divide by 100.']],
    'fraction-to-percentage': [['Write 9/25 as a percentage.', '36%. 9/25 = 36/100.']],
    'percentage-to-fraction': [['Write 45% as a fraction in its simplest form.', '9/20. 45% = 45/100, then divide the top and bottom by 5.']],
  },
  10: {
    'rounding-decimal-places': [
      ['Round 7.4362 to 2 decimal places.', '7.44. The next digit is 6, which is 5 or more, so round up.'],
    ],
    'rounding-significant-figures': [
      ['Round 48,562 to 2 significant figures.', '49,000. Round to 49 thousand and fill the places with zeros to keep the number the same size.'],
      ['Where do the significant figures start in 0.0004062?', 'At the first digit that is not zero: the 4.'],
    ],
    'rounding-powers-of-ten': [
      ['Round 6342 to the nearest 100.', '6300. The next digit is 4, which is less than 5, so the hundreds digit stays the same.'],
    ],
    'rounding-carrying': [
      ['Round 6.97 to 1 decimal place.', '7.0. Rounding 6.9 up carries into the units. Keep the 0 to show 1 decimal place.'],
    ],
  },
  11: {
    'ordering-decimals': [['Put these in order, smallest first: 0.3, 0.25, 0.305', '0.25, 0.3, 0.305. Compare tenths first, then hundredths, then thousandths.']],
    'ordering-large-numbers': [['Which is bigger: 18,605 or 18,560?', '18,605. The first difference is in the hundreds: 6 hundreds is more than 5 hundreds.']],
    'ordering-negative-numbers': [['Which is bigger: −68 or −86?', '−68. It is closer to zero, so it is higher.']],
    'ordering-fractions-decimals-percentages': [['Put in order, smallest first: 0.7, 71%, 18/25', '0.7, 71%, 18/25. Change them all to decimals: 0.7, 0.71, 0.72.']],
  },
  12: {
    'estimating-significant-figures': [['Where does the 1st significant figure start in 0.00398?', 'At the 3, the first digit that isn’t zero. 0.00398 ≈ 0.004 to 1 s.f.']],
    'estimating-calculations': [['How do you estimate 48 × 3.12?', 'Round each number to 1 s.f. first: 50 × 3 = 150. Don’t round the exact answer at the end.']],
    'estimating-formulas': [['Estimate the speed: 296 km in 3.1 hours.', '300 ÷ 3 = 100 km/h. Round the values, then put them into speed = distance ÷ time.']],
    'estimating-checking': [['Every number was rounded up. Is the estimate too big or too small?', 'Too big. Rounding every number down would make it too small.']],
  },
  13: {
    'bounds-half-unit': [['8.4 is correct to 1 decimal place. How far could the real value be from 8.4?', 'Up to 0.05 either side: half of the unit, 0.1.']],
    'bounds-lower-upper': [['250 to the nearest 10: lower and upper bounds?', 'Lower 245, upper 255. Take off and add on half of 10.']],
    'bounds-error-interval': [['Error interval for 2400 to the nearest 100?', '2350 ≤ n < 2450. The upper bound is not included, because 2450 rounds up to 2500.']],
    'truncation': [['Truncate 7.396 to 2 decimal places.', '7.39. Chop off everything after the cut-off. Don’t round up.']],
    'truncation-error-interval': [['Error interval for 3.7, truncated to 1 decimal place?', '3.7 ≤ m < 3.8. The value itself is the lower bound; add one whole unit for the upper bound.']],
  },
  14: {
    'standard-form-to-large': [['Write 3.6 × 10⁴ as an ordinary number.', '36 000. A positive power: hop the point 4 places right and fill the empty places with zeros.']],
    'standard-form-to-small': [['Write 6.3 × 10⁻⁵ as an ordinary number.', '0.000063. A negative power: hop the point 5 places left and fill the empty places with zeros.']],
    'standard-form-write-large': [['Write 84 300 000 in standard form.', '8.43 × 10⁷. The point hops 7 places left: one less than the 8 digits.']],
    'standard-form-write-small': [['Write 0.000512 in standard form.', '5.12 × 10⁻⁴. The point hops 4 places right: one more than the 3 zeros after the point.']],
    'standard-form-multiply': [['(5 × 10⁴) × (6 × 10³) in standard form?', '3 × 10⁸. 5 × 6 = 30 and 4 + 3 = 7, then 30 × 10⁷ = 3 × 10⁸.']],
    'standard-form-divide': [['(7.2 × 10⁸) ÷ (9 × 10³) in standard form?', '8 × 10⁴. 7.2 ÷ 9 = 0.8 and 8 − 3 = 5, then 0.8 × 10⁵ = 8 × 10⁴.']],
  },
  15: {
    'like-terms-one-letter': [['Simplify 9y + 5 − 4y + 6.', '5y + 11. The − belongs to the 4y, so 9y − 4y = 5y, and 5 + 6 = 11.']],
    'like-terms-different-letters': [['Simplify 3ab + 4a + 2ab.', '5ab + 4a. ab and a are not like terms, so 4a stays as it is.']],
    'like-terms-powers': [['Are x²y and xy² like terms?', 'No. The letters match, but the powers don’t: x is squared in one and y in the other.']],
    'like-terms-mixed': [['Simplify 5w + 5w + 5w.', '15w, not 5w³. Adding only changes the number in front; the letters and powers stay the same.']],
  },
  16: {
    'indices-power-one': [['What is 9¹?', '9. A power of 1 is one copy of the number, with nothing to multiply it by.']],
    'indices-multiply': [['Write 3⁴ × 3² as a single power of 3.', '3⁶. Same base, so add the powers: 4 + 2 = 6. The base stays as 3, not 9.']],
    'indices-divide': [['Write 4⁷ ÷ 4² as a single power of 4.', '4⁵. Same base, so subtract the powers: 7 − 2 = 5. The base stays as 4.']],
    'indices-power-zero': [['What is 5⁰?', '1, not 0. Any number except 0 to the power 0 is 1: 5¹ = 5, and one step down is 5 ÷ 5 = 1.']],
    'indices-one': [['What is 1⁹⁹?', '1. Multiplying 1 by itself any number of times is still 1.']],
    'indices-power-of-power': [['Write (2³)² as a single power of 2.', '2⁶. A power of a power: multiply the powers, 3 × 2 = 6. Adding is for two powers multiplied together.']],
    'indices-fraction': [['Work out (2/3)².', '4/9. Square the top and the bottom: 2² = 4 and 3² = 9.']],
    'roots': [['Work out √49 and ∛27.', '7 and 3. 7 × 7 = 49, and 3 × 3 × 3 = 27. A square root is not half.']],
  },
  17: {
    'expand-single': [['Expand −3(2p − 5).', '−6p + 15. Multiply −3 by both terms: −3 × 2p = −6p, and −3 × −5 = +15 (negative × negative is positive).']],
    'expand-double': [['Expand and simplify (n − 4)².', 'n² − 8n + 16, not n² − 16. (n − 4)² is (n − 4)(n − 4): four products, n² − 4n − 4n + 16.']],
  },
  18: {
    'factorise-two-terms': [['Factorise fully 6x² + 9x.', '3x(2x + 3). 3 is the biggest number in 6 and 9, and both terms have an x. Then 6x² ÷ 3x = 2x and 9x ÷ 3x = 3.']],
    'factorise-three-terms': [['Factorise fully 10x + 15y + 5.', '5(2x + 3y + 1). Only 5 goes into all three terms, and 5 ÷ 5 = 1, so the 1 keeps its place in the bracket.']],
  },
  19: {
    'equations-one-unknown': [['Solve 5x − 3 = 27.', 'x = 6. Add 3 to both sides: 5x = 30. Then divide both sides by 5.']],
    'equations-squares': [['Solve x² = 49.', 'x = 7 or x = −7. Square root both sides, and remember −7 × −7 = 49 too.']],
    'equations-both-sides': [['Solve 9x + 4 = 4x + 29.', 'x = 5. Subtract 4x from both sides: 5x + 4 = 29. Then 5x = 25.']],
    'equations-brackets': [['Solve 2(3x + 1) = x + 22.', 'x = 4. Multiply out: 2 × 3x = 6x and 2 × 1 = 2, so 6x + 2 = x + 22. Then 5x = 20.']],
    'equations-fractions': [['Solve (2x + 1)/3 = 5.', 'x = 7. Multiply both sides by 3: 2x + 1 = 15. Then 2x = 14.']],
  },
  20: {
    'rearrange-linear': [['Make m the subject of C = 3m + 5.', 'm = (C − 5)/3. Subtract 5 from both sides: C − 5 = 3m. Then divide all of C − 5 by 3.']],
    'rearrange-fractions': [['Make a the subject of M = (a + b)/2.', 'a = 2M − b. Multiply both sides by 2 to clear the fraction: 2M = a + b. Then subtract b.']],
    'rearrange-squares': [['Make s the subject of A = 6s².', 's = √(A/6). Divide both sides by 6: A/6 = s². Then square root the whole of A/6.']],
    'rearrange-roots': [['Make h the subject of t = √(h/5).', 'h = 5t². Square both sides to undo the root: t² = h/5. Then multiply both sides by 5.']],
  },
  21: {
    'quadratics-positive': [['Factorise x² + 8x + 15.', '(x + 3)(x + 5). 3 and 5 multiply to 15 and add to 8.']],
    'quadratics-negative-middle': [['Factorise x² − 9x + 20.', '(x − 4)(x − 5). The last number is positive and the middle negative, so both numbers are negative: −4 × −5 = 20 and −4 + −5 = −9.']],
    'quadratics-negative-last': [['Factorise x² + 2x − 15.', '(x − 3)(x + 5). The last number is negative, so one number is negative: −3 × 5 = −15 and −3 + 5 = 2.']],
    'quadratics-difference-of-squares': [['Factorise x² − 49.', '(x + 7)(x − 7). 49 is 7 × 7. One bracket plus, one minus, so the middle terms cancel.']],
  },
  23: {
    'sequences-special': [['Next two terms of 1, 3, 6, 10.', '15 and 21. The gaps are 2, 3, 4, so the next gaps are 5 and 6.']],
    'sequences-geometric': [['Next two terms of 3, 6, 12, 24.', '48 and 96. Each term divided by the one before is 2: the common ratio. Keep multiplying by 2.']],
    'sequences-nth-term': [['The nth term of 5, 9, 13, 17.', '4n + 1. The gap is 4, so start with 4n: 4, 8, 12, 16. Each term is 1 more.']],
    'sequences-in-sequence': [['Is 63 a term of 5n − 2?', 'Yes. 5n − 2 = 63, so 5n = 65 and n = 13, a whole number.']],
    'sequences-consecutive': [['Two terms next to each other of 3n + 2 add to 55. Find them.', '26 and 29. The next term is 3(n + 1) + 2 = 3n + 5. 6n + 7 = 55, so n = 8.']],
  },
  27: {
    'simultaneous-elimination': [['Solve 3x + 2y = 16 and x + 2y = 8.', 'x = 4, y = 2. Both have +2y, so take one from the other: 2x = 8. Put x = 4 back in to find y.']],
    'simultaneous-words': [['2 teas and a cake cost £7. 2 teas and 3 cakes cost £13.', 'Tea £2, cake £3. Write 2t + c = 7 and 2t + 3c = 13, take one from the other: 2c = 6.']],
  },
  28: {
    'proof-counterexample': [['“2n + 1 is always prime.” Show it is wrong.', 'One counterexample is enough: n = 4 gives 9, and 9 = 3 × 3 isn’t prime.']],
    'proof-identity': [['Show (x + 3)² − x² ≡ 6x + 9.', 'Work on the left only: x² + 6x + 9 − x² = 6x + 9. ≡ means equal for every x.']],
    'proof-geometric': [['Prove the angles in a triangle add to 180°.', 'Draw a line through the top, parallel to the base. Alternate angles copy a and b to the top, and angles on a straight line add to 180°.']],
    'proof-algebraic': [['Prove two numbers in a row add to an odd number.', 'n + (n + 1) = 2n + 1. 2n is even, so 2n + 1 is odd.']],
  },
  29: {
    'function-machines-forwards': [['Input 7 → × 4 → + 3 → output?', '31. Go through the boxes in order: 7 × 4 = 28, then 28 + 3 = 31. The order matters: + 3 first would give 40.']],
    'function-machines-backwards': [['? → × 5 → − 4 → output 26. Find the input.', '6. Undo the last box first, with opposites: 26 + 4 = 30, then 30 ÷ 5 = 6.']],
    'function-machines-creating': [['Draw the machine for y = 3x + 4.', 'x → × 3 → + 4 → y. BIDMAS: 3x is worked out before the + 4. For (x + 6) ÷ 4, the top comes first: + 6, then ÷ 4.']],
  },
  30: {
    'ratio-difference': [['2 : 3 : 6, and Fay (6 parts) has 24 more than Dev (2 parts). How many for Eli (3 parts)?', '18. The difference in parts is 6 − 2 = 4, so 4 parts = 24 and 1 part = 6. Eli: 3 × 6 = 18. 24 is the difference, not the total.']],
    'ratio-changing': [['Mira : Noel = 7 : 3. Mira gives Noel 10, and now they are equal. How many did Mira have?', '35. Call 1 part x: 7x − 10 = 3x + 10, so 4x = 20 and x = 5. Mira had 7 × 5 = 35. Change the real amounts, never the ratio numbers.']],
    'ratio-unit-form': [['Write 6 : 15 in the form 1 : n.', '1 : 2.5. Divide both numbers by the first number, 6. For n : 1, divide both by the second number. n can be a decimal.']],
  },
  31: {
    'proportion-direct': [['4 people eat 12 slices of pizza. How many slices for 7 people?', '21. Divide to find 1: 12 ÷ 4 = 3 slices each. Multiply to find many: 7 × 3 = 21. More people, more slices.']],
    'proportion-inverse': [['4 painters take 9 hours. How long do 6 painters take?', '6 hours. Multiply to get the total work: 4 × 9 = 36 hours for 1 painter alone. Divide to share it: 36 ÷ 6 = 6 hours each. More painters, less time.']],
  },
  32: {
    'percentage-of-amount': [['Work out 23% of £80 without a calculator.', '£18.40. Find 1%: 80 ÷ 100 = £0.80. Then multiply by 23: 23 × 0.80 = £18.40.']],
    'percentage-increase': [['Rent of £600 goes up by 15%. What is the new rent?', '£690. Find 1%: 600 ÷ 100 = £6. The new rent is 100% + 15% = 115%, so 115 × 6 = £690. The same as £600 × 1.15.']],
    'percentage-decrease': [['A £45 jacket has 30% off. What is the sale price?', '£31.50. Find 1%: 45 ÷ 100 = £0.45. 30% off leaves 70%, so 70 × 0.45 = £31.50. The same as £45 × 0.7.']],
    'percentage-change': [['A phone drops from £400 to £250. What is the percentage change?', 'A 37.5% decrease. Change = 400 − 250 = 150, then 150 ÷ 400 × 100 = 37.5. Always divide by the original, and say increase or decrease.']],
  },
  33: {
    'reverse-percentage': [['Headphones are £48 after 20% off. What was the price before the sale?', '£60. 20% off leaves 80%, so 80% = £48. Find 1%: 48 ÷ 80 = £0.60. Multiply by 100: 0.60 × 100 = £60. Never add 20% of £48.']],
    'reverse-percentage-multiplier': [['A bus pass went up 15% to £69. What did it cost before?', '£60. The new price is 115% = 1.15 of the old one, so divide: 69 ÷ 1.15 = £60. Check forwards: 60 × 1.15 = 69.']],
  },
  34: {
    'simple-interest': [['£800 is saved at 5% simple interest. How much after 3 years?', '£920. Interest each year: 5% of £800 = £40. 3 years: 3 × 40 = £120. Add it on: 800 + 120 = £920.']],
    'compound-growth': [['£2000 is saved at 3% compound interest. How much after 2 years?', '£2121.80. The multiplier is 100% + 3% = 1.03. 2000 × 1.03 = 2060, then 2060 × 1.03 = 2121.80. Or 2000 × 1.03².']],
    'compound-decay': [['A £12,000 car loses 20% a year. What is it worth after 2 years?', '£7680. It keeps 80%, so the multiplier is 0.8. 12000 × 0.8 = 9600, then 9600 × 0.8 = 7680. Or 12000 × 0.8².']],
    'compound-periods': [['Rent of £800 rises 5% a year. After how many years is it over £1000?', '5 years. Try n: 800 × 1.05⁴ = £972.41, too low; 800 × 1.05⁵ = £1021.03, over. Stop at the first n that works.']],
  },
  24: {
    'inequalities-number-line': [['Show h ≥ 120 on a number line.', 'A filled circle at 120 (120 is included) and an arrow pointing right (bigger). An open circle would mean 120 isn’t included: > or <.']],
    'inequalities-two-sided': [['Write the inequality: filled circle at −4, open circle at 1, joined.', '−4 ≤ x < 1. Smallest number first. Filled means ≤, open means <.']],
  },
  25: {
    'inequalities-integers': [['List the integers that satisfy −1 < x ≤ 3.', '0, 1, 2, 3. < leaves −1 out; ≤ puts 3 in.']],
    'inequalities-solve': [['Solve 4a − 5 > a + 7.', 'a > 4. Add 5: 4a > a + 12. Subtract a: 3a > 12. Divide by 3.']],
    'inequalities-solve-two-signs': [['Solve 3 < 2x + 1 < 11.', '1 < x < 5. Do the same to all three parts: subtract 1, then divide by 2.']],
    'inequalities-negative': [['Solve −3x > 12.', 'x < −4. Dividing by a negative number flips the sign.']],
  },
  22: {
    'quadratic-equations': [['Solve x² + x = 20.', 'x = 4 or x = −5. Subtract 20: x² + x − 20 = 0. Factorise: (x − 4)(x + 5) = 0. One bracket must be 0, so x − 4 = 0 or x + 5 = 0.']],
  },
  // Lessons 35 and 36 and the Graphs, Geometry and Probability chapters (11 Oct): one card per rung, written from each
  // lesson's teaching screens with the numbers in the card, since these lessons' own questions lean on their pictures.
  35: {
    'negatives-number-line': [['Work out −3 + 7.', '4. Start at −3 and move up 7: up 3 to 0, then 4 more. Adding moves up the number line; subtracting moves down.']],
    'negatives-two-signs': [
      ['Work out 6 − (−4).', '10. Two signs together become one: same signs make +, different signs make −. So 6 − (−4) = 6 + 4.'],
      ['Work out 5 + (−8).', '−3. + and − are different signs, so they make −: 5 − 8 = −3.'],
    ],
    'negatives-multiply-divide': [['Work out −6 × 4 and −20 ÷ −5.', '−24 and 4. Work out the numbers first, then the sign: different signs give a negative answer, same signs give a positive one.']],
    'negatives-problems': [['It was −4°C at 6 am and 9°C at midday. How many degrees did it rise?', '13 degrees. Bigger take smaller: 9 − (−4) = 9 + 4 = 13. Counting up through 0 gives the same: 4 to 0, then 9 more.']],
  },
  36: {
    'substitution-expressions': [['Work out 3a + 2b when a = 4 and b = 5.', '22. 3a means 3 × a, so 3 × 4 + 2 × 5 = 12 + 10 = 22.']],
    'substitution-negatives': [['Work out 2x² when x = −3.', '18. Put −3 in brackets and square first: (−3)² = 9. Then 2 × 9 = 18. A negative squared is positive.']],
    'substitution-formulae': [['Use v = u + at to find v when u = 5, a = 3 and t = 4.', '17. v = 5 + 3 × 4 = 5 + 12 = 17. Multiply before you add.']],
  },
  101: {
    'graphs-coordinates': [['In the point (4, 2), which number is across?', '4. Coordinates are across, then up: (x, y). So (4, 2) is 4 across and 2 up.']],
    'graphs-quadrants': [['Where is the point (−3, 2)?', '3 left of 0 and 2 up. A negative x goes left; a negative y goes down.']],
    'graphs-midpoint': [['Find the midpoint of (1, 2) and (7, 6).', '(4, 4). Add and halve the x’s: (1 + 7) ÷ 2 = 4. Then the y’s: (2 + 6) ÷ 2 = 4.']],
  },
  102: {
    'graphs-straight-lines': [['What does the line y = 3 look like?', 'A straight line across, through 3 on the y axis: every point on it has y = 3. The line x = 3 goes straight up and down.']],
    'graphs-table-of-values': [['For y = 2x − 1, what is y when x = 3?', '5. Put x into the rule: 2 × 3 − 1 = 5.']],
    'graphs-plot-and-join': [['Will y = 2x − 1 be a straight line or a curve?', 'A straight line. It has x and y but no x², x³ or y². Plot the points from the table and join them with one ruled line.']],
  },
  103: {
    'graphs-gradient-graph': [['How do you find the gradient of a line from a graph?', 'Up ÷ across: the change in y ÷ the change in x. Count across first, then up.']],
    'graphs-gradient-sign': [['A line goes down from left to right. Is its gradient positive or negative?', 'Negative. Always read from left to right: going up is positive, going down is negative.']],
    'graphs-gradient-points': [['Find the gradient of the line through (1, 2) and (4, 8).', '2. Up: 8 − 2 = 6. Across: 4 − 1 = 3. Gradient = 6 ÷ 3 = 2.']],
    'graphs-equation-graph': [['In y = mx + c, what are m and c?', 'm is the gradient. c is the y-intercept: where the line crosses the y axis.']],
    'graphs-equation-points': [['Find the equation of the line through (−2, 9) and (3, −1).', 'y = −2x + 5. m = (−1 − 9) ÷ (3 − (−2)) = −10 ÷ 5 = −2. Put in (−2, 9): 9 = −2 × −2 + c = 4 + c, so c = 5.']],
    'graphs-equation-rearrange': [['Find the gradient and y-intercept of x + 3y = 12.', 'Gradient −1/3, y-intercept 4. Make y the subject: 3y = −x + 12, then divide by 3: y = −(1/3)x + 4.']],
    'graphs-equation-draw': [['How do you draw y = 3x − 2 without a table?', 'Plot c, −2, on the y axis. Step the gradient from there: across 1, up 3. Repeat, then join the points with one straight line.']],
  },
  104: {
    'graphs-parallel-gradient': [['Which line is parallel to y = 2x + 3: y = 3x + 2 or y = 2x − 5?', 'y = 2x − 5. Parallel lines have the same gradient: the same m in y = mx + c.']],
    'graphs-parallel-rearrange': [['Is y = 2x + 5 parallel to 4y − 8x = 12?', 'Yes. Make y the subject: 4y = 8x + 12, so y = 2x + 3. Both have gradient 2.']],
    'graphs-parallel-through': [['Find the line parallel to y = 3x − 1 that goes through (2, 4).', 'y = 3x − 2. Same gradient, 3. Put in the point: 4 = 3 × 2 + c, so c = −2.']],
  },
  105: {
    'graphs-simultaneous-read': [['How do you solve simultaneous equations with a graph?', 'Draw both lines on one grid. They cross at the solution: its x and y make both equations true.']],
    'graphs-simultaneous-draw': [['Solve y = 2x − 3 and y = −x + 3 by drawing.', 'x = 2, y = 1. The lines cross at (2, 1). Check in both: 2 × 2 − 3 = 1 and −2 + 3 = 1.']],
    'graphs-simultaneous-rearrange': [['What do you do with 2y + x = 4 before drawing it?', 'Rearrange it to y = mx + c: 2y = −x + 4, so y = −(1/2)x + 2. Then draw it from c = 2 with gradient −1/2.']],
  },
  106: {
    'graphs-curve-table': [['For y = x² − 3, find y when x = −2.', '1. (−2)² = −2 × −2 = 4, then 4 − 3 = 1. A negative squared is positive.']],
    'graphs-curve-plot': [['How do you join the points of a quadratic graph?', 'With one smooth curve, freehand: no sharp corners and no straight bits. A quadratic is a U shape.']],
    'graphs-curve-shapes': [['For y = x³ − 3x, find y when x = −2.', '−2. (−2)³ = −8 and 3 × −2 = −6, so −8 − (−6) = −2. A negative cubed stays negative. A cubic graph is an S shape.']],
  },
  107: {
    'graphs-dt-read': [['On a distance–time graph, what does a flat part mean?', 'Stopped: time goes on but the distance doesn’t change. Going up is moving away; going down is coming back.']],
    'graphs-dt-speed': [['One part of a journey covers 30 km in 2 hours. What is the speed?', '15 km/h. Speed is the gradient: distance ÷ time = 30 ÷ 2. Steeper means faster.']],
    'graphs-dt-draw': [['You cycle at 40 km/h for 30 minutes. How far do you go?', '20 km. Distance = speed × time = 40 × 0.5. 30 minutes is half an hour.']],
  },
  108: {
    'graphs-real-convert': [['How do you use a conversion graph?', 'Start at the amount you have on its axis, go to the line, then across or down to read the other amount.']],
    'graphs-real-rate': [['A bath fills from 0 to 120 litres in 8 minutes. What is the rate?', '15 litres a minute. The gradient is the rate: 120 ÷ 8.']],
    'graphs-real-fixed': [['A plumber charges £40 to come out plus £20 an hour. How much is a 3-hour job?', '£100. 40 + 3 × 20 = 100. On the graph, £40 is where the line starts and £20 an hour is its gradient.']],
  },
  201: {
    'geometry-lines-points': [
      ['What do angles on a straight line add up to?', '180°: half a turn.'],
      ['What do angles around a point add up to?', '360°: a full turn.'],
    ],
    'geometry-shapes': [['What do the angles in a triangle add up to? And in a quadrilateral?', '180° in a triangle and 360° in a quadrilateral. A diagonal cuts a quadrilateral into two triangles: 2 × 180°.']],
    'geometry-isosceles': [['An isosceles triangle has a top angle of 40°. Find each base angle.', '70°. 180 − 40 = 140, then halve it: the two base angles are equal.']],
    'geometry-two-steps': [['One angle fact isn’t enough to find x. What do you do?', 'Find an angle you can, then use it with a second fact. Give the reason at each step.']],
  },
  202: {
    'geometry-opposite': [['Two straight lines cross. One angle is 50°. What is the angle opposite it?', '50°. Vertically opposite angles are equal. The angles next to it are 130°: on a straight line they add to 180°.']],
    'geometry-f-z': [['On parallel lines, what are corresponding and alternate angles?', 'Both are equal. Corresponding angles make an F: the same position at each crossing. Alternate angles make a Z: between the lines, on opposite sides.']],
    'geometry-allied': [['On parallel lines, are allied angles equal?', 'No: they add to 180°. They make a C: between the parallel lines, on the same side of the crossing line.']],
    'geometry-parallel-steps': [['What must you write at each step of a parallel lines question?', 'The rule you used: vertically opposite, corresponding, alternate, allied, or angles on a straight line.']],
  },
  203: {
    'geometry-polygon-names': [
      ['How many sides do a pentagon, a hexagon, an octagon and a decagon have?', '5, 6, 8 and 10. A heptagon has 7 and a nonagon 9.'],
      ['What does regular mean for a polygon?', 'All the sides are the same length and all the angles are the same size. If either is different, it is irregular.'],
    ],
    'geometry-triangle-types': [['What is the difference between an isosceles and a scalene triangle?', 'Isosceles: 2 equal sides and 2 equal angles. Scalene: no equal sides or angles. Equilateral: 3 equal sides, every angle 60°.']],
    'geometry-quadrilaterals': [['What is the difference between a square and a rhombus?', 'Both have 4 equal sides. A square also has four right angles; a rhombus’s angles don’t have to be 90°.']],
    'geometry-shape-angles': [['A parallelogram has an angle of 70°. What are the other three?', '110°, 70° and 110°. Opposite angles are equal, and next-door angles add to 180°.']],
  },
  204: {
    'geometry-exterior': [['Find the exterior angle of a regular hexagon.', '60°. Exterior angles add to 360°, so 360 ÷ 6 = 60.']],
    'geometry-interior-sum': [['What do the interior angles of a hexagon add up to?', '720°. (n − 2) × 180 = 4 × 180 = 720.']],
    'geometry-regular-angles': [['Find the interior angle of a regular pentagon.', '108°. The angles add to 3 × 180 = 540, and 540 ÷ 5 = 108. Or 180 − 360 ÷ 5 = 180 − 72 = 108.']],
    'geometry-polygon-algebra': [['A quadrilateral has angles x, 2x, 90° and 120°. Find x.', '50°. They add to 360: 3x + 210 = 360, so 3x = 150 and x = 50.']],
  },
  205: {
    'geometry-lines-symmetry': [['How many lines of symmetry does a square have?', '4: two through opposite corners and two through the middles of opposite sides.']],
    'geometry-rotational-symmetry': [['What is the order of rotational symmetry of a regular pentagon?', '5. It fits its own outline 5 times in one full turn. Every shape has an order of at least 1.']],
    'geometry-symmetry-both': [['How many lines of symmetry does a regular hexagon have, and what is its order of rotational symmetry?', '6 and 6. For a regular polygon, both are the number of sides.']],
  },
  206: {
    'geometry-area-rect-para': [['A parallelogram has base 8 cm, vertical height 5 cm and sloping side 6 cm. Find its area.', '40 cm². Base × vertical height = 8 × 5. The sloping side isn’t used.']],
    'geometry-area-triangle': [['Find the area of a triangle with base 10 cm and vertical height 6 cm.', '30 cm². 1/2 × base × vertical height = 1/2 × 10 × 6.']],
    'geometry-area-trapezium': [['A trapezium has parallel sides 5 cm and 9 cm and height 4 cm. Find its area.', '28 cm². 1/2(a + b)h = 1/2 × (5 + 9) × 4 = 1/2 × 14 × 4.']],
    'geometry-area-backwards': [['A triangle has base 12 cm and area 30 cm². Find its vertical height.', '5 cm. 30 = 1/2 × 12 × h, so 30 = 6h and h = 5.']],
  },
  207: {
    'geometry-circle-parts': [
      ['What is the difference between the radius and the diameter?', 'The radius goes from the centre to the edge. The diameter goes right across through the centre: it is 2 radii.'],
      ['What is the difference between a chord and a tangent?', 'A chord is a straight line joining two points on the circle. A tangent touches the circle at just one point.'],
    ],
    'geometry-circumference': [['Find the circumference of a circle with radius 9 cm, to 1 decimal place.', '56.5 cm. C = 2πr = 2 × π × 9 = 56.548… Or πd with d = 18.']],
    'geometry-circle-area': [['Find the area of a circle with diameter 10 cm, to 1 decimal place.', '78.5 cm². Halve the diameter first: r = 5. A = πr² = π × 25 = 78.539…']],
    'geometry-circle-backwards': [['A circle has an area of 150 cm². Find its radius, to 1 decimal place.', '6.9 cm. πr² = 150, so r² = 150 ÷ π = 47.74…, and r = √47.74… = 6.909…']],
  },
  208: {
    'geometry-perimeter-simple': [['A square has an area of 49 cm². Find its perimeter.', '28 cm. Find the side first: √49 = 7 cm. Then 4 × 7 = 28.']],
    'geometry-perimeter-compound': [['How do you find a missing side on an L-shaped shape?', 'Across, the long side equals the short sides together; up, the same. Find every missing side before adding them all.']],
    'geometry-perimeter-curved': [['Find the perimeter of a semicircle with diameter 10 cm, to 1 decimal place.', '25.7 cm. The curve is 1/2 × π × 10 = 15.707… Add the straight edge: 15.707… + 10 = 25.707…']],
    'geometry-perimeter-pythagoras': [['A rectangle has sides 2x and x + 3 and a perimeter of 36 cm. Find x.', '5. The perimeter is 2(2x + x + 3) = 6x + 6. So 6x + 6 = 36, 6x = 30 and x = 5.']],
  },
  209: {
    'geometry-sector-fraction': [['What fraction of a circle is a sector with an angle of 90°?', '1/4. The angle over 360: 90 ÷ 360 = 1/4.']],
    'geometry-sector-area': [['Find the area of a sector with angle 60° and radius 6 cm, to 1 decimal place.', '18.8 cm². 60/360 × πr² = 1/6 × π × 36 = 6π = 18.849…']],
    'geometry-arc-length': [['Find the arc length of a sector with angle 60° and radius 6 cm, to 1 decimal place.', '6.3 cm. 60/360 × πd = 1/6 × π × 12 = 2π = 6.283…']],
    'geometry-sector-perimeter': [['Find the perimeter of a sector with angle 60° and radius 6 cm, to 1 decimal place.', '18.3 cm. Arc length plus two radii: 6.283… + 6 + 6 = 18.283…']],
  },
  210: {
    'geometry-congruent-meaning': [['Is a shape congruent to its reflection?', 'Yes. Congruent means exactly the same side lengths and angles. Turned or flipped is still congruent; bigger or smaller isn’t.']],
    'geometry-congruent-pairs': [['How do you check two shapes on a grid are congruent?', 'Count the squares along each side, and imagine turning or flipping one onto the other. Which way they face doesn’t matter.']],
    'geometry-congruent-missing': [['ABC and DEF are congruent, in that order. AB = 7 cm. Which side of DEF is 7 cm?', 'DE. The letters match in order, A with D and B with E, so AB matches DE.']],
  },
  211: {
    'geometry-scale-factor': [['In two similar shapes, a 4 cm side matches a 10 cm side. What is the scale factor?', '2.5. Bigger ÷ matching smaller: 10 ÷ 4 = 2.5. The angles stay the same.']],
    'geometry-similar-bigger': [['The scale factor is 2.5. A side on the smaller shape is 6 cm. How long is its match?', '15 cm. Going to the bigger shape, multiply: 6 × 2.5 = 15.']],
    'geometry-similar-smaller': [['The scale factor is 2.5. A side on the bigger shape is 20 cm. How long is its match?', '8 cm. Going to the smaller shape, divide: 20 ÷ 2.5 = 8. Check: 8 is smaller than 20.']],
    'geometry-similar-nested': [['Triangle ADE sits inside ABC, with D on AB. AD = 4 cm and DB = 6 cm. Which length matches AD?', 'AB, which is 4 + 6 = 10 cm. Add the parts first: AD matches AB, not DB. The scale factor is 10 ÷ 4 = 2.5.']],
  },
  212: {
    'geometry-translation': [['What does the column vector (−4 over 1) mean?', '4 left and 1 up. The top number is across (negative is left); the bottom is up (negative is down).']],
    'geometry-reflection': [['What do the lines x = 2, y = 2 and y = x look like?', 'x = 2 is upright, y = 2 is flat, and y = x is a diagonal through (0, 0).']],
    'geometry-rotation': [['What three things describe a rotation?', 'The angle (90°, 180° or 270°), the direction (clockwise or anticlockwise) and the centre of rotation.']],
    'geometry-enlargement': [['A 3 cm side becomes 6 cm in an enlargement. What is the scale factor?', '2. Scale factor = new length ÷ old length = 6 ÷ 3. Above 1 makes it bigger; below 1 makes it smaller.']],
  },
  213: {
    'geometry-3d-names': [['What is the difference between a prism and a pyramid?', 'A prism has the same cross-section all the way through. A pyramid comes to a point.']],
    'geometry-3d-counting': [['How many faces, edges and vertices does a cuboid have?', '6 faces, 12 edges and 8 vertices.']],
    'geometry-3d-curved': [['How many faces, edges and vertices does a cylinder have?', '3 faces (two circles and the curved surface), 2 edges and no vertices.']],
  },
  214: {
    'geometry-volume-prism': [['A prism has a cross-section of area 12 cm² and a length of 10 cm. Find its volume.', '120 cm³. Volume of a prism = area of cross-section × length = 12 × 10.']],
    'geometry-volume-cylinder': [['Find the volume of a cylinder with radius 3 cm and height 10 cm, to 1 decimal place.', '282.7 cm³. V = πr²h = π × 9 × 10 = 90π = 282.743… Learn this one: the exam won’t give it.']],
    'geometry-volume-pyramid-cone': [['A square-based pyramid has a 6 cm base and a vertical height of 10 cm. Find its volume.', '120 cm³. 1/3 × area of base × height = 1/3 × 36 × 10.']],
    'geometry-volume-sphere': [['Find the volume of a sphere with radius 3 cm, to 1 decimal place.', '113.1 cm³. V = 4/3 πr³ = 4/3 × π × 27 = 36π = 113.097… The exam gives you this formula.']],
  },
  215: {
    'geometry-surface-cuboid': [['Find the surface area of a 2 cm by 3 cm by 4 cm cuboid.', '52 cm². Three pairs of faces: 2 × (2 × 3 + 2 × 4 + 3 × 4) = 2 × 26.']],
    'geometry-surface-cylinder': [['Find the surface area of a cylinder with radius 2 cm and height 5 cm, to 1 decimal place.', '88.0 cm². The curved side 2πrh = 20π, plus two circles 2πr² = 8π: 28π = 87.964…']],
    'geometry-surface-cone-sphere': [['Find the surface area of a sphere with radius 3 cm, to 1 decimal place.', '113.1 cm². 4πr² = 4 × π × 9 = 36π. A cone is πrl + πr², with l the slant height. The exam gives both.']],
    'geometry-surface-pyramid': [['A square-based pyramid has a 6 cm base, and each triangle is 5 cm tall. Find its surface area.', '96 cm². The base: 6 × 6 = 36. Each triangle: 1/2 × 6 × 5 = 15, and there are four: 60. 36 + 60 = 96.']],
  },
  216: {
    'geometry-views': [['What is a plan, and what is an elevation?', 'A plan is the view from directly above. An elevation is the view from the front or the side. Each is flat: no depth.']],
    'geometry-plan-elevations': [['Which two measurements does the front elevation use?', 'Width and height. The plan uses width and depth; the side elevation uses depth and height.']],
    'geometry-views-counting': [['The plan is a circle and both elevations are rectangles. What is the shape?', 'A cylinder. The plan gives the base; the elevations show how the sides go up.']],
  },
  217: {
    'geometry-locus-distance': [['What is the locus of points 2 cm from a point P?', 'A circle with centre P and radius 2 cm. From a line, it would be two parallel lines with a semicircle round each end.']],
    'geometry-perpendicular-bisector': [['What is the perpendicular bisector of AB?', 'The locus of points the same distance from A and B. It crosses AB at its middle, at 90°.']],
    'geometry-angle-bisector': [['What is the bisector of an angle?', 'The line that cuts the angle exactly in half: the locus of points the same distance from the two lines.']],
    'geometry-locus-regions': [['Is “less than 3 cm from B” inside or outside the circle?', 'Inside the circle of radius 3 cm, centre B. “More than” is outside. Shade where every rule is true.']],
  },
  218: {
    'geometry-bearing-read': [['What are the three rules for a bearing?', 'Measure from North, go clockwise, and write three figures: 060°, not 60°.']],
    'geometry-bearing-reflex': [['B is 70° anticlockwise from North at A. What is the bearing of B from A?', '290°. Bearings go clockwise, so take it from 360: 360 − 70 = 290.']],
    'geometry-bearing-back': [['The bearing of B from A is 060°. Find the bearing of A from B.', '240°. The bearing back is 180° different: under 180, add 180. 60 + 180 = 240.']],
    'geometry-bearing-scale': [['The scale is 1 cm to 10 miles. How long is a 50-mile line on the drawing?', '5 cm. Divide the real distance by the scale: 50 ÷ 10.']],
  },
  219: {
    'geometry-pythagoras-hypotenuse': [['A right-angled triangle has shorter sides 6 cm and 8 cm. Find the hypotenuse.', '10 cm. a² + b² = c²: 36 + 64 = 100, and √100 = 10.']],
    'geometry-pythagoras-shorter': [['The hypotenuse is 13 cm and one side is 5 cm. Find the other side.', '12 cm. Take the smaller square from the bigger: 169 − 25 = 144, and √144 = 12. It must be less than 13.']],
    'geometry-pythagoras-distance': [['Find the distance between (−4, −1) and (3, 4), to 1 decimal place.', '8.6. Across: 3 − (−4) = 7. Up: 4 − (−1) = 5. 49 + 25 = 74, and √74 = 8.602…']],
    'geometry-pythagoras-problems': [['A 2.9 m ladder’s foot is 1.3 m from a wall. How far up the wall does it reach, to 1 decimal place?', '2.6 m. The ladder is the hypotenuse: 2.9² − 1.3² = 8.41 − 1.69 = 6.72, and √6.72 = 2.592…']],
  },
  220: {
    'geometry-trig-sides': [['What are sin, cos and tan?', 'sin = O ÷ H, cos = A ÷ H, tan = O ÷ A (SOH CAH TOA). H is the hypotenuse, O is opposite the angle and A is next to it.']],
    'geometry-trig-length': [['The angle is 30° and the hypotenuse is 10 cm. Find the opposite side.', '5 cm. O and H, so sin: sin 30° = O ÷ 10, so O = 10 × sin 30° = 10 × 0.5 = 5.']],
    'geometry-trig-angle': [['The opposite and adjacent sides are both 5 cm. Find the angle.', '45°. O and A, so tan: tan x = 5 ÷ 5 = 1, and x = tan⁻¹(1) = 45°.']],
    'geometry-trig-exact': [['What are sin 30°, cos 60° and tan 45°?', '1/2, 1/2 and 1. Also sin 90° = 1, cos 0° = 1 and tan 0° = 0.']],
  },
  221: {
    'geometry-vector-read': [['What does the column vector (3 over −2) mean?', '3 right and 2 down. Across on top, up underneath; left and down are negative.']],
    'geometry-vector-add': [['a = (−3 over 4) and b = (5 over 2). Find a + b.', '(2 over 6). Add the top numbers: −3 + 5 = 2. Add the bottom numbers: 4 + 2 = 6.']],
    'geometry-vector-multiply': [['a = (2 over −3). Find 5a.', '(10 over −15). Multiply both numbers by 5. The arrow is 5 times longer, in the same direction.']],
    'geometry-vector-combine': [['a = (3 over 8) and b = (−7 over 2). Find 2a + b.', '(−1 over 18). Multiply first: 2a = (6 over 16). Then add: 6 + (−7) = −1 and 16 + 2 = 18.']],
  },
  301: {
    'chance-scale': [['P(rain) = 0.65. Is rain unlikely, even or likely?', 'Likely: 0.65 is more than 0.5. Probabilities go from 0 (impossible) to 1 (certain), with 0.5 an even chance.']],
    'chance-equally-likely': [['What is the probability of rolling an even number on a fair dice?', '3/6 = 1/2. Ways it can happen ÷ total outcomes: 3 ways (2, 4, 6) out of 6.']],
    'chance-sum-to-one': [['P(rain) = 0.3. What is P(not rain)?', '0.7. All the outcomes add up to 1, so 1 − 0.3 = 0.7.']],
    'chance-outcomes': [['A menu has 3 starters and 4 mains. How many different meals are there?', '12. The product rule: multiply the number of choices, 3 × 4.']],
  },
  302: {
    'freq-tree-build': [['In a frequency tree, what do the two branches from a circle add up to?', 'The number in that circle.']],
    'freq-tree-probability': [['45 people were under 18, and 12 of them didn’t solve the puzzle. One under-18 is picked. Find P(didn’t solve).', '12/45 = 4/15. Picked from the under-18s, so the bottom is 45, not the total.']],
    'freq-tree-parts': [['A club has 160 members. Adults to children is 3 : 5. How many adults?', '60. One share: 160 ÷ (3 + 5) = 20. Adults: 3 × 20 = 60.']],
  },
  303: {
    'chance-and-rule': [['You flip two coins. Find P(both heads).', '1/4. AND means multiply: 1/2 × 1/2 = 1/4.']],
    'chance-or-rule': [['A bag has 3 red, 5 blue and 2 green balls. Find P(green or blue).', '7/10. OR means add: 2/10 + 5/10 = 7/10.']],
    'chance-tree': [['On a probability tree, what do the branches from one point add up to?', '1. Multiply along a path to find that outcome; all the paths add up to 1 too.']],
    'chance-tree-both': [['A bag has 4 red and 5 blue balls. You pick one, put it back and pick again. Find P(same colour).', '41/81. Both red: 4/9 × 4/9 = 16/81. Both blue: 5/9 × 5/9 = 25/81. OR, so add: 16/81 + 25/81.']],
  },
  304: {
    'chance-relative': [['A coin lands on heads 48 times in 100 flips. What is the relative frequency of heads?', '0.48. The number of times it happened ÷ the total number of trials: 48 ÷ 100.']],
    'chance-expected': [['A fair dice is rolled 60 times. How many 6s would you expect?', '10. Expected frequency = probability × trials = 1/6 × 60.']],
    'chance-bias': [['A coin lands on heads 80 times in 100 flips. Is it biased?', 'Probably. The relative frequency, 0.8, is a long way from 0.5 after lots of trials.']],
    'chance-trials': [['Ali flips a coin 20 times and Ben 200 times. Whose estimate of P(heads) is more reliable?', 'Ben’s. The more trials, the more reliable the relative frequency.']],
  },
  305: {
    'venn-fill': [['Where do you start when filling in a Venn diagram?', 'The overlap: what is in both sets. Anything in neither goes outside the circles but inside the rectangle.']],
    'venn-probability': [['A number from 1 to 11 is picked. Find P(odd and prime).', '4/11. Odd and prime: 3, 5, 7 and 11. Divide by everything in the rectangle: 11 numbers.']],
    'venn-counts': [['126 students: 14 play neither rugby nor football and 42 play both. How many play only one?', '70. Take away the outside and the overlap: 126 − 14 − 42 = 70.']],
    'venn-three': [['With three overlapping sets, where do you start?', 'The middle, where all three overlap. Then each overlap of two (take the middle away), then each circle’s own part.']],
  },
  306: {
    'sets-notation': [['What do ξ, n(A) and A′ mean?', 'ξ is the universal set: everything. n(A) is how many elements are in A. A′ is everything not in A.']],
    'sets-and-or': [['A = {1, 2, 3, 8} and B = {2, 3, 5}. Find A ∩ B and A ∪ B.', 'A ∩ B = {2, 3}: in A and B. A ∪ B = {1, 2, 3, 5, 8}: in A or B, each written once.']],
    'sets-regions': [['Which region of a Venn diagram is A ∩ B′?', 'In A and not in B: A’s own part of its circle, without the overlap.']],
    'sets-inequalities': [['Solve 3x − 7 > 11 and write the answer in set notation.', '{x : x > 6}. Add 7: 3x > 18. Divide by 3: x > 6.']],
  },
  307: {
    'data-qualitative': [['Is favourite football team qualitative or quantitative data?', 'Qualitative: it is words. Quantitative data is numbers.']],
    'data-discrete-continuous': [['Is number of siblings discrete or continuous? And height?', 'Siblings is discrete: only exact whole numbers. Height is continuous: it can take any value in a range.']],
    'data-primary-secondary': [['What is the difference between primary and secondary data?', 'Primary: you collect it yourself. Secondary: someone else collected it. Secondary is quick and cheap, but may not suit you.']],
    'data-describe': [['You ask your class to rate a film out of 10. Describe the data.', 'Primary (you collected it), quantitative (numbers) and discrete (whole-number ratings).']],
  },
  308: {
    'average-mean': [['Find the mean of 4, 7, 8 and 9.', '7. Total ÷ how many: 28 ÷ 4 = 7.']],
    'average-median-mode': [['Find the median and the mode of 2, 3, 3, 6, 9, 11.', 'Median 4.5: the middle two are 3 and 6, and halfway is 4.5. Mode 3: the most common value.']],
    'average-range': [['Find the range of 12, 4, 19 and 7.', '15. Biggest take smallest: 19 − 4. It shows the spread, not an average.']],
    'average-applied': [['5 players score a mean of 12 points. Without one player, the other 4 have a mean of 10. What did that player score?', '20. Totals: 5 × 12 = 60 and 4 × 10 = 40. 60 − 40 = 20.']],
  },
  309: {
    'sampling-samples': [['Why use a sample instead of asking everyone?', 'It is quicker and cheaper. But it is less reliable and could be biased, so make it as representative as possible.']],
    'sampling-bias': [['Why is asking people leaving a library about reading habits biased?', 'They read more than most people. A random sample gives everyone the same chance of being picked.']],
    'questionnaire-faults': [['What makes a good questionnaire question?', 'A time frame, clear wording, and answer boxes that cover everything with no gaps or overlaps. Not leading and not too personal.']],
    'questionnaire-better': [['What is wrong with the answer boxes 0–2, 2–4, 4–6 hours?', 'They overlap (2 and 4 fit two boxes), and there is no box above 6. Try: under 2, 2 to under 4, 4 to under 6, 6 or more.']],
  },
  310: {
    'pictogram-read': [['The key is 1 picture = 4 people. A row has three and a half pictures. How many people?', '14. 3.5 × 4 = 14. Half a picture is 2 people.']],
    'pictogram-draw': [['What key would you use for 55, 60, 65, 40 and 70?', '1 picture = 10. It divides them nicely: half a picture is 5. Always show the key.']],
    'pictogram-problems': [['What do you do first in a pictogram question?', 'Turn every row into a number with the key. Then answer as you would from a table.']],
  },
  311: {
    'stem-draw': [['In a stem and leaf diagram, how is 154 written with a stem of 15?', 'Stem 15, leaf 4: the leaf is the last digit. Keep the leaves in order and always give a key, like 15 | 4 = 154.']],
    'stem-read': [['How do you find the median from a stem and leaf diagram?', 'The leaves are already in order, so count in from either end to the (n + 1) ÷ 2th value.']],
    'stem-compare': [['How do you compare two sets of data in a back-to-back stem and leaf diagram?', 'Compare an average (the median) and the spread (the range). The left leaves read outwards from the stem.']],
  },
  312: {
    'freqtable-build': [['What do the frequencies in a frequency table add up to?', 'The total: how many things were counted.']],
    'freqtable-averages': [['The values 1, 2 and 3 have frequencies 2, 3 and 5. Find the mean.', '2.3. Add value × frequency: 2 + 6 + 15 = 23. Divide by the total frequency, 10.']],
    'freqtable-problems': [['100 people asked. The known frequencies add to 75, and x : y = 3 : 2. Find x and y.', 'x = 15, y = 10. The missing frequencies are 100 − 75 = 25. One share: 25 ÷ 5 = 5.']],
  },
  313: {
    'grouped-build': [['What does the class 10 < t ≤ 20 include?', 'More than 10, up to and including 20. So 20 goes in this class, but 10 goes in the class below.']],
    'grouped-classes': [['How do you find the modal class and the class with the median?', 'The modal class has the highest frequency. For the median, find its place, (n + 1) ÷ 2, then add frequencies down until you reach it.']],
    'grouped-problems': [['How do you find how many took over 2 minutes from a grouped table?', 'Add the frequencies of every class above 2 minutes. Give it as a fraction of the total if asked.']],
  },
  314: {
    'estmean-midpoints': [['Find the midpoint of the class 10 < x ≤ 20.', '15. (bottom + top) ÷ 2 = (10 + 20) ÷ 2.']],
    'estmean-calc': [['Why is the mean from a grouped table only an estimate?', 'The midpoints stand in for the real values, which we don’t know. Estimated mean = sum of (frequency × midpoint) ÷ total frequency.']],
    'estmean-problems': [['0 < x ≤ 10 has frequency 4 and 10 < x ≤ 20 has frequency 6. Estimate the mean.', '11. Midpoints 5 and 15: (4 × 5 + 6 × 15) ÷ 10 = (20 + 90) ÷ 10.']],
  },
  315: {
    'bar-draw': [['What are the rules for drawing a bar chart?', 'Bars all the same width, with gaps between them. A scale that fits the tallest bar, and both axes labelled.']],
    'bar-read': [['Three bars show 12, 20 and 8. What percentage is the 20 bar?', '50%. The total is 40, and 20 ÷ 40 = 1/2.']],
    'bar-dual': [['What does a dual bar chart show?', 'Two groups side by side for each category, with a key. Compare the two bars in each pair.']],
  },
  316: {
    'scatter-correlation': [['What is the difference between positive and negative correlation?', 'Positive: both go up together. Negative: one goes up as the other goes down. Points close to a line mean strong correlation.']],
    'scatter-plot': [['How do you plot a student with 60 in Maths and 55 in English?', 'One point: across to 60 on the x axis (Maths), up to 55 on the y axis (English).']],
    'scatter-best-fit': [['Is a prediction from outside the data reliable?', 'No: that is extrapolation. Inside the data (interpolation) is fairly reliable.']],
  },
  317: {
    'line-draw': [['On a line graph, what goes along the x axis?', 'The time (what you choose), equally spaced. What you measure goes up the y axis. Join the points with straight lines.']],
    'line-read': [['Sleep went from 6 hours on Wednesday to 8.4 hours on Thursday. By how much did it change?', 'Up 2.4 hours: 8.4 − 6. The steeper the line, the bigger the change.']],
    'line-mistakes': [['What do you check on a line graph?', 'Every point against the table, equal steps on both axes, both axes labelled, and a title.']],
  },
  318: {
    'pie-angles': [['60 people were asked, and 10 chose red. What is red’s angle in the pie chart?', '60°. Frequency ÷ total × 360 = 10 ÷ 60 × 360. All the angles add to 360°.']],
    'pie-draw': [['24 people are in a pie chart. How many degrees is each person?', '15°. 360 ÷ 24 = 15. Times each frequency by 15 for its angle.']],
    'pie-read': [['A pie chart of 90 people has a 100° slice. How many people is that?', '25. Angle ÷ 360 × total = 100 ÷ 360 × 90.']],
    'pie-compare': [['Does a bigger slice in one pie chart always mean more people than in another?', 'No. A pie shows shares, not amounts. With different totals, turn each slice back into a number first.']],
  },
}
