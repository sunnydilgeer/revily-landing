import type { TeachingFrame } from '../teachingFrame'

// Two ideas that both tell the story of life. First how fossils form and why the record has gaps, then how scientists
// sort living things (kingdoms, the seven levels, two-part names), how new evidence gave three domains, and evolutionary trees.
const f = (label: string, summary: string, cue: string, text: string, focus: string): TeachingFrame => ({ label, summary, cue: `Think: ${cue}`, text, diagram: 'cellBiology', focus })

export const fossilFrames: Record<string, TeachingFrame[]> = {
  'B45-02': [
    f('What is a fossil?', 'Fossils are the remains of organisms from long ago.', 'remains kept in rock', 'Fossils are the remains of organisms from millions of years ago. They are found in rocks. Older rock is usually lower down, so it holds older fossils.', 'evolve-fossil-intro'),
    f('Replaced by minerals', 'Most fossils form as minerals slowly replace hard parts.', 'hard parts → minerals → rock', 'Teeth, shells and bones do not decay easily. As they very slowly decay, minerals take their place. This leaves a rock copy of the part. Most fossils form this way.', 'evolve-fossil-minerals'),
    f('Casts and impressions', 'Some fossils are shapes left in soft ground.', 'print in mud → rock', 'A footprint, a burrow or a plant root can be pressed into soft material such as clay. The clay hardens into rock and keeps the shape.', 'evolve-fossil-cast'),
    f('No decay', 'Some remains are kept where decay cannot happen.', 'no oxygen, moisture or warmth → no decay', 'The microorganisms that cause decay need oxygen, moisture, warmth and the right pH. Where one of these is missing, remains may not decay. Insects trapped in amber are kept whole.', 'evolve-fossil-decay'),
    f('Gaps in the record', 'The fossil record is incomplete.', 'soft bodies leave few fossils', 'Many early organisms had soft bodies, so they decayed and left few fossils. Movements of the Earth have also destroyed many fossils. So nobody can be sure how life began.', 'evolve-fossil-gaps'),
  ],
  'B45-06': [
    f('Sorting by features', 'Living things are sorted into groups by their features.', 'more alike → more closely related', 'Scientists sort, or classify, living things into groups. In the past, they used features you can see, such as the number of legs, and the structures inside cells.', 'evolve-class-features'),
    f('Five kingdoms', 'Living things were sorted into five kingdoms.', 'animals, plants, fungi, protists, prokaryotes', 'The biggest groups are called kingdoms. There are five: animals, plants, fungi, protists and prokaryotes. Protists are single cells with a nucleus; prokaryotes are single cells without one.', 'evolve-class-kingdoms'),
    f('Smaller and smaller groups', 'Each kingdom is split into smaller groups.', 'kingdom → phylum → class → order → family → genus → species', 'Carl Linnaeus split living things into smaller and smaller groups: kingdom, phylum, class, order, family, genus and species. Organisms in the same species are the most alike.', 'evolve-class-levels'),
    f('Two-part names', 'Every species has a two-part Latin name.', 'genus first, then species', 'Each species has a two-part name: first the genus, then the species. Humans are Homo sapiens. This is called the binomial system. The genus can be shortened, as in H. sapiens.', 'evolve-class-binomial'),
  ],
  'B45-09': [
    f('New evidence', 'Classification changes as scientists learn more.', 'better microscopes and chemical tests', 'Better microscopes let scientists see inside cells in more detail. They also learned to test the chemicals in cells. This showed some organisms were less closely related than people thought.', 'evolve-class-new'),
    f('Three domains', 'Carl Woese sorted life into three domains.', 'Archaea, Bacteria, Eukaryota', 'Carl Woese used this chemical evidence to sort living things into three domains. Archaea are simple prokaryotes, first found in extreme places such as hot springs. Bacteria are true bacteria.', 'evolve-class-domains'),
    f('Eukaryota', 'Eukaryota include plants, animals, fungi and protists.', 'cells with a nucleus', 'The third domain, Eukaryota, includes plants, animals, fungi and protists. Each domain is then split into kingdom, phylum, class, order, family, genus and species.', 'evolve-class-eukaryota'),
  ],
  'B45-11': [
    f('Evolutionary trees', 'A tree shows how species are related.', 'each split = a common ancestor', 'An evolutionary tree shows how scientists think species are related. Each point where branches split is a common ancestor. Trees are built from classification data and from fossils.', 'evolve-tree-read'),
    f('Closer relatives', 'A more recent common ancestor means a closer relationship.', 'recent ancestor → closely related', 'Whales and dolphins share a recent common ancestor, so they are closely related. Sharks share a much older common ancestor with them, so sharks are more distantly related.', 'evolve-tree-ancestor'),
  ],
}
