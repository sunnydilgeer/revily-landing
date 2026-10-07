import type { Metadata } from 'next'
import CoordinatesPreview from '../../../src/features/coordinates/CoordinatesPreview'

// Unlisted: only someone with this address and the preview password can open it, and search engines are told to skip it.
export const metadata: Metadata = {
  title: 'Preview | Revily',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CoordinatesPreview />
}
