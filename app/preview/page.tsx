import type { Viewport } from 'next'
import PreviewApp from '../../src/App'

// The lesson page is one fixed screen: when the keyboard opens, shrink it so the answer box and buttons stay above it.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
}

export default function PreviewPage() {
  return <PreviewApp />
}
