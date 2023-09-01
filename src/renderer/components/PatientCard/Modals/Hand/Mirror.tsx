import React, { useState, useEffect } from 'react';
import { Table, Button, InputNumber, Row, message } from 'antd';
import { useSessionContext } from '../../../../context/SessionContext';
import { useSocketContext } from 'renderer/context/SocketContext';
import { IPatient } from 'renderer/interfaces/Session';

interface IPatientMirror {
  patient: IPatient;
}

const Mirror = ({ patient }: IPatientMirror) => {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [handMirror, setHandMirror] = useState('NONE');

  const handleMirror = (hand: string) => {
    setHandMirror(hand);
    socketContext.handMirror(patient, hand);
  };

  const columns = [
    {
      title: 'Options',
      dataIndex: 'options',
      key: 'options',
    },
    {
      title: 'Left Hand',
      dataIndex: 'leftHand',
      key: 'leftHand',
    },
    {
      title: 'Right Hand',
      dataIndex: 'rightHand',
      key: 'rightHand',
    },
    {
      title: 'reset',
      dataIndex: 'reset',
      key: 'reset',
    },
  ];

  const mirrorData = [
    {
      key: '1',
      options: 'Mirror',
      leftHand: (
        <Button
          onClick={() => handleMirror('LEFT')}
          danger={handMirror === 'LEFT'}
        >
          Left
        </Button>
      ),
      rightHand: (
        <Button
          onClick={() => handleMirror('RIGHT')}
          danger={handMirror === 'RIGHT'}
        >
          Right
        </Button>
      ),
      reset: <Button onClick={() => handleMirror('NONE')}>Reset</Button>,
    },
  ];
  return (
    <Table
      dataSource={mirrorData}
      columns={columns}
      pagination={false}
      size="small"
    />
  );
};

export default Mirror;
