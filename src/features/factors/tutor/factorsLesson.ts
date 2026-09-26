import { chooser, numeric, working } from '../../written-methods/model'
import { author } from '../../written-methods/tutor/content'
import {
  factorTreeWorking,
  listingWorking,
  methodWorking,
  multiplesWorking,
  vennWorking,
  type MethodExample,
  type MethodWorking,
} from '../../written-methods/tutor/methodWorking'
import type { TutorMethodLesson, TutorMethodState } from '../../written-methods/tutor/model'
import type { InteractionDefinition, MicroSkillId } from '../../number-types/types'

const choose = chooser()

const { add, finish } = author(7)
const prime = 'prime-factorisation', listing = 'hcf-lcm-listing', venn = 'hcf-lcm-venn'
const text = (...lines: string[]) => ({ kind: 'text' as const, lines })
const explain = (answer: string, first: string, second: string) => working(answer, ['Use the definition.', first], ['Complete the reasoning.', second])

function practice(topic: MicroSkillId, title: string, sourceRef: string, interaction: InteractionDefinition, explanation: ReturnType<typeof working>, hint: string, walkthrough?: MethodWorking, lines: string[] = [title]) {
  const state = add(topic, title, sourceRef, text(...lines), interaction, explanation, hint)
  if (walkthrough) state.working = walkthrough
  return state
}
function video(state: TutorMethodState, definition: TutorMethodState['video']) { state.video = definition }
function append(example: MethodExample, title: string, operation: string, equation: string, instruction: string) {
  example.steps.push({ title, operation, equation, instruction, frame: example.steps.at(-1)?.frame ?? {} })
  return example
}

const tree60 = methodWorking(factorTreeWorking(60))
const primeVideo = add(prime, 'Build a prime factor tree for 60.', 'N7.1 Q4a example; video 10.17.29', tree60)
video(primeVideo, {
  id: 'lesson7-prime-factors', src: '/media/lesson-7/prime-factors.mp4', poster: '/media/lesson-7/prime-factors.jpg',
  title: 'Prime factorisation: build a factor tree for 60', durationSeconds: 38.7, sourceFile: 'WhatsApp Video 2026-09-20 at 10.17.29.mp4',
  textAlternative: ['A prime number has exactly two factors: 1 and itself.', 'Split 60 into 2 × 30, then split 30 into 2 × 15.', 'Split 15 into 3 × 5; every branch now ends in a prime.', 'Group the repeated 2s to write 60 = 2² × 3 × 5.'],
})
add(prime, 'Write 84 as a product of its prime factors', 'N7.1 Q1 worked example', methodWorking(factorTreeWorking(84)), undefined, undefined, undefined, 'Split 84 repeatedly until the end nodes are prime, then group repeated factors using index notation.')
practice(prime, 'Write 20 as a product of its prime factors.', 'N7.1 Q2', choose(['2² × 5', '2 × 10', '4 × 5']), explain('20 = 2² × 5', '20 = 2 × 10 = 2 × 2 × 5.', 'All factors are prime, so group the two 2s as 2².'), 'A final answer must contain only prime factors.', methodWorking(factorTreeWorking(20)))
practice(prime, 'Express 150 as a product of its prime factors. Give your answer in index form.', 'N7.1 Q3', choose(['2 × 3 × 5²', '2 × 75', '3 × 50']), explain('150 = 2 × 3 × 5²', '150 splits to 2, 3, 5 and 5.', 'Group the repeated 5s as 5².'), 'Keep splitting the composite branches 75 and 25.', methodWorking(factorTreeWorking(150)))
practice(prime, 'Write 60 as a product of its prime factors.', 'N7.1 Q4a', choose(['2² × 3 × 5', '2 × 30', '4 × 15']), explain('60 = 2² × 3 × 5', 'The prime ends are 2, 2, 3 and 5.', 'Write the repeated 2s as 2².'), 'Use the factor tree from the video, but give the final answer in prime factors.', tree60)
const square60 = factorTreeWorking(60)
append(square60, 'Square the prime factorisation', '(2^{2}\\times3\\times5)^2', '60^2=2^4\\times3^2\\times5^2', 'Squaring multiplies every exponent by 2: 2 becomes 4, while the unwritten exponents on 3 and 5 become 2.')
practice(prime, 'Given 60 = 2² × 3 × 5, write 60² as a product of prime factors in index form.', 'N7.1 Q4b', choose(['2⁴ × 3² × 5²', '2² × 3 × 5', '2⁴ × 3 × 5']), explain('60² = 2⁴ × 3² × 5²', 'Start with 60 = 2² × 3 × 5.', 'Squaring doubles every exponent.'), 'Apply the outside square to every prime factor.', methodWorking(square60), ['60 = 2² × 3 × 5', 'Square the complete product'])
practice(prime, 'Write 96 as a product of its prime factors. Give your answer in index form.', 'N7.1 Q5a', choose(['2⁵ × 3', '2⁴ × 6', '2 × 48']), explain('96 = 2⁵ × 3', 'Repeatedly split off 2: five copies of 2 remain with 3.', 'Group the five 2s as 2⁵.'), 'Continue until the remaining branch is prime.', methodWorking(factorTreeWorking(96)))
practice(prime, 'A student says 96 is a square number because its prime factorisation contains the even prime 2. Is the student correct?', 'N7.1 Q5b (contradictory exponent wording repaired)', choose([
  'No. In 96 = 2⁵ × 3¹, both exponents are odd; a square number needs every exponent to be even.',
  'Yes. Any number containing the prime factor 2 is a square number.',
  'Yes. Only one exponent needs to be even.',
]), explain('No - 96 is not a square number.', 'A square number has an even exponent on every prime factor.', 'The exponents in 2⁵ × 3¹ are 5 and 1, both odd.'), 'Check the exponents, not whether a prime base happens to be even.', undefined, ['96 = 2⁵ × 3¹', 'What must be true of every exponent in a square number?'])
const square96 = factorTreeWorking(96)
append(square96, 'Make every exponent even', '2\\times3', '96\\times(2\\times3)=576', 'Multiply by one more 2 and one more 3: 2⁵ × 3¹ becomes 2⁶ × 3², so the smallest multiplier is 6.')
practice(prime, 'Work out the smallest positive integer k such that 96k is a square number.', 'N7.1 Q5c', numeric(6), explain('k = 6', '96 = 2⁵ × 3¹ has two odd exponents.', 'Multiply by 2 × 3 so the exponents become 6 and 2. Therefore k = 6.'), 'Supply one more copy of every prime with an odd exponent.', methodWorking(square96))

const list1218 = methodWorking(listingWorking(12, 18))
const listVideo = add(listing, 'Find the HCF and LCM of 12 and 18 by listing.', 'N7.2 Q1; video 10.17.50', list1218)
video(listVideo, {
  id: 'lesson7-listing-hcf-lcm', src: '/media/lesson-7/listing-hcf-lcm.mp4', poster: '/media/lesson-7/listing-hcf-lcm.jpg',
  title: 'HCF and LCM by listing: 12 and 18', durationSeconds: 31.167, sourceFile: 'WhatsApp Video 2026-09-20 at 10.17.50.mp4',
  textAlternative: ['List all factors of 12 and all factors of 18.', 'The common factors are 1, 2, 3 and 6; the greatest is 6, so HCF = 6.', 'List positive multiples of 12 and 18 until the first match.', 'The first common multiple is 36, so LCM = 36.'],
})
practice(listing, 'Find the HCF of 8 and 12.', 'N7.2 Q2', numeric(4), explain('HCF = 4', 'Common factors are 1, 2 and 4.', 'The highest is 4.'), 'List every factor of both numbers and choose the greatest match.', methodWorking(listingWorking(8, 12, 'hcf')))
practice(listing, 'Find the HCF and LCM of 15 and 20.', 'N7.2 Q3', choose(['HCF = 5 and LCM = 60', 'HCF = 15 and LCM = 20', 'HCF = 1 and LCM = 35']), explain('HCF = 5 and LCM = 60', 'The greatest common factor is 5.', 'The first common positive multiple is 60.'), 'Use factor lists for the HCF and multiple lists for the LCM.', methodWorking(listingWorking(15, 20)))
practice(listing, 'List the first 5 multiples of 14.', 'N7.2 Q4a', choose(['14, 28, 42, 56, 70', '1, 2, 7, 14, 28', '14, 24, 34, 44, 54']), explain('14, 28, 42, 56, 70', 'Multiply 14 by 1, 2, 3, 4 and 5.', 'This gives 14, 28, 42, 56 and 70.'), 'Positive multiples are 14 × 1, 14 × 2, and so on.', methodWorking(multiplesWorking(14, 5)))
practice(listing, 'Bell A rings every 14 minutes and bell B every 21 minutes. After how many minutes will they next ring together?', 'N7.2 Q4b', numeric(42), explain('42 minutes', '“Together again” asks for a common multiple.', '42 is the first common multiple of 14 and 21.'), 'Find the LCM of 14 and 21.', methodWorking(listingWorking(14, 21)), ['Bell A: every 14 minutes', 'Bell B: every 21 minutes'])
practice(listing, 'Find the HCF of 24 and 36.', 'N7.2 Q5a', numeric(12), explain('HCF = 12', 'List the common factors of 24 and 36.', 'The greatest common factor is 12.'), 'Choose the greatest number that divides both exactly.', methodWorking(listingWorking(24, 36, 'hcf')))
practice(listing, 'Explain why the HCF of two numbers can never be bigger than the smaller number.', 'N7.2 Q5b', choose([
  'The HCF must divide the smaller number, and no positive factor of a number can be larger than that number.',
  'The HCF is found by adding the two numbers, so it is always larger.',
  'The HCF is always exactly equal to the smaller number.',
]), explain('It must be no larger than the smaller number.', 'The HCF is a factor of both numbers.', 'A positive factor of the smaller number cannot exceed that number.'), 'Start from the meaning of “factor of the smaller number”.', undefined, ['The HCF must be a factor of both numbers'])
practice(listing, 'Ropes of 84 cm and 126 cm are cut into the greatest possible equal pieces with none left. What is each piece length, and how many pieces are made altogether?', 'N7.2 Q5c', choose(['42 cm each; 5 pieces altogether', '21 cm each; 10 pieces altogether', '42 cm each; 3 pieces altogether']), explain('42 cm each; 5 pieces altogether', 'HCF(84, 126) = 42, so each piece is 42 cm.', '84 ÷ 42 = 2 and 126 ÷ 42 = 3; 2 + 3 = 5 pieces.'), 'Greatest equal length means the HCF. Then divide both ropes and add the piece counts.', methodWorking(listingWorking(84, 126, 'hcf')), ['84 cm rope', '126 cm rope', 'Greatest equal pieces with no remainder'])

const venn3660 = methodWorking(vennWorking(36, 60))
const vennVideo = add(venn, 'Use a Venn diagram to find the HCF and LCM of 36 and 60.', 'N7.3 Q1; video 10.18.02', venn3660)
video(vennVideo, {
  id: 'lesson7-venn-hcf-lcm', src: '/media/lesson-7/venn-hcf-lcm.mp4', poster: '/media/lesson-7/venn-hcf-lcm.jpg',
  title: 'HCF and LCM with a Venn diagram: 36 and 60', durationSeconds: 21.367, sourceFile: 'WhatsApp Video 2026-09-20 at 10.18.02.mp4',
  textAlternative: ['Prime-factorise 36 as 2 × 2 × 3 × 3 and 60 as 2 × 2 × 3 × 5.', 'Put matching copies 2, 2 and 3 in the intersection.', 'Put the remaining 3 in the 36-only region and 5 in the 60-only region.', 'Multiply only the intersection for HCF = 12; multiply every region for LCM = 180.'],
})
practice(venn, 'Write 40 as a product of its prime factors.', 'N7.3 Q2', choose(['2³ × 5', '4 × 10', '2 × 20']), explain('40 = 2³ × 5', 'A factor tree ends in 2, 2, 2 and 5.', 'Group the three 2s as 2³.'), 'Split until every end number is prime.', methodWorking(factorTreeWorking(40)))
practice(venn, 'Given 28 = 2² × 7 and 42 = 2 × 3 × 7, use a Venn diagram to find the HCF and LCM.', 'N7.3 Q3', choose(['HCF = 14 and LCM = 84', 'HCF = 2 and LCM = 42', 'HCF = 28 and LCM = 42']), explain('HCF = 14 and LCM = 84', 'The shared factors are 2 and 7, so HCF = 14.', 'Every region gives 2 × 2 × 3 × 7 = 84 for the LCM.'), 'Put one matching 2 and the 7 in the intersection.', methodWorking(vennWorking(28, 42)))
practice(venn, 'Write 90 as a product of its prime factors.', 'N7.3 Q4a', choose(['2 × 3² × 5', '9 × 10', '2 × 45']), explain('90 = 2 × 3² × 5', 'The prime ends are 2, 3, 3 and 5.', 'Group the repeated 3s as 3².'), 'Continue splitting 45 and 15 until every end is prime.', methodWorking(factorTreeWorking(90)))
practice(venn, 'Given 90 = 2 × 3² × 5 and 105 = 3 × 5 × 7, use a Venn diagram to find their LCM.', 'N7.3 Q4b', numeric(630), explain('LCM = 630', 'Share one 3 and one 5 in the intersection.', 'Multiply every region once: 2 × 3 × 3 × 5 × 7 = 630.'), 'For the LCM, multiply all factors across the union of both circles.', methodWorking(vennWorking(90, 105)))
const vennPQ = methodWorking(vennWorking(600, 540, ['p', 'q']))
practice(venn, 'p = 2³ × 3 × 5² and q = 2² × 3³ × 5. Find the HCF of p and q.', 'N7.3 Q5a', numeric(60), explain('HCF = 60', 'Take the lower exponent of each shared prime: 2², 3¹ and 5¹.', '2² × 3 × 5 = 60.'), 'The Venn intersection contains the lower number of copies of each prime.', vennPQ, ['p = 2³ × 3 × 5²', 'q = 2² × 3³ × 5'])
practice(venn, 'For p = 2³ × 3 × 5² and q = 2² × 3³ × 5, find the LCM.', 'N7.3 Q5b', numeric(5400), explain('LCM = 5,400', 'Take the higher exponent of each prime: 2³, 3³ and 5².', '2³ × 3³ × 5² = 5,400.'), 'The Venn union contains the higher number of copies of every prime.', vennPQ, ['p = 2³ × 3 × 5²', 'q = 2² × 3³ × 5'])
practice(venn, 'A student claims HCF × LCM equals the product of the two numbers. Show whether this is true for p and q.', 'N7.3 Q5c', choose([
  'It is true here: 60 × 5,400 = 324,000 and 600 × 540 = 324,000.',
  'It is false here because 60 × 5,400 = 32,400.',
  'It cannot be checked without drawing a new factor tree.',
]), explain('The products are equal for p and q.', 'HCF × LCM = 60 × 5,400 = 324,000.', 'p × q = 600 × 540 = 324,000, so the two sides match.'), 'Calculate both products separately and compare them.', undefined, ['p = 600 and q = 540', 'HCF = 60 and LCM = 5,400'])

add('mixed', 'Split, list, match and multiply', 'N7.1-N7.3 consolidation', text('Prime factorisation: finish every branch on a prime', 'Listing: greatest shared factor, first shared multiple', 'Venn: intersection for HCF, every region for LCM'), undefined, undefined, undefined, 'Choose the representation that fits the question. Repeated prime factors must be matched copy by copy.')

const states = finish()
export const tutorFactorsLesson: TutorMethodLesson = {
  id: 'L007', number: 7, title: 'Prime factors, HCF and LCM', level: 'GCSE Foundation',
  goal: 'Use prime factorisation, lists and Venn diagrams to find highest common factors and lowest common multiples.',
  labels: { [prime]: 'Prime factorisation', [listing]: 'Listing HCF and LCM', [venn]: 'Venn diagrams', mixed: 'Review' },
  states,
}
