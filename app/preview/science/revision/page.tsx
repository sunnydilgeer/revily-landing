import { redirect } from 'next/navigation'

export default function ScienceRevisionPreviewPage() {
  redirect('/preview?subject=science&view=cards')
}
