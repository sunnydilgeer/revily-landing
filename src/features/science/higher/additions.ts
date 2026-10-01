/*
 * Higher-only sections, from the CGP AQA Combined Science Higher revision guide. Each one is marked `higher: true` (it shows a Higher badge) and is inserted
 * into an existing Foundation lesson, just before the screen named in `before`, and is shown only to
 * Higher students (see ../tier.ts). Foundation lessons are never edited for Higher content.
 * Ids use an H: B13-H01, B13-H02 … so they can never clash with Foundation ids.
 */
import { addition, f, type HigherAddition } from './helpers'
import { higherB4 } from './biology-b4'
import { higherB5 } from './biology-b5'
import { higherB5Fertility } from './biology-b5-fertility'
import { higherB6 } from './biology-b6'
import { higherC2 } from './chemistry-c2'
import { higherC4 } from './chemistry-c4'
import { higherC6 } from './chemistry-c6'
import { higherP2 } from './physics-p2'
import { higherPGraphs } from './physics-graphs'
import { higherPNewton } from './physics-newton'
import { higherP6 } from './physics-p6'
import { higherWS } from './skills-ws'

export type { HigherAddition } from './helpers'

// Biology Lesson 11 · Higher p15: gill filaments, lamellae and blood and water flowing opposite ways.
const gills = addition('B-CELL-006C-B', 'B6-38', 'B-HIGHER-GILLS', ['4.1.3.1'],
  { id: 'B6-H01', higher: true, label: 'Gills up close', detail: 'Filaments, lamellae and opposite flows' },
  [
    f('Gill filaments', 'Each gill is made of many thin plates called gill filaments.', 'many thin plates → big area', 'Water goes in through a fish’s mouth and passes out over its gills. Each gill is made of lots of thin plates. These are called gill filaments. Together they give a big surface area for gas exchange.', 'exchange-gill'),
    f('Even smaller plates', 'Gill filaments are covered in tiny plates called lamellae.', 'more plates → even more area', 'Each gill filament is covered in many tiny plates. These are called lamellae. They make the surface area even bigger. Lamellae have a thin layer of cells and lots of blood capillaries, so oxygen only has a short way to go.', 'exchange-gill'),
    f('Flowing opposite ways', 'Blood and water flow in opposite directions.', 'opposite flows → gradient all the way', 'Blood flows through the lamellae one way. Water flows over them the opposite way. So the water next to the blood always has more oxygen than the blood. Oxygen keeps diffusing into the blood all the way along.', 'exchange-gill'),
  ],
  a => [
    a.choice('B6-H02', 'What are lamellae?', ['Tiny plates on gill filaments that increase the surface area', 'Holes that let water into a fish’s mouth', 'Blood cells that carry oxygen in fish'], 0, 'Think about what makes the gill surface bigger.', ['Gill filaments are thin plates on each gill.', 'They are covered in even smaller plates called lamellae, which make the surface area bigger.']),
    a.choice('B6-H03', 'In a fish gill, blood and water flow in opposite directions. Why does this help?', ['The water next to the blood always has more oxygen, so oxygen keeps diffusing in', 'It stops water getting into the blood', 'It slows the blood down so it can rest'], 0, 'Compare the oxygen in the water with the oxygen in the blood beside it.', ['Because the flows go opposite ways, the water always has more oxygen than the blood next to it.', 'So there is a concentration gradient all the way along, and oxygen keeps diffusing into the blood.'], 'application', true),
  ])

// Biology Lesson 18 · Higher p26: oxyhaemoglobin.
const oxyhaemoglobin = addition('B-ORG-013-B', 'B13-08', 'B-HIGHER-OXYHB', ['4.2.2.3'],
  { id: 'B13-H01', higher: true, label: 'Oxyhaemoglobin', detail: 'Picking up and letting go of oxygen' },
  [
    f('Joining on', 'In the lungs, haemoglobin joins with oxygen to make oxyhaemoglobin.', 'haemoglobin + oxygen → oxyhaemoglobin', 'In the lungs there is lots of oxygen. Haemoglobin joins with the oxygen there. Together they make a new substance called oxyhaemoglobin.', 'blood-red-haemoglobin'),
    f('Letting go', 'In body tissues, oxyhaemoglobin splits up to release oxygen.', 'oxyhaemoglobin → haemoglobin + oxygen', 'Body cells use up oxygen all the time. In body tissues, oxyhaemoglobin splits up into haemoglobin and oxygen. The oxygen is released to the cells. The haemoglobin goes back to the lungs to collect more.', 'blood-red-haemoglobin'),
  ],
  a => [
    a.choice('B13-H02', 'What happens to oxyhaemoglobin in body tissues?', ['It splits up into haemoglobin and oxygen', 'It joins with more oxygen', 'It turns into plasma'], 0, 'The body cells need the oxygen.', ['Oxyhaemoglobin forms in the lungs, where oxygen joins haemoglobin.', 'In body tissues it splits up, which releases oxygen to the cells.']),
    a.choice('B13-H03', 'Where does oxyhaemoglobin form?', ['In the lungs', 'In the muscles', 'In the kidneys'], 0, 'Where does oxygen first enter the blood?', ['Oxygen enters the blood in the lungs.', 'That is where haemoglobin joins with oxygen to make oxyhaemoglobin.'], 'recall', true),
  ])

// Biology Lesson 19 · Higher p28: 'good' HDL cholesterol, and a clot near a stent is a thrombosis.
const cholesterol = addition('B-ORG-014-B', 'B14-10', 'B-HIGHER-HDL', ['4.2.2.4'],
  { id: 'B14-H01', higher: true, label: 'Good cholesterol and clots', detail: 'HDL cholesterol and thrombosis' },
  [
    f('Two kinds of cholesterol', 'There is ‘bad’ LDL cholesterol and ‘good’ HDL cholesterol.', 'bad builds up, good helps clear', 'There are two kinds of cholesterol in the blood. ‘Bad’ cholesterol is called LDL cholesterol. Too much of it leads to fatty deposits in arteries. ‘Good’ cholesterol is called HDL cholesterol. It helps remove bad cholesterol from the blood.', 'cardio-cholesterol'),
    f('Statins do two jobs', 'Statins lower bad cholesterol and can raise good cholesterol.', 'less LDL, more HDL', 'Statins lower the amount of bad LDL cholesterol. They can also raise the amount of good HDL cholesterol. Both help slow down the build-up of fatty deposits.', 'cardio-statin'),
    f('A clot near a stent', 'A blood clot near a stent is called a thrombosis.', 'clot → blocks the artery again', 'One risk of a stent is that a blood clot forms near it. A blood clot inside a blood vessel is called a thrombosis. It can block the artery again.', 'cardio-stent-balance'),
  ],
  a => [
    a.choice('B14-H02', 'Which statement about HDL cholesterol is correct?', ['It is ‘good’ cholesterol that helps remove bad cholesterol', 'It is ‘bad’ cholesterol that forms fatty deposits', 'It is a drug that lowers cholesterol'], 0, 'One kind of cholesterol is ‘good’ and one is ‘bad’.', ['LDL is the ‘bad’ cholesterol that builds up in arteries.', 'HDL is the ‘good’ cholesterol. It helps remove bad cholesterol from the blood.']),
    a.choice('B14-H03', 'A patient has a stent fitted. Later, a blood clot forms next to it. What is this called?', ['A thrombosis', 'A statin', 'A pacemaker'], 0, 'It is the name for a blood clot inside a blood vessel.', ['A statin is a drug and a pacemaker controls the heartbeat.', 'A blood clot inside a blood vessel is called a thrombosis.'], 'recall', true),
  ])

// Biology Lesson 20 · Higher p30: hepatitis viruses and liver cancer, HPV and cervical cancer.
const virusCancer = addition('B-ORG-015-B', 'B15-10', 'B-HIGHER-VIRUS-CANCER', ['4.2.2.5'],
  { id: 'B15-H01', higher: true, label: 'Viruses that cause cancer', detail: 'Hepatitis and HPV' },
  [
    f('Hepatitis and the liver', 'Some hepatitis viruses can lead to liver cancer.', 'long infection → higher risk', 'Some types of hepatitis virus cause a long-term infection of the liver. The virus lives inside the liver cells. This increases the risk of developing liver cancer.', 'health-virus-cancer'),
    f('HPV and the cervix', 'Infection with HPV can cause cervical cancer.', 'HPV → cancer of the cervix', 'HPV is short for human papillomavirus. Infection with HPV can cause cancer of the cervix in women. The cervix is the opening at the bottom of the womb.', 'health-virus-cancer'),
  ],
  a => [
    a.choice('B15-H02', 'Which virus can cause cervical cancer?', ['HPV', 'Measles', 'Influenza'], 0, 'Its name is shortened to three letters.', ['Measles and influenza are viruses, but they do not cause cervical cancer.', 'Infection with HPV (human papillomavirus) can cause cervical cancer.']),
    a.choice('B15-H03', 'A person has had a hepatitis infection in their liver for many years. Which disease are they at higher risk of?', ['Liver cancer', 'Coronary heart disease', 'Malaria'], 0, 'Where does the hepatitis virus live?', ['The hepatitis virus lives inside liver cells for a long time.', 'This increases the risk of liver cancer.'], 'application', true),
  ])

// Biology Lesson 21 · Higher p31: substances in the body (asbestos) and more disease in deprived areas.
const riskPlaces = addition('B-ORG-016-B', 'B16-10', 'B-HIGHER-RISK', ['4.2.2.6'],
  { id: 'B16-H01', higher: true, label: 'Where risk comes from', detail: 'Asbestos and where people live' },
  [
    f('Three kinds of risk factor', 'Risk factors can be in your lifestyle, your environment or your body.', 'lifestyle, environment, body', 'Risk factors come from three places. Some are part of how you live, like how much exercise you do. Some are substances in the environment, like air pollution. Some are substances in your body.', 'risk-types'),
    f('Asbestos', 'Asbestos fibres can build up in the airways and cause cancer later in life.', 'fibres in the body → cancer later', 'Asbestos is a material that was once used in buildings. Its tiny fibres can be breathed in and build up in the airways. Years later they can cause diseases such as cancer. This is why asbestos is no longer used.', 'risk-types'),
    f('Where you live matters', 'Some diseases are more common in deprived areas.', 'poorer area → more risk factors', 'Within a country, people in poorer areas are more likely to smoke, have a poor diet and not exercise. These are called deprived areas. So more people there have heart disease, obesity and type 2 diabetes.', 'risk-types'),
  ],
  a => [
    a.choice('B16-H02', 'Asbestos fibres stay in a person’s airways. Which kind of risk factor is this?', ['A substance in the body', 'Part of a person’s lifestyle', 'A communicable disease'], 0, 'Where do the fibres end up?', ['The fibres are breathed in and stay in the airways.', 'So asbestos is a risk factor that is a substance in the body.']),
    a.choice('B16-H03', 'Why are heart disease and type 2 diabetes more common in deprived areas?', ['People there are more likely to smoke, have a poor diet and not exercise', 'These diseases spread from person to person there', 'Everyone there has the same genes'], 0, 'Think about the risk factors for these diseases.', ['Heart disease and type 2 diabetes are not communicable, so they do not spread.', 'People in deprived areas are more likely to have risk factors such as smoking, a poor diet and no exercise.'], 'understanding', true),
  ])

export const higherAdditions: readonly HigherAddition[] = [gills, oxyhaemoglobin, cholesterol, virusCancer, riskPlaces, ...higherB4, ...higherB5, ...higherB5Fertility, ...higherB6, ...higherC2, ...higherC4, ...higherC6, ...higherP2, ...higherPGraphs, ...higherPNewton, ...higherP6, ...higherWS]
