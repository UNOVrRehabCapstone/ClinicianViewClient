import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import socketIOClient, { io, Socket } from 'socket.io-client';
import { useUserContext } from './UserContext';
import { useSessionContext } from './SessionContext';
import { IPatient } from 'renderer/interfaces/Session';
import { IKRig } from 'renderer/components/PatientCard/Modals/IKRigModal';
import { BalloonProgress } from 'renderer/interfaces/PatientInfo';

// Student server
//const SERVER_IP = 'http://137.48.186.67:5000';

// Local
 //const SERVER_IP = 'http://localhost:5000';

 // AWS lightsail instance
 const SERVER_IP = 'http://35.182.185.82:5000';

 
export interface ISocketContext {
  sendMessage: (messageId: string, object: any) => void;
  connected: boolean;
  socket: Socket | null;
  handleServerEvents: (newSocket: Socket) => Socket;
  repData: string[];
  setRepData: Dispatch<SetStateAction<string[]>>;
  lastLeftRep: string;
  lastRightRep: string;
  positionLeftController: string[];
  positionRightController: string[];
  positionHead: string[];
  pauseGame: (patient: IPatient) => void;
  resumeGame: (patient: IPatient) => void;
  updatePatientPosition: (patient: IPatient, position: object) => void;
  handMirror: (patient: IPatient, handMirrored: string) => void;
  ikRigMeasurements: (patient: IPatient, measurements: IKRig) => void;
  showIKSkeleton: (patient: IPatient) => void;
  testSocket:(patient: IPatient) => void;
  handScale: (
    patient: IPatient,
    handToScale: string,
    scaleAmount: number
  ) => void;

  setCurrentBalloonGameMode: (mode: string) => void;
  setCurrentBalloonTarget: (target: string) => void;
  setCurrentPowerupFreq: (freq: string) => void;
  setCurrentLeftRightRatio: (ratio: string) => void;
  setCurrentSpawnPattern: (pattern: string) => void;
  setCurrentMaxLives: (lives: string) => void;
  setCurrentValidHand: (hand: string) => void;
  setCareerModeLevelToPlay: (level: string) => void;
  setCurrentBalloonSpeedModifier:(modifier: string) => void;
  manuallySpawnBalloon: (patient: IPatient) => void;
  sendBalloonGameSettings: (patient: IPatient) => void;
  setCurrentNumOfBalloonsAtOnce:(maxAtOnce: string) => void;
  setCurrentTimeBetweenSpawns:(timeBetween: string) => void;
  moveDart:(patient: IPatient, isUp: boolean) => void;

  currentBalloonGameMode: string;
  currentBalloonTarget: string
  currentBalloonPowerupFreq: string
  currentLeftRightRatio: string
  currentSpawnPattern: string
  currentMaxLives: string
  currentValidHand: string
  currentBalloonSpeedModifier: string
  currentNumOfBalloonsAtOnce: string
  currentTimeBetweenSpawns: string
}


export interface IBalloonSettings{
    mode: string,
    target: string,
    freq: string,
    ratio: string,
    pattern: string,
    lives: string,
    hand: string
    level: string;
    modifier: string;
    numBalloonsSpawnedAtOnce: string;
    timeBetweenSpawns: string;
}
const SocketContext = React.createContext<ISocketContext>({} as ISocketContext);

export const SocketProvider = (props: { children: ReactElement }) => {
  const { children } = props;
  const auth = useUserContext();
  const session = useSessionContext();
  const [connected, setConnected] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [repData, setRepData] = useState<string[]>([]);
  const [positionLeftController, setPositionLeftController] = useState<
    string[]
  >([]);
  const [positionRightController, setPositionRightController] = useState<
    string[]
  >([]);
  const [positionHead, setPositionHead] = useState<string[]>([]);
  const [lastLeftRep, setLastLeftRep] = useState<string>('');
  const [lastRightRep, setLastRightRep] = useState<string>('');

  
  const [careerModeLevelToPlay, setCareerModeLevelToPlay] = useState("0");
  const [currentBalloonGameMode, setCurrentBalloonGameMode] = useState('1');
  const [currentBalloonTarget, setCurrentBalloonTarget] = useState('10');
  const [currentBalloonPowerupFreq, setCurrentPowerupFreq] = useState('Low');
  const [currentLeftRightRatio, setCurrentLeftRightRatio] = useState('0.5');
  const [currentSpawnPattern, setCurrentSpawnPattern] = useState('1');
  const [currentMaxLives, setCurrentMaxLives] = useState('5');
  const [currentValidHand, setCurrentValidHand] = useState('2');
  const [currentBalloonSpeedModifier, setCurrentBalloonSpeedModifier] = useState('1.00');
  const [currentNumOfBalloonsAtOnce, setCurrentNumOfBalloonsAtOnce] = useState('2');
  const [currentTimeBetweenSpawns, setCurrentTimeBetweenSpawns] = useState('2.5');



  const handleServerEvents = (newSocket: Socket) => {
    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join', newSocket.id);
    });
    newSocket.on('balloonDataClientUpdate', () => {console.log("new updated")})
    newSocket.on('balloonProgressionUpdate', (data: string) => {
      console.log("Data");
      console.log("progress");
    })
    newSocket.on('userJoined', () => {});
    newSocket.on('positionalDataClinician', (data: string) => {
      switch (data.split('(')[0]) {
        case 'LEFT':
          setPositionLeftController([
            ...positionLeftController,
            data.slice(data.indexOf('(')),
          ]);
          break;
        case 'RIGHT':
          setPositionRightController([
            ...positionRightController,
            data.slice(data.indexOf('(')),
          ]);
          break;
        default:
          setPositionHead([...positionHead, data.slice(data.indexOf('('))]);
          break;
      }
      console.log(data.slice(data.indexOf('(')));
    });
    newSocket.on('repTrackingDataClinician', (data: string) => {
      console.log(data);
      repData.push(data);
      if (data.split(':')[0] === 'Left') {
        setLastLeftRep(data.split(':')[1]);
      } else {
        setLastRightRep(data.split(':')[1]);
      }
      console.log(repData);
    });
    return newSocket;
  };

  useEffect(() => {
    let newSocket = socketIOClient(SERVER_IP, { transports: ['websocket'] });

    newSocket = handleServerEvents(newSocket);
    setSocket(newSocket);
    return () => {
      setConnected(false);
      newSocket.close();
    };
  }, [setSocket]);


  useEffect(() => {
    console.log(currentSpawnPattern)  
  }, [currentSpawnPattern]);

  const sendMessage = (messageId: string, object: any) => {
    if (socket) {
      socket.emit(messageId, {
        object,
        key: session.currentSession?.sessionKey,
      });
    }
  };

  const pauseGame = (patient: IPatient): void => {
    if (socket) {
      socket.emit('pauseGame', patient);
    }
  };





  const manuallySpawnBalloon = (patient: IPatient) => {
    if(socket){
      socket.emit('balloonSpawn',patient)
    }
  };


  const testSocket = (patient: IPatient) : void =>{
    if(socket){
      socket.emit('test',patient);
    }
  }

  const resumeGame = (patient: IPatient): void => {
    if (socket) {
      socket.emit('resumeGame', patient);
    }
  };
  const sendBalloonGameSettings = (patient: IPatient) => {
    //If the game is the balloon game, update balloon settings
    let balloonSettings: IBalloonSettings = {
      mode: currentBalloonGameMode,
      target: currentBalloonTarget,
      freq: currentBalloonPowerupFreq,
      ratio: currentLeftRightRatio,
      pattern: currentSpawnPattern,
      lives: currentMaxLives,
      hand: currentValidHand,
      level: careerModeLevelToPlay,
      modifier: currentBalloonSpeedModifier,
      numBalloonsSpawnedAtOnce: currentNumOfBalloonsAtOnce,
      timeBetweenSpawns: currentTimeBetweenSpawns
    }
    if(socket){
      socket.emit("balloonSettings",{...patient, balloonSettings})
    }
  };

  const updatePatientPosition = (patient: IPatient, position: object): void => {
    if (socket) {
      socket.emit('updatePatientPosition', { ...patient, position });
    }
  };

  const handMirror = (patient: IPatient, handMirrored: string): void => {
    if (socket) {
      socket.emit('handMirror', { ...patient, handMirrored });
    }
  };

  const ikRigMeasurements = (patient: IPatient, measurements: IKRig): void => {
    if (socket) {
      socket.emit('IKRig', { ...patient, measurements });
    }
  };

  const moveDart = (patient: IPatient, isUp: boolean) =>{
    console.log( isUp)
    if(socket){
      if(isUp){
        socket.emit("moveDartUp", patient);
      }
      else{
        socket.emit("moveDartDown", patient);
      }
    }
  }

  const showIKSkeleton = (patient: IPatient): void => {
    if (socket) {
      socket.emit('toggleSkeleton', patient);
    }
  };

  const handScale = (
    patient: IPatient,
    handToScale: string,
    scaleAmount: number
  ): void => {
    if (socket) {
      socket.emit('handScale', { ...patient, handToScale, scaleAmount });
    }
  };

  

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        connected,
        socket,
        handleServerEvents,
        repData,
        setRepData,
        lastLeftRep,
        lastRightRep,
        positionLeftController,
        positionRightController,
        positionHead,
        pauseGame,
        resumeGame,
        updatePatientPosition,
        handMirror,
        ikRigMeasurements,
        showIKSkeleton,
        handScale,
        testSocket,
        setCurrentBalloonGameMode,
        setCurrentPowerupFreq,
        setCurrentBalloonTarget,
        setCurrentLeftRightRatio,
        setCurrentSpawnPattern,
        setCurrentMaxLives,
        setCurrentValidHand,
        manuallySpawnBalloon,
        sendBalloonGameSettings,
        setCurrentBalloonSpeedModifier,
        currentBalloonGameMode,
        currentBalloonPowerupFreq,
        currentBalloonSpeedModifier,
        currentBalloonTarget,
        currentMaxLives,
        currentLeftRightRatio,
        currentNumOfBalloonsAtOnce,
        currentSpawnPattern,
        currentTimeBetweenSpawns,
        currentValidHand,
        setCareerModeLevelToPlay,
        setCurrentNumOfBalloonsAtOnce,
        setCurrentTimeBetweenSpawns,
        moveDart
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): ISocketContext => {
  const context = useContext<ISocketContext>(SocketContext);

  if (context === undefined) {
    throw new Error(`Error using DataProvider`);
  }
  return context;
};

export default SocketContext;
