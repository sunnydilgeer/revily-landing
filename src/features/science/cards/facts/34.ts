import type { ScienceFactSet } from '../types'

export const facts: ScienceFactSet = {
  lessonId: 'B-HOM-034-B',
  sections: {
    'B34-02': [
      ['What makes the blood glucose level rise?', 'Eating carbohydrate. It is digested into glucose, which passes into the blood.'],
      ['What makes the blood glucose level fall?', 'Cells take glucose from the blood for respiration. Exercise makes muscles take a lot more.'],
      ['Which organ monitors blood glucose?', 'The pancreas. It detects when the level is too high.'],
    ],
    'B34-05': [
      ['What does the pancreas do when blood glucose is too high?', 'It releases the hormone insulin into the blood.'],
      ['What does insulin do?', 'It makes glucose move from the blood into cells, so the blood glucose level falls.'],
      ['What is glycogen, and where is it stored?', 'A large storage molecule made from glucose. It is stored in liver and muscle cells.', 'Glycogen is stored in the liver and muscles, not in the pancreas.'],
    ],
    'B34-08': [
      ['On a graph after a meal, which rises first: glucose or insulin?', 'Glucose rises first. Insulin rises after it, in response, and then glucose falls.'],
      ['Why is the insulin peak later than the glucose peak?', 'The pancreas releases insulin only after it detects that glucose is high.'],
    ],
    'B34-10': [
      ['What is Type 1 diabetes, and how is it treated?', 'The pancreas makes too little insulin, or none. It is treated with insulin injections through the day.'],
      ['What is Type 2 diabetes, and how is it controlled?', 'The body’s cells do not respond properly to insulin. It is controlled with a carbohydrate-controlled diet and regular exercise.', 'Type 1 = too little insulin. Type 2 = cells do not respond.'],
      ['What increases the chance of Type 2 diabetes?', 'Being obese, which means very overweight.'],
    ],
  },
  recall: ['B34-06', 'B34-07', 'B34-11', 'B34-12'],
}
