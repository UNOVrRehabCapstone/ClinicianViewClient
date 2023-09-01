import React, { FC, useEffect, useRef } from 'react';
import { useSessionContext } from 'renderer/context/SessionContext';
import { useSocketContext } from 'renderer/context/SocketContext';
import { useUserContext } from 'renderer/context/UserContext';
import { IPatient } from 'renderer/interfaces/Session';

export interface IPatientRep {
  patient: IPatient;
}

const RepModal: FC<IPatientRep> = ({ patient }: IPatientRep) => {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const auth = useUserContext();
  const scrollRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [socketContext.lastLeftRep, socketContext.lastRightRep]);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          textAlign: 'center',
        }}
      >
        <div
          className="left"
          style={{
            borderRight: '1px solid gray',
            width: '50%',
            borderBottom: '2px solid gray',
          }}
        >
          <h2>Left Hand</h2>
        </div>
        <div
          className="right"
          style={{
            borderLeft: '1px solid gray',
            width: '50%',
            borderBottom: '2px solid gray',
          }}
        >
          <h2>Right Hand</h2>
        </div>
      </div>
      <div className="data" style={{ height: '100px', overflowY: 'scroll' }}>
        {socketContext.repData.map((rep) => {
          return (
            <>
              {rep.split(':')[0] === 'Left' ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  {' '}
                  <p>{rep.split(':')[1]}</p> <p>-</p>{' '}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  {' '}
                  <p>-</p> <p>{rep.split(':')[1]}</p>
                </div>
              )}
            </>
          );
        })}
        <div ref={scrollRef} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <div
          className="leftTotal"
          style={{
            width: '50%',
            borderTop: '2px solid gray',
            textAlign: 'center',
            padding: 6,
            fontSize: '18px',
          }}
        >
          {socketContext.lastLeftRep}
        </div>
        <div
          className="rightTotal"
          style={{
            width: '50%',
            borderTop: '2px solid gray',
            textAlign: 'center',
            padding: 6,
            fontSize: '18px',
          }}
        >
          {socketContext.lastRightRep}
        </div>
      </div>
    </div>
  );
};

export default RepModal;
