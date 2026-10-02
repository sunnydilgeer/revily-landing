/*
 * Higher-only section for chapter P2 (electricity), from the CGP AQA Combined Science Higher guide page 195, bottom box
 * (scope only; all wording, numbers, questions and diagrams are original). AQA 8464 HT content: 6.2.4.3 (Vp × Ip = Vs × Is
 * for a transformer that is 100% efficient). Diagrams: components/HigherTransformerVisuals.tsx ('htrans-').
 * The Foundation lesson already teaches step-up and step-down transformers and why the grid uses a high pd and a low
 * current; this section only adds the coils and the equation, and links back to those ideas.
 */
import { addition, f, type HigherAddition } from './helpers'

// Physics Lesson 26 · Higher p195: the transformer equation. Before "On your own".
const transformerEquation = addition('P-ELE-026-P', 'P26-14', 'P-HIGHER-TRANSFORMER', ['6.2.4.3'],
  { id: 'P26-H01', higher: true, label: 'The transformer equation', detail: 'Power in the primary coil = power in the secondary coil' },
  [
    f('Two coils', 'A transformer has two coils of wire: a primary coil and a secondary coil.', 'in through the primary, out through the secondary', 'Inside a transformer there are two coils of wire wound on an iron core. The electricity goes in through one coil. This is called the primary coil. It comes out of the other coil. This is called the secondary coil. The two coils usually have different numbers of turns.', 'htrans-coils'),
    f('A pd and a current for each coil', 'Vp and Ip belong to the primary coil. Vs and Is belong to the secondary coil.', 'p for primary, s for secondary', 'Each coil has its own pd and its own current. The pd across the primary coil is Vp. The current in the primary coil is Ip. On the other side, the pd across the secondary coil is Vs and the current in it is Is.', 'htrans-labels'),
    f('Power in = power out', 'Transformers are nearly 100% efficient, so power in the primary = power in the secondary.', 'P = VI for each coil → the two powers match', 'You know that power = pd × current. So the power in the primary coil is Vp × Ip, and the power in the secondary coil is Vs × Is. Transformers waste almost no energy. They are nearly 100% efficient, so the two powers are equal.', 'htrans-power'),
    f('Put it together', 'Vp × Ip = Vs × Is. If the pd goes up, the current goes down.', 'same power: pd up → current down', 'Writing the two powers as equal gives the transformer equation: Vp × Ip = Vs × Is. The power stays the same, so pd and current trade places. A step-up transformer makes Vs bigger, so Is is smaller. A step-down transformer makes Vs smaller, so Is is bigger.', 'htrans-all'),
  ],
  a => [
    a.worked('P26-H02', 'Use the transformer equation', 'A transformer has a pd of 230 V across its primary coil and a current of 2.0 A in it. The pd across the secondary coil is 23 V. What is the current in the secondary coil?', ['Write the equation: Vp × Ip = Vs × Is.', 'Put in the numbers you know: 230 × 2.0 = 23 × Is.', 'Work out the left side: 230 × 2.0 = 460. So 460 = 23 × Is.', 'Divide both sides by 23: Is = 460 ÷ 23 = 20 A.', 'Check: the pd went down 10 times, so the current went up 10 times. This is a step-down transformer.'], 'htrans-worked'),
    a.choice('P26-H03', 'A transformer has Vp = 12 V and Ip = 3.0 A. The pd across the secondary coil is Vs = 36 V. What is the current in the secondary coil, Is?', ['9.0 A', '0.33 A', '1.0 A', '3.0 A'], 2, 'Work out Vp × Ip first. Then divide by Vs.', ['Vp × Ip = 12 × 3.0 = 36. So 36 = 36 × Is.', 'Is = 36 ÷ 36 = 1.0 A. The pd went up 3 times, so the current went down 3 times.'], 'calculation'),
    a.choice('P26-H04', 'Why is the power in the primary coil equal to the power in the secondary coil?', ['Because the two coils have the same number of turns', 'Because transformers are nearly 100% efficient', 'Because the current is the same in both coils', 'Because the pd is the same across both coils'], 1, 'Think about how much energy a transformer wastes.', ['A transformer wastes almost no energy, so it is nearly 100% efficient.', 'So all the power that goes into the primary coil comes out of the secondary coil.']),
    a.choice('P26-H05', 'A step-up transformer makes the pd across the secondary coil bigger than across the primary coil. What happens to the current?', ['The current in the secondary coil is bigger than in the primary coil', 'The current is the same in both coils', 'There is no current in the secondary coil', 'The current in the secondary coil is smaller than in the primary coil'], 3, 'The power stays the same: Vp × Ip = Vs × Is.', ['The power in both coils is the same, so pd × current stays the same.', 'If the pd goes up, the current must go down. So Is is smaller than Ip.']),
    a.choice('P26-H06', 'A step-up transformer at a power station has Vp = 25 000 V and Ip = 400 A. The pd across its secondary coil is 400 000 V. What is the current in the secondary coil?', ['6400 A', '25 A', '0.040 A', '250 A'], 1, 'Use Vp × Ip = Vs × Is. Work out the power first.', ['Vp × Ip = 25 000 × 400 = 10 000 000 W.', 'Is = 10 000 000 ÷ 400 000 = 25 A. The pd went up 16 times, so the current went down 16 times.'], 'calculation', true, 'htrans-question'),
  ])

export const higherP2: HigherAddition[] = [transformerEquation]
