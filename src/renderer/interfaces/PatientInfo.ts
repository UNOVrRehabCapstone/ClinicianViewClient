export interface IPatientInfo {
  _id: any;
  firstName: string;
  lastName: string;
  currentSession: any;
  createdBy: any;
  currentGame: any;
  pastGames: [];
  userName: string;
  createdAt: Date;
  patientId: string;
  balloonProgress: BalloonProgress

  
}

export interface BalloonProgress{
  achievementProgress: string;
}
