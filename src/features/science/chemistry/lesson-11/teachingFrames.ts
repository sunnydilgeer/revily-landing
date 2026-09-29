import type { TeachingFrame } from '../../teachingFrame'

// Meet the family first (where, who, what they look like), then explain the one fact that makes them special (a full outer
// shell, so they barely react), then use that fact (an unreactive atmosphere), and only then the trend down the group and
// how to predict from it, because prediction needs the trend first.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const nobleFrames: Record<string, TeachingFrame[]> = {
  'C11-02': [
    f('The last column', 'Group 0 is the column on the far right of the periodic table.', 'far right column → Group 0', 'You met groups when you learned about the modern periodic table: columns of elements that behave in similar ways. The column on the far right is special. Its elements hardly react at all. This column is called Group 0.', 'noble-table'),
    f('Six elements', 'Group 0 holds helium, neon, argon, krypton, xenon and radon.', 'He, Ne, Ar, Kr, Xe, Rn → the noble gases', 'Group 0 starts with helium at the top. Below it come neon, argon, krypton, xenon and radon. All six are gases, and they rarely react with anything. So the elements of Group 0 are called the noble gases.', 'noble-members'),
    f('Colourless gases', 'At room temperature, every noble gas is a colourless gas.', 'room temperature → gas, no colour → looks empty', 'At room temperature, all the noble gases are gases. None of them has a colour, so a jar full of one looks empty. A gas with no colour is called colourless. About 1% of the air around you is argon, and you never notice it.', 'noble-colourless'),
  ],
  'C11-05': [
    f('Helium’s shell', 'Helium has 2 electrons, and its only shell holds 2.', '2 electrons → first shell full', 'You met electron shells when you learned about electronic structure. Helium has just 2 electrons. Both sit in the first shell, which can only hold 2. So helium’s outer shell is full.', 'noble-shell-he'),
    f('Eight outer electrons', 'The other noble gases all have 8 electrons in their outer shell.', 'neon 2,8 · argon 2,8,8 → 8 outer electrons', 'Neon’s electrons are arranged 2,8, and argon’s are 2,8,8. So each has 8 electrons in its outer shell, which is full. Krypton, xenon and radon also have 8 outer electrons. So every noble gas has a full outer shell.', 'noble-shell-ne-ar'),
    f('Full means stable', 'A full outer shell is stable, so noble gases are very unreactive.', 'full outer shell → stable → inert', 'Atoms of other elements react by losing, gaining or sharing electrons. This gives them a full outer shell. Noble gas atoms already have one, so they have no need to react. Their full outer shell is a stable arrangement. So noble gases are very unreactive, which is called inert.', 'noble-shell-stable'),
    f('Single atoms', 'Noble gas atoms do not join up, so the gases are made of single atoms.', 'no bonds → single atoms, not molecules', 'Oxygen gas is made of molecules: pairs of atoms joined together. Noble gas atoms do not easily bond, not even to each other. So a noble gas is made of single atoms, each moving around on its own.', 'noble-single'),
  ],
  'C11-08': [
    f('When air gets in the way', 'Oxygen or water in the air can react with some chemicals.', 'air → oxygen and water → unwanted reactions', 'Air contains oxygen and water vapour. Some chemicals react with these instead of taking part in the reaction you want. Sometimes the product you make reacts with the air and is spoiled. So some reactions cannot be done in air.', 'noble-air'),
    f('Fill it with argon', 'The flask is filled with a noble gas, usually argon, instead of air.', 'push out the air → fill with argon', 'So chemists push the air out of the flask and fill it with a noble gas instead, usually argon. Argon does not react with the chemicals. A gas around the chemicals is called an atmosphere. So argon gives an unreactive atmosphere, and only the reaction you want happens.', 'noble-argon'),
    f('Put it together', 'Noble gases protect chemicals because they do not react.', 'inert gas → keeps air away → chemicals protected', 'In air, oxygen and water can react with the chemicals. In argon, nothing reacts with them. So a noble gas keeps the air away and protects the reactants and products. This works only because noble gases are inert.', 'noble-atmosphere'),
  ],
  'C11-10': [
    f('Heavier atoms', 'Relative atomic mass increases down Group 0.', 'down the group → heavier atoms', 'Look at the relative atomic masses down Group 0. Helium’s is 4, argon’s is 40 and radon’s is 222. So the atoms get heavier as you go down the group.', 'noble-trend-mass'),
    f('More electrons', 'Atoms further down the group have more electrons.', 'further down → more protons → more electrons', 'Going down the group, each atom also has more protons, so it has more electrons. A helium atom has 2 electrons. An argon atom has 18, and a radon atom has 86.', 'noble-trend-electrons'),
    f('Stronger forces', 'More electrons mean stronger forces between atoms.', 'more electrons → stronger forces between atoms', 'Noble gas atoms do not bond, but weak forces still pull neighbouring atoms towards each other. These are called forces between atoms. Atoms with more electrons pull on each other more strongly. So the forces between atoms get stronger down the group.', 'noble-trend-forces'),
    f('Higher boiling points', 'Boiling point increases down Group 0.', 'stronger forces → more energy to separate → higher boiling point', 'To boil a liquid, its atoms must be separated from each other. Stronger forces take more energy to overcome, so the liquid must get hotter. So boiling point increases down the group. Helium boils at −269 °C and radon at −62 °C.', 'noble-trend-bp'),
    f('Put it together', 'One chain of ideas explains the trend.', 'heavier → more electrons → stronger forces → higher boiling point', 'Going down Group 0, relative atomic mass increases. So each atom has more electrons. More electrons mean stronger forces between atoms. So more energy is needed to separate them, and the boiling point increases.', 'noble-trend-chain'),
  ],
  'C11-13': [
    f('Predict a state', 'A pattern lets you predict a state from one known fact.', 'argon is a gas → neon and helium boil lower → also gases', 'Suppose you only know that argon is a gas at 25 °C. So argon boils below 25 °C. Helium and neon are above argon, so they boil at even lower temperatures. So they must be gases at 25 °C too.', 'noble-predict-state'),
    f('Predict a value', 'An element’s boiling point lies between those of its neighbours.', 'between two neighbours → between their boiling points', 'Neon boils at −246 °C and krypton at −153 °C. Argon sits between them in the group. So its boiling point should be between −246 °C and −153 °C. A sensible prediction is about −200 °C.', 'noble-predict-range'),
    f('Check the prediction', 'Argon’s real boiling point is inside the predicted range.', 'real value in the range → the pattern works', 'Argon really boils at −186 °C. This is between −246 °C and −153 °C, as predicted. It is not exactly −200 °C, because a pattern only shows roughly where a value lies. So give your prediction as a range or an estimate.', 'noble-predict-check'),
  ],
}
