import type { Metadata } from 'next'
import '../../src/index.css'

export const metadata: Metadata = {
  title: 'Types of numbers | Revily preview',
  description: 'Learn the main types of number for GCSE Foundation maths.',
}

export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
