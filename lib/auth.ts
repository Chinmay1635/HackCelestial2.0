import { auth } from '@clerk/nextjs'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export async function getCurrentUser() {
  const { userId } = auth()
  
  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      athlete: true,
      coach: true,
      academy: true,
      sponsor: true,
    },
  })

  return user
}

export async function createUserProfile(
  clerkId: string,
  email: string,
  name: string,
  role: UserRole
) {
  const user = await prisma.user.create({
    data: {
      clerkId,
      email,
      name,
      role,
    },
  })

  // Create role-specific profile
  switch (role) {
    case 'ATHLETE':
      await prisma.athlete.create({
        data: {
          userId: user.id,
          name,
          sport: 'Boxing', // Default sport
          region: 'Mumbai', // Default region
          level: 'BEGINNER',
        },
      })
      break
    case 'COACH':
      await prisma.coach.create({
        data: {
          userId: user.id,
          name,
          sport: 'Boxing', // Default sport
          experience: 0,
        },
      })
      break
    case 'ACADEMY':
      await prisma.academy.create({
        data: {
          userId: user.id,
          name,
          location: 'Mumbai, Maharashtra',
          city: 'Mumbai',
          state: 'Maharashtra',
          sports: ['Boxing'],
        },
      })
      break
    case 'SPONSOR':
      await prisma.sponsor.create({
        data: {
          userId: user.id,
          name,
          company: name,
          industry: 'Sports',
          budget: '₹1,00,000',
          contactEmail: email,
        },
      })
      break
  }

  return user
}