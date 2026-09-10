import type { LearningState, LessonDefinition, MicroSkillId, OperationLegendItem } from '../number-types/types'

const bidmasOperations = ['Brackets', 'Indices', 'Division', 'Multiplication', 'Addition', 'Subtraction']

function whyOperation(now: string[], later: string[] = []): OperationLegendItem[] {
  const orderedOperations = [...now, ...later]
  return bidmasOperations.map((label) => ({
    label,
    status: now.includes(label) ? 'now' : later.includes(label) ? 'later' : 'absent',
    step: orderedOperations.includes(label) ? orderedOperations.indexOf(label) + 1 : undefined,
  }))
}

function continueState(
  state: Omit<LearningState, 'interaction' | 'completionCondition'> & { completionCondition?: string },
): LearningState {
  return {
    ...state,
    interaction: { type: 'continue' },
    completionCondition: state.completionCondition ?? 'Learner views the mathematical transformation and continues.',
  }
}

const states: LearningState[] = [
  continueState({
    id: 'L2-H01', microSkillId: 'operation-priority', phase: 'hook',
    teachingIntent: 'Narrate a complete scan-and-resolve strategy using every BIDMAS operation.',
    content: { title: 'Let’s solve one big expression together', prompt: 'Scan the expression in BIDMAS order. Follow the changing highlight.' },
    component: { type: 'operationSpotlight', props: { example: 'all-bidmas' } },
    transition: { onComplete: 'L2-O01' }, completionCondition: 'Learner follows a narrated example containing all BIDMAS operations.',
  }),
  continueState({
    id: 'L2-O01', microSkillId: 'operation-priority', phase: 'teach',
    teachingIntent: 'Introduce precise BIDMAS vocabulary and equal-priority pairing.',
    content: {
      eyebrow: 'Micro-skill 1', title: 'BIDMAS is a priority map',
      body: 'Resolve brackets, then indices. For division and multiplication, follow the expression from left to right. Do the same for addition and subtraction.',
    },
    component: { type: 'operationPriority', props: {} }, transition: { onComplete: 'L2-O02' },
  }),
  continueState({
    id: 'L2-O02', microSkillId: 'operation-priority', phase: 'teach',
    teachingIntent: 'Model multiplication before addition one legal operation at a time.',
    content: { title: 'Resolve the multiplication first', prompt: 'Only one part is ready to change.' },
    component: { type: 'expressionSteps', props: { expression: '7+\\underbrace{3\\times4}', legend: whyOperation(['Multiplication'], ['Addition']), steps: [
      { expression: '7+12', operation: 'Multiplication' },
      { expression: '19', operation: 'Addition' },
    ] } },
    transition: { onComplete: 'L2-O03' },
  }),
  continueState({
    id: 'L2-O03', microSkillId: 'operation-priority', phase: 'guided',
    teachingIntent: 'Ask the learner to identify each legal operation directly within the expression.',
    content: { title: 'Which calculation happens next?', prompt: 'Select the operation inside the expression.' },
    component: { type: 'nextOperation', props: {
      stages: [
        {
          accessibleExpression: '18 minus 2 times 6',
          tokens: [
            { text: '18' }, { text: ' − ', actionId: 'subtract', actionLabel: 'Calculate 18 minus 2' },
            { text: '2' }, { text: ' × ', actionId: 'multiply', actionLabel: 'Calculate 2 times 6' }, { text: '6' },
          ],
          resolvedExpression: '18-\\underbrace{2\\times6}',
          correctActionId: 'multiply', operation: 'Multiplication',
          correctFeedback: 'Multiplication has priority over subtraction, so calculate 2 × 6 = 12.',
          incorrectFeedback: 'Multiplication has priority over subtraction. Calculate 2 × 6 = 12 first.',
        },
        {
          accessibleExpression: '18 minus 12',
          tokens: [{ text: '18' }, { text: ' − ', actionId: 'subtract', actionLabel: 'Calculate 18 minus 12' }, { text: '12' }],
          resolvedExpression: '\\underbrace{18-12}',
          correctActionId: 'subtract', operation: 'Subtraction',
          correctFeedback: 'It is the only operation left: 18 − 12 = 6.',
          incorrectFeedback: 'Subtraction is the only operation left: 18 − 12 = 6.',
        },
      ], finalExpression: '18 − 12', finalAnswer: '6',
    } },
    transition: { onComplete: 'L2-O04' }, completionCondition: 'Learner follows the legal operation sequence to 6.',
  }),
  {
    id: 'L2-O04', microSkillId: 'operation-priority', phase: 'independent',
    teachingIntent: 'Check unaided application with multiplication appearing first on the page.',
    content: { title: 'Evaluate 4 × 5 + 3', prompt: 'Enter the value.' },
    component: { type: 'expressionSteps', props: { expression: '\\underbrace{4\\times5}+3', legend: whyOperation(['Multiplication'], ['Addition']), steps: [
      { expression: '20+3', operation: 'Multiplication' },
      { expression: '23', operation: 'Addition' },
    ], revealStepsOnAnswer: true } },
    interaction: { type: 'numericInput', correctAnswer: 23, acceptanceRule: 'numeric', placeholder: 'Your answer' },
    feedback: { correct: { message: 'Correct. 4 × 5 = 20, then 20 + 3 = 23.' }, incorrect: { message: 'Complete the multiplication first.', evidence: '4 × 5 = 20, then add 3 to get 23.' } },
    transition: { onCorrect: 'L2-B01' }, completionCondition: 'Learner enters 23.',
  },
  continueState({
    id: 'L2-B01', microSkillId: 'brackets-indices', phase: 'teach',
    teachingIntent: 'Model nested priority by spotlighting one legal operation and preserving the expression structure at every stage.',
    content: { eyebrow: 'Micro-skill 2', title: 'Follow the changing highlight', prompt: 'Resolve one highlighted part at a time.' },
    component: { type: 'operationSpotlight', props: { example: 'brackets-indices' } },
    transition: { onComplete: 'L2-B02' },
  }),
  continueState({
    id: 'L2-B02', microSkillId: 'brackets-indices', phase: 'guided',
    teachingIntent: 'Check the ordering of an index and subtraction inside brackets by selecting each operation in place.',
    content: { title: 'Work through the bracket', prompt: 'Select the operation that should be calculated next.' },
    component: { type: 'nextOperation', props: {
      stages: [
        {
          accessibleExpression: '2 times open bracket 5 squared minus 9 close bracket',
          tokens: [
            { text: '2' }, { text: ' × ', actionId: 'outside-multiply', actionLabel: 'Calculate 2 times the bracket' }, { text: '(' },
            { text: '5', superscript: '2', actionId: 'square', actionLabel: 'Calculate 5 squared' },
            { text: ' − ', actionId: 'subtract', actionLabel: 'Calculate 5 squared minus 9' }, { text: '9)' },
          ],
          resolvedExpression: '2\\times(\\underbrace{5^2}-9)',
          correctActionId: 'square', operation: 'Indices',
          correctFeedback: 'Work inside the brackets first; within them, the index has priority. 5² = 25.',
          incorrectFeedback: 'The bracket must be completed before the outside multiplication, and the index comes before subtraction. Start with 5² = 25.',
        },
        {
          accessibleExpression: '2 times open bracket 25 minus 9 close bracket',
          tokens: [
            { text: '2' }, { text: ' × ', actionId: 'outside-multiply', actionLabel: 'Calculate 2 times the bracket' }, { text: '(25' },
            { text: ' − ', actionId: 'subtract', actionLabel: 'Calculate 25 minus 9' }, { text: '9)' },
          ],
          resolvedExpression: '2\\times\\underbrace{(25-9)}',
          correctActionId: 'subtract', operation: 'Subtraction inside the brackets',
          correctFeedback: 'Complete the bracket: 25 − 9 = 16.',
          incorrectFeedback: 'Finish the calculation inside the brackets before multiplying outside: 25 − 9 = 16.',
        },
        {
          accessibleExpression: '2 times 16',
          tokens: [{ text: '2' }, { text: ' × ', actionId: 'multiply', actionLabel: 'Calculate 2 times 16' }, { text: '16' }],
          resolvedExpression: '\\underbrace{2\\times16}',
          correctActionId: 'multiply', operation: 'Multiplication',
          correctFeedback: 'The bracket is complete, so calculate 2 × 16 = 32.',
          incorrectFeedback: 'Multiplication is the only operation left: 2 × 16 = 32.',
        },
      ], finalExpression: '2 × 16', finalAnswer: '32',
    } },
    transition: { onComplete: 'L2-B03' }, completionCondition: 'Learner follows indices, bracket subtraction, then multiplication.',
  }),
  {
    id: 'L2-B03', microSkillId: 'brackets-indices', phase: 'independent',
    teachingIntent: 'Distinguish a power applied to a completed bracket from a power applied to one term.',
    content: { title: 'Evaluate 30 − (2 + 3)²', prompt: 'Enter the value.' },
    component: { type: 'expressionSteps', props: { expression: '30-\\underbrace{(2+3)}^2', legend: whyOperation(['Brackets', 'Addition'], ['Indices', 'Subtraction']), steps: [
      { expression: '30-5^2', operation: 'Brackets: addition' },
      { expression: '30-25', operation: 'Indices' },
      { expression: '5', operation: 'Subtraction' },
    ], revealStepsOnAnswer: true } },
    interaction: { type: 'numericInput', correctAnswer: 5, acceptanceRule: 'numeric', placeholder: 'Your answer' },
    feedback: { correct: { message: 'Correct. Complete the bracket, square 5, then subtract.' }, incorrect: { message: 'The square applies to the whole bracket.', evidence: '(2 + 3)² = 5² = 25, then 30 − 25 = 5.' } },
    transition: { onCorrect: 'L2-E01' }, completionCondition: 'Learner enters 5.',
  },
  continueState({
    id: 'L2-E01', microSkillId: 'equal-priority', phase: 'teach',
    teachingIntent: 'Correct the interpretation that division must always precede multiplication.',
    content: { eyebrow: 'Micro-skill 3', title: 'Division and multiplication: work left to right', body: 'When only division and multiplication remain, start with the operation furthest left and continue across the expression.' },
    component: { type: 'expressionSteps', props: { expression: '\\underbrace{24\\div6}\\times2', legend: whyOperation(['Division'], ['Multiplication']), steps: [
      { expression: '4\\times2', operation: 'Division: first from the left' },
      { expression: '8', operation: 'Multiplication: next from the left' },
    ], secondary: { expression: '24\\div\\underbrace{(6\\times2)}', legend: whyOperation(['Brackets', 'Multiplication'], ['Division']), steps: [
      { expression: '24\\div12', operation: 'Brackets: multiplication' },
      { expression: '2', operation: 'Division' },
    ], label: 'Different expression: brackets added' } } },
    transition: { onComplete: 'L2-E02' },
  }),
  continueState({
    id: 'L2-E02', microSkillId: 'equal-priority', phase: 'guided',
    teachingIntent: 'Diagnose multiplication-first use of the BIDMAS acronym.',
    content: { title: 'Follow equal-priority operations', prompt: 'Select the operation that should be calculated next.' },
    component: { type: 'nextOperation', props: {
      stages: [
        {
          accessibleExpression: '18 divided by 3 times 2',
          tokens: [
            { text: '18' }, { text: ' ÷ ', actionId: 'divide', actionLabel: 'Calculate 18 divided by 3' }, { text: '3' },
            { text: ' × ', actionId: 'multiply', actionLabel: 'Calculate 3 times 2' }, { text: '2' },
          ],
          resolvedExpression: '\\underbrace{18\\div3}\\times2',
          correctActionId: 'divide', operation: 'Division',
          correctFeedback: 'Division and multiplication have equal priority, so work from left to right: 18 ÷ 3 = 6.',
          incorrectFeedback: 'Multiplication does not automatically come first. With equal priority, start from the left: 18 ÷ 3 = 6.',
        },
        {
          accessibleExpression: '6 times 2',
          tokens: [{ text: '6' }, { text: ' × ', actionId: 'multiply', actionLabel: 'Calculate 6 times 2' }, { text: '2' }],
          resolvedExpression: '\\underbrace{6\\times2}',
          correctActionId: 'multiply', operation: 'Multiplication',
          correctFeedback: 'Continue from left to right: 6 × 2 = 12.',
          incorrectFeedback: 'Multiplication is the only operation left: 6 × 2 = 12.',
        },
      ], finalExpression: '6 × 2', finalAnswer: '12',
    } },
    transition: { onComplete: 'L2-E03' }, completionCondition: 'Learner evaluates equal-priority operations from left to right.',
  }),
  continueState({
    id: 'L2-E03', microSkillId: 'equal-priority', phase: 'teach',
    teachingIntent: 'Correct the belief that addition always precedes subtraction.',
    content: { title: 'Addition and subtraction: work left to right', prompt: 'Follow the expression from left to right.' },
    component: { type: 'expressionSteps', props: { expression: '\\underbrace{10-6}+2', legend: whyOperation(['Subtraction'], ['Addition']), steps: [
      { expression: '4+2', operation: 'Subtraction: first from the left' },
      { expression: '6', operation: 'Addition: next from the left' },
    ], secondary: { expression: '10-\\underbrace{(6+2)}', legend: whyOperation(['Brackets', 'Addition'], ['Subtraction']), steps: [
      { expression: '10-8', operation: 'Brackets: addition' },
      { expression: '2', operation: 'Subtraction' },
    ], label: 'Different expression: brackets added' } } },
    transition: { onComplete: 'L2-E04' },
  }),
  {
    id: 'L2-E04', microSkillId: 'equal-priority', phase: 'independent',
    teachingIntent: 'Check left-to-right addition and subtraction without scaffolding.',
    content: { title: 'Evaluate 20 − 8 + 3', prompt: 'Enter the value.' },
    component: { type: 'expressionSteps', props: { expression: '\\underbrace{20-8}+3', legend: whyOperation(['Subtraction'], ['Addition']), steps: [
      { expression: '12+3', operation: 'Subtraction: first from the left' },
      { expression: '15', operation: 'Addition: next from the left' },
    ], revealStepsOnAnswer: true } },
    interaction: { type: 'numericInput', correctAnswer: 15, acceptanceRule: 'numeric', placeholder: 'Your answer' },
    feedback: { correct: { message: 'Correct. 20 − 8 = 12, then 12 + 3 = 15.' }, incorrect: { message: 'Addition and subtraction share priority.', evidence: 'Work left to right: 20 − 8 = 12, then add 3 to get 15.' } },
    transition: { onCorrect: 'L2-F01' }, completionCondition: 'Learner enters 15.',
  },
  continueState({
    id: 'L2-F01', microSkillId: 'fraction-grouping', phase: 'teach',
    teachingIntent: 'Establish the fraction bar as grouping the entire numerator and denominator.',
    content: { eyebrow: 'Micro-skill 4', title: 'The fraction bar groups the top and the bottom', body: 'Evaluate the whole numerator. Evaluate the whole denominator. Then simplify the fraction.', prompt: 'Top → Bottom → Simplify' },
    component: { type: 'groupedFraction', props: { numerator: '\\underbrace{a+b}', denominator: '\\underbrace{c+d}', legend: whyOperation(['Addition'], ['Division']), showLabels: true, revealStepsOnAnswer: true } },
    transition: { onComplete: 'L2-F02' },
  }),
  continueState({
    id: 'L2-F02', microSkillId: 'fraction-grouping', phase: 'teach',
    teachingIntent: 'Model separate evaluation of numerator and denominator before recombination.',
    content: { title: 'Keep the two calculation zones separate', prompt: 'Evaluate the whole top, then the whole bottom.' },
    component: { type: 'groupedFraction', props: { numerator: '18-\\underbrace{2\\times5}', denominator: '\\underbrace{3+1}', legend: whyOperation(['Multiplication'], ['Subtraction', 'Addition', 'Division']), resolvedNumerator: '18-10=8', resolvedDenominator: '3+1=4', simplified: '\\frac{8}{4}=2', numeratorOperation: 'Multiplication → subtraction', denominatorOperation: 'Addition', simplifyOperation: 'Division' } },
    transition: { onComplete: 'L2-F03' },
  }),
  {
    id: 'L2-F03', microSkillId: 'fraction-grouping', phase: 'guided',
    teachingIntent: 'Detect incomplete numerator or denominator evaluation.',
    content: { title: 'Evaluate the fraction', prompt: 'Use Top → Bottom → Simplify.' },
    component: { type: 'groupedFraction', props: { numerator: '\\underbrace{4^2}+8', denominator: '\\underbrace{2\\times3}', legend: whyOperation(['Indices'], ['Addition', 'Multiplication', 'Division']), resolvedNumerator: '16+8=24', resolvedDenominator: '2\\times3=6', simplified: '\\frac{24}{6}=4', numeratorOperation: 'Indices → addition', denominatorOperation: 'Multiplication', simplifyOperation: 'Division', revealStepsOnAnswer: true } },
    interaction: { type: 'numericInput', correctAnswer: 4, acceptanceRule: 'numeric', placeholder: 'Your answer' },
    feedback: { correct: { message: 'Correct. The numerator is 24 and the denominator is 6.' }, incorrect: { message: 'The accepted answer is 4.', evidence: 'Complete each side of the fraction bar before dividing.' } },
    transition: { onCorrect: 'L2-F04' }, completionCondition: 'Learner evaluates both grouped regions and simplifies.',
  },
  {
    id: 'L2-F04', microSkillId: 'fraction-grouping', phase: 'independent',
    teachingIntent: 'Check transfer when numerator and denominator each contain an operation.',
    content: { title: 'Evaluate the fraction independently', prompt: 'Complete the numerator and denominator before dividing.' },
    component: { type: 'groupedFraction', props: { numerator: '\\underbrace{30\\div5}+6', denominator: '\\underbrace{10-6}', legend: whyOperation(['Division'], ['Addition', 'Subtraction']), resolvedNumerator: '6+6=12', resolvedDenominator: '10-6=4', simplified: '\\frac{12}{4}=3', numeratorOperation: 'Division → addition', denominatorOperation: 'Subtraction', simplifyOperation: 'Division', revealStepsOnAnswer: true } },
    interaction: { type: 'numericInput', correctAnswer: 3, acceptanceRule: 'numeric', placeholder: 'Your answer' },
    feedback: { correct: { message: 'Correct. The numerator is 12, the denominator is 4, and 12 ÷ 4 = 3.' }, incorrect: { message: 'Complete the two grouped calculations separately.', evidence: 'The top is 12, the bottom is 4, and 12 ÷ 4 = 3.' } },
    transition: { onCorrect: 'L2-R01' }, completionCondition: 'Learner enters 3.',
  },
  {
    id: 'L2-R01', microSkillId: 'mixed', phase: 'independent',
    teachingIntent: 'Retrieve the equal-priority rule after intervening fraction work.',
    content: { eyebrow: 'Memory check', title: 'Evaluate 36 ÷ 6 × 2 − 5', prompt: 'Enter the value without a hint.' },
    component: { type: 'expressionSteps', props: { expression: '\\underbrace{36\\div6}\\times2-5', legend: whyOperation(['Division'], ['Multiplication', 'Subtraction']), steps: [
      { expression: '6\\times2-5', operation: 'Division: first from the left' },
      { expression: '12-5', operation: 'Multiplication: next from the left' },
      { expression: '7', operation: 'Subtraction' },
    ], revealStepsOnAnswer: true } },
    interaction: { type: 'numericInput', correctAnswer: 7, acceptanceRule: 'numeric', placeholder: 'Your answer' },
    feedback: { correct: { message: 'Correct. Division and multiplication were handled left to right before subtraction.' }, incorrect: { message: 'Work left to right across division and multiplication.', evidence: '36 ÷ 6 = 6, then 6 × 2 = 12, then subtract 5 to get 7.' } },
    transition: { onCorrect: 'L2-T01' }, completionCondition: 'Learner enters 7.', analytics: { misconceptionId: 'equal-priority-left-to-right', eventName: 'lesson_2_delayed_retrieval' },
  },
  {
    id: 'L2-T01', microSkillId: 'mixed', phase: 'transfer',
    teachingIntent: 'Integrate indices, fraction grouping and simplification in a GCSE-style item.',
    content: { eyebrow: 'GCSE transfer', title: 'Work out the value of the fraction', prompt: 'Show the structure in your working.' },
    component: { type: 'groupedFraction', props: { numerator: '\\underbrace{3^2}+3', denominator: '\\underbrace{10-6}', legend: whyOperation(['Indices'], ['Addition', 'Subtraction', 'Division']), resolvedNumerator: '9+3=12', resolvedDenominator: '10-6=4', simplified: '\\frac{12}{4}=3', numeratorOperation: 'Indices → addition', denominatorOperation: 'Subtraction', simplifyOperation: 'Division', revealStepsOnAnswer: true } },
    interaction: { type: 'numericInput', correctAnswer: 3, acceptanceRule: 'numeric', placeholder: 'Your answer' },
    feedback: { correct: { message: 'Correct. You evaluated the grouped numerator and denominator before simplifying.' }, incorrect: { message: 'Complete the numerator and denominator separately.', evidence: 'The numerator is 12, the denominator is 4, and 12 ÷ 4 = 3.' } },
    transition: { onCorrect: 'L2-M01' }, completionCondition: 'Learner enters 3.',
  },
  continueState({
    id: 'L2-M01', microSkillId: 'mixed', phase: 'mastery',
    teachingIntent: 'Consolidate the transferable decision rules without requiring perfect accuracy.',
    content: { eyebrow: 'Lesson complete', title: 'Read the structure before calculating', body: 'Brackets → Indices → Division or multiplication left to right → Addition or subtraction left to right.', prompt: 'For a fraction: Top → Bottom → Simplify.' },
    component: { type: 'operationPriority', props: { compact: true } }, transition: {},
  }),
]

export const orderOfOperationsLesson: LessonDefinition = {
  id: 'L002',
  title: 'Order of operations',
  level: 'GCSE Foundation',
  goal: 'I can read the structure of a numerical expression and evaluate it in a valid order.',
  states,
}

export const orderOfOperationsMicroSkillLabels: Partial<Record<MicroSkillId, string>> = {
  'operation-priority': 'Priority',
  'brackets-indices': 'Brackets & indices',
  'equal-priority': 'Left to right',
  'fraction-grouping': 'Fraction bars',
  mixed: 'Recall & transfer',
}
