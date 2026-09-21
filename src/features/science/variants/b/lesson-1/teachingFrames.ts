// Variant B: simpler teaching copy. Visual targets and step order match Variant A.
import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

export const teachingFrames: Record<string, TeachingFrame[]> = {
  "B1-02": [
    {
      "label": "Meet an animal cell",
      "summary": "Animals are made of tiny living units called cells.",
      "cue": "Think: parts with different jobs",
      "text": "Your body is made of cells. Each cell has smaller parts called sub-cellular structures. Each part has a job. We call this its function."
    },
    {
      "label": "The cell membrane",
      "part": "membrane",
      "summary": "Controls what enters and leaves the cell.",
      "cue": "Think: the cell boundary",
      "text": "The membrane is the thin boundary around a cell. Useful substances enter through it. Waste substances leave through it."
    },
    {
      "label": "The cytoplasm",
      "part": "cytoplasm",
      "summary": "Many chemical reactions happen here.",
      "cue": "Think: reactions inside the cell",
      "text": "Cytoplasm is the jelly-like material inside a cell. Chemical reactions happen here. These reactions change substances and help the cell stay alive."
    },
    {
      "label": "The nucleus",
      "part": "nucleus",
      "summary": "Holds the cell’s genetic instructions.",
      "cue": "Think: genetic instructions",
      "text": "The nucleus contains DNA. DNA is genetic material: it carries instructions for how the cell works. These instructions help control the cell’s activities."
    }
  ],
  "B1-05": [
    {
      "label": "Mitochondria release energy",
      "part": "mitochondria",
      "summary": "Releases energy from food.",
      "cue": "Think: respiration → released energy",
      "text": "Cells need energy to work. Much of this energy is released from food in mitochondria. The process uses oxygen. It is called aerobic respiration. Energy is released, not created."
    },
    {
      "label": "Ribosomes make proteins",
      "part": "ribosomes",
      "summary": "Makes proteins for the cell.",
      "cue": "Think: ribosomes → proteins",
      "text": "Cells need proteins to build parts and do their work. Ribosomes make these proteins. Making proteins is called protein synthesis. The dots represent ribosomes."
    },
    {
      "label": "Put the animal cell together",
      "summary": "Five cell parts, five jobs.",
      "cue": "Think: name the part and its job",
      "text": "Membrane: controls entry and exit. Cytoplasm: chemical reactions. Nucleus: genetic instructions. Mitochondria: aerobic respiration. Ribosomes: protein synthesis. These are typical animal-cell parts. Some specialised cells differ."
    }
  ],
  "B1-24": [
    {
      "label": "Meet a plant cell",
      "summary": "Plant cells have familiar parts too.",
      "cue": "Think: familiar parts, new jobs",
      "text": "Find the membrane, cytoplasm and nucleus. This plant cell also has a wall, a large vacuole and chloroplasts. It is an example of a cell that photosynthesises.",
      "diagram": "plant"
    },
    {
      "label": "The plant-cell membrane",
      "summary": "Controls what enters and leaves.",
      "cue": "Think: membrane inside the wall",
      "text": "The membrane sits just inside the wall. It controls which substances cross into or out of the cell. The wall has a different job: support.",
      "diagram": "plant",
      "focus": "membrane"
    },
    {
      "label": "The plant-cell cytoplasm",
      "summary": "Chemical reactions happen here.",
      "cue": "Think: material around the structures",
      "text": "Cytoplasm surrounds the parts inside the cell. The large vacuole fills much of the centre. Much of the cytoplasm is nearer the edges.",
      "diagram": "plant",
      "focus": "cytoplasm"
    },
    {
      "label": "The plant-cell nucleus",
      "summary": "Holds genetic instructions.",
      "cue": "Think: the same job as in animals",
      "text": "The plant-cell nucleus contains DNA. It helps control the cell’s activities, just as an animal-cell nucleus does. Here it sits beside the vacuole.",
      "diagram": "plant",
      "focus": "nucleus"
    }
  ],
  "B1-42": [
    {
      "label": "Plant cells need mitochondria",
      "summary": "Plant cells release energy from food too.",
      "cue": "Think: plants respire",
      "text": "Photosynthesis makes food. Plant cells still need to release energy from that food. Aerobic respiration in mitochondria releases energy for the cell’s work.",
      "diagram": "plant",
      "focus": "mitochondria"
    },
    {
      "label": "Plant cells need ribosomes",
      "summary": "Plant cells need proteins too.",
      "cue": "Think: protein synthesis",
      "text": "Ribosomes make proteins. Plant cells use these proteins to build parts and carry out reactions. Making proteins is called protein synthesis.",
      "diagram": "plant",
      "focus": "ribosomes"
    },
    {
      "label": "The cell wall supports the cell",
      "summary": "Strengthens and supports the cell.",
      "cue": "Think: wall → strength and support",
      "text": "The cell wall is outside the membrane. Plant and algal walls contain cellulose, a strong material. Animal cells have no cell wall.",
      "diagram": "plant",
      "focus": "wall"
    },
    {
      "label": "The permanent vacuole",
      "summary": "Holds a watery liquid called cell sap.",
      "cue": "Think: vacuole → cell sap",
      "text": "The permanent vacuole is a space inside a plant cell. It holds cell sap: water with dissolved substances. Cytoplasm surrounds this separate space.",
      "diagram": "plant",
      "focus": "vacuole"
    },
    {
      "label": "Chloroplasts absorb light",
      "summary": "Uses light to make food.",
      "cue": "Think: light → photosynthesis",
      "text": "Photosynthesis happens in chloroplasts. They contain chlorophyll, a green pigment that absorbs light. Root cells usually have no chloroplasts.",
      "diagram": "plant",
      "focus": "chloroplast"
    },
    {
      "label": "Put the plant cell together",
      "summary": "Five familiar parts and three extra parts.",
      "cue": "Think: structure → function",
      "text": "This cell shares five parts with typical animal cells. Its wall supports it. Its vacuole holds cell sap. Its chloroplasts carry out photosynthesis. Not every plant cell has chloroplasts.",
      "diagram": "plant"
    }
  ],
  "B1-41": [
    {
      "label": "What do both cells have?",
      "summary": "Typical animal and plant cells share five parts.",
      "cue": "Think: shared parts, shared jobs",
      "text": "Both have a membrane, cytoplasm, nucleus, mitochondria and ribosomes. These parts do the same jobs in both cells. Compare the parts, not just the cell’s shape.",
      "diagram": "comparison"
    },
    {
      "label": "What is different?",
      "summary": "This plant cell has extra parts.",
      "cue": "Think: a paired comparison",
      "text": "This plant cell has a wall, permanent vacuole and chloroplasts. Typical animal cells have no wall or chloroplasts. Some plant cells, such as root cells, also have no chloroplasts.",
      "diagram": "comparison",
      "focus": "differences"
    }
  ],
  "B1-27": [
    {
      "label": "Meet a bacterial cell",
      "summary": "Bacteria are usually much smaller cells.",
      "cue": "Think: a different cell layout",
      "text": "A bacterium has a membrane, cytoplasm and ribosomes. It has DNA but no nucleus. This drawing is enlarged to show its parts, not its real size.",
      "diagram": "bacterium"
    },
    {
      "label": "The bacterial cell wall",
      "summary": "Supports the cell.",
      "cue": "Think: support outside the membrane",
      "text": "The bacterial wall is outside the membrane. It supports the cell. Unlike a plant cell wall, it is not made of cellulose.",
      "diagram": "bacterium",
      "focus": "wall"
    },
    {
      "label": "The bacterial cell membrane",
      "summary": "Controls what enters and leaves.",
      "cue": "Think: the same membrane function",
      "text": "The membrane sits inside the wall. It controls movement into and out of the cell. This is the same job as in animal and plant cells.",
      "diagram": "bacterium",
      "focus": "membrane"
    },
    {
      "label": "Cytoplasm and ribosomes",
      "summary": "Cytoplasm: reactions. Ribosomes: proteins.",
      "cue": "Think: two familiar functions",
      "text": "Bacteria have cytoplasm where reactions happen. Their ribosomes make proteins. Bacteria have no mitochondria or chloroplasts.",
      "diagram": "bacterium",
      "focus": "ribosomes"
    },
    {
      "label": "The bacterial DNA loop",
      "summary": "A loop of DNA carries genetic instructions.",
      "cue": "Think: DNA without a nucleus",
      "text": "The main DNA forms a loop in the cytoplasm. It is not inside a nucleus. Bacteria have DNA even though they have no nucleus.",
      "diagram": "bacterium",
      "focus": "dna"
    },
    {
      "label": "Some bacteria also have plasmids",
      "summary": "Small extra rings of DNA.",
      "cue": "Think: extra DNA rings",
      "text": "Plasmids are separate from the main DNA loop. They carry extra genes, or genetic instructions. Some bacteria have plasmids; others do not.",
      "diagram": "bacterium",
      "focus": "plasmids"
    }
  ],
  "B1-22": [
    {
      "label": "Cells with a nucleus: eukaryotic",
      "summary": "Eukaryotic cells have genetic material inside a nucleus.",
      "cue": "Think: genetic material in a nucleus",
      "text": "Typical animal and plant cells have a nucleus around their genetic material. We call these cells eukaryotic. This names a type of cell, not a cell part.",
      "diagram": "comparison"
    },
    {
      "label": "Bacterial cells: prokaryotic",
      "summary": "Bacterial DNA is not inside a nucleus.",
      "cue": "Think: genetic material without a nucleus",
      "text": "Bacteria are prokaryotic cells. Their main DNA loop is in the cytoplasm, not a nucleus. Where the DNA is held is the key difference.",
      "diagram": "bacterium",
      "focus": "dna"
    }
  ],
  "B1-29": [
    {
      "label": "Measuring tiny cells",
      "summary": "1 mm = 1000 µm.",
      "cue": "Think: mm × 1000 → µm",
      "text": "A micrometre is one thousandth of a millimetre. We write it as µm. Convert mm to µm: multiply by 1000. Convert µm to mm: divide by 1000.",
      "diagram": "scale"
    },
    {
      "label": "Compare sizes in the same unit",
      "summary": "Use the same units, then divide.",
      "cue": "Think: larger diameter ÷ smaller diameter",
      "text": "Example diameters: animal cell 20 µm; bacterium 2 µm. Calculate 20 ÷ 2 = 10. The animal cell’s diameter is 10 times larger. Actual cell sizes vary.",
      "diagram": "scale"
    },
    {
      "label": "What is an order of magnitude?",
      "summary": "Each order of magnitude is a factor of 10.",
      "cue": "Think: ×10, then ×10 again",
      "text": "A diameter 10 times larger differs by one order of magnitude. A diameter 100 times larger differs by two: 10 × 10. Compare diameters in the same units.",
      "diagram": "scale"
    },
    {
      "label": "Writing small sizes in standard form",
      "summary": "Standard form is a short way to write numbers.",
      "cue": "Think: a is at least 1 but less than 10",
      "text": "Write a number as a × 10ⁿ. The first number must be at least 1 but less than 10. Example: 0.002 mm = 2 × 10⁻³ mm. Here, 10⁻³ means 0.001.",
      "diagram": "scale"
    }
  ]
}
