import type { Metadata, Viewport } from 'next'
import GraphsShelf from '../../../src/features/graphs/GraphsShelf'

// Unlisted: only someone with this address and the preview password can open it, and search engines are told to skip it.
export const metadata: Metadata = {
  title: 'Preview | Revily',
  robots: { index: false, follow: false },
}


// The lesson page is one fixed screen: when the keyboard opens, shrink it so the answer box and buttons stay above it.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
}

export default function Page() {
  return <GraphsShelf />
}
