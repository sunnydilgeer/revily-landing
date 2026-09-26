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
}
