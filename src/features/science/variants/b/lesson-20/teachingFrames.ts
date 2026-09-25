import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Every disease answers the same four questions: cause, signs, spread, stop. The cards join into one grid.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const humanDiseaseFrames: Record<string, TeachingFrame[]> = {
  'B20-02': [
    f('A barbecue goes wrong', 'Undercooked chicken can cause food poisoning.', 'food → illness', 'A family eats chicken that is not cooked all the way through. Hours later, two of them feel very ill. The cause is Salmonella, a type of bacterium.', 'disease-salmonella-cause'),
    f('Signs of Salmonella', 'Toxins from the bacteria cause the symptoms.', 'toxins → symptoms', 'Symptoms are the signs of an illness. Salmonella causes fever, stomach cramps, vomiting and diarrhoea. Toxins made by the bacteria cause these symptoms. You met toxins in Lesson 19.', 'disease-salmonella-signs'),
    f('How it spreads', 'It spreads in food and on dirty hands.', 'in food, on hands', 'You can catch it by eating food that already contains Salmonella, such as chicken infected while alive. You can also catch it from food prepared in an unclean kitchen.', 'disease-salmonella-spread'),
    f('How it is stopped', 'Farm birds are vaccinated, and kitchens stay clean.', 'vaccinate birds, clean kitchens', 'Poultry means chickens, turkeys and other farm birds. In the UK, most poultry are vaccinated against Salmonella. This controls the spread to people. Clean hands and kitchens help too.', 'disease-salmonella-stop'),
  ],
  'B20-05': [
    f('Another bacterial disease', 'Gonorrhoea is passed on by sexual contact.', 'STD = sexually transmitted disease', 'Gonorrhoea is caused by bacteria. It is a sexually transmitted disease, or STD. An STD is passed on by sexual contact, such as sex without a condom.', 'disease-gonorrhoea-cause'),
    f('Signs of gonorrhoea', 'A thick discharge and pain when urinating.', 'discharge = fluid coming out', 'Discharge means fluid coming out of the body. Gonorrhoea can cause a thick yellow or green discharge from the vagina or penis. It can also cause pain when urinating.', 'disease-gonorrhoea-signs'),
    f('Treating gonorrhoea', 'It used to be treated with penicillin.', 'antibiotics kill bacteria', 'Antibiotics are medicines that kill bacteria. Gonorrhoea used to be treated with an antibiotic called penicillin. You will find out more about antibiotics in Lesson 24.', 'disease-gonorrhoea-treat'),
    f('Resistant strains', 'Penicillin no longer kills many types of gonorrhoea.', 'resistant = not killed', 'There are now many strains, or types, of gonorrhoea that are resistant to penicillin. Resistant means penicillin no longer kills them. So doctors use other antibiotics instead.', 'disease-gonorrhoea-resistant'),
    f('How it is stopped', 'Condoms block the bacteria.', 'barrier → cannot pass on', 'Barrier methods of contraception, such as condoms, stop the bacteria passing between people. Treating people with the right antibiotic also stops them passing it on.', 'disease-gonorrhoea-stop'),
  ],
  'B20-08': [
    f('A viral disease', 'Measles spreads like a cold.', 'droplets → breathed in', 'Measles is caused by a virus. It spreads like a cold. People breathe in droplets from an infected person’s coughs and sneezes.', 'disease-measles-cause'),
    f('Signs of measles', 'A fever and a red rash.', 'fever = high temperature', 'People with measles get a fever. A fever is a high temperature. They also get a red skin rash.', 'disease-measles-signs'),
    f('Why vaccination matters', 'Measles can be serious, so children are vaccinated.', 'serious → vaccinate young', 'Measles can lead to other problems, called complications. Complications can kill. So most young children are vaccinated against measles.', 'disease-measles-stop'),
  ],
  'B20-11': [
    f('Another viral disease', 'HIV spreads through sexual contact and blood.', 'body fluids', 'HIV is a virus. It spreads by sexual contact, or when body fluids such as blood pass between people. Sharing needles is one way this can happen.', 'disease-hiv-cause'),
    f('The first weeks', 'A flu-like illness, then often no symptoms.', 'flu-like, then quiet', 'At first, HIV causes a flu-like illness for a few weeks. After that, a person may have no symptoms for several years.', 'disease-hiv-signs'),
    f('Keeping HIV under control', 'Antiretroviral drugs stop the virus copying itself.', 'stop the copying', 'Antiretroviral drugs control HIV. They stop the virus copying itself in the body. People taking them can stay well for many years.', 'disease-hiv-stop'),
    f('If HIV is not controlled', 'HIV attacks immune cells.', 'fewer defences → other illnesses', 'Without treatment, HIV attacks immune cells. These cells help fight pathogens. You will meet them in Lesson 22. If the immune system is badly damaged, the body cannot cope with other infections or cancers. This late stage is called AIDS.', 'disease-hiv-late'),
  ],
  'B20-13': [
    f('Put the cards together', 'Two are bacteria, two are viruses, and each spreads its own way.', 'route → stop', 'Salmonella and gonorrhoea are caused by bacteria. Measles and HIV are caused by viruses. Each one spreads in its own way, so each is stopped in its own way.', 'disease-grid'),
  ],
}
