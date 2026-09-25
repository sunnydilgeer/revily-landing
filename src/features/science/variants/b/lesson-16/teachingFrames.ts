import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Big idea: a risk factor makes a disease more likely, not certain. Cancer starts when cells divide out of control.
// One new word per frame. Plain meaning first, then the GCSE term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const riskCancerFrames: Record<string, TeachingFrame[]> = {
  'B16-02': [
    f('More likely, not certain', 'A risk factor raises the chance of a disease.', 'chance, not certainty', 'A risk factor is anything that makes a disease more likely. More likely does not mean certain. Some people with a risk factor never get the disease.', 'risk-chance'),
    f('Where risk factors come from', 'Risk factors come from how we live, the environment and our genes.', 'lifestyle, environment, genes', 'Some risk factors are about how people live, such as smoking or diet. Others are in the environment, such as radiation. Some, like the genes we inherit, are not a choice.', 'risk-types'),
    f('Several at once', 'Many diseases have several risk factors.', 'factors add up', 'Many diseases are caused by several risk factors acting together. This is why two people with the same habit can have different health.', 'risk-types'),
  ],
  'B16-04': [
    f('Things that go together', 'A correlation is a pattern where two things go together.', 'pattern in big groups', 'Scientists compare large groups of people. They may find that a factor and a disease often go together. This is called a correlation.', 'risk-correlation'),
    f('A link is not proof', 'A correlation does not prove cause.', 'something else could explain both', 'A correlation does not prove the factor causes the disease. Something else might explain both. Ice cream sales and sunburn both rise in sunny weather.', 'risk-causation'),
    f('Showing how', 'For some factors, scientists know how they cause harm.', 'how it causes harm', 'For some risk factors, scientists have shown how they cause harm. Chemicals in tobacco smoke damage lung cells. For other factors, only the link is known so far.', 'risk-mechanism'),
  ],
  'B16-06': [
    f('Smoking', 'Smoking raises the risk of lung and heart disease.', 'lungs and heart', 'Smoking damages the lungs. It is a risk factor for lung disease and lung cancer. It also raises the risk of cardiovascular disease.', 'risk-smoking'),
    f('Diet and exercise', 'Diet and exercise affect cardiovascular disease.', 'fat in, activity out', 'A diet high in fat and taking little exercise both raise the risk of cardiovascular disease. (You met this in Lesson 14.)', 'risk-diet'),
    f('Obesity', 'Obesity is a risk factor for Type 2 diabetes.', 'extra body fat', 'Obesity means carrying a lot of extra body fat. It is a risk factor for Type 2 diabetes.', 'risk-obesity'),
  ],
  'B16-08': [
    f('Alcohol', 'Drinking a lot of alcohol can damage the liver and brain.', 'how much, how often', 'Drinking a lot of alcohol can damage the liver. It can also affect how the brain works.', 'risk-alcohol'),
    f('Before birth', 'Smoking and alcohol in pregnancy can harm the unborn baby.', 'shared blood supply', 'Smoking and alcohol during pregnancy can harm the unborn baby. The baby shares the mother’s blood supply through the placenta.', 'risk-pregnancy'),
    f('Carcinogens', 'A carcinogen is something that can cause cancer.', 'causes cancer', 'Something that can cause cancer is called a carcinogen. Ionising radiation, such as from X-rays, is one. Some chemicals in tobacco smoke are too.', 'risk-radiation'),
  ],
  'B16-10': [
    f('Normal division', 'Normally, cells divide only when needed.', 'controlled division', 'Normally, cells divide only when the body needs new cells. Each division makes two cells. (You met the cell cycle in Lesson 5.)', 'cycle-daughters'),
    f('Out of control', 'A tumour is a lump of cells dividing out of control.', 'no stop signal', 'Sometimes changes in a cell stop this control. The cell divides again and again. A lump of these cells is called a tumour.', 'cancer-formation'),
  ],
  'B16-12': [
    f('Benign tumours', 'A benign tumour stays in one place.', 'stays put', 'A benign tumour stays in one place. It is usually held inside a membrane. It does not invade other parts of the body.', 'cancer-benign'),
    f('Malignant tumours', 'A malignant tumour can spread and form a secondary tumour.', 'invades and spreads', 'A malignant tumour is a cancer. Its cells invade nearby tissue. They can travel in the blood and form a secondary tumour somewhere else.', 'cancer-malignant'),
    f('Genes and lifestyle', 'Some cancers have lifestyle and genetic risk factors.', 'raises the chance, not certain', 'Scientists have found lifestyle and genetic risk factors for some cancers. Some people inherit genes that raise their risk. This does not mean every person with the gene gets cancer.', 'cancer-genetic'),
  ],
  'B16-14': [
    f('Lowering some risks', 'People can lower some risks, but not every risk.', 'some risks, not all', 'People can lower some risks. Not smoking and protecting skin from the sun lower the risk of some cancers. But no one can remove every risk.', 'cancer-prevention'),
    f('The cost of disease', 'Non-communicable diseases have human and money costs.', 'people, services, countries', 'Non-communicable diseases have human costs, such as pain and shorter lives. They also cost money for families, health services and whole countries.', 'risk-costs'),
  ],
}
