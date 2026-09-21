import type { LessonNumber, ScienceVariant } from './lessonNavigation'
import { scienceLessonHref } from './lessonNavigation'

export const assessmentResources = 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/assessment-resources'
export const copyrightPolicy = 'https://www.aqa.org.uk/about-us/who-we-are/our-standards/copyright-and-intellectual-property-policy/copyright-policy-for-centres'
export interface CoverageTopic { id: string; lesson: LessonNumber; title: string; activity: string; spec: string; skills: string }
// This is an audit of our own teaching, not a claim about any unreviewed exam question.
export const coverageTopics: CoverageTopic[] = [
  { id: 'cell-parts', lesson: 1, title: 'Animal-cell structures and functions', activity: 'B1-02', spec: '4.1.1.2', skills: 'Identify structures; link structures to functions.' },
  { id: 'cell-comparison', lesson: 1, title: 'Plant, animal and bacterial cells', activity: 'B1-24', spec: '4.1.1.1–4.1.1.2', skills: 'Compare structures; distinguish eukaryotic and prokaryotic cells.' },
  { id: 'cell-scale', lesson: 1, title: 'Cell size and scale', activity: 'B1-29', spec: '4.1.1.1–4.1.1.2; maths skills', skills: 'Compare sizes; convert units; estimate area.' },
  { id: 'microscope-detail', lesson: 2, title: 'Magnification and resolution', activity: 'B2-06', spec: '4.1.1.5', skills: 'Distinguish enlargement from resolving detail; compare microscopes.' },
  { id: 'microscope-calculation', lesson: 2, title: 'Microscopy calculations', activity: 'B2-12', spec: '4.1.1.5; maths skills', skills: 'Calculate magnification, image size or real size; match units.' },
  { id: 'slide-method', lesson: 3, title: 'Slide preparation and safe focusing', activity: 'B3-04', spec: '4.1.1.2; required practical 1', skills: 'Describe a method; explain stain, thin specimens and safe focusing.' },
  { id: 'observations', lesson: 3, title: 'Observations and biological drawings', activity: 'B3-16', spec: '4.1.1.2; required practical 1; working scientifically', skills: 'Record visible evidence; draw and label; calculate drawing magnification.' },
  { id: 'animal-adaptations', lesson: 4, title: 'Specialised animal cells', activity: 'B4-02', spec: '4.1.1.3', skills: 'Link a sperm, nerve or muscle cell feature to its function.' },
  { id: 'plant-adaptations', lesson: 4, title: 'Specialised plant cells', activity: 'B4-08', spec: '4.1.1.3', skills: 'Link root-hair, xylem and phloem features to their jobs.' },
  { id: 'differentiation', lesson: 4, title: 'Differentiation', activity: 'B4-16', spec: '4.1.1.4', skills: 'Explain becoming specialised; distinguish plant and animal patterns.' },
  { id: 'cell-cycle', lesson: 5, title: 'Chromosomes and the cell cycle', activity: 'B5-05', spec: '4.1.2.1–4.1.2.2', skills: 'Describe DNA copying, mitosis and division; explain identical daughter cells.' },
  { id: 'stem-cells', lesson: 5, title: 'Stem cells', activity: 'B5-14', spec: '4.1.2.3', skills: 'Compare sources; explain uses; evaluate benefits, risks and ethical arguments.' },
  { id: 'diffusion', lesson: 6, title: 'Diffusion and its rate', activity: 'B6-02', spec: '4.1.3.1', skills: 'Predict net direction; explain concentration gradients, temperature and surface area.' },
  { id: 'osmosis', lesson: 6, title: 'Osmosis in cells and tissue', activity: 'B6-08', spec: '4.1.3.2', skills: 'Identify water and membrane; predict direction and mass changes.' },
  { id: 'active-transport', lesson: 6, title: 'Active transport', activity: 'B6-13', spec: '4.1.3.3', skills: 'Explain lower-to-higher movement and energy; apply to root hairs and gut uptake.' },
  { id: 'exchange-surfaces', lesson: 6, title: 'Exchange surfaces and SA:V', activity: 'B6-18', spec: '4.1.3.1', skills: 'Calculate ratios; explain area, thin barriers, blood supply and ventilation.' },
  { id: 'osmosis-method', lesson: 6, title: 'Osmosis practical and fair tests', activity: 'B6-25', spec: '4.1.3.2; required practical 2', skills: 'Identify variables; describe a safe fair test; evaluate repeats and unusual results.' },
  { id: 'osmosis-data', lesson: 6, title: 'Osmosis calculations and graphs', activity: 'B6-28', spec: '4.1.3.2; maths skills', skills: 'Calculate percentage mass change; interpret and plot graphs; calculate rates.' },
]
export function coverageLessonHref(topic: CoverageTopic, variant: ScienceVariant) { return scienceLessonHref(topic.lesson, variant, topic.activity) }
export type Readiness = 'ready' | 'partial' | 'notTaught'
export const readinessLabels: Record<Readiness, string> = { ready: 'Ready after linked teaching', partial: 'Partly covered', notTaught: 'Not taught yet' }
export interface PaperMapping {
  id: string; year: number; series: 'June' | 'November'; question: string; marks: number | null
  topicIds: string[]; readiness: Readiness; additionalKnowledge: string
  review: 'pending' | 'teacherChecked'; reviewer: string; checkedAt: string | null
}
// Inherited locator only. We have NOT inspected or verified these question matches.
export const initialPaperMappings: PaperMapping[] = ['01.2', '01.3', '01.4'].map(question => ({
  id: `legacy-2023-${question}`, year: 2023, series: 'June', question, marks: null, topicIds: [],
  readiness: 'partial', additionalKnowledge: 'Existing Lesson 1 source locator; exact skills, marks and prerequisites need teacher review.',
  review: 'pending', reviewer: '', checkedAt: null,
}))
export const mappingStorageKey = 'revily:science:exam-map:v1'
export function paperLink(entry: PaperMapping, kind: 'QP' | 'MS') {
  const series = entry.series === 'June' ? 'june' : 'november'
  const code = entry.series === 'June' ? 'JUN' : 'NOV'
  return `https://filestore.aqa.org.uk/sample-papers-and-mark-schemes/${entry.year}/${series}/AQA-8464B1F-${kind}-${code}${String(entry.year).slice(-2)}.PDF`
}
export function validMapping(value: unknown): value is PaperMapping {
  if (!value || typeof value !== 'object') return false
  const m = value as PaperMapping
  return typeof m.id === 'string' && m.id.length > 0 && m.id.length <= 100
    && Number.isInteger(m.year) && m.year >= 2018 && m.year <= 2025
    && ['June', 'November'].includes(m.series) && typeof m.question === 'string' && /^\d{2}\.\d{1,2}$/.test(m.question)
    && (m.marks === null || (Number.isInteger(m.marks) && m.marks >= 1 && m.marks <= 12))
    && Array.isArray(m.topicIds) && m.topicIds.length <= coverageTopics.length && new Set(m.topicIds).size === m.topicIds.length
    && m.topicIds.every(id => coverageTopics.some(t => t.id === id))
    && ['ready', 'partial', 'notTaught'].includes(m.readiness)
    && typeof m.additionalKnowledge === 'string' && m.additionalKnowledge.length <= 1500
    && (m.readiness === 'ready' ? m.topicIds.length > 0 : m.additionalKnowledge.trim().length > 0)
    && ['pending', 'teacherChecked'].includes(m.review) && typeof m.reviewer === 'string' && m.reviewer.length <= 100
    && (m.review === 'pending' ? m.checkedAt === null : m.reviewer.trim().length > 0 && m.marks !== null && typeof m.checkedAt === 'string' && Number.isFinite(Date.parse(m.checkedAt)))
}
export function restoreMappings(value: unknown): PaperMapping[] | null {
  if (!Array.isArray(value) || value.length > 100 || !value.every(validMapping) || new Set(value.map(m => m.id)).size !== value.length) return null
  if (new Set(value.map(m => `${m.year}-${m.series}-${m.question}`)).size !== value.length) return null
  return value
}

export interface PilotTask {
  id: string; stage: 'worked' | 'supported' | 'independent'; title: string; marks: number
  topicIds: string[]; prompt: string; scaffold?: string[]; points: string[]; model: string; commonSlip: string
}
export const transportPilot: PilotTask[] = [
  { id: 'EP6-01', stage: 'worked', title: 'Worked answer: active transport', marks: 2, topicIds: ['active-transport'],
    prompt: 'The concentration of mineral ions is lower in the soil than inside a root hair cell. Explain how the cell can continue to absorb mineral ions. [2 marks]',
    points: ['Active transport moves the ions from lower to higher concentration, against the concentration gradient.', 'It uses energy released by respiration.'],
    model: 'The cell absorbs the ions by active transport, against the concentration gradient. This uses energy released by respiration.',
    commonSlip: 'Saying “diffusion” does not explain movement from lower to higher concentration.' },
  { id: 'EP6-02', stage: 'supported', title: 'Your turn, with support', marks: 2, topicIds: ['active-transport'],
    prompt: 'A root hair cell takes in mineral ions even though their concentration is higher inside the cell than in the soil. Explain why diffusion cannot achieve this uptake and how the cell takes the ions in. [2 marks]',
    scaffold: ['Compare the concentration outside with inside.', 'What direction does diffusion move particles overall?', 'Name the process that can move ions the other way and its energy source.'],
    points: ['Diffusion has net movement from higher to lower concentration, so it cannot achieve this lower-to-higher uptake.', 'Active transport moves the ions in using energy released by respiration.'],
    model: 'Diffusion moves particles overall from higher to lower concentration, not from the soil into this cell. Active transport takes the ions in using energy released by respiration.',
    commonSlip: '“The plant needs minerals” explains the need, but not the transport process.' },
  { id: 'EP6-03', stage: 'independent', title: 'Independent calculation: osmosis', marks: 3, topicIds: ['osmosis', 'osmosis-data'],
    prompt: 'A potato sample has an initial mass of 4.00 g and a final mass of 3.60 g after being placed in a sugar solution. Calculate the percentage change in mass. Then explain the mass decrease using osmosis. Show your working. [3 marks]',
    points: ['Mass change = 3.60 − 4.00 = −0.40 g.', 'Percentage change = (−0.40 ÷ 4.00) × 100 = −10% (or a 10% decrease).', 'Water left cells by osmosis through partially permeable membranes into the more concentrated outside solution.'],
    model: 'Change = −0.40 g. Percentage change = (−0.40 ÷ 4.00) × 100 = −10%. Water moved out of the cells through partially permeable membranes by osmosis because the outside solution was more concentrated.',
    commonSlip: 'Divide by the initial mass, not the final mass. A mass loss gives a negative percentage change.' },
  { id: 'EP6-04', stage: 'independent', title: 'Independent explanation: diffusion', marks: 2, topicIds: ['diffusion'],
    prompt: 'Oxygen concentration is higher in the blood than inside a nearby cell. Explain how oxygen moves into the cell. [2 marks]',
    points: ['Oxygen crosses the cell membrane by diffusion.', 'Its net movement is from higher concentration in blood to lower concentration inside the cell, down the concentration gradient.'],
    model: 'Oxygen crosses the cell membrane by diffusion. Its net movement is from the higher concentration in blood to the lower concentration in the cell.',
    commonSlip: 'Osmosis moves water, not oxygen. Diffusion does not require energy from respiration.' },
]
export const pilotStorageKey = (variant: ScienceVariant) => `revily:science:transport-exam-pilot:v1:${variant}`
export interface PilotSession { version: 1; current: number; drafts: Record<string, string>; submitted: Record<string, string>; modelSeen: string[] }
export function newPilotSession(): PilotSession { return { version: 1, current: 0, drafts: {}, submitted: {}, modelSeen: [] } }
export function restorePilotSession(value: unknown): PilotSession | null {
  if (!value || typeof value !== 'object') return null
  const s = value as PilotSession
  const known = (id: string) => transportPilot.some(t => t.id === id)
  const responses = (v: unknown) => !!v && typeof v === 'object' && !Array.isArray(v) && Object.entries(v).every(([id, text]) => known(id) && typeof text === 'string' && text.length <= 6000)
  if (s.version !== 1 || !Number.isInteger(s.current) || s.current < 0 || s.current > transportPilot.length || !responses(s.drafts) || !responses(s.submitted)
    || !Array.isArray(s.modelSeen) || s.modelSeen.some(id => !known(id) || (transportPilot.find(t => t.id === id)!.stage !== 'worked' && !s.submitted[id])) || new Set(s.modelSeen).size !== s.modelSeen.length
    || Object.entries(s.submitted).some(([id, text]) => !text.trim() || transportPilot.find(t => t.id === id)!.stage === 'worked' || s.drafts[id] !== text)
    || (s.current > 0 && transportPilot.slice(0, s.current).some(t => t.stage === 'worked' ? !s.modelSeen.includes(t.id) : !s.submitted[t.id]))) return null
  return s
}
export type PilotAction = { type: 'draft'; text: string } | { type: 'submit' } | { type: 'reveal' } | { type: 'next' } | { type: 'back' }
export function pilotReducer(s: PilotSession, action: PilotAction): PilotSession {
  const task = transportPilot[s.current]
  if (action.type === 'back') return { ...s, current: Math.max(0, s.current - 1) }
  if (!task) return s
  if (action.type === 'draft') return s.submitted[task.id] ? s : { ...s, drafts: { ...s.drafts, [task.id]: action.text.slice(0, 6000) } }
  if (action.type === 'submit') return task.stage === 'worked' || s.submitted[task.id] || !s.drafts[task.id]?.trim() ? s : { ...s, submitted: { ...s.submitted, [task.id]: s.drafts[task.id] } }
  if (action.type === 'reveal') return task.stage !== 'worked' && !s.submitted[task.id] || s.modelSeen.includes(task.id) ? s : { ...s, modelSeen: [...s.modelSeen, task.id] }
  if (action.type === 'next') return task.stage === 'worked' ? s.modelSeen.includes(task.id) ? { ...s, current: s.current + 1 } : s : s.submitted[task.id] ? { ...s, current: s.current + 1 } : s
  return s
}
