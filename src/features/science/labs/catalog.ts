/** The Science Arcade: games where the science is the move, each tied to the exam question it trains (AQA Trilogy 8464, Foundation). */
export type ScienceArea = 'physics' | 'chemistry' | 'biology'

export const scienceAreas: { id: ScienceArea; title: string; chip: string }[] = [
  { id: 'physics', title: 'Physics', chip: '30%+ of marks are maths' },
  { id: 'chemistry', title: 'Chemistry', chip: '20%+ of marks are maths' },
  { id: 'biology', title: 'Biology', chip: '10%+ of marks are maths' },
]

export type ScienceLabId = 'grid' | 'sparky' | 'rush' | 'pit' | 'hydrogen'

export type ScienceLabEntry = {
  id: ScienceLabId
  area: ScienceArea
  href: string
  emoji: string
  title: string
  hook: string
  skill: string
  /** The required practical hidden in the game. */
  practical: string
  minutes: number
  /** The Arcade tile's one-liner: about five words. */
  tagline: string
  /** The Arcade tile's topic, in a word or two. */
  tag: string
}

/** Where a science game's × goes: back to the Science Arcade. */
export const SCIENCE_ARCADE_HREF = '/preview?view=lab&subject=science'

export const scienceLabCatalog: ScienceLabEntry[] = [
  {
    id: 'grid', area: 'physics', href: '/preview/lab/grid', emoji: '⚡', title: 'Grid Boss',
    hook: 'It’s 6pm and the whole country puts the kettle on. Keep the National Grid alive.',
    skill: 'Energy: efficiency, power, energy resources',
    practical: 'Specific heat capacity',
    minutes: 6,
    tagline: 'Survive the kettle surge.', tag: 'Energy',
  },
  {
    id: 'sparky', area: 'physics', href: '/preview/lab/sparky', emoji: '🔌', title: 'Sparky',
    hook: 'Wire a solar house and an EV charger. Light the bulbs without frying them.',
    skill: 'Electricity: V = IR, series and parallel, power',
    practical: 'Resistance of a wire',
    minutes: 6,
    tagline: 'Light it. Don’t fry it.', tag: 'Electricity',
  },
  {
    id: 'pit', area: 'physics', href: '/preview/lab/pit', emoji: '🏎️', title: 'Pit Crew',
    hook: 'Tune a self-driving EV so it stops before the crossing. Every time.',
    skill: 'Forces: speed, stopping distance, F = ma',
    practical: 'Acceleration (F = ma)',
    minutes: 6,
    tagline: 'Stop before the crossing.', tag: 'Forces',
  },
  {
    id: 'hydrogen', area: 'chemistry', href: '/preview/lab/hydrogen', emoji: '🧪', title: 'Green Hydrogen Lab',
    hook: 'Split water into green hydrogen, then speed it up to power a Net Zero town.',
    skill: 'Electrolysis, rates of reaction, atmosphere',
    practical: 'Rates of reaction',
    minutes: 6,
    tagline: 'Brew fuel from water.', tag: 'Rates',
  },
  {
    id: 'rush', area: 'biology', href: '/preview/lab/rush', emoji: '🩺', title: 'A&E Rush',
    hook: 'Triage a packed A&E. Find the bug under the microscope, then treat it right.',
    skill: 'Microscopes, pathogens and treating disease',
    practical: 'Microscopy',
    minutes: 6,
    tagline: 'Find the bug. Treat it.', tag: 'Infection',
  },
]
