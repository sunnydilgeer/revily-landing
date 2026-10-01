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
}

