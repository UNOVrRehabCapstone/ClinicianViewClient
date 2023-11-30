import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IPatient, ISession } from '../interfaces/Session';
import { useUserContext } from './UserContext';
import { useAxiosContext } from './AxiosContext';
import { useSocketContext } from './SocketContext';
import { BalloonProgress, IPatientInfo } from '../interfaces/PatientInfo';

export interface ISessionContext {
  sessionList: ISession[];
  sessionListLoading: boolean;
  createSession: (name: string, cb: Function) => any;
  removeSession: (id: string) => void;
  patientJoin: (sessionKey: string, patientIp: string) => void;
  clinicianJoin: (session: ISession) => void;
  currentSession: ISession | undefined;
  copyKey: (key: string) => void;
  updateSessionList: () => void;
  leaveSession: (sessionKey: string) => void;
  getWaitingClients: () => void;
  waitingClients: IPatient[];
  addClientsToSession: (clientList: string[], sessionKey: string) => void;
  clientListLoading: boolean;
  getPatientsInSession: (sessionKey: string) => Promise<any>;
  patientList: IPatient[];
  balloonInfo: BalloonProgress;
  startGame: (sessionKey: string, patientId?: string) => void;
  getCurrentGame: () => string;
  setCurrentGame: (game: string) => void;
  setCurrentBalloonGameMode: (mode: string) => void;
  setCurrentBalloonTarget: (target: string) => void;
  setCurrentPowerupFreq: (freq: string) => void;
  setCurrentLeftRightRatio: (ratio: string) => void;
  setCurrentSpawnPattern: (pattern: string) => void;
  setCurrentMaxLives: (lives: string) => void;
  setCurrentValidHand: (hand: string) => void;
  manuallySpawnBalloon: (patientId?: string) => void;
  loadPatientBalloonGameData: (userName: string) => void;
  deletePatientFromSession: (patientIn: string) => void;
  getPatientPositionalData: (
    patientName: string,
    patientSocketId: string
  ) => void;
  updatePatientInfo: (values: IPatientInfo) => Promise<void>;
  getPatient: (patientID: string, patientName: string) => Promise<any>;
}

const SessionContext = React.createContext<ISessionContext>(
  {} as ISessionContext
);
let tempBalloonInfo = {
  achievementProgress: "0000000000"
}

export const SessionProvider = (props: { children: ReactElement }) => {
  const [sessionList, setSessionList] = useState<ISession[]>([]);
  const [currentSession, setCurrentSession] = useState<ISession | undefined>(
    undefined
  );
  const { children } = props;

  const [sessionListLoading, setSessionListLoading] = useState(false);
  const [waitingClients, setWaitingClients] = useState<IPatient[]>([]);

  const [clientListLoading, setClientListLoading] = useState<boolean>(false);

  const [patientList, setPatientList] = useState<IPatient[]>([]);
  const [currentGame, setCurrentGame] = useState('0');
  const [currentBalloonGameMode, setCurrentBalloonGameMode] = useState('0');
  const [currentBalloonTarget, setCurrentBalloonTarget] = useState('10');
  const [currentBalloonPowerupFreq, setCurrentPowerupFreq] = useState('None');
  const [currentLeftRightRatio, setCurrentLeftRightRatio] = useState('0.5');
  const [currentSpawnPattern, setCurrentSpawnPattern] = useState('0');
  const [currentMaxLives, setCurrentMaxLives] = useState('5');
  const [currentValidHand, setCurrentValidHand] = useState('2');
  const [balloonInfo, setBalloonInfo] = useState<BalloonProgress>(tempBalloonInfo);
  const auth = useUserContext();
  const axiosContext = useAxiosContext();
  const socket = useSocketContext();
  const history = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      setCurrentSession(undefined);
    }
  }, [socket.connected]);

  const updateSessionList = () => {
    setSessionListLoading(true);
    axiosContext
      .fetchSessions()
      .then((res: any) => {
        if (res) {
          setSessionList(res.sessions);
        }
        setSessionListLoading(false);
        return res;
      })
      .catch((err: any) => message.error(err));
  };

  const createSession = (name: string, cb: Function) => {
    if (auth.currentUser === undefined) return false;
    axiosContext
      .createSession(name)
      .then((res: any) => {
        if (res.success) {
          message.success('Successfully Created Session');
          updateSessionList();
        } else {
          message.error('Error creating session');
        }
        return res;
      })
      .catch((err: any) => message.error(err));
    return cb();
  };

  const removeSession = (id: string) => {
    setSessionList((currentList) => {
      const filteredList = currentList.filter((ses) => ses.sessionKey !== id);
      return filteredList;
    });
    axiosContext
      .deleteSession(id)
      .then((res: any) => {
        if (res === 200) {
          message.success('Successfully Deleted Session');
        } else {
          message.error('Error Deleting Session');
        }
        return res;
      })
      .catch((err: any) => message.error(err));
  };

  const getSessionById = (id: string) => {
    return sessionList.find((s) => s.sessionKey === id);
  };

  const patientJoin = (sessionKey: string, patientIp: string) => {
    const foundSession = getSessionById(sessionKey);
    if (foundSession) {
      // foundSession.patientIPs?.push({
      //     ip: patientIp,
      //     useSessionGame: true
      // });
      // updateSession(sessionId, foundSession);
    }
  };

  const clinicianJoin = (session: ISession) => {
    axiosContext
      .joinSession(session.sessionKey, auth.currentUser?.username)
      .then((res: any) => {
        if (res === 200) {
          history(`/session/${session.sessionKey}`);
          setCurrentSession(session);
        }
        return res;
      })
      .catch((err: any) => message.error(err));
  };

  const leaveSession = (sessionKey: string) => {
    axiosContext
      .leaveSession(sessionKey)
      .then((res: any) => {
        setCurrentSession(undefined);
        return res;
      })
      .catch((err: any) => message.error(err));
  };

  const copyKey = (key: string) => {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        return message.info('Copied!');
      })
      .catch((err: any) => message.error(err));
  };

  const getWaitingClients = () => {
    setClientListLoading(true);
    axiosContext
      .getWaitingClients()
      .then((res: any) => {
        setWaitingClients(res);
        setClientListLoading(false);
        return res;
      })
      .catch((err: any) => message.error(err));
  };

  const deletePatientFromSession = (patientIn: string) => {
    axiosContext
      .removePatientFromSession(patientIn, currentSession?.sessionKey)
      .then(() => message.success(`Patient ${patientIn} removed from session`))
      .catch((err: any) => message.error(err));

    patientList.map((patient) => {
      if (patientIn !== patient.name) return patient;
      return null;
    });
    setPatientList([]);
  };

  const addClientsToSession = (clientList: string[], sessionKey: string) => {
    axiosContext
      .addClientsToSession(
        clientList,
        sessionKey,
        socket.socket.id,
        auth.currentUser?.username
      )
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => message.error(err));
  };

  const getPatientsInSession = (sessionKey: string) => {
    return axiosContext
      .getPatientsInSession(sessionKey)
      .then((res: IPatient[]) => {
        // res.forEach((patient) => {
        //   patient.sessionKey = currentSession?.sessionKey;
        // });
        console.log(res);
        return setPatientList(res);
      })
      .catch((err: any) => message.error(err));
  };

  const startGame = (sessionKey: string, patientId?: string) => {
    //If the game is the balloon game, update balloon settings
    if(currentGame == "2"){
      axiosContext.updateBalloonSettings(sessionKey, currentBalloonGameMode,currentBalloonTarget
        ,currentBalloonPowerupFreq, currentLeftRightRatio, currentSpawnPattern, currentMaxLives, currentValidHand)
    }
    axiosContext
      .startGame(sessionKey, currentGame, auth.currentUser?.username, patientId)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => message.error(err));
  };


  const manuallySpawnBalloon = (patientId?: string) => {
    axiosContext
      .manuallySpawnBalloon(currentSession?.sessionKey)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => message.error(err));
  };
  const getCurrentGame = () => {
    return currentGame;
  }


  const getPatientPositionalData = (
    patientName: string,
    patientSocketId: string
  ) => {
    axiosContext.getPatientPositionalData(
      patientName,
      patientSocketId,
      currentSession?.sessionKey,
      socket.socket.id
    );
  };

  const updatePatientInfo = async (values: IPatientInfo) => {
    axiosContext
      .updatePatientInfo(values, currentSession?.sessionKey)
      .then((res: any) => {
        if (res === 200) {
          message.success("Successfully updated Patient's info");
        }
        return res;
      })
      .catch((err: any) => message.error(err));
  };

  const loadPatientBalloonGameData = async( userName: string) => {
    let newData: BalloonProgress
    axiosContext.loadPatientBalloonData(userName).then((res:any) =>{
      newData = {achievementProgress:  res.data.achievementProgress}
      setBalloonInfo(newData);
      //patientList[0].info.balloonProgress= newData;

    })
  }

  const getPatient = async (patientID: string, patientName: string) => {
    return axiosContext
      .getPatient(patientID, patientName)
      .then((res: any) => {
        return res;
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <SessionContext.Provider
      value={{
        sessionList,
        sessionListLoading,
        createSession,
        removeSession,
        patientJoin,
        clinicianJoin,
        currentSession,
        leaveSession,
        updateSessionList,
        copyKey,
        getWaitingClients,
        waitingClients,
        addClientsToSession,
        clientListLoading,
        getPatientsInSession,
        patientList,
        startGame,
        deletePatientFromSession,
        getPatientPositionalData,
        updatePatientInfo,
        getPatient,
        setCurrentBalloonGameMode,
        setCurrentPowerupFreq,
        setCurrentBalloonTarget,
        setCurrentLeftRightRatio,
        setCurrentGame,
        setCurrentSpawnPattern,
        setCurrentMaxLives,
        setCurrentValidHand,
        getCurrentGame,
        manuallySpawnBalloon,
        loadPatientBalloonGameData,
        balloonInfo
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = (): ISessionContext => {
  const context = useContext<ISessionContext>(SessionContext);

  if (context === undefined) {
    throw new Error(`Error using DataProvider`);
  }
  return context;
};

export default SessionContext;
