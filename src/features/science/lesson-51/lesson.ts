import type { ScienceLesson, ScienceState } from '../types'
import { author, sampledRequirements } from '../lessonAuthoring'
import { biodiversityFrames as frames } from './teachingFrames'

const source = { id: 'aqa-biology', title: 'AQA 8464 Biology subject content', url: 'https://www.aqa.org.uk/subjects/science/gcse/science-8464/specification/biology-subject-content', locator: '4.7.3.1 Biodiversity: meaning, stability of ecosystems, human dependence on it; 4.7.3.2 Waste management: population, standard of living, pollution in water, on land and in air' }
const a = author('B-BIODIVERSITY', ['4.7.3.1', '4.7.3.2'])
const t = (id: keyof typeof frames, title: string) => a.teach(id, title, frames[id])

export const biodiversitySections = [
  { id: 'B51-01', label: 'Start here', detail: 'Living things that depend on each other' },
  { id: 'B51-02', label: 'What is biodiversity?', detail: 'Variety, links and stability' },
  { id: 'B51-05', label: 'Why is biodiversity falling?', detail: 'More people, more resources' },
  { id: 'B51-08', label: 'Where does pollution go?', detail: 'Water, land and air' },
  { id: 'B51-11', label: 'On your own', detail: 'Ponds, a river survey and a growing town' },
]

const states: ScienceState[] = [
  { ...a.choice('B51-01', 'A thrush eats caterpillars from an oak tree and nests in it. What is it called when species rely on each other?', ['Interdependence', 'Photosynthesis', 'Evaporation', 'Decay'], 0, 'You met this idea when you learned about communities.', ['The thrush needs the tree and the caterpillars, and the caterpillars need the tree.', 'Species in a community relying on each other is called interdependence.']), phase: 'priorKnowledge', evidenceRole: 'diagnostic' },
  t('B51-02', 'What is biodiversity?'),
  a.choice('B51-03', 'What is biodiversity?', ['The number of individuals of one species', 'The variety of different species on Earth or in an ecosystem', 'The amount of food in an ecosystem'], 1, 'Think about how many different kinds of living thing there are.', ['Biodiversity is about how many different species there are, not how many of one kind.', 'It is the variety of different species on Earth or in an ecosystem.']),
  a.choice('B51-04', 'Why is an ecosystem with high biodiversity more stable?', ['Each species has many others to depend on, not just a few', 'Every animal eats only one kind of food', 'There are no predators in it'], 0, 'Think about the fox when the rabbits disappeared.', ['With many species, each one has several sources of food and shelter.', 'So if one species is lost, the others can still survive, and the ecosystem stays stable.']),
  t('B51-05', 'Why is biodiversity falling?'),
  a.choice('B51-06', 'Why does a higher standard of living mean more resources are used?', ['People need less food', 'Fewer things are made', 'Each person wants more things, and making them uses raw materials and energy'], 2, 'What does a higher standard of living mean people want?', ['A higher standard of living means people want more things, such as cars and computers.', 'Making those things uses more raw materials and energy.']),
  a.choice('B51-07', 'Why is it important for humans to keep a good level of biodiversity?', ['It makes the human population grow faster', 'It stops all pollution', 'It makes the weather warmer', 'Humans depend on other species to survive'], 3, 'What do humans get from other living things?', ['Humans rely on other species, for example for food.', 'So humans depend on a good level of biodiversity to survive.']),
  t('B51-08', 'Where does pollution go?'),
  a.choice('B51-09', 'Look at the numbered places. Which one shows a source of air pollution?', ['Place 1', 'Place 2', 'Place 3', 'Place 4'], 1, 'Air pollution rises into the air.', ['Places 1, 3 and 4 show pipes, a landfill site and a sprayer, which pollute water and land.', 'Place 2 is smoke from the factory chimney, which pollutes the air.'], 'understanding', false, 'earth-pollution-question'),
  a.choice('B51-10', 'Rain washes fertiliser from a field into a river. What kind of pollution is this?', ['Air pollution', 'Land pollution', 'Water pollution'], 2, 'Where does the fertiliser end up?', ['The fertiliser is carried off the field by rain.', 'It ends up in the river, so this is water pollution.']),
  a.choice('B51-11', 'Pond A has 4 species; Pond B has 30. One insect species dies in each. Which is more likely to stay stable?', ['Pond A, because it has fewer species to feed', 'Pond B, because each species has more others to depend on', 'Both ponds change by the same amount'], 1, 'Which pond has higher biodiversity?', ['Pond B has higher biodiversity, so animals that ate the insect have other food.', 'So Pond B is more likely to stay stable.'], 'application', true),
  a.choice('B51-12', 'A pipe leaks sewage into a river. Students counted the kinds of small animal at three places. Which conclusion fits their results?', ['Sewage kills every animal in the river', 'The same number of kinds was found at every place', 'All rivers with pipes have low biodiversity', 'In this survey, fewer kinds of animal were found at the pipe than upstream'], 3, 'Only say what these three counts show.', ['They found 12 kinds upstream, 3 at the pipe and 7 further downstream; some animals were still found at the pipe.', 'One survey of one river cannot show what happens in all rivers. In this survey, fewer kinds were found at the pipe than upstream.'], 'dataInterpretation', true, 'earth-survey-data'),
  a.choice('B51-13', 'A town’s population doubles, and people’s standard of living rises. What is most likely to happen?', ['Less waste is produced', 'Resources are replaced faster than they are used', 'More resources are used and more waste is produced'], 2, 'More people, each wanting more things.', ['More people, each wanting more things, use more raw materials and energy.', 'So more resources are used and more waste is produced.'], 'application', true),
  a.written('B51-14', 'Explain how a growing human population can lead to a fall in biodiversity.', 'Think about what more people need, what they throw away, and what that does to other species.', 'More people need more resources, and many want a higher standard of living, so even more raw materials and energy are used. People take more land for building and farming, leaving less space for other species. More waste is produced, and if it is not handled properly it pollutes water, land and air. Pollution and loss of land kill plants and animals, so the number of different species falls.', ['More people need more resources, such as food, materials and energy.', 'A higher standard of living means even more resources are used.', 'More land is used by people, leaving less for other species.', 'More waste is produced, which can cause pollution of water, land or air.', 'Pollution and loss of land kill plants and animals, so biodiversity falls.'], ['Saying biodiversity means the number of people.', 'Saying pollution only happens in the air.', 'Saying more people always increases biodiversity.'])
]

export const lesson51: ScienceLesson = {
  id: 'B-ECO-051-B', contentVersion: '0.1.0', qualification: 'AQA-8464F', strand: 'biology',
  title: 'Biodiversity and waste', prerequisites: ['B-MATERIAL-CYCLES'], reviewStatus: 'draftNeedsTeacherReview',
  sources: [source], misconceptions: [], states, retrieval: [], requirements: sampledRequirements(states),
}
