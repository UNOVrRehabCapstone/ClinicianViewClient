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
  careerProgress: string;
  levelOneScore:  string;
  levelTwoScore:  string;
  levelThreeScore: string;
  levelFourScore: string;
  levelFiveScore: string;
}
