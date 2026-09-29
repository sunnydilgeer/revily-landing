import { type ReactNode } from 'react'

export function EmDangerVisual({ focus, assessment = false }: { focus: string; assessment?: boolean }) {
  void assessment
  const views: Record<string, () => ReactNode> = {}
  return <>{views[focus]?.() ?? null}</>
}
