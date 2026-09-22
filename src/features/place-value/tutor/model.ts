export type PlaceVisual =
  | { kind: 'number'; value: string; highlights?: number[]; guideIndex?: number }
  | { kind: 'compare'; values: [string, string] }
  | { kind: 'alignment'; values: string[]; highlightPlace?: number }
  | { kind: 'parts'; parts: string[] }
  | { kind: 'direction' | 'summary' }

export type PlaceLessonVisual = PlaceVisual
  | { kind: 'explore'; value: string; initialIndex: number }
  | { kind: 'zeroes' }
  | { kind: 'equivalent' }
  | { kind: 'worked'; initial: PlaceVisual; steps: Array<{ visual: PlaceVisual; instruction: string; equation?: string }> }

export type PlaceHint = {
  label: string
  text: string
  guide?: { value: string; index: number }
  alignment?: string[]
}
