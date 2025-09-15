import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import LandingPage from '@/components/LandingPage'
import { getCurrentUser } from '@/lib/auth'

export default async function Home() {
  const { userId } = auth()
  
  if (userId) {
    const user = await getCurrentUser()
    if (user) {
      redirect(`/${user.role.toLowerCase()}/dashboard`)
    }
  }

  return <LandingPage />
}