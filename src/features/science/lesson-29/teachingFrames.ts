import type { TeachingFrame } from '../teachingFrame'

// Follow one run from start to finish: why breathing and heart rate go up, what happens when exercise gets really hard,
// why you keep breathing hard afterwards, then zoom out to every reaction in the body: metabolism.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const exerciseFrames: Record<string, TeachingFrame[]> = {
  'B29-02': [
    f('Muscles need energy', 'Muscles need energy from respiration to contract.', 'more contracting → more respiration → more oxygen', 'Muscles move you by getting shorter, which is called contracting. The energy comes from respiration in the muscle cells. During exercise, muscles contract more often, so they need more energy. More respiration needs more oxygen.', 'energy-exercise-muscle'),
    f('Breathe faster', 'Your breathing rate goes up.', 'breathing rate = how fast you breathe', 'How fast you breathe is called your breathing rate. During exercise, your breathing rate increases. More air reaches your lungs each minute.', 'energy-exercise-rate'),
    f('Breathe deeper', 'Your breath volume goes up.', 'breath volume = how deep each breath is', 'How deep each breath is, is called your breath volume. During exercise, your breath volume increases too. Together with faster breathing, this gets more oxygen into your blood.', 'energy-exercise-volume'),
    f('Heart beats faster', 'Your heart rate goes up.', 'heart rate = how fast your heart beats', 'How fast your heart beats is called your heart rate. During exercise, your heart rate increases. This carries oxygenated blood to the muscles faster, as you saw when you learned about the heart. In a less fit person, heart rate usually rises more and takes longer to return to normal.', 'energy-exercise-heart'),
    f('Put it together', 'Four changes get more oxygen to working muscles.', 'muscles → lungs → heart', 'Muscles contract more, so they respire more and need more oxygen. Breathing rate and breath volume increase to get more oxygen into the blood. Heart rate increases to carry that blood to the muscles faster.', 'energy-exercise-all'),
  ],
  'B29-05': [
    f('Not enough oxygen', 'In really hard exercise, oxygen cannot arrive fast enough.', 'not enough oxygen → anaerobic as well', 'In really hard exercise, your body cannot supply oxygen to your muscles quickly enough. So the muscles start respiring anaerobically as well, as you saw when you learned about the two kinds of respiration. This is not the best way to transfer energy from glucose.', 'energy-hard-short'),
    f('Lactic acid builds up', 'Lactic acid builds up in the muscles, and it hurts.', 'anaerobic → lactic acid → painful', 'Anaerobic respiration in muscles makes lactic acid. During hard exercise, lactic acid builds up in the muscles. This can be painful.', 'energy-hard-lactic'),
    f('Muscle fatigue', 'Long periods of exercise make muscles tired.', 'fatigue = tired, not contracting well', 'After long periods of exercise, muscles get tired and stop contracting efficiently. This is called muscle fatigue.', 'energy-hard-fatigue'),
  ],
  'B29-08': [
    f('After you stop', 'You keep breathing hard after exercise.', 'stopping running ≠ stopping breathing hard', 'When you stop exercising, your breathing does not go straight back to normal. You keep breathing hard for a while. The graph shows breathing rate before, during and after a run.', 'energy-debt-after'),
    f('Oxygen debt', 'The extra oxygen you need after exercise is an oxygen debt.', 'debt = oxygen your muscles are still owed', 'During hard exercise, your lungs, heart and blood could not keep up with the muscles’ need for oxygen. So after exercise, your body needs extra oxygen. The amount of extra oxygen your body needs after exercise is called the oxygen debt.', 'energy-debt-name'),
    f('Paying it back', 'Breathing hard gets oxygen to the muscle cells.', 'lungs → blood → muscle cells', 'Breathing hard after exercise gets more oxygen into your blood. The blood carries it to the muscle cells. Your breathing slowly returns to normal as the debt is paid back.', 'energy-debt-repay'),
  ],
  'B29-11': [
    f('Lots of reactions', 'Cells carry out many reactions all the time.', 'reactions → controlled by enzymes', 'In every cell, lots of chemical reactions happen all the time. Enzymes control these reactions, as you saw when you learned about enzymes. Some reactions build larger molecules, and others break molecules down.', 'energy-meta-reactions'),
    f('Building from glucose', 'Glucose is joined up to make larger molecules.', 'many glucose → starch, glycogen, cellulose', 'Many small glucose molecules can be joined together. Plants make starch to store and cellulose for their cell walls. Animals join glucose into a storage molecule called glycogen.', 'energy-meta-build'),
    f('Lipids', 'A lipid is made from glycerol and three fatty acids.', '1 glycerol + 3 fatty acids', 'Lipids are fats and oils. Each lipid molecule is made from one molecule of glycerol joined to three fatty acids.', 'energy-meta-lipid'),
    f('Proteins', 'Amino acids join to make proteins.', 'glucose + nitrate → amino acids → protein', 'Glucose is combined with nitrate ions to make amino acids, as you saw when you learned what plants do with glucose. Amino acids are then joined together to make proteins.', 'energy-meta-protein'),
    f('Breaking down', 'Some reactions break molecules down.', 'glucose → respiration; extra protein → urea', 'Glucose is broken down in respiration. Extra protein that the body does not need is broken down into a waste substance called urea. Urea leaves the body in urine.', 'energy-meta-break'),
    f('Metabolism', 'All the reactions together are your metabolism.', 'metabolism = the sum of all the reactions', 'Now add up every reaction in a cell or in the body, building up and breaking down. The sum of all these reactions is called metabolism.', 'energy-meta-all'),
  ],
}
