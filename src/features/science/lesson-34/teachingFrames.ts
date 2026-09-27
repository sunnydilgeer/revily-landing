import type { TeachingFrame } from '../teachingFrame'

// Follow the glucose from one breakfast: into the blood, used by cells, then brought back down by insulin and stored as
// glycogen. Then read the same story as a graph, and finally see what goes wrong in Type 1 and Type 2 diabetes.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const bloodGlucoseFrames: Record<string, TeachingFrame[]> = {
  'B34-02': [
    f('Glucose from a meal', 'Digested carbohydrate puts glucose into the blood.', 'meal → glucose in the blood', 'At breakfast, Sam eats a bowl of porridge. His gut breaks the carbohydrate down into glucose, a sugar. The glucose passes from the small intestine into the blood.', 'hormone-glucose-meal'),
    f('Cells use glucose', 'Cells take glucose from the blood for respiration.', 'cells use glucose → energy', 'Cells all over the body take glucose out of the blood. They use it for respiration, which transfers the energy they need. So the amount of glucose in the blood slowly falls.', 'hormone-glucose-cells'),
    f('Exercise uses more', 'Exercise makes muscles take much more glucose.', 'exercise → more glucose used', 'When Sam runs for the bus, his muscles work harder. They need more energy for respiration. So they take a lot more glucose out of the blood.', 'hormone-glucose-exercise'),
    f('The pancreas checks', 'The pancreas monitors the blood glucose level.', 'pancreas = checks the level', 'Keeping blood glucose steady is part of homeostasis, which you met when you learned how the body keeps conditions steady. The pancreas monitors the blood glucose level all the time. It detects when the level is too high.', 'hormone-glucose-pancreas'),
  ],
  'B34-05': [
    f('Insulin is released', 'When glucose is too high, the pancreas releases insulin.', 'too high → insulin released', 'After breakfast, Sam’s blood glucose level is high. The pancreas detects this and releases the hormone insulin into the blood. The blood carries insulin all around the body.', 'hormone-glucose-insulin'),
    f('Glucose moves into cells', 'Insulin makes glucose move from the blood into cells.', 'insulin → glucose into cells', 'Insulin makes glucose move out of the blood and into cells. Liver cells and muscle cells take in a lot of it. So the level of glucose in the blood falls.', 'hormone-glucose-into-cells'),
    f('Stored as glycogen', 'Liver and muscle cells store glucose as glycogen.', 'glucose → glycogen, a store', 'Inside liver and muscle cells, many glucose molecules are joined into one large storage molecule. This store is called glycogen. It keeps glucose in the cells for later.', 'hormone-glucose-glycogen'),
    f('Back to normal', 'The blood glucose level falls back to normal.', 'high → insulin → level falls', 'Glucose entered the blood, and the pancreas released insulin. Glucose moved into cells and was stored as glycogen. So the blood glucose level fell back to normal. This happens after every meal.', 'hormone-glucose-all'),
  ],
  'B34-08': [
    f('The axes', 'A graph can show glucose and insulin after a meal.', 'axes: time along, concentration up', 'This graph shows what happens in Sam’s blood after breakfast. Time after the meal, in minutes, runs along the bottom. Concentration in the blood goes up the side, in arbitrary units (a.u.). Arbitrary units let us compare how the lines rise and fall.', 'hormone-graph-axes'),
    f('The glucose line', 'Glucose rises first, then falls.', 'meal → glucose peaks first', 'The glucose line rises soon after the meal. It peaks at about 30 minutes. Then it falls back to its starting level by about 120 minutes.', 'hormone-graph-glucose'),
    f('The insulin line', 'Insulin rises after glucose rises.', 'glucose up → insulin up → glucose down', 'The insulin line rises after the glucose line, and it peaks later, at about 60 minutes. As insulin rises, glucose falls. When glucose is back to normal, the pancreas releases less insulin.', 'hormone-graph-insulin'),
  ],
  'B34-10': [
    f('Diabetes', 'In diabetes, blood glucose is not controlled properly.', 'diabetes = glucose not controlled', 'Some people cannot control their blood glucose level properly. This condition is called diabetes. There are two types: Type 1 and Type 2.', 'hormone-diabetes-what'),
    f('Type 1', 'In Type 1, the pancreas makes too little insulin, or none.', 'Type 1 = too little insulin', 'In Type 1 diabetes, the pancreas does not make enough insulin. It may make none at all. So glucose stays in the blood, and the level can rise so high that it is life-threatening.', 'hormone-diabetes-type1'),
    f('Insulin injections', 'Type 1 is treated with insulin injections.', 'Type 1 → inject insulin', 'People with Type 1 diabetes inject insulin several times through the day. The injected insulin makes glucose move from the blood into cells. This means glucose is removed from the blood soon after a meal.', 'hormone-diabetes-injection'),
    f('Type 2', 'In Type 2, cells do not respond properly to insulin.', 'Type 2 = cells do not respond', 'In Type 2 diabetes, the pancreas still makes insulin, but the body’s cells do not respond to it properly. This is called being resistant to insulin. Being obese, which means very overweight, increases the chance of Type 2.', 'hormone-diabetes-type2'),
    f('Controlling Type 2', 'Type 2 is controlled by diet and exercise.', 'Type 2 → diet + exercise', 'A carbohydrate-controlled diet means carefully measuring how much carbohydrate is eaten. This limits how much glucose enters the blood. Regular exercise also helps, because working muscles use up glucose.', 'hormone-diabetes-type2-treat'),
  ],
}
