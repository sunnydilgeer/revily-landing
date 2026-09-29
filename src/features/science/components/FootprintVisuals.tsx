// Chemistry diagrams. Every focus id here starts with 'footprint-' and is routed from CellBiologyVisuals.tsx.
// Reuse the Chemistry palette and particle helpers exported from AtomVisuals.tsx.
export function FootprintVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  return <p>Missing diagram: {focus}</p>
}
