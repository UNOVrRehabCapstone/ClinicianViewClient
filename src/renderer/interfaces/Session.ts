import {IPatientInfo} from "./PatientInfo"
export interface ISession {
  createdByName: string | undefined;
  sessionName: string;
  sessionKey?: string;
  createdBy?: string;
}

export interface IPatient {
  name: string;
  socketId: string;
}
