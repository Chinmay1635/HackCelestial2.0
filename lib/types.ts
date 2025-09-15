import { 
  User, 
  Athlete, 
  Coach, 
  Academy, 
  Sponsor, 
  Tournament, 
  Badge, 
  TrainingPlan, 
  Exercise, 
  AthleteProgress,
  TrainingProgram,
  Notification,
  TournamentRegistration,
  AthleteBadge,
  UserRole,
  AthleteLevel,
  TournamentLevel,
  TournamentStatus,
  BadgeCategory,
  BadgeRarity,
  TrainingPlanStatus,
  ProgramLevel,
  NotificationType
} from '@prisma/client'

// Extended types with relations
export type AthleteWithRelations = Athlete & {
  user: User
  academy?: Academy | null
  coach?: Coach | null
  badges: (AthleteBadge & { badge: Badge })[]
  tournaments: TournamentRegistration[]
  trainingPlans: TrainingPlan[]
  progress: AthleteProgress[]
}

export type CoachWithRelations = Coach & {
  user: User
  academy?: Academy | null
  athletes: Athlete[]
  trainingPlans: TrainingPlan[]
  athleteProgress: AthleteProgress[]
}

export type AcademyWithRelations = Academy & {
  user: User
  athletes: Athlete[]
  coaches: Coach[]
  tournaments: Tournament[]
}

export type SponsorWithRelations = Sponsor & {
  user: User
  sponsoredTournaments: any[]
}

export type TournamentWithRelations = Tournament & {
  academy: Academy
  registrations: TournamentRegistration[]
  sponsors: any[]
  winners: any[]
}

export type TrainingPlanWithRelations = TrainingPlan & {
  athlete: Athlete
  coach: Coach
  exercises: Exercise[]
}

// Re-export Prisma types
export {
  User,
  Athlete,
  Coach,
  Academy,
  Sponsor,
  Tournament,
  Badge,
  TrainingPlan,
  Exercise,
  AthleteProgress,
  TrainingProgram,
  Notification,
  TournamentRegistration,
  AthleteBadge,
  UserRole,
  AthleteLevel,
  TournamentLevel,
  TournamentStatus,
  BadgeCategory,
  BadgeRarity,
  TrainingPlanStatus,
  ProgramLevel,
  NotificationType
}