/** Every lab, as the Lab screen lists it: the game, the GCSE skill it trains, and the exam question it gets you ready for. */
export type LabArea = 'number' | 'ratio' | 'algebra' | 'geometry' | 'probability' | 'statistics'

export const labAreas: { id: LabArea; title: string; chip: string }[] = [
  { id: 'number', title: 'Number games', chip: 'Number · about a quarter of Foundation marks' },
  { id: 'ratio', title: 'Ratio games', chip: 'Ratio, proportion & rates · about a quarter of Foundation marks' },
  { id: 'algebra', title: 'Algebra games', chip: 'Algebra · about a fifth of Foundation marks' },
  { id: 'geometry', title: 'Geometry games', chip: 'Geometry & measures · about 15% of Foundation marks' },
  { id: 'probability', title: 'Probability games', chip: 'Probability · shares about 15% of Foundation marks with statistics' },
  { id: 'statistics', title: 'Statistics games', chip: 'Statistics · shares about 15% of Foundation marks with probability' },
]

export type LabEntry = {
  id: 'heist' | 'storm' | 'potion' | 'tiers' | 'balance' | 'trick' | 'packs' | 'deals' | 'stats' | 'mind' | 'build' | 'levels' | 'laser' | 'stall' | 'formula' | 'loot' | 'viral' | 'slice' | 'supplies' | 'obby'
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
    inGame: 'The zone is 400 m away and the storm closes in 80 s. Set your speed.',
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
    inGame: 'The ball hits the cushion at 50°. Turn the cue to the angle it bounces off at.',
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
  {
    id: 'deals', area: 'number', href: '/preview/lab/deals', emoji: '🏷️', title: 'Deal or Steal',
    hook: 'Black Friday mega-sale, and half the deals are fake. Work out the real price before Sale Sal fools you.',
    skill: 'Percentages: % of an amount, discounts and increases',
    inGame: 'Shop A: £180, 20% off. Shop B: just £150. Which is cheaper?',
    inExam: 'A watch costs £180. In a sale the price is reduced by 20%. Work out the sale price.',
    minutes: 4,
  },
  {
    id: 'mind', area: 'algebra', href: '/preview/lab/mind', emoji: '🔮', title: 'Mind Reader',
    hook: 'Learn a think-of-a-number trick that always lands on the same answer, then use algebra to show why.',
    skill: 'Expressions, like terms and expanding brackets',
    inGame: 'Mystic Mo’s trick: n × 10, + 40, ÷ 10. What is (10n + 40) ÷ 10?',
    inExam: 'Expand and simplify 3(n + 6) − 3n.',
    minutes: 4,
  },
  {
    id: 'levels', area: 'algebra', href: '/preview/lab/levels', emoji: '🆙', title: 'Level Up',
    hook: 'The XP for each level follows a pattern. Crack it and predict level 50 before you get there.',
    skill: 'Linear sequences and the nth term',
    inGame: 'Levels 1 to 4 need 140, 190, 240, 290 XP. How much XP for level 50?',
    inExam: 'The nth term of a sequence is 50n + 90. Work out the 50th term.',
    minutes: 4,
  },
  {
    id: 'build', area: 'geometry', href: '/preview/lab/build', emoji: '🧱', title: 'Base Builder',
    hook: 'Night is coming and so are the zombies. Walls round the edge, floor inside: build it in time.',
    skill: 'Perimeter and area, including L-shapes',
    inGame: 'A 35 m by 10 m shed. How many metres of wall go all the way round?',
    inExam: 'A rectangle is 35 m long and 10 m wide. Work out its perimeter and its area.',
    minutes: 4,
  },
  {
    id: 'stats', area: 'statistics', href: '/preview/lab/stats', emoji: '📊', title: 'Rig the Stats',
    hook: 'Your mate’s screen time is a disaster. Work out the averages, then rig one day so the mean looks small.',
    skill: 'Mean, median, mode and range',
    inGame: 'Screen time: 130, 260, 100, 240, 120 minutes. What’s the mean?',
    inExam: 'Work out the mean and the range of these five numbers.',
    minutes: 4,
  },
  {
    id: 'laser', area: 'algebra', href: '/preview/lab/laser', emoji: '🎯', title: 'Laser Line',
    hook: 'Tune y = mx + c and blast the drones. Your laser fires along the line you set.',
    skill: 'Straight-line graphs · y = mx + c',
    inGame: 'Drones at (−4, 0) and (−3, −1). Set m and c so your laser hits both.',
    inExam: 'Find the equation of the line through (−4, 0) and (−3, −1).',
    minutes: 6,
  },
  {
    id: 'stall', area: 'number', href: '/preview/lab/stall', emoji: '🌱', title: 'Stall Tycoon',
    hook: 'Run a market stall with Ziggy for three days. Stock up, give change, set prices and decide if the upgrade pays.',
    skill: 'Money problems: costs, change, profit, wages and payback',
    inGame: 'They buy 4 at £3.50 each and pay with a £50 note. How much change?',
    inExam: 'Pens cost £3.50 each. Sam buys 4 and pays with a £50 note. How much change should Sam get?',
    minutes: 5,
  },
  {
    id: 'formula', area: 'algebra', href: '/preview/lab/formula', emoji: '🔨', title: 'Formula Forge',
    hook: 'Grumpy Flint forges fantasy weapons, and every damage stat comes from a formula. Swap in the numbers and strike the anvil.',
    skill: 'Substitution into formulae · function machines',
    inGame: 'A sword has a = 6 and b = 5. Damage D = 3a + 2b. Set the damage dial and forge it.',
    inExam: 'D = 3a + 2b. Work out the value of D when a = 6 and b = 5.',
    minutes: 5,
  },
  {
    id: 'loot', area: 'geometry', href: '/preview/lab/loot', emoji: '📦', title: 'Loot Packer',
    hook: 'Pack the loot chests before the drop ship leaves. No gaps, no spills.',
    skill: 'Volume of cuboids · cm³ and litres',
    inGame: 'A tank is 50 cm by 30 cm by 20 cm. How many litres of slime fill it?',
    inExam: 'A cuboid tank measures 50 cm by 30 cm by 20 cm. How many litres of water does it hold?',
    minutes: 6,
  },
  {
    id: 'viral', area: 'statistics', href: '/preview/lab/viral', emoji: '📱', title: 'Going Viral',
    hook: 'Turn an influencer’s stats into charts the brand will actually trust.',
    skill: 'Bar charts · pie charts · misleading graphs',
    inGame: '120 viewers, 40 are Superfans. What angle is their slice?',
    inExam: 'Draw a pie chart to show the data. Explain why this graph is misleading.',
    minutes: 6,
  },
  {
    id: 'slice', area: 'number', href: '/preview/lab/slice', emoji: '🍕', title: 'Slice Wars',
    hook: 'Out-slice the rival pizza shop with Nonna Rosa. Cut pizzas, combine orders and share out the toppings fairly.',
    skill: 'Fractions: equivalent fractions, adding fractions, fractions of amounts',
    inGame: 'Box up 1/2 of a Margherita and 1/3 of a Pepperoni. Cut both pizzas into the same size slices.',
    inExam: 'Work out 1/2 + 1/3. Give your answer as a fraction.',
    minutes: 6,
  },
  {
    id: 'supplies', area: 'ratio', href: '/preview/lab/supplies', emoji: '🏕️', title: '99 Nights Supplies',
    hook: 'Scout’s panicking. Measure out rope, water, rice and night-watch shifts before dark.',
    skill: 'Unit conversions: length, mass, capacity and time',
    inGame: 'Share 3 litres of water into 250 ml cups. How many cups?',
    inExam: 'A bottle holds 3 litres. A cup holds 250 ml. How many cups can be filled?',
    minutes: 6,
  },
  {
    id: 'obby', area: 'probability', href: '/preview/lab/obby', emoji: '🧱', title: 'Obby Split',
    hook: 'Blox’s obstacle course is live. Fill the frequency tree to track every player down every branch, then work out the odds.',
    skill: 'Frequency trees and probability from them',
    inGame: '200 players start. 120 take the Lava path, the rest take Ice. 3/4 of the Lava players clear the jump. Fill the tree.',
    inExam: '200 people took a test. 120 were adults, and 3/4 of the adults passed. Complete the frequency tree.',
    minutes: 5,
  },
]

/** Coming soon: shown locked, so students can see where the labs are heading. */
export const labTeasers = [
  { emoji: '💱', title: 'Import or Not', skill: 'Ratio · exchange rates' },
  { emoji: '📐', title: 'Pythagoras Parkour', skill: 'Geometry · Pythagoras' },
]
