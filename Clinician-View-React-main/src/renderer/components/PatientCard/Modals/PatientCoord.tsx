import React, { FC, useEffect, useRef, useState } from 'react';
import { useUserContext } from 'renderer/context/UserContext';
import { useSessionContext } from '../../../context/SessionContext';
import { IPatient } from '../../../interfaces/Session';
import { useSocketContext } from '../../../context/SocketContext';

export interface IPatientCoord {
  patient: IPatient;
}

const PatientCoord: FC<IPatientCoord> = ({ patient }: IPatientCoord) => {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const auth = useUserContext();
  const scrollRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [
    socketContext.positionLeftController,
    socketContext.positionRightController,
    socketContext.positionHead,
  ]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        textAlign: 'center',
      }}
    >
      <div
        className="left"
        style={{
          borderRight: '1px solid gray',
          flex: 1,
          height: '300px',
        }}
      >
        <h2 style={{ flex: 1 }}>Left Hand</h2>
        <div style={{ flex: 3, overflowY: 'scroll', height: '200px' }}>
          {socketContext.positionLeftController.map((position) => {
            return <p>{position}</p>;
          })}
          <div ref={scrollRef} />
        </div>
      </div>
      <div
        className="right"
        style={{
          borderLeft: '1px solid gray',
          borderRight: '1px solid gray',
          flex: 1,
          height: '300px',
        }}
      >
        <h2 style={{ flex: 1 }}>Right Hand</h2>
        <div style={{ flex: 3, overflowY: 'scroll', height: '200px' }}>
          {socketContext.positionRightController.map((position) => {
            return <p>{position}</p>;
          })}
          <div ref={scrollRef} />
        </div>
      </div>
      <div
        className="head"
        style={{
          borderLeft: '1px solid gray',
          flex: 1,
          height: '300px',
        }}
      >
        <h2 style={{ flex: 1 }}>Head</h2>
        <div style={{ flex: 3, overflowY: 'scroll', height: '200px' }}>
          {socketContext.positionHead.map((position) => {
            return <p>{position}</p>;
          })}
          <div ref={scrollRef} />
        </div>
      </div>
    </div>
  );
};

export default PatientCoord;
