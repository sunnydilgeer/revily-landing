/*
 * How much AQA tests each checklist statement: the marks of every Foundation question part that uses it, across
 * the 18 papers from November 2022 to June 2025 (Papers 1–3, six sittings), read with their mark schemes.
 * A part that tests several statements counts for each. Sprints use this so practice follows the real paper:
 * decimal multiplication (on the paper every sitting) comes up far more often than truncation (not once).
 */
export const aqaMarks: Record<string, number> = {
  '1:whole-values': 25,
  '1:special-integers': 52,
  '1:rational-numbers': 0,
  '1:irrational-numbers': 0,
  '1:multiples-factors': 30,
  '2:bidmas-ladder': 3,
  '2:operation-priority': 31,
  '2:equal-priority': 3,
  '2:fraction-grouping': 7,
  '2:mixed': 17,
  '3:digit-place-value': 5,
  '3:decimal-places': 9,
  '4:long-multiplication-layout': 4,
  '4:long-multiplication-ones': 3,
  '4:long-multiplication-carrying': 4,
  '4:long-multiplication-tens': 6,
  '4:long-multiplication-application': 62,
  '5:long-division-layout': 72,
  '5:long-division-regrouping': 4,
  '5:long-division-remainders': 43,
  '5:long-division-check': 9,
  '5:long-division-two-digit': 2,
  '6:decimal-addition': 42,
  '6:decimal-subtraction': 55,
  '6:decimal-multiplication': 143,
  '6:decimal-division': 107,
  '7:prime-factorisation': 8,
  '7:hcf-lcm-listing': 5,
  '7:hcf-lcm-venn': 2,
  '8:simplifying-fractions': 42,
  '8:mixed-improper-fractions': 17,
  '8:adding-fractions': 10,
  '8:subtracting-fractions': 11,
  '8:multiplying-fractions': 18,
  '8:dividing-fractions': 14,
  '8:mixed-fraction-calculations': 9,
  '8:fractions-of-amounts': 75,
  '9:fraction-to-decimal': 34,
  '9:decimal-to-fraction': 11,
  '9:decimal-to-percentage': 1,
  '9:percentage-to-decimal': 68,
  '9:fraction-to-percentage': 26,
  '9:percentage-to-fraction': 4,
  '10:rounding-decimal-places': 23,
  '10:rounding-significant-figures': 9,
  '10:rounding-powers-of-ten': 4,
  '10:rounding-carrying': 0,
  '11:ordering-decimals': 13,
  '11:ordering-large-numbers': 2,
  '11:ordering-negative-numbers': 33,
  '11:ordering-fractions-decimals-percentages': 16,
  '12:estimating-significant-figures': 5,
  '12:estimating-calculations': 13,
  '12:estimating-formulas': 0,
  '12:estimating-checking': 4,
  '13:bounds-half-unit': 8,
  '13:bounds-lower-upper': 9,
  '13:bounds-error-interval': 6,
  '13:truncation': 0,
  '13:truncation-error-interval': 0,
  // Estimates, not yet counted from the 18 papers: standard form comes up most sittings, usually for 1–2 marks.
  '14:standard-form-to-large': 3,
  '14:standard-form-to-small': 3,
  '14:standard-form-write-large': 4,
  '14:standard-form-write-small': 4,
  '14:standard-form-multiply': 3,
  '14:standard-form-divide': 2,
  // Estimates, not yet counted from the 18 papers: "simplify" comes up most sittings, usually for 1–2 marks.
  '15:like-terms-one-letter': 5,
  '15:like-terms-different-letters': 3,
  '15:like-terms-powers': 2,
  '15:like-terms-mixed': 3,
  // Estimates, not yet counted from the 18 papers: index laws and roots come up most sittings, usually for 1–2 marks.
  '16:indices-power-one': 1,
  '16:indices-multiply': 3,
  '16:indices-divide': 3,
  '16:indices-power-zero': 2,
  '16:indices-one': 1,
  '16:indices-power-of-power': 2,
  '16:indices-fraction': 1,
  '16:roots': 4,
  // Estimates, not yet counted from the 18 papers: expanding brackets comes up most sittings, usually for 1–2 marks.
  '17:expand-single': 4,
  '17:expand-double': 3,
}

/**
 * How often a template should come up, relative to the others: the square root of the average AQA marks of its
 * statements, plus a floor so that a statement AQA has not tested lately still appears now and then.
 */
export function aqaWeight(statements: string[]) {
  const average = statements.reduce((sum, key) => sum + (aqaMarks[key] ?? 0), 0) / Math.max(1, statements.length)
  return Math.sqrt(average + 4)
}
