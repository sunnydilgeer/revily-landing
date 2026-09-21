// Variant B: simpler teaching copy. Visual targets and step order match Variant A.
import type { TeachingFrame } from '../../../lesson-1/teachingFrames'

export const transportFrames: Record<string, TeachingFrame[]> = {
  "B6-02": [
    {
      "label": "Meet diffusion",
      "summary": "Particles spread from higher to lower concentration overall.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "Concentration means how much of a substance is in a given volume. Particles move randomly. More leave a higher-concentration region than return. This overall movement is diffusion.",
      "diagram": "cellBiology",
      "focus": "diffusion"
    },
    {
      "label": "Net does not mean one-way",
      "summary": "Net means overall, not one-way.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "Particles move both ways. Net movement is higher to lower concentration. At equal concentrations, particles still move, but the movements balance. There is no net movement.",
      "diagram": "cellBiology",
      "focus": "diffusion"
    }
  ],
  "B6-04": [
    {
      "label": "Diffusion in living things",
      "summary": "Gases move where their concentration is lower.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "A concentration gradient is a difference in concentration. Cells use oxygen, keeping its concentration low. Oxygen can diffuse in from blood. Cells produce carbon dioxide. Where its concentration is higher inside cells, it can diffuse out into blood.",
      "diagram": "cellBiology",
      "focus": "diffusion-examples"
    },
    {
      "label": "Waste leaves cells too",
      "summary": "Dissolved waste can diffuse too.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "Urea is a dissolved waste substance. It can diffuse into blood plasma, the liquid part of blood. Blood carries it to the kidneys for excretion, or removal from the body.",
      "diagram": "cellBiology",
      "focus": "diffusion-examples"
    }
  ],
  "B6-06": [
    {
      "label": "A steeper concentration gradient",
      "summary": "A bigger concentration difference makes diffusion faster.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "A bigger concentration difference is a steeper gradient. More particles move overall each second. Diffusion is faster. Keep temperature and surface area the same when comparing gradients.",
      "diagram": "cellBiology",
      "focus": "diffusion-rate"
    },
    {
      "label": "Temperature and area",
      "summary": "Warmer particles move faster; more area allows more crossing.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "Higher temperature gives particles more energy, so they move faster. A larger membrane area lets more particles cross at once. For a fair test, change only one factor.",
      "diagram": "cellBiology",
      "focus": "diffusion-rate"
    }
  ],
  "B6-08": [
    {
      "label": "Meet osmosis",
      "summary": "Water can cross a partially permeable membrane.",
      "cue": "Think: water, membrane, overall direction",
      "text": "Partially permeable means some substances can pass through, but others cannot. Here, water can pass but the dissolved substance cannot. That dissolved substance is called a solute.",
      "diagram": "cellBiology",
      "focus": "osmosis"
    },
    {
      "label": "Dilute to concentrated",
      "summary": "Water moves overall from dilute to concentrated solution.",
      "cue": "Think: water, membrane, overall direction",
      "text": "Dilute means less dissolved solute in a given volume. Water moves overall from a more dilute to a more concentrated solution. It crosses a partially permeable membrane. This is osmosis.",
      "diagram": "cellBiology",
      "focus": "osmosis"
    },
    {
      "label": "Water keeps moving",
      "summary": "Water keeps moving in both directions.",
      "cue": "Think: water, membrane, overall direction",
      "text": "Equal amounts of water crossing each way give no net movement. The water molecules have not stopped. Their overall movements balance.",
      "diagram": "cellBiology",
      "focus": "osmosis"
    }
  ],
  "B6-11": [
    {
      "label": "Plant tissue gains water",
      "summary": "A more dilute outside solution can make tissue gain mass.",
      "cue": "Think: water, membrane, overall direction",
      "text": "Compare outside with inside. If the outside solution is more dilute, water enters cells by osmosis. The extra water increases the tissue’s mass.",
      "diagram": "cellBiology",
      "focus": "tissue-gain"
    },
    {
      "label": "Plant tissue loses water",
      "summary": "A more concentrated outside solution can make tissue lose mass.",
      "cue": "Think: water, membrane, overall direction",
      "text": "If the outside solution is more concentrated, water leaves cells by osmosis. The tissue loses water, so its mass decreases. Direction depends on outside compared with inside.",
      "diagram": "cellBiology",
      "focus": "tissue-loss"
    }
  ],
  "B6-13": [
    {
      "label": "Meet active transport",
      "summary": "Moves substances from lower to higher concentration.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "Root hairs need mineral ions for growth. Ion concentration may be lower in soil than inside the cell. Active transport can move ions into the cell against this gradient.",
      "diagram": "cellBiology",
      "focus": "active"
    },
    {
      "label": "Energy from respiration",
      "summary": "Active transport needs energy from respiration.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "The cell uses energy to move substances against their gradient, from lower to higher concentration. Respiration releases this energy. Diffusion and osmosis do not need energy from respiration.",
      "diagram": "cellBiology",
      "focus": "active"
    }
  ],
  "B6-15": [
    {
      "label": "Sugar uptake in the gut",
      "summary": "Active transport helps absorb sugar into the blood.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "Sugar can move from a lower concentration in the gut to a higher concentration in blood. Active transport allows this. Blood then carries the sugar to cells for respiration.",
      "diagram": "cellBiology",
      "focus": "gut-active"
    },
    {
      "label": "Now compare three processes",
      "summary": "Compare what moves, its direction and its energy needs.",
      "cue": "Think: how concentrated, which direction, energy",
      "text": "Diffusion: particles move overall from higher to lower concentration. Osmosis: water moves from dilute to concentrated through a partially permeable membrane. Active transport: lower to higher concentration, using energy from respiration.",
      "diagram": "cellBiology",
      "focus": "transport-compare"
    }
  ],
  "B6-18": [
    {
      "label": "Small bodies exchange easily",
      "summary": "A small cell has lots of surface compared with its volume.",
      "cue": "Think: surface area, distance, supply",
      "text": "A single-celled organism exchanges materials across its outer surface. That surface is large compared with its volume. It can supply enough material for the cell’s needs.",
      "diagram": "cellBiology",
      "focus": "ratio"
    },
    {
      "label": "Scaling up changes the ratio",
      "summary": "Larger bodies have less surface for each unit of volume.",
      "cue": "Think: surface area, distance, supply",
      "text": "A 1 cm cube has area 6 cm² and volume 1 cm³: 6:1. A 2 cm cube has 24 cm² and 8 cm³: 3:1. Volume grows faster than surface area.",
      "diagram": "cellBiology",
      "focus": "ratio"
    },
    {
      "label": "Larger organisms need help",
      "summary": "Large organisms need exchange surfaces and transport systems.",
      "cue": "Think: surface area, distance, supply",
      "text": "Multicellular means made of many cells. Large organisms have less outer surface per unit of volume. Internal cells are farther away. Exchange surfaces take in supplies. Transport systems carry them to cells.",
      "diagram": "cellBiology",
      "focus": "ratio"
    }
  ],
  "B6-21": [
    {
      "label": "Lungs: many alveoli",
      "summary": "Many tiny air sacs give the lungs a large area.",
      "cue": "Think: surface area, distance, supply",
      "text": "Alveoli are tiny air sacs. Their large total area and thin walls help gases diffuse quickly. Breathing replaces air. Blood flow carries gases. Both maintain concentration differences.",
      "diagram": "cellBiology",
      "focus": "exchange-lung"
    },
    {
      "label": "Intestine: many villi",
      "summary": "Small projections give the intestine more area.",
      "cue": "Think: surface area, distance, supply",
      "text": "Villi are small projections in the intestine. They increase surface area for absorption. Their thin surface gives a short crossing distance. Blood carries substances away, maintaining gradients for diffusion.",
      "diagram": "cellBiology",
      "focus": "exchange-intestine"
    }
  ],
  "B6-23": [
    {
      "label": "Fish: gills",
      "summary": "Thin gill surfaces help gases cross.",
      "cue": "Think: surface area, distance, supply",
      "text": "Many surfaces give gills a large area. Their thinness gives a short diffusion path. Flowing water supplies oxygen. Blood carries it away, maintaining the concentration gradient.",
      "diagram": "cellBiology",
      "focus": "exchange-gill"
    },
    {
      "label": "Plants: roots",
      "summary": "Root hairs give more surface for uptake.",
      "cue": "Think: feature → how it helps → job",
      "text": "The long extension touches more soil solution. Water enters by osmosis. Mineral ions can enter by active transport, using energy from respiration.",
      "diagram": "cellBiology",
      "focus": "root"
    },
    {
      "label": "Plants: leaves",
      "summary": "Leaf pores let gases pass through.",
      "cue": "Think: surface area, distance, supply",
      "text": "Stomata are small pores in leaves. Carbon dioxide diffuses through them and internal air spaces to photosynthesising cells. Thin, moist cell surfaces give a large area and short diffusion paths.",
      "diagram": "cellBiology",
      "focus": "exchange-leaf"
    }
  ],
  "B6-25": [
    {
      "label": "Required practical 2: prepare digitally",
      "summary": "Test how solution concentration affects plant-tissue mass.",
      "cue": "Think: what changes, units, evidence",
      "text": "Use different salt or sugar concentrations and measure tissue mass changes. Do the real practical in school with your teacher and a risk-assessed method. Use prepared tissue. Cutting and lab solutions are not home tasks.",
      "diagram": "cellBiology",
      "focus": "practical-setup"
    },
    {
      "label": "Measure before and after",
      "summary": "Weigh before soaking and after blotting.",
      "cue": "Think: what changes, units, evidence",
      "text": "Record the initial mass. Soak for a set time. Gently blot surface liquid away, then record the final mass. Blotting removes droplets that would add extra mass.",
      "diagram": "cellBiology",
      "focus": "practical-setup"
    },
    {
      "label": "Make it a fair comparison",
      "summary": "Change concentration; keep other conditions the same.",
      "cue": "Think: what changes, units, evidence",
      "text": "Keep tissue type, dimensions, solution volume, time and temperature the same. Repeat and calculate a mean, or average. This lesson prepares you for required practical 2; it does not replace doing it.",
      "diagram": "cellBiology",
      "focus": "practical-setup"
    }
  ],
  "B6-30": [
    {
      "label": "From measurements to percentages",
      "summary": "Express the mass change as a percentage.",
      "cue": "Think: what changes, units, evidence",
      "text": "Change = final mass − initial mass. Divide by initial mass, then multiply by 100. Positive means gain; negative means loss. Percentages compare different starting masses. These are example data, not real measurements.",
      "diagram": "cellBiology",
      "focus": "practical-data"
    },
    {
      "label": "Concentration on the horizontal axis",
      "summary": "Put concentration across and percentage change up the graph.",
      "cue": "Think: what changes, units, evidence",
      "text": "Label both axes with units. Use evenly spaced scales. Include gains and losses. Plot the points. Draw a suitable trend line to show the overall pattern.",
      "diagram": "cellBiology",
      "focus": "practical-graph"
    },
    {
      "label": "A zero crossing",
      "summary": "At 0% change, water gain and loss balance overall.",
      "cue": "Think: what changes, units, evidence",
      "text": "Where the trend crosses 0%, there is no net water gain or loss. Water still moves both ways. Use repeats and a mean to make the estimated concentration more reliable.",
      "diagram": "cellBiology",
      "focus": "practical-graph"
    }
  ],
  "B6-33": [
    {
      "label": "Try plotting one point",
      "summary": "Use the table to choose a point.",
      "cue": "Think: what changes, units, evidence",
      "text": "At 0.2 mol/dm³, mass change is +5%. Select +5% and plot. The point uses these two values. This optional practice does not submit an assessed answer.",
      "diagram": "cellBiology",
      "focus": "plot"
    },
    {
      "label": "Rates need time",
      "summary": "Rate means change per unit of time.",
      "cue": "Think: what changes, units, evidence",
      "text": "A sample gains 0.20 g in 40 minutes. Divide gain by time: 0.20 ÷ 40 = 0.005 g/min. Use the gain, not the final mass.",
      "diagram": "cellBiology",
      "focus": "uptake-rate"
    }
  ]
}
