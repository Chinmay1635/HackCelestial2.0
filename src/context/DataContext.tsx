import React, { createContext, useContext, useState } from 'react';
import { Athlete, Coach, Academy, Tournament, Badge, TrainingPlan, Notification } from '../types';
import { Sponsor, TrainingProvider, TrainingProgram, AthleteProgress, TournamentWinner } from '../types';
import { 
  sampleAthletes, 
  sampleCoaches, 
  sampleAcademies, 
  sampleTournaments, 
  sampleBadges,
  sampleTrainingPlans,
  sampleSponsors,
  sampleTrainingProviders,
  sampleTrainingPrograms,
  sampleAthleteProgress,
  sampleTournamentWinners
} from '../data/sampleData';

interface DataContextType {
  athletes: Athlete[];
  coaches: Coach[];
  academies: Academy[];
  tournaments: Tournament[];
  badges: Badge[];
  trainingPlans: TrainingPlan[];
  notifications: Notification[];
  sponsors: Sponsor[];
  trainingProviders: TrainingProvider[];
  trainingPrograms: TrainingProgram[];
  athleteProgress: AthleteProgress[];
  tournamentWinners: TournamentWinner[];
  addTournament: (tournament: Omit<Tournament, 'id'>) => void;
  registerForTournament: (tournamentId: string, athleteId: string) => void;
  enrollInTraining: (programId: string, athleteId: string) => void;
  sponsorTournament: (tournamentId: string, sponsorId: string, prize: string) => void;
  assignCoachToAthlete: (athleteId: string, coachId: string) => void;
  awardBadgeToAthlete: (athleteId: string, badgeId: string) => void;
  updateAthleteLevel: (athleteId: string, level: 'Beginner' | 'Intermediate' | 'Pro') => void;
  updateAthleteProgress: (athleteId: string, progress: Partial<AthleteProgress>) => void;
  addTrainingPlan: (plan: Omit<TrainingPlan, 'id'>) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  addAcademy: (academy: Omit<Academy, 'id'>) => void;
  removeAcademy: (academyId: string) => void;
  addCoachToAcademy: (academyId: string, coach: Omit<Coach, 'id' | 'academyId'>) => void;
  removeCoachFromAcademy: (coachId: string) => void;
  updateAcademySports: (academyId: string, sports: string[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [athletes, setAthletes] = useState<Athlete[]>(sampleAthletes);
  const [coaches, setCoaches] = useState<Coach[]>(sampleCoaches);
  const [academies, setAcademies] = useState<Academy[]>(sampleAcademies);
  const [tournaments, setTournaments] = useState<Tournament[]>(sampleTournaments);
  const [badges, setBadges] = useState<Badge[]>(sampleBadges);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>(sampleTrainingPlans);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>(sampleSponsors);
  const [trainingProviders, setTrainingProviders] = useState<TrainingProvider[]>(sampleTrainingProviders);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>(sampleTrainingPrograms);
  const [athleteProgress, setAthleteProgress] = useState<AthleteProgress[]>(sampleAthleteProgress);
  const [tournamentWinners, setTournamentWinners] = useState<TournamentWinner[]>(sampleTournamentWinners);

  const addTournament = (tournament: Omit<Tournament, 'id'>) => {
    const newTournament: Tournament = {
      ...tournament,
      id: `tournament-${Date.now()}`
    };
    setTournaments(prev => [...prev, newTournament]);
  };

  const registerForTournament = (tournamentId: string, athleteId: string) => {
    setTournaments(prev => 
      prev.map(tournament => 
        tournament.id === tournamentId 
          ? { ...tournament, currentParticipants: tournament.currentParticipants + 1 }
          : tournament
      )
    );
    
    // Add notification
    addNotification({
      userId: athleteId,
      title: 'Tournament Registration Successful',
      message: 'You have successfully registered for the tournament!',
      type: 'tournament',
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const enrollInTraining = (programId: string, athleteId: string) => {
    setTrainingPrograms(prev => 
      prev.map(program => 
        program.id === programId 
          ? { ...program, currentParticipants: program.currentParticipants + 1 }
          : program
      )
    );
    
    addNotification({
      userId: athleteId,
      title: 'Training Enrollment Successful',
      message: 'You have successfully enrolled in the training program!',
      type: 'general',
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const sponsorTournament = (tournamentId: string, sponsorId: string, prize: string) => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    const sponsor = sponsors.find(s => s.id === sponsorId);
    
    if (tournament && sponsor) {
      setSponsors(prev => 
        prev.map(s => 
          s.id === sponsorId 
            ? { ...s, sponsoredTournaments: [...s.sponsoredTournaments, tournamentId] }
            : s
        )
      );
      
      setTournaments(prev => 
        prev.map(t => 
          t.id === tournamentId 
            ? { ...t, prizePool: prize }
            : t
        )
      );
    }
  };

  const assignCoachToAthlete = (athleteId: string, coachId: string) => {
    setAthletes(prev => 
      prev.map(athlete => 
        athlete.id === athleteId 
          ? { ...athlete, coachId }
          : athlete
      )
    );
    
    // Add notification
    addNotification({
      userId: athleteId,
      title: 'Coach Assigned',
      message: 'A new coach has been assigned to you!',
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const awardBadgeToAthlete = (athleteId: string, badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge) return;

    setAthletes(prev => 
      prev.map(athlete => 
        athlete.id === athleteId 
          ? { ...athlete, badges: [...athlete.badges, badge] }
          : athlete
      )
    );
    
    // Add notification
    addNotification({
      userId: athleteId,
      title: 'New Badge Earned!',
      message: `Congratulations! You've earned the "${badge.name}" badge!`,
      type: 'badge',
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const updateAthleteLevel = (athleteId: string, level: 'Beginner' | 'Intermediate' | 'Pro') => {
    setAthletes(prev => 
      prev.map(athlete => 
        athlete.id === athleteId 
          ? { ...athlete, level }
          : athlete
      )
    );
    
    // Add notification
    addNotification({
      userId: athleteId,
      title: 'Level Up!',
      message: `Congratulations! You've advanced to ${level} level!`,
      type: 'badge',
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const updateAthleteProgress = (athleteId: string, progress: Partial<AthleteProgress>) => {
    setAthleteProgress(prev => {
      const existingIndex = prev.findIndex(p => p.athleteId === athleteId);
      if (existingIndex >= 0) {
        return prev.map((p, index) => 
          index === existingIndex 
            ? { ...p, ...progress, lastUpdated: new Date().toISOString() }
            : p
        );
      } else {
        return [...prev, {
          id: `progress-${Date.now()}`,
          athleteId,
          coachId: progress.coachId || '',
          speedImprovement: 0,
          accuracyImprovement: 0,
          lastTournamentPosition: 0,
          lastUpdated: new Date().toISOString(),
          ...progress
        }];
      }
    });
  };

  const addTrainingPlan = (plan: Omit<TrainingPlan, 'id'>) => {
    const newPlan: TrainingPlan = {
      ...plan,
      id: `plan-${Date.now()}`
    };
    setTrainingPlans(prev => [...prev, newPlan]);
    
    // Add notification
    addNotification({
      userId: plan.athleteId,
      title: 'New Training Plan',
      message: `Your coach has assigned a new training plan: "${plan.title}"`,
      type: 'assignment',
      read: false,
      createdAt: new Date().toISOString()
    });
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const addAcademy = (academy: Omit<Academy, 'id'>) => {
    const newAcademy: Academy = {
      ...academy,
      id: `academy-${Date.now()}`
    };
    setAcademies(prev => [...prev, newAcademy]);
  };

  const removeAcademy = (academyId: string) => {
    setAcademies(prev => prev.filter(a => a.id !== academyId));
    // Also remove associated coaches and athletes
    setCoaches(prev => prev.filter(c => c.academyId !== academyId));
    setAthletes(prev => prev.filter(a => a.academyId !== academyId));
  };

  const addCoachToAcademy = (academyId: string, coach: Omit<Coach, 'id' | 'academyId'>) => {
    const newCoach: Coach = {
      ...coach,
      id: `coach-${Date.now()}`,
      academyId
    };
    setCoaches(prev => [...prev, newCoach]);
  };

  const removeCoachFromAcademy = (coachId: string) => {
    setCoaches(prev => prev.filter(c => c.id !== coachId));
    // Remove coach assignment from athletes
    setAthletes(prev => 
      prev.map(a => 
        a.coachId === coachId 
          ? { ...a, coachId: undefined }
          : a
      )
    );
  };

  const updateAcademySports = (academyId: string, sports: string[]) => {
    setAcademies(prev => 
      prev.map(a => 
        a.id === academyId 
          ? { ...a, sports }
          : a
      )
    );
  };

  return (
    <DataContext.Provider value={{
      athletes,
      coaches,
      academies,
      tournaments,
      badges,
      trainingPlans,
      notifications,
      sponsors,
      trainingProviders,
      trainingPrograms,
      athleteProgress,
      tournamentWinners,
      addTournament,
      registerForTournament,
      enrollInTraining,
      sponsorTournament,
      assignCoachToAthlete,
      awardBadgeToAthlete,
      updateAthleteLevel,
      updateAthleteProgress,
      addTrainingPlan,
      addNotification,
      addAcademy,
      removeAcademy,
      addCoachToAcademy,
      removeCoachFromAcademy,
      updateAcademySports
    }}>
      {children}
    </DataContext.Provider>
  );
};