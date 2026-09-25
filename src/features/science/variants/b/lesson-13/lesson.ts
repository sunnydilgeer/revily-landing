import type { ScienceLesson, ScienceState } from '../../../types'
import { author, sampledRequirements } from '../../../lessonAuthoring'
import { bloodFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.2.2.3 Blood' }
const a = author('B-BLOOD', ['4.2.2.3'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const bloodSections = [
  { id: 'B13-01', label: 'Start here', detail: 'What is blood made of?' },
  { id: 'B13-02', label: 'What is in blood?', detail: 'Plasma and three kinds of cell part' },
  { id: 'B13-04', label: 'Red blood cells', detail: 'Haemoglobin, shape and no nucleus' },
  { id: 'B13-08', label: 'White blood cells', detail: 'Defending the body' },
  { id: 'B13-10', label: 'Platelets', detail: 'Sealing a cut' },
  { id: 'B13-12', label: 'Plasma carries everything', detail: 'Useful substances and waste' },
  { id: 'B13-15', label: 'On your own', detail: 'Use what you know about blood' },
]

const states: ScienceState[] = [
  { ...a.choice('B13-01', 'What is blood mostly made of?', ['Red blood cells packed tightly together', 'A pale liquid with cells floating in it', 'Water with red dye in it'], 1, 'Think about what the cells must be carried in.', ['Blood cells need something to float and move in.', 'Most of blood is a pale yellow liquid, with cells floating in it.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B13-02', 'What is in blood?'),
  a.choice('B13-03', 'Which part of blood is the liquid?', ['Red blood cells', 'Platelets', 'Plasma'], 2, 'It is the part the cells float in.', ['Red blood cells and platelets are solid parts.', 'They are carried in a liquid called plasma.']),
  t('B13-04', 'How red blood cells carry oxygen'),
  a.choice('B13-05', 'Where does oxygen join onto haemoglobin?', ['In the muscles', 'In the kidneys', 'In the lungs'], 2, 'Where does oxygen first enter the blood?', ['Oxygen enters the blood from the air we breathe in.', 'It joins haemoglobin in the lungs and is let go in body cells such as muscles.']),
  a.choice('B13-06', 'How does a biconcave shape help a red blood cell?', ['It makes room for a large nucleus', 'It gives a large surface area for oxygen', 'It helps the cell make antibodies'], 1, 'Think about the outside of the cell, not the inside.', ['The cell is dished in on both sides.', 'This gives more outside surface, so oxygen moves in and out quickly.']),
  a.choice('B13-07', 'Why does a red blood cell have no nucleus?', ['To leave more room for haemoglobin', 'So it can divide more quickly', 'So it can engulf pathogens'], 0, 'What does the cell need lots of inside it?', ['Haemoglobin carries the oxygen.', 'Without a nucleus there is more space inside for haemoglobin.']),
  t('B13-08', 'How white blood cells defend the body'),
  a.choice('B13-09', 'How do white blood cells defend the body?', ['They carry oxygen to pathogens', 'They form a plug over pathogens', 'They engulf pathogens or make antibodies'], 2, 'There are two different ways.', ['Some white blood cells surround and swallow pathogens.', 'Others make antibodies, which stick to pathogens.']),
  t('B13-10', 'How platelets seal a cut'),
  a.choice('B13-11', 'Why does a small cut stop bleeding after a few minutes?', ['Red blood cells block the cut', 'Platelets help a clot form', 'Plasma dries out in the air'], 1, 'Which part of blood is a tiny piece of a cell?', ['Platelets collect at the cut.', 'They help the blood form a clot, which seals the cut.']),
  t('B13-12', 'What plasma carries'),
  a.choice('B13-13', 'Which waste does plasma carry to the kidneys?', ['Urea', 'Glucose', 'Oxygen'], 0, 'It is made in the liver.', ['Glucose is useful, not waste. Oxygen travels on red blood cells.', 'The liver makes urea, and the kidneys remove it.']),
  a.choice('B13-14', 'Where does plasma carry carbon dioxide?', ['To the kidneys', 'To the small intestine', 'To the lungs'], 2, 'Where does carbon dioxide leave the body?', ['Body cells make carbon dioxide in respiration.', 'Plasma carries it to the lungs, and we breathe it out.']),
  a.choice('B13-15', 'Look at the diagram. What is part 2?', ['Red blood cell', 'White blood cell', 'Platelet', 'Plasma'], 1, 'Look for the cell with a nucleus.', ['Part 2 is larger than the red cells.', 'It has a nucleus, so it is a white blood cell.'], 'understanding', true, 'blood-components'),
  a.choice('B13-16', 'A blood part has no nucleus, a dished shape and lots of haemoglobin. What is it?', ['A platelet', 'A white blood cell', 'A red blood cell'], 2, 'Which part carries oxygen?', ['Platelets also have no nucleus, but they have no haemoglobin.', 'Haemoglobin and a biconcave shape help it carry oxygen, so it is a red blood cell.'], 'application', true, 'blood-red-question'),
  a.choice('B13-17', 'A patient has very few platelets. Which problem are they most likely to have?', ['Bleeding for longer after a cut', 'Not enough oxygen carried', 'Urea not reaching the kidneys'], 0, 'What do platelets do at a wound?', ['Platelets help a clot form.', 'With few platelets, a clot forms slowly, so a cut bleeds for longer.'], 'application', true),
  a.written('B13-18', 'Explain how a red blood cell is adapted to carry oxygen.', 'Link two or more features to how each helps.', 'A red blood cell contains haemoglobin, which binds oxygen. Its biconcave (dished) shape gives a large surface area for oxygen exchange, and having no nucleus leaves more room for haemoglobin.', ['It contains haemoglobin that binds oxygen.', 'Its biconcave (dished) shape gives a large surface area.', 'A large surface area supports oxygen exchange.', 'It has no nucleus, leaving more room for haemoglobin.'], ['It carries oxygen because it has a cellulose cell wall.', 'Its nucleus makes haemoglobin during circulation.', 'Its biconcave shape is said to reduce all surface area.']),
]

export const lesson13: ScienceLesson = {
  id: 'B-ORG-013-B', contentVersion: '0.2.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Blood', prerequisites: ['B-BLOOD-VESSELS'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
