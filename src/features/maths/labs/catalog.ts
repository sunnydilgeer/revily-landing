/** Every lab, as the Lab screen lists it: the game, the GCSE skill it trains, and the exam question it gets you ready for. */
export type LabEntry = {
  id: 'heist' | 'storm' | 'potion' | 'tiers'
  href: string
  emoji: string
  title: string
  hook: string
  skill: string
  inGame: string
  inExam: string
  minutes: number
}

export const labCatalog: LabEntry[] = [
  {
    id: 'heist', href: '/preview/lab/heist', emoji: '💰', title: 'Heist Split',
    hook: 'Split the take before the crew turns on you.',
    skill: 'Sharing in a ratio',
    inGame: 'Split £600 between the crew 3 : 2 : 1.',
    inExam: 'Share £600 in the ratio 3 : 2 : 1.',
    minutes: 5,
  },
  {
    id: 'storm', href: '/preview/lab/storm', emoji: '🌀', title: 'Storm Run',
    hook: 'Outrun the storm to the safe zone.',
    skill: 'Map scales · speed, distance, time',
    inGame: 'You sprint at 5 m/s. Do you reach the zone before the storm?',
    inExam: 'A runner covers 400 m at 5 m/s. How long does it take?',
    minutes: 6,
  },
  {
    id: 'potion', href: '/preview/lab/potion', emoji: '🧪', title: 'Potion Lab',
    hook: 'Scale the recipe or blow up the lab.',
    skill: 'Scaling ratios · recipes',
    inGame: 'Brew a double batch of 2 : 3 : 1 Speed Potion.',
    inExam: 'A recipe for 4 people uses 300 g of flour. How much for 12?',
    minutes: 5,
  },
  {
    id: 'tiers', href: '/preview/lab/tiers', emoji: '🏆', title: 'Value Tier List',
    hook: 'Rank the deals from S tier to C tier.',
    skill: 'Best buys · unitary method',
    inGame: 'Is the 12-pack or the “2 for £2.50” better value?',
    inExam: 'Which pack is the best value for money? Show your working.',
    minutes: 6,
  },
]

/** Coming soon: shown locked, so students can see where the labs are heading. */
export const labTeasers = [
  { emoji: '⚖️', title: 'Balance Bot', skill: 'Algebra · solving equations' },
  { emoji: '🎱', title: 'Trick Shot', skill: 'Geometry · angle facts' },
  { emoji: '🃏', title: 'Pack Opener', skill: 'Probability · expected outcomes' },
]
