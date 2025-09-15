import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { athleteId } = await request.json()
    const tournamentId = params.id

    // Check if tournament exists and has space
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    })

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
      return NextResponse.json({ error: 'Tournament is full' }, { status: 400 })
    }

    // Check if already registered
    const existingRegistration = await prisma.tournamentRegistration.findUnique({
      where: {
        tournamentId_athleteId: {
          tournamentId,
          athleteId
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 })
    }

    // Create registration and update participant count
    const registration = await prisma.tournamentRegistration.create({
      data: {
        tournamentId,
        athleteId
      }
    })

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        currentParticipants: {
          increment: 1
        }
      }
    })

    // Create notification
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId }
    })

    if (athlete) {
      await prisma.notification.create({
        data: {
          userId: athlete.userId,
          title: 'Tournament Registration Successful',
          message: `You have successfully registered for ${tournament.name}!`,
          type: 'TOURNAMENT'
        }
      })
    }

    return NextResponse.json(registration)
  } catch (error) {
    console.error('Error registering for tournament:', error)
    return NextResponse.json({ error: 'Failed to register for tournament' }, { status: 500 })
  }
}