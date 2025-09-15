import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({
      include: {
        user: true,
        academy: true,
        coach: true,
        badges: {
          include: {
            badge: true
          }
        }
      }
    })

    return NextResponse.json(athletes)
  } catch (error) {
    console.error('Error fetching athletes:', error)
    return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    const athlete = await prisma.athlete.create({
      data: {
        ...data,
        userId: data.userId
      },
      include: {
        user: true,
        academy: true,
        coach: true,
        badges: {
          include: {
            badge: true
          }
        }
      }
    })

    return NextResponse.json(athlete)
  } catch (error) {
    console.error('Error creating athlete:', error)
    return NextResponse.json({ error: 'Failed to create athlete' }, { status: 500 })
  }
}