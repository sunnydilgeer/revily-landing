import type { Metadata } from 'next'
import '../../src/index.css'

export const metadata: Metadata = {
  title: 'GCSE Maths lessons | Revily preview',
  description: 'Preview interactive Revily lessons for GCSE Foundation maths.',
}

export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
