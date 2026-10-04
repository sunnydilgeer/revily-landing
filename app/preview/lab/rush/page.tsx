import type { Metadata } from 'next'
import AERush from '../../../../src/features/science/labs/rush/AERush'

export const metadata: Metadata = {
  title: 'A&E Rush | Revily Science Arcade',
  description: 'Run an A&E shift: magnification, pathogens, antibiotics and vaccines, and the microscopy required practical.',
}

export default function RushLabPage() {
  return <div className="lab-page"><AERush /></div>
}
