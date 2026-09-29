import { type ReactNode } from 'react'

export function IrEmitVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {}
  return <>{views[focus]?.() ?? null}</>
}
