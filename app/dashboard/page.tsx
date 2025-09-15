import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function Dashboard() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  redirect(`/${user.role.toLowerCase()}/dashboard`)
}