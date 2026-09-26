'use client'

import { useEffect, useRef } from 'react'
import { mountLadderPlayer } from './ladderEngine'
import './ladderPlayer.css'

/** The animated BIDMAS ladder lesson. The player manages its own DOM inside this container. */
export default function LadderPlayer() {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!root.current) return
    return mountLadderPlayer(root.current)
  }, [])
  return <div className="lp" ref={root} />
}
