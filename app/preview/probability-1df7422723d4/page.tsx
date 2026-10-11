import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

// The Probability and statistics lessons are on the course now (Sunny, 11 Oct): the old unlisted shelf address opens the same lesson there.
export const metadata: Metadata = {
  title: 'Preview | Revily',
  robots: { index: false, follow: false },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ lesson?: string; section?: string }> }) {
  const { lesson = '301', section } = await searchParams
  const url = new URLSearchParams({ lesson })
  if (section) url.set('section', section)
  redirect(`/preview?${url}`)
}
