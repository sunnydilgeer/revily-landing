import type { BalanceExpression } from './EquationBalance'

export type LessonChoice = {
  id: string
  label: string
  feedback: string
  correct?: boolean
}

export type WorkingLine = {
  equation: string
  note: string
  accent?: boolean
  revealLabel?: string
  parts?: WorkingPart[]
}

export type WorkingPart = {
  text: string
  change?: 'added' | 'result'
  cancelled?: boolean
}

type LessonStepBase = {
  id: string
  label: string
  title: string
  instruction: string
  equation?: string
  left?: BalanceExpression
  right?: BalanceExpression
  visual?: boolean
  variableValue?: number
}

export type LessonStep = LessonStepBase &
  (
    | { type: 'explain' }
    | { type: 'choice'; choices: LessonChoice[] }
    | { type: 'break'; amount: number }
    | { type: 'matching'; amount: number }
    | { type: 'worked'; working: WorkingLine[] }
    | {
        type: 'number'
        answer: number
        hints: string[]
        success: string
        diagnostics?: Record<string, string>
        suffix?: string
      }
    | { type: 'complete' }
  )

const units = (unitCount: number): BalanceExpression => ({ unitCount })
const unknown = (unitCount: number): BalanceExpression => ({
  variableCount: 1,
  unitCount,
})

type AdditionQuestionOptions = {
  id: string
  label: string
  addend: number
  total: number
  title?: string
  instruction?: string
  equation?: string
  hints?: string[]
  success?: string
  suffix?: string
}

function additionEquationQuestion({
  id,
  label,
  addend,
  total,
  title = `Solve x + ${addend} = ${total}`,
  instruction = 'Use the same rule you used with the balance.',
  equation = `x + ${addend} = ${total}`,
  hints = [
    `Which operation undoes +${addend}?`,
    `Subtract ${addend} from both sides, then calculate ${total} − ${addend}.`,
  ],
  success = 'Yes. The picture has gone, but the same rule still works.',
  suffix = 'x =',
}: AdditionQuestionOptions): LessonStep {
  return {
    id,
    type: 'number',
    label,
    title,
    instruction,
    equation,
    left: unknown(addend),
    right: units(total),
    visual: false,
    variableValue: total - addend,
    answer: total - addend,
    hints,
    diagnostics: {
      [String(total)]: `That is the number on the right. You still need to subtract ${addend}.`,
      [String(addend)]: `That is the number next to x. Work out ${total} − ${addend}.`,
      [String(total + addend)]: `You added ${addend}. To get x on its own, subtract ${addend}.`,
    },
    success,
    suffix,
  }
}

export const equalityLesson = {
  id: 'equality-as-balance-v2',
  skillId: 'algebra-equality-as-balance',
  title: 'Equality as balance',
  outcome: 'Explain and use the rule that keeps an equation equal.',
  steps: [
    {
      id: 'welcome',
      type: 'explain',
      label: 'The idea',
      title: 'An equals sign is a promise',
      instruction:
        'It says both sides are worth the same. The balance helps you see it.',
      left: units(5),
      right: units(5),
      visual: true,
    },
    {
      id: 'notice',
      type: 'choice',
      label: 'Quick check',
      title: 'What does the balance show?',
      instruction: 'Count each side. Which statement is true?',
      left: units(5),
      right: units(5),
      visual: true,
      choices: [
        {
          id: 'equal',
          label: '5 = 5',
          correct: true,
          feedback: 'Yes. Both sides are worth 5, so the balance stays level.',
        },
        {
          id: 'left-more',
          label: '5 > 5',
          feedback: 'Count again. Neither side has more. Both have 5 blocks.',
        },
        {
          id: 'not-equal',
          label: '5 ≠ 5',
          feedback: 'The two sides match exactly, so the equals sign is true.',
        },
      ],
    },
    {
      id: 'break',
      type: 'break',
      label: 'Try changing one side',
      title: 'Take 1 block from one side',
      instruction: 'Pick a side. Before you click, think: which way will the balance tip?',
      amount: 1,
      left: units(5),
      right: units(5),
      visual: true,
    },
    {
      id: 'restore',
      type: 'matching',
      label: 'Fix the balance',
      title: 'Now take 1 from both sides',
      instruction: 'Take 1 from each side. You can start on either side.',
      amount: 1,
      left: units(5),
      right: units(5),
      visual: true,
    },
    {
      id: 'worked-example',
      type: 'worked',
      label: 'See it in algebra',
      title: 'Turn the balance into an equation',
      instruction:
        'Reveal one line at a time. Try to guess the next line first.',
      left: unknown(3),
      right: units(8),
      visual: true,
      variableValue: 5,
      working: [
        {
          equation: 'x + 3 = 8',
          note: 'We want x on its own. The +3 is in the way.',
        },
        {
          equation: 'x + 3 − 3 = 8 − 3',
          note: 'Subtract 3 on the left. Do the same on the right.',
          revealLabel: 'Show what to do',
          parts: [
            { text: 'x ' },
            { text: '+ 3', cancelled: true },
            { text: ' − 3', change: 'added', cancelled: true },
            { text: ' = 8 ' },
            { text: '− 3', change: 'added' },
          ],
        },
        {
          equation: 'x = 5',
          note: 'Now simplify: x = 5. Both sides are still equal.',
          revealLabel: 'Show the answer',
          parts: [
            { text: 'x = ' },
            { text: '5', change: 'result' },
          ],
        },
      ],
    },
    {
      id: 'choose-valid-line',
      type: 'choice',
      label: 'Your turn',
      title: 'Start x + 4 = 10',
      instruction: 'Which line removes the +4 and keeps both sides equal?',
      equation: 'x + 4 = 10',
      left: unknown(4),
      right: units(10),
      visual: true,
      variableValue: 6,
      choices: [
        {
          id: 'both-minus-four',
          label: 'x + 4 − 4 = 10 − 4',
          correct: true,
          feedback: 'Yes. Subtracting 4 undoes +4, and both sides change in the same way.',
        },
        {
          id: 'different-operations',
          label: 'x + 4 − 4 = 10 + 4',
          feedback: 'The two sides change in different ways, so they will no longer be equal.',
        },
        {
          id: 'right-only',
          label: 'x + 4 = 10 − 4',
          feedback: 'Only the right side changed. You need to subtract 4 from both sides.',
        },
      ],
    },
    additionEquationQuestion({
      id: 'guided-answer',
      label: 'Finish it',
      addend: 4,
      total: 10,
      title: 'What is x?',
      equation: 'x + 4 − 4 = 10 − 4',
      instruction: 'The first step is done. Work out 10 − 4.',
      hints: [
        'The +4 and −4 cancel. What is 10 − 4?',
        'After simplifying, the line is x = 10 − 4.',
      ],
      success: 'Yes. x = 6.',
    }),
    {
      id: 'variation',
      type: 'choice',
      label: 'Same rule, new numbers',
      title: 'Try x + 5 = 12',
      instruction:
        'Which next line gets x on its own and keeps both sides equal?',
      equation: 'x + 5 = 12',
      visual: false,
      choices: [
        {
          id: 'valid-transform',
          label: 'x + 5 − 5 = 12 − 5',
          correct: true,
          feedback: 'Yes. Subtract 5 from both sides.',
        },
        {
          id: 'left-only-transform',
          label: 'x + 5 − 5 = 12',
          feedback: 'This gets x on its own, but only one side changed. The equation is no longer equal.',
        },
        {
          id: 'wrong-inverse',
          label: 'x + 5 + 5 = 12 + 5',
          feedback: 'Adding 5 keeps both sides equal, but it does not get x on its own.',
        },
      ],
    },
    additionEquationQuestion({
      id: 'symbolic',
      label: 'No balance this time',
      addend: 7,
      total: 12,
      instruction: 'Work it out on your own. If you get stuck, try an answer to see a hint.',
      success: 'Yes. x = 5. You used the same rule without the picture.',
    }),
    additionEquationQuestion({
      id: 'context',
      label: 'Use it in real life',
      addend: 3,
      total: 14,
      title: 'A ticket and its booking fee cost £14',
      equation: 'ticket + £3 fee = £14',
      instruction: 'The booking fee is £3. What does the ticket itself cost?',
      hints: [
        'Remove the £3 booking fee from both sides.',
        'The ticket price is 14 − 3.',
      ],
      success: 'Yes. The ticket costs £11.',
      suffix: '£',
    }),
    {
      id: 'reflection',
      type: 'choice',
      label: 'One last question',
      title: 'Why did the equation stay equal?',
      instruction: 'Choose the reason, not just the shortcut.',
      choices: [
        {
          id: 'both-sides',
          label: 'The same operation was applied to both sides',
          correct: true,
          feedback: 'Yes. Doing the same operation to both sides keeps them equal.',
        },
        {
          id: 'changed-sign',
          label: 'The number moved across and changed sign',
          feedback: 'That shortcut can help, but it does not explain why it works. Think about both sides.',
        },
        {
          id: 'left-first',
          label: 'The left side was always changed first',
          feedback: 'It does not matter which side you start with. Both sides need the same operation.',
        },
      ],
    },
    {
      id: 'complete',
      type: 'complete',
      label: 'Lesson complete',
      title: 'You can keep equations balanced',
      instruction:
        'You started with blocks, then used the same idea to solve equations on your own.',
    },
  ] satisfies LessonStep[],
}
