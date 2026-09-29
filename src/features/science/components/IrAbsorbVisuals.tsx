import { type ReactNode } from 'react'

export function IrAbsorbVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {}
  return <>{views[focus]?.() ?? null}</>
}
