// Chemistry diagrams. Every focus id here starts with 'rfval-' and is routed from CellBiologyVisuals.tsx.
// Reuse the Chemistry palette and particle helpers exported from AtomVisuals.tsx.
export function RfVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  return <p>Missing diagram: {focus}</p>
}
