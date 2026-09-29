// Chemistry diagrams. Every focus id here starts with 'ghg-' and is routed from CellBiologyVisuals.tsx.
// Reuse the Chemistry palette and particle helpers exported from AtomVisuals.tsx.
export function GreenhouseVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  return <p>Missing diagram: {focus}</p>
}
