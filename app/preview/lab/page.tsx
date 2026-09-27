import { redirect } from 'next/navigation'

/** The labs live in the app's Lab section now. */
export default function LabHubPage() {
  redirect('/preview?view=lab')
}
