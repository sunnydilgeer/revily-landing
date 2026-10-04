import type { Metadata } from 'next'
import GeneDetective from '../../../../src/features/science/labs/gene/GeneDetective'

export const metadata: Metadata = {
  title: 'Gene Detective | Revily Science Arcade',
  description: 'Crack NHS newborn genome cases: chromosomes and meiosis, Punnett squares, cystic fibrosis and polydactyly, XX and XY, and 3 : 1 ratios.',
}

export default function GeneLabPage() {
  return <div className="lab-page"><GeneDetective /></div>
}
