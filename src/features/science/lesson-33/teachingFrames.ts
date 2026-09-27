import type { TeachingFrame } from '../teachingFrame'

// Follow one hormone from its gland, through the blood, to its target organ; then place the six glands on the body;
// then compare hormones with nerves.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const hormonesFrames: Record<string, TeachingFrame[]> = {
  'B33-02': [
    f('Chemical messengers', 'Hormones are chemicals that carry messages around the body.', 'hormone = chemical messenger', 'Your body does not send every message as a nerve impulse. Some messages are chemicals made by glands. A chemical messenger like this is called a hormone.', 'hormone-route-hormone'),
    f('Endocrine glands', 'Glands release hormones straight into the blood.', 'gland → straight into the blood', 'A gland releases its hormone directly into the blood, not through a tube. A gland that does this is called an endocrine gland. Together, these glands make up the endocrine system.', 'hormone-route-gland'),
    f('Carried in the blood', 'The blood carries hormones all around the body.', 'released → carried everywhere', 'Once a hormone is in the blood, the blood carries it all around the body. It travels dissolved in the plasma. You met plasma when you learned about blood.', 'hormone-route-blood'),
    f('Target organs', 'Only certain organs respond to a hormone.', 'reaches most organs, only targets respond', 'A hormone reaches almost every organ, but only some of them respond to it. An organ that responds to a hormone is called a target organ. Other organs do not respond.', 'hormone-route-target'),
    f('Put it together', 'Gland → blood → target organ.', 'gland → blood → target organ', 'A gland releases a hormone straight into the blood. The blood carries it around the body. Only its target organs respond. Next, you will see where the main glands are.', 'hormone-route-all'),
  ],
  'B33-05': [
    f('The pituitary gland', 'The pituitary gland is the “master gland”.', 'pituitary → controls other glands', 'The pituitary gland is a small gland under the brain. It releases several hormones. Many of them act on other glands and make them release their own hormones. So it is often called the master gland.', 'hormone-glands-pituitary'),
    f('The thyroid gland', 'The thyroid gland releases thyroxine.', 'thyroid → thyroxine → metabolism', 'The thyroid gland is in the neck. It releases a hormone called thyroxine. Thyroxine helps control the rate of metabolism, which is how quickly reactions happen in your cells. It also affects heart rate and body temperature.', 'hormone-glands-thyroid'),
    f('The adrenal glands', 'The adrenal glands release adrenaline.', 'adrenaline = fight or flight', 'There are two adrenal glands, one on top of each kidney. They release a hormone called adrenaline. Adrenaline gets the body ready to act at a scary or exciting moment. This is called the “fight or flight” response.', 'hormone-glands-adrenal'),
    f('The pancreas', 'The pancreas releases insulin.', 'pancreas → insulin → blood glucose', 'The pancreas sits just below the stomach. It releases a hormone called insulin. Insulin helps control the amount of glucose in the blood. You will learn how in the next lesson.', 'hormone-glands-pancreas'),
    f('Ovaries and testes', 'Ovaries release oestrogen; testes release testosterone.', 'ovaries → oestrogen; testes → testosterone', 'Females have two ovaries, which release oestrogen. Oestrogen is involved in the menstrual cycle. Males have two testes, which release testosterone. Testosterone controls puberty and sperm production in males.', 'hormone-glands-sex'),
    f('Put it together', 'Six glands, each with its own hormones.', 'gland → hormone → job', 'Each gland releases its own hormones, and each hormone has its own target organs. The key under the drawing lists all six glands. Use it to link each gland to its hormone and its job.', 'hormone-glands-all'),
  ],
  'B33-09': [
    f('Nerves', 'Nerves carry fast electrical impulses.', 'nerves = fast, short, precise', 'You met neurones when you learned about the nervous system. They carry electrical impulses very fast. The effect lasts a very short time. It happens in a precise area, such as one muscle.', 'hormone-compare-nerves'),
    f('Hormones', 'Hormones act more slowly, but for longer.', 'hormones = slower, longer, general', 'Hormones travel in the blood, so they act more slowly than nerves. Their effects usually last for longer. They can reach many organs, so they act in a more general way.', 'hormone-compare-hormones'),
    f('Which one?', 'Quick jobs use nerves; long-lasting jobs use hormones.', 'fast → nerves; long-lasting → hormones', 'Pulling your hand away from a hot pan needs a fast, precise response, so nerves control it. Changing at puberty takes years, so hormones control it. Hormones also keep blood glucose steady all day.', 'hormone-compare-all'),
  ],
}
