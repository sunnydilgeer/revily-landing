/*
 * The exam map: the GCSE Maths Foundation paper as topics, each sized by the marks it is worth in an average
 * 80-mark paper, and scored by how ready the student is for the checklist statements that sit inside it.
 *
 * Marks come from the analysis of 30 AQA Foundation papers (Nov 2019 – Jun 2025): the total marks each
 * sub-topic earned across all 30 papers. Topics that analysis did not break out (most of Revily's Number
 * lessons) carry an estimate, marked `estimate: true`. The weights are scaled so the topics add up to one
 * 80-mark paper: the analysis left about a fifth of its marks unassigned (mostly 1–2 mark recall questions),
 * so every topic stands in for its share of those too. For ranking and rough sizing, not exact predictions.
 */
import type { Level } from './readiness'
import type { LabEntry } from '../labs/catalog'

export const PAPER_MARKS = 80
/** AQA Foundation grade 4 has sat at roughly half the marks in recent series. A rough guide only. */
export const GRADE_4_SHARE = 0.5

export type AreaId = 'number' | 'algebra' | 'ratio' | 'geometry' | 'probability' | 'statistics'

export type PaperTopic = {
  id: string
  title: string
  /** A shorter name for small tiles. */
  short?: string
  area: AreaId
  /** Marks across the 30 analysed papers. */
  marks30: number
  /** In how many of the 10 sittings the topic came up, where the analysis counted it. */
  sittings?: number
  estimate?: boolean
  /** Checklist statements (lesson:section) that make up the topic. None means Revily does not teach it yet. */
  statements: string[]
  /** Topics to learn first: the branches of the skill tree. */
  requires?: string[]
  labs?: LabEntry['id'][]
}

export const areaTitles: Record<AreaId, string> = {
  number: 'Number',
  algebra: 'Algebra',
  ratio: 'Ratio and proportion',
  geometry: 'Geometry and measures',
  probability: 'Probability',
  statistics: 'Statistics',
}

const lesson = (number: number, ...sections: string[]) => sections.map(section => `${number}:${section}`)

export const paperTopics: PaperTopic[] = [
  // Number
  { id: 'money', title: 'Money problems', short: 'Money', area: 'number', marks30: 231, sittings: 10, requires: ['decimals', 'percentages'], statements: [], labs: ['stall'] },
  { id: 'percentages', title: 'Percentages', short: 'Percent', area: 'number', marks30: 130, sittings: 10, requires: ['fdp'], statements: [], labs: ['deals'] },
  { id: 'factors', title: 'Factors and multiples', short: 'Factors', area: 'number', marks30: 49, sittings: 9, requires: ['number-types'], statements: [
    ...lesson(1, 'multiples-factors'), ...lesson(7, 'prime-factorisation', 'hcf-lcm-listing', 'hcf-lcm-venn'),
  ] },
  { id: 'fractions', title: 'Fractions', area: 'number', marks30: 46, sittings: 10, requires: ['factors'], statements: lesson(8,
    'simplifying-fractions', 'mixed-improper-fractions', 'adding-fractions', 'subtracting-fractions',
    'multiplying-fractions', 'dividing-fractions', 'mixed-fraction-calculations', 'fractions-of-amounts'), labs: ['slice'] },
  { id: 'decimals', title: 'Decimals', area: 'number', marks30: 28, sittings: 6, requires: ['written-methods', 'place-value'], statements: lesson(6,
    'decimal-addition', 'decimal-subtraction', 'decimal-multiplication', 'decimal-division') },
  { id: 'written-methods', title: 'Written methods', short: 'Written methods', area: 'number', marks30: 60, estimate: true, requires: ['place-value'], statements: [
    ...lesson(4, 'long-multiplication-layout', 'long-multiplication-ones', 'long-multiplication-carrying', 'long-multiplication-tens', 'long-multiplication-application'),
    ...lesson(5, 'long-division-layout', 'long-division-regrouping', 'long-division-remainders', 'long-division-check', 'long-division-two-digit'),
  ] },
  { id: 'rounding', title: 'Rounding and estimating', short: 'Rounding', area: 'number', marks30: 60, estimate: true, requires: ['place-value'], statements: [
    ...lesson(10, 'rounding-decimal-places', 'rounding-significant-figures', 'rounding-powers-of-ten', 'rounding-carrying'),
    ...lesson(12, 'estimating-significant-figures', 'estimating-calculations', 'estimating-formulas', 'estimating-checking'),
  ] },
  { id: 'place-value', title: 'Place value and ordering', short: 'Place value', area: 'number', marks30: 45, estimate: true, statements: [
    ...lesson(3, 'digit-place-value', 'decimal-places'),
    ...lesson(11, 'ordering-decimals', 'ordering-large-numbers', 'ordering-negative-numbers', 'ordering-fractions-decimals-percentages'),
  ] },
  { id: 'number-types', title: 'Types of number', short: 'Number types', area: 'number', marks30: 45, estimate: true, statements: lesson(1,
    'whole-values', 'special-integers', 'rational-numbers', 'irrational-numbers') },
  { id: 'fdp', title: 'Fractions, decimals and percentages', short: 'FDP', area: 'number', marks30: 40, estimate: true, requires: ['fractions', 'decimals'], statements: lesson(9,
    'fraction-to-decimal', 'decimal-to-fraction', 'decimal-to-percentage', 'percentage-to-decimal', 'fraction-to-percentage', 'percentage-to-fraction') },
  { id: 'bidmas', title: 'Order of operations', short: 'BIDMAS', area: 'number', marks30: 25, estimate: true, requires: ['number-types'], statements: lesson(2,
    'bidmas-ladder', 'operation-priority', 'equal-priority', 'fraction-grouping', 'mixed') },
  { id: 'bounds', title: 'Bounds and error intervals', short: 'Bounds', area: 'number', marks30: 20, estimate: true, requires: ['rounding'], statements: lesson(13,
    'bounds-half-unit', 'bounds-lower-upper', 'bounds-error-interval', 'truncation', 'truncation-error-interval') },
  { id: 'standard-form', title: 'Standard form', short: 'Std form', area: 'number', marks30: 25, estimate: true, requires: ['rounding'], statements: lesson(14,
    'standard-form-to-large', 'standard-form-to-small', 'standard-form-write-large', 'standard-form-write-small', 'standard-form-multiply', 'standard-form-divide') },

  // Algebra
  { id: 'straight-lines', title: 'Straight-line graphs', short: 'Graphs', area: 'algebra', marks30: 84, sittings: 10, requires: ['substitution', 'equations'], statements: [], labs: ['laser'] },
  { id: 'substitution', title: 'Substitution', area: 'algebra', marks30: 76, sittings: 10, requires: ['simplifying'], statements: [], labs: ['formula'] },
  { id: 'sequences', title: 'Sequences', area: 'algebra', marks30: 59, sittings: 10, requires: ['substitution'], statements: lesson(23, 'sequences-special', 'sequences-geometric', 'sequences-nth-term', 'sequences-in-sequence', 'sequences-consecutive'), labs: ['levels'] },
  { id: 'inequalities', title: 'Inequalities', area: 'algebra', marks30: 30, estimate: true, requires: ['equations'], statements: lesson(24, 'inequalities-number-line', 'inequalities-two-sided') },
  { id: 'equations', title: 'Solving equations', short: 'Equations', area: 'algebra', marks30: 50, sittings: 10, requires: ['function-machines', 'simplifying'], statements: [...lesson(19,
    'equations-one-unknown', 'equations-squares', 'equations-both-sides', 'equations-brackets', 'equations-fractions'),
    ...lesson(20, 'rearrange-linear', 'rearrange-fractions', 'rearrange-squares', 'rearrange-roots'),
    ...lesson(22, 'quadratic-equations')], labs: ['balance'] },
  { id: 'simplifying', title: 'Simplifying expressions', short: 'Simplifying', area: 'algebra', marks30: 43, sittings: 9, statements: [...lesson(15,
    'like-terms-one-letter', 'like-terms-different-letters', 'like-terms-powers', 'like-terms-mixed'),
    ...lesson(16, 'indices-power-one', 'indices-multiply', 'indices-divide', 'indices-power-zero', 'indices-one', 'indices-power-of-power', 'indices-fraction', 'roots'),
    ...lesson(17, 'expand-single', 'expand-double'),
    ...lesson(18, 'factorise-two-terms', 'factorise-three-terms'),
    ...lesson(21, 'quadratics-positive', 'quadratics-negative-middle', 'quadratics-negative-last', 'quadratics-difference-of-squares'),
  ], labs: ['mind'] },
  { id: 'function-machines', title: 'Function machines', short: 'Functions', area: 'algebra', marks30: 19, sittings: 7, statements: [], labs: ['formula'] },

  // Ratio, proportion and rates of change
  { id: 'ratio', title: 'Ratio and proportion', short: 'Ratio', area: 'ratio', marks30: 89, sittings: 10, statements: [], labs: ['heist', 'potion', 'tiers'] },
  { id: 'conversions', title: 'Unit conversions', short: 'Units', area: 'ratio', marks30: 57, sittings: 10, statements: [], labs: ['supplies'] },
  { id: 'speed', title: 'Speed, distance, time', short: 'Speed', area: 'ratio', marks30: 37, sittings: 8, requires: ['conversions'], statements: [], labs: ['storm'] },

  // Geometry and measures
  { id: 'angles', title: 'Angles', area: 'geometry', marks30: 143, sittings: 10, requires: ['shapes'], statements: [], labs: ['trick'] },
  { id: 'area', title: 'Area and perimeter', short: 'Area', area: 'geometry', marks30: 58, sittings: 10, requires: ['shapes'], statements: [], labs: ['build'] },
  { id: 'volume', title: 'Volume', area: 'geometry', marks30: 56, sittings: 10, requires: ['area'], statements: [], labs: ['loot'] },
  { id: 'shapes', title: 'Properties of shapes', short: 'Shapes', area: 'geometry', marks30: 31, sittings: 8, statements: [] },
  { id: 'transformations', title: 'Transformations', short: 'Transform', area: 'geometry', marks30: 23, sittings: 7, requires: ['shapes'], statements: [] },
  { id: 'trigonometry', title: 'Trigonometry', short: 'Trig', area: 'geometry', marks30: 22, sittings: 8, requires: ['pythagoras'], statements: [] },
  { id: 'pythagoras', title: 'Pythagoras', area: 'geometry', marks30: 17, sittings: 5, requires: ['area'], statements: [] },

  // Probability
  { id: 'probability', title: 'Probability', area: 'probability', marks30: 59, sittings: 10, statements: [], labs: ['packs'] },
  { id: 'frequency-trees', title: 'Frequency trees', short: 'Freq. trees', area: 'probability', marks30: 38, sittings: 9, requires: ['probability'], statements: [], labs: ['obby'] },

  // Statistics
  { id: 'charts', title: 'Charts and graphs', short: 'Charts', area: 'statistics', marks30: 56, sittings: 10, statements: [], labs: ['viral'] },
  { id: 'averages', title: 'Averages', area: 'statistics', marks30: 26, sittings: 7, requires: ['charts'], statements: [], labs: ['stats'] },
]

const totalMarks30 = paperTopics.reduce((sum, topic) => sum + topic.marks30, 0)

/** Marks the topic is worth in an average 80-mark paper. */
export function marksPerPaper(topic: PaperTopic) {
  return topic.marks30 / totalMarks30 * PAPER_MARKS
}

/** How much of a statement's marks a level counts for. */
export const levelShare: Record<Level, number> = { notStarted: 0, learning: 0.25, learnt: 0.5, secure: 0.8, examReady: 1 }

export type TopicScore = {
  topic: PaperTopic
  marks: number
  /** Marks the student is ready for, from their levels. */
  ready: number
  share: number
  taught: boolean
}

export function scoreTopics(levels: Record<string, Level>): TopicScore[] {
  return paperTopics.map(topic => {
    const marks = marksPerPaper(topic)
    const taught = topic.statements.length > 0
    const share = taught ? topic.statements.reduce((sum, key) => sum + levelShare[levels[key] ?? 'notStarted'], 0) / topic.statements.length : 0
    return { topic, marks, ready: marks * share, share, taught }
  })
}

/** The taught topic with the most marks still to win, or null when every taught topic is exam-ready. */
export function biggestWin(scores: TopicScore[]) {
  const open = scores.filter(score => score.taught && score.share < 1)
  if (!open.length) return null
  return open.reduce((best, score) => score.marks - score.ready > best.marks - best.ready ? score : best)
}

/** A topic's tile colour: its overall level, from the share of its marks the student is ready for. */
export function tileLevel(score: TopicScore): Level {
  if (score.share === 0) return 'notStarted'
  if (score.share < 0.45) return 'learning'
  if (score.share < 0.75) return 'learnt'
  if (score.share < 0.95) return 'secure'
  return 'examReady'
}

/** A branch of the skill tree: its topics in rows, each row one step further from the roots. */
export function branchTiers(area: AreaId) {
  const topics = paperTopics.filter(topic => topic.area === area)
  const depth = new Map<string, number>()
  const depthOf = (topic: PaperTopic): number => {
    if (!depth.has(topic.id)) {
      const parents = (topic.requires ?? []).map(id => topics.find(candidate => candidate.id === id)!)
      depth.set(topic.id, parents.length ? 1 + Math.max(...parents.map(depthOf)) : 0)
    }
    return depth.get(topic.id)!
  }
  const tiers: PaperTopic[][] = []
  for (const topic of topics) (tiers[depthOf(topic)] ??= []).push(topic)
  return tiers
}

/** Taught topics in the branch that no other taught topic builds on: the boss sits beneath these. */
export function branchLeaves(area: AreaId) {
  const taught = paperTopics.filter(topic => topic.area === area && topic.statements.length > 0)
  return taught.filter(topic => !taught.some(other => other.requires?.includes(topic.id)))
}

/** The exam topic a lesson mostly belongs to (the one holding most of its statements), for its icon. */
export function topicForLesson(lesson: number) {
  const prefix = `${lesson}:`
  let best: PaperTopic | undefined, most = 0
  for (const topic of paperTopics) {
    const count = topic.statements.filter(key => key.startsWith(prefix)).length
    if (count > most) { best = topic; most = count }
  }
  return best
}
