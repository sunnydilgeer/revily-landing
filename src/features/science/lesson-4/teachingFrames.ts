import type { TeachingFrame } from '../teachingFrame'

// Big idea first: a cell's shape and parts fit its job. Then an animal team, a plant team,
// and how a cell becomes specialised. One new word per screen. Plain meaning first, then the term.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const specialisationFrames: Record<string, TeachingFrame[]> = {
  'B4-02': [
    f('Cells look different', 'Not every cell looks like the simple cells you drew.', 'different shapes → different cells', 'In Lesson 3 you looked at real cells under a microscope. Your body has many other kinds of cell too. Some look very different, like this long, branched nerve cell.', 'nerve'),
    f('Each cell has a job', 'A cell’s job is called its function.', 'every cell → a job to do', 'Each kind of cell has a job to do in the body or the plant. In Lesson 1 you met the word for a job: function. A muscle cell’s function is to help you move.', 'muscle'),
    f('Shape fits the job', 'A cell’s shape and parts help it do its job.', 'shape + parts → fit the job', 'Many cells have a special shape or extra parts. These help them do their job well. A cell with a shape and parts suited to one job is called a specialised cell.', 'sperm'),
    f('Explain a feature', 'Name the feature, say what it does, then link it to the job.', 'feature → how it helps → job', 'To explain a specialised cell, name one feature. Say what that feature does. Then link it to the cell’s job. Next, you will use this on three animal cells and three plant cells.', 'sperm'),
  ],
  'B4-04': [
    f('A sperm cell swims', 'A sperm’s job is to reach an egg and join with it.', 'tail + mitochondria → swim to the egg', 'A sperm’s job is to reach an egg and join with it. Its long tail moves to push it through liquid. Swimming needs energy, so the middle is packed with mitochondria. Enzymes in its head help it get into the egg.', 'sperm'),
    f('Nerve cells carry signals', 'Nerve cells carry electrical signals called impulses.', 'signals → parts of the body communicate', 'A nerve cell’s job is to carry electrical signals around the body. These signals let different parts of your body communicate. They are called impulses.', 'nerve'),
    f('A long fibre', 'A long fibre lets impulses travel a long way.', 'long fibre → impulses go far', 'A nerve cell has one very long, thin fibre. So impulses can travel a long way, for example from your spine to your toes. This long fibre is called an axon. Branched ends connect with many other cells.', 'nerve'),
    f('Muscle cells contract', 'Muscle cells get shorter to move parts of the body.', 'shorten → pull → move', 'A muscle cell’s job is to make part of the body move. When it gets shorter, it pulls on that part. Getting shorter is called contracting. Contracting needs energy, so muscle cells have many mitochondria.', 'muscle'),
    f('Put the animal team together', 'Each animal cell’s features fit its job.', 'feature → how it helps → job', 'A sperm has a tail to swim and mitochondria for energy. A nerve cell has a long axon and branched ends to carry impulses. A muscle cell contracts, with many mitochondria for energy.', 'sperm'),
  ],
  'B4-08': [
    f('Root hair cells take in water', 'A root hair gives the cell more surface to take in water.', 'long hair → more surface → more water in', 'A plant takes in water from the soil. A root hair cell has a long, hair-like part that reaches between soil particles. The hair is part of the same cell. This gives it more surface area. More water and mineral ions can enter from the soil. It is underground, so it usually has no chloroplasts.', 'root'),
    f('Water moves up in xylem', 'Xylem cells form hollow tubes that carry water up.', 'no end walls → hollow tube → water flows up', 'Next, the water must travel up the stem to the leaves. It flows through long tubes made of dead cells joined end to end. The cells have no contents and no end walls, so the tube is hollow. These cells are called xylem.', 'xylem'),
    f('Strong walls', 'Lignin makes xylem walls strong.', 'strong walls → hold the plant up', 'The walls of xylem cells contain a tough substance. It makes the walls strong, so xylem also helps hold the plant up. This substance is called lignin.', 'xylem'),
    f('Food moves in phloem', 'Phloem cells carry sugar from the leaves.', 'pores in end walls → sugar passes through', 'Leaves make sugar by photosynthesis. Long, living cells joined end to end carry the dissolved sugar to other parts, such as the roots. Their end walls have small holes, called pores, so the sugar can pass through. These cells are called phloem.', 'phloem'),
    f('Put the plant team together', 'Water goes in and up; sugar goes from the leaves to other parts.', 'root hair → xylem → leaves; leaves → phloem', 'Root hair cells take water in from the soil. Xylem carries water and mineral ions up to the leaves. Phloem carries sugar from the leaves to other parts of the plant. Each cell’s shape fits its part of the job.', 'plant-transport-map'),
  ],
  'B4-12': [
    f('Cells start plain', 'Early on, cells are not suited to any one job.', 'plain cells → no job yet', 'A plant or animal starts life as a small group of cells that are all alike. These cells do not have a special shape or extra parts yet. They are called unspecialised cells.', 'differentiate'),
    f('Becoming specialised', 'A cell gains the shape and parts it needs for one job.', 'plain cell → gains parts → specialised cell', 'As the organism develops, each cell gains the shape and parts it needs for one job. For example, a cell may grow a tail or a long fibre. So it becomes a specialised cell. This change is called differentiation.', 'differentiate'),
    f('Animals: mostly early', 'Most animal cells differentiate early in development.', 'animals → early', 'Most types of animal cell differentiate early, while the animal is still developing. After that, most of its cells stay the type they became. Just growing bigger is not differentiation.', 'muscle'),
    f('Plants: all through life', 'Many plant cells can differentiate all through the plant’s life.', 'plants → all through life', 'Many plant cells can still differentiate throughout the plant’s life. So as a plant grows, it can keep making new xylem, phloem and root hair cells.', 'xylem'),
    f('Put it together', 'An unspecialised cell differentiates into a specialised cell.', 'unspecialised → differentiation → specialised', 'An unspecialised cell differentiates to become a specialised cell. Most animal cells do this early. Many plant cells can do it all through their life. In the next lesson you will see how new cells are made.', 'differentiate'),
  ],
}
