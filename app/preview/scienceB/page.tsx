import { redirect } from 'next/navigation'

// The Lesson 1 revision preview became Science revision cards in the app.
export default function ScienceRevisionPage() {
  redirect('/preview?subject=science&view=cards')
}
