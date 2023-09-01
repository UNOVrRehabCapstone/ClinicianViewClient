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

const SERVER_IP = 'http://52.11.199.188:5000';
// const SERVER_IP = 'http://localhost:5000/';
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
  handScale: (
    patient: IPatient,
    handToScale: string,
    scaleAmount: number
  ) => void;
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

  const handleServerEvents = (newSocket: Socket) => {
    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join', newSocket.id);
    });
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

  const resumeGame = (patient: IPatient): void => {
    if (socket) {
      socket.emit('resumeGame', patient);
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
