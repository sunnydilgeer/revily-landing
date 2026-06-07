import { Suspense } from 'react'
import Practice from '@/components/Practice'

export default function PracticePage() {
  return (
    <Suspense fallback={null}>
      <Practice />
    </Suspense>
  )
}