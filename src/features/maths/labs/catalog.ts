/** Every lab, as the Lab screen lists it: the game, the GCSE skill it trains, and the exam question it gets you ready for. */
export type LabArea = 'ratio' | 'algebra' | 'geometry' | 'probability'

export const labAreas: { id: LabArea; title: string; chip: string }[] = [
  { id: 'ratio', title: 'Ratio games', chip: 'Ratio, proportion & rates · about a quarter of Foundation marks' },
  { id: 'algebra', title: 'Algebra games', chip: 'Algebra · about a fifth of Foundation marks' },
  { id: 'geometry', title: 'Geometry games', chip: 'Geometry & measures · about 15% of Foundation marks' },
  { id: 'probability', title: 'Probability games', chip: 'Probability & statistics · about 15% of Foundation marks' },
]

export type LabEntry = {
  id: 'heist' | 'storm' | 'potion' | 'tiers' | 'balance' | 'trick' | 'packs'
  area: LabArea
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
    id: 'heist', area: 'ratio', href: '/preview/lab/heist', emoji: '💰', title: 'Heist Split',
    hook: 'Split the take before the crew turns on you.',
    skill: 'Sharing in a ratio',
    inGame: 'Split £600 between the crew 3 : 2 : 1.',
    inExam: 'Share £600 in the ratio 3 : 2 : 1.',
    minutes: 5,
  },
  {
    id: 'storm', area: 'ratio', href: '/preview/lab/storm', emoji: '🌀', title: 'Storm Run',
    hook: 'Outrun the storm to the safe zone.',
    skill: 'Map scales · speed, distance, time',
    inGame: 'You sprint at 5 m/s. Do you reach the zone before the storm?',
    inExam: 'A runner covers 400 m at 5 m/s. How long does it take?',
    minutes: 6,
  },
  {
    id: 'potion', area: 'ratio', href: '/preview/lab/potion', emoji: '🧪', title: 'Potion Lab',
    hook: 'Scale the recipe or blow up the lab.',
    skill: 'Scaling ratios · recipes',
    inGame: 'Brew a double batch of 2 : 3 : 1 Speed Potion.',
    inExam: 'A recipe for 4 people uses 300 g of flour. How much for 12?',
    minutes: 5,
  },
  {
    id: 'tiers', area: 'ratio', href: '/preview/lab/tiers', emoji: '🏆', title: 'Value Tier List',
    hook: 'Rank the deals from S tier to C tier.',
    skill: 'Best buys · unitary method',
    inGame: 'Is the 12-pack or the “2 for £2.50” better value?',
    inExam: 'Which pack is the best value for money? Show your working.',
    minutes: 6,
  },
  {
    id: 'balance', area: 'algebra', href: '/preview/lab/balance', emoji: '⚖️', title: 'Balance Bot',
    hook: 'Keep the robot’s see-saw level to crack the mystery box.',
    skill: 'Solving linear equations',
    inGame: 'Two mystery boxes and 5 weights balance 11 weights. What’s in a box?',
    inExam: 'Solve 2x + 5 = 11.',
    minutes: 5,
  },
  {
    id: 'trick', area: 'geometry', href: '/preview/lab/trick', emoji: '🎱', title: 'Trick Shot',
    hook: 'Find the angle, sink the shot.',
    skill: 'Angle facts',
    inGame: 'The ball hits the cushion at 50°. What angle does it bounce off at?',
    inExam: 'Work out the size of angle x. Give a reason for your answer.',
    minutes: 6,
  },
  {
    id: 'packs', area: 'probability', href: '/preview/lab/packs', emoji: '🃏', title: 'Pack Opener',
    hook: 'Open 1,000 packs and bust the hype.',
    skill: 'Probability · expected outcomes',
    inGame: '5% of packs are legendary. How many in 20 packs?',
    inExam: 'P(red) = 0.05. The spinner is spun 20 times. Estimate how many reds.',
    minutes: 5,
  },
]

/** Coming soon: shown locked, so students can see where the labs are heading. */
export const labTeasers = [
  { emoji: '🔮', title: 'Mind Reader', skill: 'Algebra · expressions and brackets' },
  { emoji: '📊', title: 'Rig the Stats', skill: 'Statistics · mean, median, mode' },
  { emoji: '🏷️', title: 'Deal or Steal', skill: 'Ratio · percentages and discounts' },
]
