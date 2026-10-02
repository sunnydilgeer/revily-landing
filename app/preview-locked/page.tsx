import type { Metadata } from 'next'
import LockScreen from './LockScreen'

export const metadata: Metadata = {
  title: 'Under construction | Revily',
  robots: { index: false, follow: false },
}

export default function PreviewLockedPage() {
  return <LockScreen />
}
