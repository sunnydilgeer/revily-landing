import type { TeachingFrame } from '../teachingFrame'

// Meet the parts of the nervous system on one body, follow one response (a goalkeeper's save) from stimulus to
// response, zoom in on the gap between two neurones, then see how a reflex skips the thinking brain.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const nervousSystemFrames: Record<string, TeachingFrame[]> = {
  'B31-02': [
    f('The CNS', 'Your brain and spinal cord form the CNS.', 'CNS = brain + spinal cord', 'Your nervous system lets you react to your surroundings and coordinates your behaviour. At its centre are your brain and your spinal cord. Together they are called the central nervous system, or CNS.', 'nerve-ns-cns'),
    f('Receptors', 'Different receptors detect different stimuli.', 'eyes → light; ears → sound', 'Receptors detect stimuli, as you saw when you learned about homeostasis. Different receptors detect different stimuli. Receptors in your eyes detect light, and receptors in your ears detect sound. Receptors in your skin detect touch.', 'nerve-ns-receptors'),
    f('Neurones', 'Nerve cells carry electrical impulses.', 'neurone = nerve cell', 'Long, thin nerve cells connect the CNS to the rest of your body. Information travels along them as electrical impulses. Nerve cells are called neurones.', 'nerve-ns-neurones'),
    f('Sensory neurones', 'Sensory neurones carry impulses to the CNS.', 'sensory: receptor → CNS', 'Some neurones carry impulses from receptors to the CNS. These are called sensory neurones.', 'nerve-ns-sensory'),
    f('Motor neurones', 'Motor neurones carry impulses away from the CNS.', 'motor: CNS → effector', 'Other neurones carry impulses from the CNS out to effectors. These are called motor neurones.', 'nerve-ns-motor'),
    f('Effectors', 'Muscles and glands are effectors.', 'muscles contract; glands release hormones', 'Effectors respond to impulses and bring about a change. Muscles respond by contracting, which means getting shorter. Glands respond by releasing hormones.', 'nerve-ns-effectors'),
  ],
  'B31-05': [
    f('The stimulus', 'Receptors in the eyes detect the ball.', 'stimulus → receptor', 'A football flies towards a goalkeeper. Light from the moving ball is the stimulus. Light receptors in the goalkeeper’s eyes detect it.', 'nerve-path-receptor'),
    f('To the CNS', 'Sensory neurones carry impulses to the CNS.', 'receptor → sensory neurone → CNS', 'The receptors send electrical impulses along sensory neurones to the brain. The brain is part of the CNS.', 'nerve-path-sensory'),
    f('The CNS decides', 'The CNS coordinates a response.', 'CNS = coordination centre', 'The CNS receives the information and decides what to do. This is called coordinating a response. Here, the brain decides to move the goalkeeper’s arms.', 'nerve-path-cns'),
    f('Out to the effectors', 'Motor neurones carry impulses to the muscles.', 'CNS → motor neurone → effector', 'Impulses travel from the CNS along motor neurones to the arm muscles. The muscles are the effectors. They contract, and the arms move up.', 'nerve-path-motor'),
    f('Put it together', 'Stimulus to response, one step at a time.', 'stimulus → receptor → sensory → CNS → motor → effector → response', 'The goalkeeper catches the ball. This is the response. Responses like this follow the same route: stimulus, receptor, sensory neurone, CNS, motor neurone, effector, response.', 'nerve-path-all'),
  ],
  'B31-08': [
    f('A tiny gap', 'Two neurones meet at a synapse.', 'synapse = where two neurones connect', 'Where one neurone ends and the next one starts, there is a tiny gap. The connection between two neurones is called a synapse. The electrical impulse cannot jump across the gap.', 'nerve-syn-gap'),
    f('Chemicals released', 'The impulse makes the neurone release chemicals.', 'impulse arrives → chemicals out', 'An impulse arrives at the end of the first neurone. This makes the neurone release chemicals into the gap.', 'nerve-syn-release'),
    f('Across the gap', 'The chemicals diffuse across the gap.', 'chemicals spread across', 'The chemicals spread out across the gap. They move by diffusion, which you met when you learned how substances move into and out of cells.', 'nerve-syn-diffuse'),
    f('A new impulse', 'The chemicals set off a new impulse.', 'chemicals → new impulse', 'The chemicals reach the start of the next neurone. They set off a new electrical impulse there. The impulse then carries on along the next neurone.', 'nerve-syn-new'),
  ],
  'B31-11': [
    f('Reflexes', 'A reflex is a fast, automatic response.', 'reflex = automatic, no thinking', 'You grab a rose stem and a thorn pricks your finger. Your hand pulls away before you even think about it. An automatic response like this is called a reflex. Reflexes are very quick, so they help stop you getting hurt.', 'nerve-reflex-quick'),
    f('Into the spinal cord', 'A sensory neurone carries impulses to the spinal cord.', 'receptor → sensory neurone', 'Receptors in the skin of your finger detect the prick of the thorn. Impulses travel along a sensory neurone, up your arm to your spinal cord.', 'nerve-reflex-sensory'),
    f('The relay neurone', 'A relay neurone passes the impulses on.', 'relay: sensory → motor', 'In the spinal cord, the impulses cross a synapse to a relay neurone. Relay neurones connect sensory neurones to motor neurones. They are found in the CNS.', 'nerve-reflex-relay'),
    f('Out to the muscle', 'A motor neurone carries impulses to a muscle.', 'motor neurone → effector', 'The impulses cross another synapse to a motor neurone. The motor neurone carries them to a muscle in your arm, the effector. The muscle contracts and pulls your hand away.', 'nerve-reflex-motor'),
    f('The reflex arc', 'The path of a reflex is called a reflex arc.', 'receptor → sensory → relay → motor → effector', 'The path from receptor to effector in a reflex is called a reflex arc. It goes through the spinal cord or a part of the brain you are not aware of. The thinking part of your brain is not involved, so the response is fast.', 'nerve-reflex-arc'),
  ],
}
