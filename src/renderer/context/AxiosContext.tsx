import React, { ReactElement, useContext } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { sha256 } from 'js-sha256';
import { useSocketContext } from './SocketContext';
import { IUser } from '../interfaces/User';
import { IPatientInfo } from '../interfaces/PatientInfo';

//const SERVER_IP = 'http://137.48.186.67:5000';
 const SERVER_IP = 'http://localhost:5000';

export interface IAxiosContext {
  login: (username: string, password: string) => Promise<any>;
  fetchSessions: () => Promise<any>;
  createSession: (sessionName: string) => Promise<any>;
  loginWithToken: (token: string) => Promise<any>;
  joinSession: (
    sessionKey: string,
    clinicianName: string
  ) => Promise<number | null>;
  leaveSession: (sessionKey: string) => Promise<number | null>;
  logout: (currentUser: IUser) => Promise<any>;
  getWaitingClients: () => Promise<any>;
  addClientsToSession: (
    clientList: string[],
    roomKey: string,
    clinicianSocketId: string,
    clinicianName: string
  ) => Promise<number | null>;
  getPatientsInSession: (roomKey: string) => Promise<any>;
  startGame: (
    sessionKey: string,
    game: string,
    clinician: string,
    patientSocketId: string
  ) => Promise<number | null>;
  updateBalloonSettings:(
    sessionKey: string,
    mode: string,
    target: string,
    freq: string,
    ratio: string,
    pattern: string,
    lives: string,
    hand: string,
  ) => Promise<any>;
  manuallySpawnBalloon: (sessionKey: string) => Promise<any>;
  loadPatientBalloonData:(userName: string) => Promise<any>;
  deleteSession: (sessionKey: string) => Promise<number | null>;
  removePatientFromSession: (
    patientId: string,
    sessionKey: string
  ) => Promise<number | null>;
  getPatientPositionalData: (
    patientName: string,
    socketID: string,
    sessionKey: string,
    currentSocketId: string
  ) => Promise<number | false>;
  getClinicianPatients: (clinician: string) => Promise<any>;
  updatePatientInfo: (
    values: IPatientInfo,
    sessionKey: string
  ) => Promise<boolean>;
  savePatientRepData: (repdata: string[], patient: string) => Promise<boolean>;
  getPatient: (patientID: string, patientName: string) => Promise<any | null>;
}

const AxiosContext = React.createContext<IAxiosContext>({} as IAxiosContext);

export const AxiosProvider = (props: { children: ReactElement }) => {
  const { children } = props;
  const socket = useSocketContext();
  const history = useNavigate();

  const unauthorized = () => {
    message.error('Token Expired');
    // leaveAllRooms();
    history('/login');
    return null;
  };

  //REMOVED HASHING OF PASSWORD FOR TESTING REVERT THIS CHANGE 
  const login = async (username: string, password: string) => {
    console.log("Logging in.")
    const res = await axios.post(`${SERVER_IP}/login`, {
      username,
      shaPassword: sha256(password),
    });
    return res.data;
  };

  const logout = async (currentUser: IUser) => {
    // await leaveAllRooms();
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${SERVER_IP}/logout`,
        { currentUser },
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.data;
    } catch {
      message.error('Error Logging Out');
      return unauthorized();
    }
  };

  const loginWithToken = async (token: string) => {
    const res = await axios.post(`${SERVER_IP}/loginWithToken`, null, {
      headers: { Authorization: `${token}` },
    });
    return res.data;
  };

  const fetchSessions = async () => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.get(`${SERVER_IP}/session`, {
        headers: { Authorization: `${token}` },
      });
      return res.data;
    } catch {
      message.error('Error Fetching Sessions');
      return unauthorized();
    }
  };

  const createSession = async (sessionName: string) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${SERVER_IP}/session`,
        { sessionName },
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.data;
    } catch (error: any) {
      message.error(error);
      return unauthorized();
    }
  };

  const deleteSession = async (sessionKey: string) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.delete(`${SERVER_IP}/session`, {
        data: { sessionKey },
        headers: { Authorization: `${token}` },
      });
      return res.status;
    } catch (error: any) {
      message.error(error);
      return unauthorized();
    }
  };

  const joinSession = async (sessionKey: string, clinicianName: string) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${SERVER_IP}/join`,
        {
          sessionKey,
          clinicianName,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.status;
    } catch (error: any) {
      message.error(error);
      return unauthorized();
    }
  };

  const leaveSession = async (sessionKey: string) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${SERVER_IP}/leave`,
        {
          sessionKey,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      history('/dashboard');
      return res.status;
    } catch (error: any) {
      message.error(error);
      return unauthorized();
    }
  };

  const getWaitingClients = async () => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.get(`${SERVER_IP}/getWaitingClients`, {
        headers: { Authorization: `${token}` },
      });
      return res.data.waitingList;
    } catch {
      message.error('Error Retrieving Patients');
      return unauthorized();
    }
  };

  const addClientsToSession = async (
    clientList: string[],
    roomKey: string,
    clinicianSocketId: string,
    clinicianName: string
  ) => {
    const token = window.localStorage.getItem('token');
    // const clinicianSocketId = socket.socket.id;
    try {
      const res = await axios.post(
        `${SERVER_IP}/addClientsToSession`,
        { clientList, roomKey, clinicianSocketId, clinicianName },
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.status;
    } catch (error: any) {
      message.error(error);
      return unauthorized();
    }
  };

  const getPatientsInSession = async (roomKey: string) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.get(
        `${SERVER_IP}/getPatientsInSession?roomKey=${roomKey}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.data.patientList;
    } catch {
      message.error('Error Retreiving Patients From Session');
      return unauthorized();
    }
  };

  const removePatientFromSession = async (
    patientId: string,
    sessionKey: string
  ) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.delete(`${SERVER_IP}/removePatientFromSession`, {
        headers: { Authorization: `${token}` },
        data: { patientId, sessionKey },
      });
      return res.status;
    } catch (error: any) {
      message.error(error);
      return unauthorized();
    }
  };

  //New addition - apply settings when starting the game.
  //Should be moved to a separate method. 
  const startGame = async (
    sessionKey: string,
    game: string,
    clinician: string,
    patientSocketId: string
  ) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${SERVER_IP}/startGame`,
        { sessionKey, game, userName: clinician, patientSocketId },
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.status;
    } catch (error: any) {
      message.error(error);
      return unauthorized();
    }
  };
  const updateBalloonSettings = async(
    sessionKey: string,
    mode: string,
    target: string,
    freq: string,
    ratio: string,
    pattern: string,
    lives: string,
    hand: string,

  ) =>{
    const token = window.localStorage.getItem('token');
    try{
      const res2 = await axios.post(
        `${SERVER_IP}/updateBalloonSettings`,
        {sessionKey, mode, target, freq, pattern, ratio, lives, hand},
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res2.status;
    } catch( error: any){
      message.error(error);
      return unauthorized();
    }

  }
  
  const manuallySpawnBalloon = async(
    sessionKey: string
  ) => {
    const token = window.localStorage.getItem('token');
    try{
      const res2 = await axios.post(
        `${SERVER_IP}/manuallySpawnBalloon`,
        {sessionKey},
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res2.status;
    } catch( error: any){
      message.error(error);
      return unauthorized();
    }
  }
  const loadPatientBalloonData = async(
    userName: string
  ) =>{
    const token = window.localStorage.getItem('token');
    try{
      const res = await axios.post(`${SERVER_IP}/loadPatientBalloonData`,{userName},{headers: {Authorization: `${token}`}})
      return res
    }
    catch( error: any){
      message.error(error);
      return unauthorized();
    }
  }

  const getPatientPositionalData = async (
    patientName: string,
    socketID: string,
    sessionKey: string,
    currentSocketId: string
  ) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.patch(
        `${SERVER_IP}/dataSendTest`,
        { patientName, socketID, sessionKey, currentSocketId },
        { headers: { Authorization: `${token}` } }
      );
      return res.status;
    } catch (error: any) {
      message.error(error);
      return false;
    }
  };

  const getClinicianPatients = async (clinician: string) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.get(
        `${SERVER_IP}/patientExist?clinician=${clinician}`,
        { headers: { Authorization: `${token}` } }
      );
      return res.data;
    } catch (error: any) {
      message.error(error);
      return false;
    }
  };

  const updatePatientInfo = async (
    values: IPatientInfo,
    sessionKey: string
  ) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.patch(
        `${SERVER_IP}/updatePatientInfo`,
        { values, sessionKey },
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.status === 200;
    } catch (error: any) {
      message.error(error);
      return false;
    }
  };

  const savePatientRepData = async (repdata: string[], patient: string) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.patch(
        `${SERVER_IP}/savePatientRepData`,
        {
          repdata,
          patient,
        },
        { headers: { Authorization: `${token}` } }
      );
      return res.status === 200;
    } catch (error: any) {
      message.error(error);
      return false;
    }
  };

  const getPatient = async (patientID: string, patientName: string) => {
    const token = window.localStorage.getItem('token');
    try {
      const res = await axios.get(
        `${SERVER_IP}/patient/${patientName}/${patientID}`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      return res.data;
    } catch (error: any) {
      message.error(error);
      return null;
    }
  };

  return (
    <AxiosContext.Provider
      value={{
        getPatientsInSession,
        startGame,
        updateBalloonSettings,
        login,
        fetchSessions,
        createSession,
        loginWithToken,
        joinSession,
        leaveSession,
        deleteSession,
        logout,
        getWaitingClients,
        addClientsToSession,
        removePatientFromSession,
        getPatientPositionalData,
        getClinicianPatients,
        updatePatientInfo,
        savePatientRepData,
        getPatient,
        manuallySpawnBalloon,
        loadPatientBalloonData
      }}
    >
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxiosContext = (): IAxiosContext => {
  const context = useContext<IAxiosContext>(AxiosContext);

  if (context === undefined) {
    throw new Error(`Error using DataProvider`);
  }
  return context;
};

export default AxiosContext;
