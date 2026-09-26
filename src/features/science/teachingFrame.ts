/* One step of a teaching walkthrough: the words, and which part of the diagram it points at. */
export type TeachingFrame = {
  label: string; summary: string; cue: string; text: string;
  part?: 'membrane' | 'cytoplasm' | 'nucleus' | 'mitochondria' | 'ribosomes'; diagram?: 'plant' | 'bacterium' | 'scale' | 'comparison' | 'microscopy' | 'practical' | 'cellBiology'; focus?: string
}

export const plantPartIds = ['membrane', 'cytoplasm', 'nucleus', 'mitochondria', 'ribosomes', 'wall', 'vacuole', 'chloroplast']
