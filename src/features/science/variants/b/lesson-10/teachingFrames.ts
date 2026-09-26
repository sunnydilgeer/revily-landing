import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({
  label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus,
})

export const lungsFrames: Record<string, TeachingFrame[]> = {
  'B10-02': [
    f('The airway begins', 'Air enters through the nose or mouth and travels down the trachea.', 'one route into the chest', 'The trachea is the main airway. It carries air towards the lungs and is kept open so air can move freely.', 'lung-airway-trachea'),
    f('The route branches', 'The trachea splits into two bronchi, one leading to each lung.', 'one airway divides between two lungs', 'Inside each lung, a bronchus branches into smaller airways. These are often called bronchioles, but the required route here focuses on the trachea, bronchi and alveoli.', 'lung-airway-bronchi'),
    f('Air reaches the alveoli', 'The smaller airways end in tiny air sacs called alveoli.', 'air finishes at the gas-exchange surface', 'The alveoli are where oxygen and carbon dioxide move between air and blood. Follow the required route from the trachea, through the bronchi and smaller airways, to the alveoli.', 'lung-airway-alveoli'),
  ],
  'B10-05': [
    f('Air meets blood', 'Each alveolus is surrounded by a network of tiny capillaries.', 'air on one side, blood on the other', 'Blood arriving at the lungs has less oxygen and more carbon dioxide than the air in an alveolus. The close capillary network brings blood beside the air sacs.', 'lung-alveolus-network'),
    f('Oxygen enters the blood', 'Oxygen diffuses from the air in an alveolus into the blood.', 'movement from higher to lower concentration', 'Fresh air in the alveolus has a higher oxygen concentration than the arriving blood. The net movement of oxygen is into the blood, down its concentration gradient.', 'lung-alveolus-oxygen'),
    f('Carbon dioxide leaves the blood', 'Carbon dioxide diffuses from the blood into the alveolus.', 'the opposite direction', 'Arriving blood has a higher carbon dioxide concentration than the alveolar air. Carbon dioxide diffuses into the alveolus and is breathed out.', 'lung-alveolus-carbon'),
  ],
  'B10-08': [
    f('Large surface area', 'Millions of alveoli provide a very large total surface area.', 'more surface for diffusion', 'A large surface area lets many oxygen and carbon dioxide molecules diffuse at the same time.', 'lung-adaptation-area'),
    f('A short diffusion distance', 'The alveolar and capillary walls are very thin.', 'a shorter route makes exchange faster', 'The thin exchange surface gives gas molecules only a short distance to travel between air and blood.', 'lung-adaptation-thin'),
    f('Gradients are maintained', 'Breathing refreshes the air and blood flow carries gases away or brings them in.', 'keep the difference in concentration', 'Ventilation brings in oxygen and removes carbon dioxide. Blood flow brings deoxygenated blood and carries oxygenated blood away. Together they maintain steep concentration gradients.', 'lung-adaptation-supply'),
  ],
}
