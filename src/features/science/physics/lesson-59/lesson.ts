import type { ScienceLesson, ScienceState } from '../../types'
import { author, sampledRequirements } from '../../lessonAuthoring'
import { emMoreFrames as frames } from './teachingFrames'

const source = { id: 'aqa-physics', title: 'AQA 8464 Physics subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/physics-subject-content', locator: '6.6.2.4 Uses and applications of electromagnetic waves (visible light, ultraviolet, X-rays, gamma rays), as on the supplied revision page' }
const skill = 'P-EMMORE'
const light = author(skill, ['6.6.2.4'], ['aqa-physics'])
const uv = author(skill, ['6.6.2.4'], ['aqa-physics'])
const xray = author(skill, ['6.6.2.4'], ['aqa-physics'])
const treat = author(skill, ['6.6.2.4'], ['aqa-physics'])
const t = (a: ReturnType<typeof author>, id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const emMoreSections = [
  { id: 'P59-01', label: 'Start here', detail: 'Pictures of bones' },
  { id: 'P59-02', label: 'How does light carry data?', detail: 'Optical fibres' },
  { id: 'P59-05', label: 'How is ultraviolet used?', detail: 'Lamps, pens and suntans' },
  { id: 'P59-08', label: 'How are X-rays used to see inside you?', detail: 'X-ray images' },
  { id: 'P59-11', label: 'How do X-rays and gamma rays treat and track?', detail: 'Radiotherapy and tracers' },
  { id: 'P59-14', label: 'On your own', detail: 'Choose, read and explain' },
]

const states: ScienceState[] = [
  { ...xray.choice('P59-01', 'A doctor wants a picture of the bones in an arm. Which wave passes through skin and muscle to make it?', ['Visible light', 'Microwaves', 'X-rays', 'Radio waves'], 2, 'Think about hospital pictures of bones.', ['X-rays pass through flesh but not through bone.', 'So they can show the bones.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t(light, 'P59-02', 'How does light carry data?'),
  light.choice('P59-03', 'How is data sent along an optical fibre?', ['As radio waves', 'As sound waves', 'As pulses of visible light', 'As X-rays'], 2, 'Optical means to do with light.', ['Data is sent along optical fibres as pulses of visible light.', 'Fibres are used for telephones and computers.'], 'recall'),
  light.choice('P59-04', 'What happens to the light rays inside an optical fibre?', ['They are reflected back and forth until they reach the other end', 'They are absorbed by the glass', 'They leave through the side of the fibre', 'They turn into electricity'], 0, 'The light has to reach the far end.', ['The rays are reflected off the inside wall again and again.', 'This keeps the light in the fibre until it reaches the other end.']),
  t(uv, 'P59-05', 'How is ultraviolet used?'),
  uv.choice('P59-06', 'What does the ink of a security pen do under UV light?', ['It melts', 'It glows, giving off visible light', 'It gives out gamma rays', 'It absorbs visible light and goes dark'], 1, 'Think about the ink being invisible at other times.', ['Some materials absorb UV and give off visible light.', 'So the ink glows under a UV light.']),
  uv.choice('P59-07', 'What do fluorescent lamps use to produce visible light?', ['Ultraviolet radiation', 'Radio waves', 'Microwaves', 'X-rays'], 0, 'Some materials absorb UV and give off visible light.', ['A fluorescent lamp produces UV radiation.', 'A coating absorbs the UV and gives off visible light.']),
  t(xray, 'P59-08', 'How are X-rays used to see inside you?'),
  xray.choice('P59-09', 'Why do bones show up on an X-ray image?', ['Bones give out X-rays of their own', 'Bones let X-rays through more easily than flesh', 'Flesh blocks X-rays completely', 'X-rays pass through flesh easily but not through bones'], 3, 'Think about which parts the X-rays get through.', ['X-rays pass easily through flesh but not through bones.', 'So bones show up clearly on the image.']),
  xray.choice('P59-10', 'What can a doctor use an X-ray image to check for?', ['Sunburn', 'Broken bones', 'A fever', 'Hearing loss'], 1, 'Think about what X-rays show clearly.', ['An X-ray image shows the bones clearly.', 'A doctor can use it to check for broken bones.']),
  t(treat, 'P59-11', 'How do X-rays and gamma rays treat and track?'),
  treat.choice('P59-12', 'Why is radiotherapy aimed carefully at the cancer cells?', ['To make the X-rays visible', 'To heat the room', 'To make the rays pass through bone', 'To avoid killing too many healthy cells'], 3, 'X-rays and gamma rays can kill living cells.', ['The radiation can kill living cells.', 'So it is aimed at the cancer cells, to avoid killing too many healthy cells.']),
  treat.choice('P59-13', 'Which type of EM wave is used in a medical tracer?', ['X-rays', 'Ultraviolet', 'Gamma rays', 'Infrared'], 2, 'These rays pass easily through the body.', ['Gamma rays pass easily through the body.', 'So small amounts can be used as medical tracers.'], 'recall'),
  uv.choice('P59-14', 'A museum\'s ink is invisible until a special lamp is switched on. Which EM wave does the lamp give out?', ['Radio waves', 'Infrared', 'X-rays', 'Ultraviolet'], 3, 'Think about which wave makes special inks glow.', ['Some inks absorb UV radiation and give off visible light.', 'So the lamp gives out ultraviolet.'], 'application', true),
  light.choice('P59-15', 'What happens to the light ray at point 2 in the diagram?', ['It escapes from the fibre', 'It is reflected back into the fibre', 'It is absorbed and stops', 'It turns into sound'], 1, 'The light must stay in the fibre until the far end.', ['Light rays in an optical fibre are reflected off the inside wall.', 'So the ray at point 2 is reflected back into the fibre.'], 'dataInterpretation', true, 'emmore-q-fibre'),
  treat.choice('P59-16', 'Which statement about X-rays and gamma rays is correct?', ['Both can be used to treat cancer', 'Only gamma rays can kill living cells', 'Neither can pass through the body', 'Only X-rays can be used to treat cancer'], 0, 'Think about radiotherapy.', ['X-rays and gamma rays can both kill living cells.', 'So both can be used to treat cancer.'], 'understanding', true),
  treat.written('P59-17', 'Explain how a medical tracer helps doctors check that an organ is working.', 'Think about what is put in, what the rays do, and what the doctors track.', 'A small amount of a substance that gives out gamma rays is put into the body. Gamma rays pass easily through the body, so a detector outside can pick them up. The detector tracks how the tracer moves around the body. This shows doctors whether the organ is working as it should.', ['A small amount of a gamma-emitting substance is put into the body.', 'Gamma rays pass easily through the body.', 'A detector outside the body tracks the movement of the tracer.', 'This shows doctors whether the organ is working as it should.'], ['Saying gamma rays are used to kill the organ.', 'Saying X-rays are the tracer.', 'Saying large amounts are used.']),
]

export const lessonP59: ScienceLesson = {
  id: 'P-WAV-059-P', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'physics',
  title: 'Uses of light, UV, X-rays and gamma rays', prerequisites: [], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
