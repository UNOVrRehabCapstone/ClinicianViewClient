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
  ach0: boolean,
  ach1: boolean,
  ach2: boolean,
  ach3: boolean,
  ach4: boolean,
  ach5: boolean,
  ach6: boolean,
  ach7: boolean,
  ach8: boolean,
  ach9: boolean,
}
