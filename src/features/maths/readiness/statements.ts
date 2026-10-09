/*
 * "I can…" statements for the exam checklist: one per lesson section that teaches or practises a skill
 * (review sections are left out). Keyed by lesson number and section id, because section ids such as
 * "mixed" repeat across lessons. Draft wording, to be reviewed by the maths teacher.
 */
export const canStatements: Record<string, string> = {
  '1:whole-values': 'I can tell integers from non-integers',
  '1:special-integers': 'I can recognise square, cube and prime numbers',
  '1:rational-numbers': 'I can explain what makes a number rational',
  '1:irrational-numbers': 'I can spot irrational numbers, like √2 and π',
  '1:multiples-factors': 'I can find multiples and factors of a number',

  '2:bidmas-ladder': 'I can say the order of operations in BIDMAS',
  '2:operation-priority': 'I can use BIDMAS to work out a calculation in the right order',
  '2:equal-priority': 'I can work left to right when operations have equal priority',
  '2:fraction-grouping': 'I can use BIDMAS when a fraction line groups a calculation',
  '2:mixed': 'I can use BIDMAS with algebra',

  '3:digit-place-value': 'I can give the value of a digit in a large number',
  '3:decimal-places': 'I can give the value of a digit in a decimal',

  '4:long-multiplication-layout': 'I can multiply using the grid method',
  '4:long-multiplication-ones': 'I can set out column multiplication',
  '4:long-multiplication-carrying': 'I can carry correctly in column multiplication',
  '4:long-multiplication-tens': 'I can multiply by a two-digit number in columns',
  '4:long-multiplication-application': 'I can use long multiplication in a problem',

  '5:long-division-layout': 'I can divide using the bus-stop method',
  '5:long-division-regrouping': 'I can carry remainders across in short division',
  '5:long-division-remainders': 'I can decide what a remainder means in a problem',
  '5:long-division-check': 'I can check a division by multiplying back',
  '5:long-division-two-digit': 'I can divide by a two-digit number',

  '6:decimal-addition': 'I can add decimals, lining up the decimal points',
  '6:decimal-subtraction': 'I can subtract decimals, lining up the decimal points',
  '6:decimal-multiplication': 'I can multiply decimals and place the decimal point',
  '6:decimal-division': 'I can divide by a decimal',

  '7:prime-factorisation': 'I can write a number as a product of prime factors',
  '7:hcf-lcm-listing': 'I can find the HCF and LCM by listing',
  '7:hcf-lcm-venn': 'I can find the HCF and LCM using a Venn diagram',

  '8:simplifying-fractions': 'I can simplify a fraction fully',
  '8:mixed-improper-fractions': 'I can convert between mixed numbers and improper fractions',
  '8:adding-fractions': 'I can add fractions with different denominators',
  '8:subtracting-fractions': 'I can subtract fractions with different denominators',
  '8:multiplying-fractions': 'I can multiply fractions',
  '8:dividing-fractions': 'I can divide fractions',
  '8:mixed-fraction-calculations': 'I can calculate with mixed numbers',
  '8:fractions-of-amounts': 'I can find a fraction of an amount',

  '9:fraction-to-decimal': 'I can convert a fraction to a decimal',
  '9:decimal-to-fraction': 'I can convert a decimal to a fraction',
  '9:decimal-to-percentage': 'I can convert a decimal to a percentage',
  '9:percentage-to-decimal': 'I can convert a percentage to a decimal',
  '9:fraction-to-percentage': 'I can convert a fraction to a percentage',
  '9:percentage-to-fraction': 'I can convert a percentage to a fraction',

  '10:rounding-decimal-places': 'I can round to a number of decimal places',
  '10:rounding-significant-figures': 'I can round to significant figures',
  '10:rounding-powers-of-ten': 'I can round to the nearest 10, 100 or 1000',
  '10:rounding-carrying': 'I can round when a 9 rolls over, like 3.97 to 4.0',

  '11:ordering-decimals': 'I can put decimals in order',
  '11:ordering-large-numbers': 'I can put large numbers in order',
  '11:ordering-negative-numbers': 'I can put negative numbers in order',
  '11:ordering-fractions-decimals-percentages': 'I can order fractions, decimals and percentages together',

  '12:estimating-significant-figures': 'I can round to 1 significant figure to estimate',
  '12:estimating-calculations': 'I can estimate the answer to a calculation',
  '12:estimating-formulas': 'I can estimate using a formula',
  '12:estimating-checking': 'I can say whether an estimate is too big or too small',

  '13:bounds-half-unit': 'I can find half the unit a measurement was rounded to',
  '13:bounds-lower-upper': 'I can find the lower and upper bounds',
  '13:bounds-error-interval': 'I can write an error interval for a rounded value',
  '13:truncation': 'I can truncate a number',
  '13:truncation-error-interval': 'I can write an error interval for a truncated value',

  '14:standard-form-to-large': 'I can write a number like 3.6 × 10⁴ as an ordinary number',
  '14:standard-form-to-small': 'I can write a number like 6.3 × 10⁻⁵ as an ordinary number',
  '14:standard-form-write-large': 'I can write a large number in standard form',
  '14:standard-form-write-small': 'I can write a small number in standard form',
  '14:standard-form-multiply': 'I can multiply numbers in standard form',
  '14:standard-form-divide': 'I can divide numbers in standard form',

  '15:like-terms-one-letter': 'I can collect like terms with one letter, like 4p + 6 + 2p − 3',
  '15:like-terms-different-letters': 'I can tell like terms apart when they use different letters, like ab and a',
  '15:like-terms-powers': 'I can collect like terms with powers, like x²y and xy²',
  '15:like-terms-mixed': 'I can simplify expressions with several letters and powers',

  '16:indices-power-one': 'I can use a power of 1, like 9¹ = 9 and x = x¹',
  '16:indices-multiply': 'I can multiply powers of the same base, like 3⁴ × 3⁵ = 3⁹ and 5a⁴ × 3a² = 15a⁶',
  '16:indices-divide': 'I can divide powers of the same base, like 3⁷ ÷ 3⁴ = 3³, including negative answers',
  '16:indices-power-zero': 'I can use a power of 0, like 9⁰ = 1',
  '16:indices-one': 'I can work out 1 to any power, like 1¹⁰⁰ = 1',
  '16:indices-power-of-power': 'I can raise a power to a power, like (5²)³ = 5⁶',
  '16:indices-fraction': 'I can raise a fraction to a power, like (2/3)² = 4/9',
  '16:roots': 'I can work out square roots, cube roots and other roots, like √49 = 7 and ∛27 = 3',

  '17:expand-single': 'I can expand a single bracket, like −3(2p − 5) = −6p + 15',
  '17:expand-double': 'I can expand and simplify double brackets, like (x + 4)(x + 6) = x² + 10x + 24',

  '18:factorise-two-terms': 'I can factorise two terms fully, like 6x² + 9x = 3x(2x + 3)',
  '18:factorise-three-terms': 'I can factorise three terms fully, like 10x + 15y + 5 = 5(2x + 3y + 1)',

  '19:equations-one-unknown': 'I can solve an equation like 5x − 3 = 27 by doing the same to both sides',
  '19:equations-squares': 'I can solve x² = 49 (x = 7 or −7) and √x = 5 (x = 25)',
  '19:equations-both-sides': 'I can solve an equation with the unknown on both sides, like 9x + 4 = 4x + 29',
  '19:equations-brackets': 'I can solve an equation with brackets, like 2(3x + 1) = x + 22',
  '19:equations-fractions': 'I can solve an equation with fractions, like (2x + 1)/3 = 5',

  '20:rearrange-linear': 'I can make m the subject of a formula like C = 3m + 5',
  '20:rearrange-fractions': 'I can rearrange a formula with a fraction, like M = (a + b)/2',
  '20:rearrange-squares': 'I can rearrange a formula with a square, like A = 6s², to get s = √(A/6)',
  '20:rearrange-roots': 'I can rearrange a formula with a square root, like t = √(h/5), to get h = 5t²',

  '21:quadratics-positive': 'I can factorise a quadratic like x² + 8x + 15 = (x + 3)(x + 5)',
  '21:quadratics-negative-middle': 'I can factorise a quadratic with a negative middle term, like x² − 9x + 20 = (x − 4)(x − 5)',
  '21:quadratics-negative-last': 'I can factorise a quadratic with a negative last term, like x² + 2x − 15 = (x − 3)(x + 5)',
  '21:quadratics-difference-of-squares': 'I can factorise the difference of two squares, like x² − 49 = (x + 7)(x − 7)',

  '23:sequences-special': 'I can continue square, cube, triangular and Fibonacci-type sequences, like 1, 3, 6, 10, 15, 21',
  '23:sequences-geometric': 'I can find the common ratio of a geometric sequence and continue it, like 3, 6, 12, 24, 48',
  '23:sequences-nth-term': 'I can find and use the nth term of a linear sequence, like 4n + 1 for 5, 9, 13, 17',
  '23:sequences-in-sequence': 'I can decide whether a number is in a sequence by solving, like 5n − 2 = 63 gives n = 13',
  '23:sequences-consecutive': 'I can solve problems with two terms next to each other, using n and n + 1',

  '27:simultaneous-elimination': 'I can solve simultaneous equations by taking one from the other, like 3x + 2y = 16 and x + 2y = 8 give x = 4, y = 2',
  '27:simultaneous-words': 'I can write two equations from a problem in words and solve them, like 2 teas and a cake for £7',

  '28:proof-counterexample': 'I can show a statement is wrong with one counterexample, like 2n + 1 is 9 when n = 4, and 9 isn’t prime',
  '28:proof-identity': 'I can show two expressions are identical by expanding one side, like (x + 3)² − x² ≡ 6x + 9',
  '28:proof-geometric': 'I can prove an angle fact with reasons, like the angles in a triangle add to 180° using a parallel line',
  '28:proof-algebraic': 'I can prove facts about odd and even numbers with n, like n + (n + 1) = 2n + 1 is always odd',

  '29:function-machines-forwards': 'I can put a number through a function machine, box by box, like 7 → × 4 → + 3 gives 31',
  '29:function-machines-backwards': 'I can work backwards through a function machine, undoing the last box first, like 26 back through × 5, − 4 gives 6',
  '29:function-machines-creating': 'I can turn an equation into a function machine in BIDMAS order, like y = 3x + 4 is × 3, then + 4',

  '30:ratio-difference': 'I can find a share from the difference between two parts, like 2 : 3 : 6 with Fay 24 more than Dev gives Eli 18',
  '30:ratio-changing': 'I can solve a ratio that changes by calling 1 part x, like 7 : 3 then Mira gives Noel 10 to make them equal',
  '30:ratio-unit-form': 'I can write a ratio in the form 1 : n or n : 1, like 6 : 15 = 1 : 2.5',
  '31:proportion-direct': 'I can use direct proportion by finding 1 first, like 4 people eat 12 slices, so 7 people eat 7 × 3 = 21',
  '32:percentage-of-amount': 'I can find a percentage of an amount by finding 1% and multiplying, like 23% of £80 = 23 × 0.80 = £18.40',
  '32:percentage-increase': 'I can increase an amount by a percentage, like £600 up 15% is 115 × £6 = £690, or £600 × 1.15',
  '32:percentage-decrease': 'I can decrease an amount by a percentage, like £45 with 30% off is 70 × £0.45 = £31.50, or £45 × 0.7',
  '32:percentage-change': 'I can work out a percentage change: change ÷ original × 100, like £400 to £250 is a 37.5% decrease',
  '33:reverse-percentage': 'I can find the original amount by finding 1% and multiplying by 100, like £48 after 20% off: 48 ÷ 80 × 100 = £60',
  '33:reverse-percentage-multiplier': 'I can find the original amount by dividing by the multiplier, like £69 after a 15% rise: 69 ÷ 1.15 = £60',
  '34:simple-interest': 'I can work out simple interest on the original amount, like £800 at 5% for 3 years: 800 + 3 × 40 = £920',
  '34:compound-growth': 'I can work out compound growth with a multiplier, like £2000 at 3% for 2 years: 2000 × 1.03² = £2121.80',
  '34:compound-decay': 'I can work out compound decay with a multiplier, like a £12,000 car losing 20% a year: 12000 × 0.8² = £7680',
  '34:compound-periods': 'I can find how many years it takes to pass a target by trying values, like £800 × 1.05ⁿ first passes £1000 at n = 5',
  '31:proportion-inverse': 'I can use inverse proportion by finding 1 first, like 4 painters take 9 hours, so 1 takes 36 and 6 take 6 hours',

  '24:inequalities-number-line': 'I can write an inequality from words or a number line and show it, like h ≥ 120 as a filled circle at 120 with an arrow right',
  '24:inequalities-two-sided': 'I can write and show a two-sided inequality, like 1 ≤ t < 5 as a filled circle at 1 and an open circle at 5, joined',

  '25:inequalities-integers': 'I can list the integers that satisfy an inequality, like 0, 1, 2 for −1 < x < 3',
  '25:inequalities-solve': 'I can solve a linear inequality, like 4a − 5 > a + 7 gives a > 4',
  '25:inequalities-solve-two-signs': 'I can solve an inequality with two signs, like 3 < 2x + 1 < 11 gives 1 < x < 5',
  '25:inequalities-negative': 'I can flip the sign when I multiply or divide by a negative, like −3x > 12 gives x < −4',

  '22:quadratic-equations': 'I can solve a quadratic like x² + x = 20 by making one side 0, factorising and setting each bracket to 0',
}

