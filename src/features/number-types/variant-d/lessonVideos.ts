import type { LearningState, LessonVideoDefinition } from '../types'

const assetRoot = '/lessons/lesson-1/videos'
type SectionClip = { id: string; before: string; props: LessonVideoDefinition['props'] }

export const lessonOneVideos: SectionClip[] = [
  {
    id: 'D-V-I', before: 'D-I-01', props: {
      title: 'Integers and non-integers — video', src: `${assetRoot}/integers.mp4`, poster: `${assetRoot}/integers.jpg`,
      width: 1024, height: 576, durationLabel: '0:58',
      clarification: 'Correction to the clip: a fraction can represent an integer — 12/4 = 3. Negative integers count too; the whole-number set starts at zero.',
      summary: [
        'Integers include negative integers, zero and positive integers: … −3, −2, −1, 0, 1, 2, 3 … .',
        '4.5 has a fractional part, so it is not an integer.',
        'Work out an expression before classifying it. 12/4 = 3 is an integer; 7/8 = 0.875 is not.',
        '√5 and π are non-integers. Fractions and square roots do not all belong to the same category.',
        'From −7, 1.5, 0, 12/4, √11 and 26, the integers are −7, 0, 12/4 and 26.',
      ],
    },
  },
  {
    id: 'D-V-SI', before: 'D-SI-01', props: {
      title: 'Squares, cubes and primes — video', src: `${assetRoot}/special-integers.mp4`, poster: `${assetRoot}/special-integers.jpg`,
      width: 1024, height: 576, durationLabel: '0:53',
      summary: [
        '3 × 3 = 9, so 9 is a square number. 8 is not a square number.',
        '2 × 2 × 2 = 8, so 8 is a cube number.',
        '6 = 2 × 3 has factors other than 1 and itself, so it is not prime.',
        '7 has exactly two positive factors, 1 and 7, so it is prime.',
      ],
    },
  },
  {
    id: 'D-V-R', before: 'D-R-01', props: {
      title: 'Rational numbers — video', src: `${assetRoot}/rational-numbers.mp4`, poster: `${assetRoot}/rational-numbers.jpg`,
      width: 1024, height: 576, durationLabel: '0:38',
      clarification: 'Precisely: a rational number is a fraction of two integers, with a non-zero denominator. Negative numbers can be rational too.',
      summary: [
        'A rational number can be written exactly as a fraction of two integers, with a non-zero denominator.',
        '5/8 = 5 ÷ 8 = 0.625, a terminating decimal.',
        '1/3 = 0.333…, a recurring decimal. It is still rational.',
        '4 = 4/1. Every integer, including zero and negative integers, is rational.',
      ],
    },
  },
  {
    id: 'D-V-IR', before: 'D-IR-01', props: {
      title: 'Irrational numbers — video', src: `${assetRoot}/irrational-numbers.mp4`, poster: `${assetRoot}/irrational-numbers.jpg`,
      width: 1024, height: 576, durationLabel: '0:38',
      clarification: '“Never repeat” means no fixed block repeats forever. Individual digits can repeat.',
      summary: [
        'An irrational number cannot be written exactly as a fraction of two integers. Its decimal neither terminates nor repeats a fixed block.',
        '√16 = 4 and √25 = 5 are exact integer roots. √20 lies between 4 and 5 and is irrational.',
        '√20 ≈ 4.47213595… . These displayed digits are only the beginning of its decimal.',
        '3 × √5 is still irrational. In general, multiplying an irrational number by a non-zero rational number gives an irrational result; multiplying by zero gives zero.',
      ],
    },
  },
  {
    id: 'D-V-MF', before: 'D-MF-01', props: {
      title: 'Multiples and factors — video', src: `${assetRoot}/multiples-factors.mp4`, poster: `${assetRoot}/multiples-factors.jpg`,
      width: 1024, height: 576, durationLabel: '0:39',
      summary: [
        'Positive multiples of 6 are made by taking steps of 6: 6, 12, 18, 24, 30, 36, … .',
        '4 × 6 = 24. Both 4 and 6 divide 24 exactly, so they are factors of 24.',
        '12 = 6 × 2 and 18 = 6 × 3. 6 divides both exactly, so it is a common factor of 12 and 18.',
      ],
    },
  },
]

// Add an optional clip before each topic without changing any existing question data.
export function withSectionVideos(states: LearningState[]): LearningState[] {
  const intros = new Map(lessonOneVideos.map(clip => [clip.before, clip]))
  return states.flatMap(state => {
    const transition = Object.fromEntries(Object.entries(state.transition).map(([route, target]) => [route, intros.get(target)?.id ?? target]))
    const activity = { ...state, transition }
    const clip = intros.get(state.id)
    if (!clip) return [activity]
    const video: LearningState = {
      id: clip.id, microSkillId: state.microSkillId, phase: 'teach', teachingIntent: `Introduce ${state.microSkillId} with Ani’s short animation.`,
      content: { title: clip.props.title }, component: { type: 'lessonVideo', props: clip.props },
      interaction: { type: 'continue' }, transition: { onComplete: state.id },
      completionCondition: 'Choose Continue at any time; watching the clip is optional.',
    }
    return [video, activity]
  })
}
