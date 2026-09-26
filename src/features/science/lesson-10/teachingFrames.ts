import type { TeachingFrame } from '../teachingFrame'

// Follow one breath: nose or mouth, trachea, bronchi, alveoli, then into the blood.
// One new word per screen. Plain meaning first, then the GCSE term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const lungsFrames: Record<string, TeachingFrame[]> = {
  'B10-02': [
    f('Breathe in', 'Air goes in through your nose or mouth and down a tube in your neck.', 'one tube into the chest', 'In Lesson 9, digested food passed into your blood. Your cells also need oxygen, and it comes from the air. When you breathe in, air enters through your nose or mouth. It travels down a wide tube in your neck. This tube is called the trachea.', 'lung-airway-trachea'),
    f('The tube splits in two', 'The trachea splits into two tubes, one for each lung.', 'one branch for each lung', 'At the bottom of the trachea, the tube splits into two. One branch goes into each lung. These two branches are called the bronchi. Just one of them is called a bronchus.', 'lung-airway-bronchi'),
    f('Branching again and again', 'Inside each lung, the bronchi branch into smaller and smaller tubes.', 'more branches reach more of the lung', 'Inside each lung, each bronchus branches many times, like the branches of a tree. So air is carried to every part of the lung, not just the middle. Some books call these smaller tubes bronchioles.', 'lung-airway-branches'),
    f('The end of the line', 'The smallest tubes end in tiny air sacs.', 'millions of sacs all through the lung', 'Each of the smallest tubes ends in a bunch of tiny air sacs. One air sac is called an alveolus. Many of them are called alveoli. The branching tubes carry air to millions of alveoli.', 'lung-airway-alveoli'),
    f('Put the route together', 'Air goes from the trachea to the bronchi, then to the alveoli.', 'trachea, bronchi, smaller tubes, alveoli', 'When you breathe in, air goes down the trachea, then into the bronchi. Then it passes through smaller and smaller tubes. Finally it reaches the alveoli. This is where oxygen leaves the air.', 'lung-airway-alveoli'),
  ],
  'B10-05': [
    f('Air meets blood', 'Each alveolus is wrapped in tiny blood vessels.', 'air on one side, blood on the other', 'Tiny blood vessels wrap around every alveolus like a net. These tiny vessels are called capillaries. So the air in an alveolus sits very close to the blood.', 'lung-alveolus-network'),
    f('Oxygen goes in', 'Oxygen moves from the air in the alveolus into the blood.', 'lots of oxygen to less oxygen', 'Fresh air in an alveolus has lots of oxygen. Blood arriving at the lungs has less oxygen. So oxygen spreads from the air into the blood. This spreading from lots to less is diffusion, which you met in Lesson 6.', 'lung-alveolus-oxygen'),
    f('Carbon dioxide comes out', 'Carbon dioxide moves from the blood into the alveolus.', 'the opposite way', 'Your cells make carbon dioxide as a waste gas. Blood arriving at the lungs carries lots of it, and the air in the alveolus has less. So carbon dioxide diffuses out of the blood into the alveolus. Then you breathe it out.', 'lung-alveolus-carbon'),
    f('Put it together', 'Two gases swap places across the walls.', 'oxygen in, carbon dioxide out', 'Oxygen diffuses from the alveolus into the blood. At the same time, carbon dioxide diffuses from the blood into the alveolus. This swap of gases is called gas exchange.', 'lung-alveolus-exchange'),
  ],
  'B10-08': [
    f('A huge surface', 'Millions of alveoli give a very large surface area.', 'more surface, more gas crosses at once', 'Each alveolus is tiny, but your lungs have millions of them. All their surfaces added together make a very large surface area. So lots of oxygen can cross into the blood at the same time.', 'lung-adaptation-area'),
    f('Very thin walls', 'The walls of the alveolus and the capillary are very thin.', 'short distance, fast crossing', 'The wall of an alveolus is only one cell thick. The capillary wall next to it is also one cell thick. So gases only travel a very short distance. A short distance makes diffusion faster.', 'lung-adaptation-thin'),
    f('A good blood supply', 'Blood keeps flowing past every alveolus.', 'blood carries oxygen away', 'Blood flows through the capillaries all the time. It carries oxygen-rich blood away and brings in blood with less oxygen. So the blood next to the alveolus always has less oxygen than the air. The difference stays big, so oxygen keeps diffusing in.', 'lung-alveolus-network'),
  ],
  'B10-11': [
    f('In and out', 'Breathing moves air in and out of the lungs.', 'fresh air in, used air out', 'Each time you breathe in, fresh air flows into the alveoli. Each time you breathe out, used air leaves. Moving air in and out of the lungs like this is called ventilation.', 'lung-adaptation-supply'),
    f('Keep the difference big', 'Ventilation keeps lots of oxygen in the alveoli.', 'fresh air keeps oxygen high', 'Without fresh air, the oxygen in an alveolus would soon run low. Then less oxygen would diffuse into the blood. Ventilation keeps bringing in fresh air and taking away carbon dioxide. So the difference stays big for both gases. When you run, you breathe faster and deeper, so fresh air comes in even faster.', 'lung-adaptation-supply'),
    f('Put it together', 'Four features make gas exchange in the lungs fast.', 'area, thin walls, blood flow, ventilation', 'Millions of alveoli give a large surface area. Thin walls make the distance short. Blood flow and ventilation keep the difference big. Then the oxygen-rich blood goes to the heart next, which you will follow in the next lesson.', 'lung-alveolus-network'),
  ],
}
