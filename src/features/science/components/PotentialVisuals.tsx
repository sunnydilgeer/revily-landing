// Physics diagrams (Lesson 4). Every focus id here starts with 'gpe-' and is routed from CellBiologyVisuals.tsx.
// Draw with the Physics kit exported from PhysicsKit.tsx (physicsPalette, circuit symbols, EnergyStoreBadge, TransferArrow, GraphAxes).
// Until a focus id is drawn this returns null, so check-science-lesson.cjs reports it as a missing diagram.
export function PotentialVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void focus
  void assessment
  return null
}
