import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

// Follow one group of bacteria from a door handle: every entrance is guarded; the few that get in through a cut
// meet white blood cells, which attack in three ways. Toxins (Lesson 19) set up antitoxins at the end.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const defenceFrames: Record<string, TeachingFrame[]> = {
  'B22-02': [
    f('Bacteria on a door handle', 'Your body has defences at every way in.', 'every entrance is guarded', 'A school door handle can carry millions of bacteria. Some of them are pathogens. Your body has defences that keep most of them out.', 'defence-body-overview'),
    f('Skin', 'Skin is a barrier that covers your body.', 'barrier = blocks the way', 'Skin covers your body like a barrier. It stops pathogens getting inside. Skin also releases substances that kill pathogens.', 'defence-body-skin'),
    f('Nose', 'Hairs and mucus in the nose trap particles.', 'mucus = sticky trap', 'Mucus is a sticky liquid that traps particles. Hairs and mucus in your nose trap particles that could contain pathogens.', 'defence-body-nose'),
    f('Airways', 'The trachea and bronchi make mucus too.', 'mucus lines the airways', 'Air reaches your lungs through the trachea and bronchi. You met these in Lesson 10. They make mucus, which traps pathogens before they reach the lungs.', 'defence-airway-mucus'),
    f('Cilia', 'Tiny hairs sweep the mucus away.', 'cilia sweep upwards', 'Cilia are tiny hair-like structures lining the trachea and bronchi. They sweep the mucus up to the back of the throat. There it is swallowed.', 'defence-airway-cilia'),
    f('Stomach', 'Stomach acid kills swallowed pathogens.', 'acid kills', 'Your stomach makes hydrochloric acid. The acid kills most pathogens that you swallow in food, drink or mucus.', 'defence-body-stomach'),
  ],
  'B22-06': [
    f('Through a cut', 'A cut lets a few bacteria inside.', 'barrier broken → immune system', 'A cut breaks the skin barrier, and a few bacteria get inside. Now your immune system attacks them. The immune system is the part of your body that attacks pathogens inside you.', 'defence-wbc-cut'),
    f('White blood cells', 'White blood cells attack pathogens in three ways.', 'three ways to attack', 'White blood cells are a key part of the immune system. You met them in Lesson 13. They attack pathogens in three ways.', 'defence-wbc-cells'),
    f('Way 1: swallow it', 'A white blood cell surrounds a pathogen and digests it.', 'surround → digest', 'Some white blood cells surround a pathogen and then digest it. This is called phagocytosis.', 'defence-wbc-phago'),
  ],
  'B22-08': [
    f('Antigens', 'Every pathogen has its own surface molecules.', 'antigen = on the pathogen', 'Every pathogen has unique molecules on its surface. These are called antigens.', 'defence-antibody-antigen'),
    f('Way 2: antibodies', 'Antibodies lock onto antigens.', 'antibody = made by white blood cells', 'Some white blood cells make antibodies. Antibodies lock onto the antigens. This helps other white blood cells find and destroy the pathogen.', 'defence-antibody-antibody'),
    f('One antibody, one antigen', 'Each antibody fits only one type of antigen.', 'specific = fits one only', 'Each antibody is specific. It fits only one type of antigen. An antibody against one pathogen will not lock onto a different one.', 'defence-antibody-specific'),
    f('Way 3: antitoxins', 'Antitoxins stop toxins working.', 'antitoxin = against a toxin', 'These bacteria make toxins. You met toxins in Lesson 19. White blood cells make antitoxins, which stop the toxins working.', 'defence-antitoxin'),
    f('Three ways together', 'Swallow it, antibodies, antitoxins.', 'three ways', 'White blood cells swallow pathogens, make antibodies against them and make antitoxins against their toxins. Together these clear the bacteria from the cut.', 'defence-wbc-summary'),
  ],
}
