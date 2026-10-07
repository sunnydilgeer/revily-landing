import type { Metadata } from 'next'
import LinesPreview from '../../../src/features/lines/LinesPreview'

// Unlisted: only someone with this address and the preview password can open it, and search engines are told to skip it.
export const metadata: Metadata = {
  title: 'Preview | Revily',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <LinesPreview />
}
