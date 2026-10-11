'use client'

/** The chance board's play screens (probability and statistics); see the board below. */
export type ChanceBoardSpec = { mode: 'scale' | 'tree' | 'spin' | 'average' }

export function ChanceBoard({ spec }: { spec: ChanceBoardSpec }) {
  return <div className="angle-board" data-mode={spec.mode} />
}
