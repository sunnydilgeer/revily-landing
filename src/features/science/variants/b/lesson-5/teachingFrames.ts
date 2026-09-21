// Variant B: simpler teaching copy. Visual targets and step order match Variant A.
import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

export const divisionFrames: Record<string, TeachingFrame[]> = {
  "B5-02": [
    {
      "label": "Inside a body cell",
      "summary": "Chromosomes carry genetic information.",
      "cue": "Think: cell, nucleus, DNA",
      "text": "The nucleus contains chromosomes. Each chromosome is made of a long DNA molecule. That DNA contains many genes.",
      "diagram": "cellBiology",
      "focus": "chromosomes"
    },
    {
      "label": "DNA and genes",
      "summary": "A gene is a section of DNA.",
      "cue": "Think: cell, nucleus, DNA",
      "text": "Look at the highlighted section. It represents one gene. A gene is part of the DNA and carries genetic information.",
      "diagram": "cellBiology",
      "focus": "chromosomes"
    },
    {
      "label": "Usually in pairs",
      "summary": "A pair contains two chromosomes.",
      "cue": "Think: cell, nucleus, DNA",
      "text": "Human body cells normally have 23 pairs: 46 chromosomes altogether. This diagram only shows two pairs, so you can see them clearly.",
      "diagram": "cellBiology",
      "focus": "pairs"
    }
  ],
  "B5-05": [
    {
      "label": "First: grow and copy",
      "summary": "The cell grows and copies its DNA.",
      "cue": "Think: copy, separate, divide",
      "text": "Before dividing, the cell grows. It makes more parts, including mitochondria and ribosomes. It copies its DNA. This copying is called replication.",
      "diagram": "cellBiology",
      "focus": "cycle-copy"
    },
    {
      "label": "A copied chromosome",
      "summary": "A copied chromosome has two joined DNA copies.",
      "cue": "Think: copy, separate, divide",
      "text": "The two joined parts contain identical DNA copies. They separate later, giving a copy to each new cell. Chromosomes are not always X-shaped.",
      "diagram": "cellBiology",
      "focus": "cycle-copy"
    }
  ],
  "B5-07": [
    {
      "label": "Then: mitosis",
      "summary": "The chromosome copies separate.",
      "cue": "Think: what changes, units, evidence",
      "text": "During mitosis, one complete chromosome set moves to each end of the cell. New nuclei form around the sets. They contain the same genetic information.",
      "diagram": "cellBiology",
      "focus": "cycle-separate"
    },
    {
      "label": "A complete set at each end",
      "summary": "Each new nucleus gets a complete set.",
      "cue": "Think: what changes, units, evidence",
      "text": "The cell copied its DNA first. There is now a complete set of instructions for each new nucleus. Neither receives only half the instructions.",
      "diagram": "cellBiology",
      "focus": "cycle-separate"
    }
  ],
  "B5-09": [
    {
      "label": "Finally: two cells",
      "summary": "The cell splits into two daughter cells.",
      "cue": "Think: copy, separate, divide",
      "text": "The cytoplasm and membrane divide. The two new cells are called daughter cells. They are genetically identical. Each has the original chromosome number from before DNA copying.",
      "diagram": "cellBiology",
      "focus": "cycle-daughters"
    },
    {
      "label": "Same number, more cells",
      "summary": "The chromosome number stays the same in each new cell.",
      "cue": "Think: copy, separate, divide",
      "text": "The starting cell had two chromosomes. Their DNA was copied. Each daughter gets a complete set: two chromosomes, not four.",
      "diagram": "cellBiology",
      "focus": "cycle-daughters"
    }
  ],
  "B5-12": [
    {
      "label": "Growing and developing",
      "summary": "More cells help an organism grow.",
      "cue": "Think: copy, separate, divide",
      "text": "Multicellular means made of many cells. Repeated cell cycles produce more cells for growth and development. Each cell grows before it divides.",
      "diagram": "cellBiology",
      "focus": "cycle-daughters"
    },
    {
      "label": "Maintaining mature tissues",
      "summary": "New cells replace old ones and help repair tissue.",
      "cue": "Think: feature → how it helps → job",
      "text": "Skin cells wear out. Cell division makes new cells to replace them. It also produces cells that help repair damaged tissue.",
      "diagram": "cellBiology",
      "focus": "repair"
    }
  ],
  "B5-14": [
    {
      "label": "Meet embryonic stem cells",
      "summary": "Stem cells have not yet become specialised.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "A stem cell is undifferentiated: not yet specialised. It can divide to make more stem cells. Early human embryo stem cells can form most human cell types.",
      "diagram": "cellBiology",
      "focus": "stem-embryo"
    },
    {
      "label": "Division or differentiation?",
      "summary": "Making more cells is not the same as specialising.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "Division makes more stem cells. This is self-renewal. Differentiation changes a stem cell into a specialised cell with a particular job.",
      "diagram": "cellBiology",
      "focus": "stem-embryo"
    }
  ],
  "B5-16": [
    {
      "label": "Meet bone-marrow stem cells",
      "summary": "Some adult stem cells are found inside bones.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "Bone marrow is tissue inside bones. Its stem cells can form several cell types, including blood cells. Their range is smaller than that of embryonic stem cells.",
      "diagram": "cellBiology",
      "focus": "stem-marrow"
    },
    {
      "label": "Not every adult cell is a stem cell",
      "summary": "Most adult cells are already specialised.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "Some adult tissues keep stem cells for repair and replacement. A specialised nerve cell is not a stem cell. Not all adult cells can form every cell type.",
      "diagram": "cellBiology",
      "focus": "stem-marrow"
    }
  ],
  "B5-18": [
    {
      "label": "Meet a plant meristem",
      "summary": "Plant growing tips contain stem cells.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "Meristems are growing regions at root and shoot tips. Their stem cells can form any type of plant cell throughout the plant’s life.",
      "diagram": "cellBiology",
      "focus": "stem-meristem"
    },
    {
      "label": "Cloning useful plants",
      "summary": "Clones are genetically identical copies.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "Meristem stem cells can make many cloned plants quickly and cheaply. This can preserve rare species or produce crops with useful features, such as disease resistance.",
      "diagram": "cellBiology",
      "focus": "stem-meristem"
    }
  ],
  "B5-20": [
    {
      "label": "Possible medical benefits",
      "summary": "Stem cells could supply replacement cells.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "Stem cells could form nerve cells for paralysis or insulin-producing cells for diabetes. These might replace damaged or faulty cells. These are possible uses, not guaranteed cures. Benefits need evidence.",
      "diagram": "cellBiology",
      "focus": "stem-benefits"
    },
    {
      "label": "Risks and objections",
      "summary": "A medical risk is different from an ethical objection.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "Stem cells could pass a viral infection to a patient. That is a medical risk. Some people object to using embryos for ethical or religious reasons: beliefs about right and wrong.",
      "diagram": "cellBiology",
      "focus": "stem-risks"
    },
    {
      "label": "Therapeutic cloning",
      "summary": "Matching genes helps avoid rejection.",
      "cue": "Think: where found, what cells they can form, limits",
      "text": "Therapeutic cloning makes an embryo with the patient’s genes. Its stem cells can produce cells for treatment. The patient’s body does not reject these matching cells. Other treatment risks remain.",
      "diagram": "cellBiology",
      "focus": "therapeutic"
    }
  ]
}
