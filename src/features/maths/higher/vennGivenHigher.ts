/*
 * Lesson 305 (Venn diagrams), a Higher section. From the Higher revision guide, P5 Venn Diagrams and Conditional
 * Probability (Level 6-7, p253–254): P(A given B), written P(A|B), counts only inside B, so the total is B's whole
 * circle, not everyone. The book's numbers: the Example (P(G|H) = 12/14 = 6/7), Your Turn Q2c (given not Geography,
 * P(not History) = 36/88 = 9/22) and Q3c (crocodiles and exactly one other animal, 22/80 = 11/40). P(H|G) is our own.
 */
import { author } from '../../written-methods/tutor/content'
import type { FigureTone } from '../../written-methods/tutor/methodWorking'
import { line, part, sign } from '../../written-methods/tutor/stepWorking'
import { boardModel } from '../../simultaneous-equations/tutor/boardWorkings'
import { venn3Fig, vennFig, type Venn3Region, type VennRegion, type VennShade } from '../../probability/tutor/chancePictures'
import { screens } from '../../geometry/tutor/figureLesson'
import { asks } from './figureHelpers'
import { fraction, text, type HigherAddition } from './helpers'

const given = 'venn-given'
const a = author(305, 'L305-H')
const { add } = a
const { worked } = screens(a)
const ask = asks(a)

add(given, 'Given that', 'Higher P5 Venn Diagrams and Conditional Probability', text(
  'P(A given B) is the probability of A when you already know B has happened. It is written P(A|B).',
  'Knowing B happened means you only look inside B. The total is everything in B, not everyone.',
  'So P(A|B) = (the number in both A and B) ÷ (the number in B).',
  'Watch for the word “given”: it changes the bottom of the fraction.',
))

type Tones = Partial<Record<VennRegion, FigureTone>>
const gh = (tones: Tones = {}, shade?: VennShade, caption?: string) => vennFig({
  names: ['G', 'H'], regions: { onlyA: ['6'], both: ['12'], onlyB: ['2'], outside: ['9'] }, tones, ...(shade ? { shade } : {}), caption,
  spoken: 'G is students taking Geography and H is students taking History. Geography only 6, both 12, History only 2, neither 9.',
})

worked(given, 'G is students taking Geography and H is students taking History. Find P(G given H).', 'Given that', 'Higher P5 Venn Diagrams and Conditional Probability (p253)', boardModel([], [
  { title: 'Look inside H', say: 'We already know they take History, so only count the people in H’s circle.', rows: ['In H = 2 + 12 = 14'], picture: gh({}, 'B') },
  { title: 'Those also in G', say: 'Of those 14, the ones in G are in the overlap.', rows: ['In G and H = 12'], picture: gh({ both: 'lit' }, 'B') },
  { title: 'Over H’s total', say: '12 out of the 14, then simplify.', rows: ['P(G|H) = {12|14}', '! P(G|H) = {6|7}'], picture: gh({ both: 'found' }, 'B', '12 out of 14') },
], 'Probability', gh()), 'With “given”, the total on the bottom is only the group you are given, here the 14 in H, not all 29 students.')

ask(given, 'Using the same Venn diagram, find P(H given G).', 'Higher P5 Venn Diagrams and Conditional Probability (own question)', gh(), fraction('2/3'), '2/3', 'Now you are given G. Count G’s whole circle.', {
  kind: 'step-worked', start: 'Given G', steps: [
    { title: 'Look inside G', why: 'Only the students in G’s circle count.', lines: [line([part('6'), sign('+'), part('12')], '18')] },
    { title: 'Those also in H', why: 'The overlap is in H as well. Put it over G’s total and simplify.', lines: [line([part('12/18')], '2/3', { eq: true, answer: true })] },
  ],
}, { label: 'Probability' })

{
  // Your Turn Q2c: Geography only 40, both 14, History only 52, neither 36.
  const geo = (tones: Tones = {}, shade?: VennShade) => vennFig({ names: ['G', 'H'], regions: { onlyA: ['40'], both: ['14'], onlyB: ['52'], outside: ['36'] }, tones, ...(shade ? { shade } : {}), spoken: 'Year 10: Geography only 40, both 14, History only 52, neither 36.' })
  ask(given, 'G is year 10 students who study Geography and H is those who study History. A student is picked at random. Given that they do not study Geography, what is the probability that they do not study History?', 'Higher P5 Your Turn Q2c (Level 6-7)', geo(), fraction('9/22'), '9/22', 'Not Geography is everything outside the Geography circle.', {
    kind: 'step-worked', start: 'Given not Geography', steps: [
      { title: 'Outside Geography', why: 'Not Geography is History only and neither.', lines: [line([part('52'), sign('+'), part('36')], '88')] },
      { title: 'Not History either', why: 'Of those, the ones not in History are outside both circles.', lines: [line([part('Neither')], '36', { eq: true })] },
      { title: 'Over the given total', why: 'Put it over the total you were given, then divide top and bottom by four.', lines: [line([part('36/88')], '9/22', { eq: true, answer: true })] },
    ],
  }, { label: 'Probability' })
}

{
  // Your Turn Q3c: the 80 students and sharks, crocodiles and hippos.
  const regions: Partial<Record<Venn3Region, string>> = { onlyA: '12', onlyB: '7', onlyC: '18', AB: '14', AC: '6', BC: '8', ABC: '15', outside: '0' }
  ask(given, '80 students like sharks (S), crocodiles (C) or hippos (H), as in the Venn diagram. One is picked at random. Find the probability that they like crocodiles and exactly one other animal.', 'Higher P5 Your Turn Q3c (Level 6-7)', venn3Fig(['S', 'C', 'H'], regions, '80 students: sharks only 12, crocodiles only 7, hippos only 18, sharks and crocodiles only 14, sharks and hippos only 6, crocodiles and hippos only 8, all three 15.'), fraction('11/40'), '11/40', 'Crocodiles and sharks but not hippos, or crocodiles and hippos but not sharks.', {
    kind: 'step-worked', start: '80 students', steps: [
      { title: 'Exactly one other', why: 'Crocodiles with sharks only, and crocodiles with hippos only. The middle likes all three, so leave it out.', lines: [line([part('14'), sign('+'), part('8')], '22')] },
      { title: 'Over everyone', why: 'This one has no “given”, so the total is all eighty. Simplify by halving.', lines: [line([part('22/80')], '11/40', { eq: true, answer: true })] },
    ],
  }, { label: 'Probability' })
}

export const vennGiven: HigherAddition = { lessonId: 'L305', skill: given, label: 'Given that', states: a.finish() }
