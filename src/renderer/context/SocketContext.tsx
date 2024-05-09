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
import AxiosContext, { useAxiosContext } from './AxiosContext';

// Student server
//const SERVER_IP = 'http://137.48.186.67:5000';

// Local
 const SERVER_IP = 'http://localhost:5000';

 // AWS lightsail instance
//  const SERVER_IP = 'http://15.157.73.210:5000';


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

export interface IPlaneSettings{
  rightSideSpawnOnly: boolean,
  leftSideSpawnOnly: boolean,
  griplessGrabbing: boolean,
  //Active only when griplessGrabbig is true.  Only one can be selected at a time.
  useDistanceFromHeadThrow: boolean,
  useAutoReleaseTimerThrow: boolean,
  useButtonPressForThrow: boolean,
  //Active only when griplessGrabbing is true.
  throwThreshold: number,
  requiredAimTime: number,
  useAutoAim: boolean,
  //Active only when useButtonPressForThrow is true.  Valid strings are "A", "B", "Trigger", "Grip", "Joystick"
  releaseButton: String,
  targets: number,
  
}

export class BalloonSettingsStatic{
  static balloonSettings: IBalloonSettings = {
    mode: "1",
    target: "10",
    freq: "Low",
    ratio: "0.5",
    pattern: "1",
    lives: "5",
    hand: "2",
    level: "0",
    modifier: "1.00",
    numBalloonsSpawnedAtOnce: "2",
    timeBetweenSpawns: "2.5"
  }
}

export class PlaneSettingsStatic{
  static planeSettings: IPlaneSettings = {
    rightSideSpawnOnly: false,
    leftSideSpawnOnly: false,
    griplessGrabbing: false,
    throwThreshold: 30.0,
    requiredAimTime: 3.0,
    useAutoReleaseTimerThrow: false,
    useAutoAim: false,
    useButtonPressForThrow: true,
    releaseButton: "Trigger",
    useDistanceFromHeadThrow: false,
    targets: 1,
  }
}

export class StaticBallooonProgress{
  static balloonInfo: BalloonProgress = {
    levelOneScore: "0",
    levelTwoScore: "0",
    levelThreeScore: "0",
    levelFourScore: "0",
    levelFiveScore: "0",
    ach0: false,
    ach1: false,
    ach2: false,
    ach3: false,
    ach4: false,
    ach5: false,
    ach6: false,
    ach7: false,
    ach8: false,
    ach9: false,
    
  }

}


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

  manuallySpawnBalloon: (patient: IPatient) => void;
  sendBalloonGameSettings: (patient: IPatient) => void;
  sendPlaneGameSettings: (patient: IPatient) => void;
  moveDart:(patient: IPatient, isUp: boolean) => void;
  setStartGame:(start: boolean) => void;
  setShowBalloonSpawner:(show: boolean) => void;
  showBalloonSpawner: boolean;
  isManual: boolean,
  setIsManual:(isManual: boolean) => void;
  spawnMethod: string;
  setSpawnMethod:(method: string) => void;
  setMode:(mode: string) => void;
  setTarget:(target: string) => void;
  setFreq:(freq: string) => void;
  setRatio:(ratio: string) => void;
  setPattern:(pattern: string) => void;
  setLives:(lives: string) =>void;
  setHand:(hand: string) => void;
  setModifier:(modifier: string) => void;
  setNumOfBalloonsSpawnedAtOnce:(num: string) => void;
  setTimeBetweenSpawns:(time: string) => void;
  modeState: string;
  targetState: string;
  freqState: string;
  ratioState: string;
  patternState: string;
  livesState: string;
  handState: string;
  modifierState: string;
  numOfBalloonsSpawnedAtOnceState: string;
  timeBetweenSpawnsState: string;
  gameIsRunning: boolean;
  setGameIsRunning:(running: boolean) => void;
  loadPatientBalloonGameData:(userName: string) => void;
  balloonInfo: BalloonProgress;

}





const SocketContext = React.createContext<ISocketContext>({} as ISocketContext);

export const SocketProvider = (props: { children: ReactElement }) => {
  const { children } = props;
  const auth = useUserContext();
  const session = useSessionContext();
  const axiosContext = useAxiosContext();
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
  const [showBalloonSpawner, setShowBalloonSpawner] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [spawnMethod, setSpawnMethod] = useState("1");
  const [modeState, setMode] = useState("1");
  const [targetState, setTarget] = useState("10");
  const [freqState, setFreq] = useState("Low");
  const [ratioState, setRatio] = useState("pattern");
  const [patternState, setPattern] = useState("1");
  const [livesState, setLives] = useState("5");
  const [handState, setHand] = useState("2");
  const [modifierState, setModifier] = useState("1.00");
  const [numOfBalloonsSpawnedAtOnceState, setNumOfBalloonsSpawnedAtOnce] = useState("2");
  const [timeBetweenSpawnsState, setTimeBetweenSpawns] = useState("2.5");
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const sessionContext = useSessionContext();
  const [startGame, setStartGame] = useState(false);
  const [balloonInfo, setBalloonInfo] = useState(StaticBallooonProgress.balloonInfo)

  
  const loadPatientBalloonGameData = async( userName: string) => {
    let newData: BalloonProgress
    let res = await axiosContext.loadPatientBalloonData(userName)
      newData = {
          levelOneScore: res.data.levelOneScore,
          levelTwoScore: res.data.levelTwoScore,
          levelThreeScore: res.data.levelThreeScore,
          levelFourScore: res.data.levelFourScore,
          levelFiveScore: res.data.levelFiveScore,
          ach0: res.data.ach0,
          ach1: res.data.ach1,
          ach2: res.data.ach2,
          ach3: res.data.ach3,
          ach4: res.data.ach4,
          ach5: res.data.ach5,
          ach6: res.data.ach6,
          ach7: res.data.ach7,
          ach8: res.data.ach8,
          ach9: res.data.ach9,}
      StaticBallooonProgress.balloonInfo = newData;
      setBalloonInfo(newData);
      return newData;
  }

  const handleServerEvents = (newSocket: Socket) => {
    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join', newSocket.id);
    });


    newSocket.on("balloonProgressionUpdate",(payload: string) => {
      loadPatientBalloonGameData(payload);

    });
    newSocket.on("clientGameEnded",() =>{
      setGameIsRunning(false);


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
    let balloonSettings:IBalloonSettings = BalloonSettingsStatic.balloonSettings;
    if(socket){
      socket.emit("balloonSettings",{...patient, balloonSettings});
    }
  };
  const sendPlaneGameSettings = (patient: IPatient) => {
    //If the game is the plane game, update plane settings
    let planeSettings: IPlaneSettings = PlaneSettingsStatic.planeSettings;
    if(socket){
      socket.emit("planeSettings",{...patient, planeSettings});
      console.log(planeSettings);
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
        manuallySpawnBalloon,
        sendBalloonGameSettings,
        sendPlaneGameSettings,
        setStartGame,
        moveDart,
        setShowBalloonSpawner,
        showBalloonSpawner,
        isManual,
        setIsManual,
        spawnMethod,
        setSpawnMethod,
        setFreq,
        setTarget,
        setHand,
        setNumOfBalloonsSpawnedAtOnce,
        setTimeBetweenSpawns,
        setMode,
        setRatio,
        setPattern,
        setLives,
        setModifier,
        modeState,
        targetState,
        freqState,
        ratioState,
        patternState,
        livesState,
        handState,
        modifierState,
        numOfBalloonsSpawnedAtOnceState,
        timeBetweenSpawnsState,
        gameIsRunning,
        setGameIsRunning,
        loadPatientBalloonGameData,
        balloonInfo,
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
