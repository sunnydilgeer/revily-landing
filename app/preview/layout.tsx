import type { Metadata } from 'next'
import '../../src/index.css'

export const metadata: Metadata = {
  title: 'Equality as balance | Revily preview',
  description: 'Try Revily’s interactive Equality as balance lesson.',
}

export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
