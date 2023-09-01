import React, { useState, useEffect } from 'react';
import { Table, Button, InputNumber, message } from 'antd';
import { useSessionContext } from '../../../../context/SessionContext';
import { IPatient } from 'renderer/interfaces/Session';
import { useSocketContext } from 'renderer/context/SocketContext';

interface IPatientScale {
  patient: IPatient;
}

const Scale = ({ patient }: IPatientScale) => {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [handToScale, setHandToScale] = useState('NONE');
  const [handScale, setHandScale] = useState(0);

  const handleHandScale = () => {
    socketContext.handScale(patient, handToScale, handScale);
  };

  const columnsHandChosen = [
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
      title: 'Apply/Reset',
      dataIndex: 'AR',
      key: 'AR',
    },
  ];
  const columnsNoHandChosen = [
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
  ];

  const scaleDataChosenHand = [
    {
      key: '0',
      options: 'Scale',
      leftHand: (
        <Button
          onClick={() => {
            setHandToScale('LEFT');
            setHandScale(0);
          }}
          danger={handToScale === 'LEFT'}
        >
          Left
        </Button>
      ),
      rightHand: (
        <Button
          onClick={() => {
            setHandToScale('RIGHT');
            setHandScale(0);
          }}
          danger={handToScale === 'RIGHT'}
        >
          Right
        </Button>
      ),
      AR: (
        <Button
          onClick={() => {
            setHandToScale('NONE');
            setHandScale(0);
            sessionContext.handScale('NONE', 0);
          }}
        >
          Reset
        </Button>
      ),
    },
    {
      key: '1',
      options: 'Amount',
      leftHand: (
        <InputNumber
          step={1}
          onStep={(value, info) => {
            setHandScale(value);
          }}
          disabled={handToScale === 'RIGHT'}
          value={handScale}
        />
      ),
      rightHand: (
        <InputNumber
          step={1}
          onStep={(value, info) => {
            setHandScale(value);
          }}
          disabled={handToScale === 'LEFT'}
          value={handScale}
        />
      ),
      AR: <Button onClick={() => handleHandScale()}>Apply</Button>,
    },
  ];

  const scaleDataNoHand = [
    {
      key: '0',
      options: 'Scale',
      leftHand: (
        <Button
          onClick={() => setHandToScale('LEFT')}
          danger={handToScale === 'LEFT'}
        >
          Left
        </Button>
      ),
      rightHand: (
        <Button
          onClick={() => setHandToScale('RIGHT')}
          danger={handToScale === 'RIGHT'}
        >
          Right
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={
        handToScale === 'NONE' ? scaleDataNoHand : scaleDataChosenHand
      }
      columns={handToScale === 'NONE' ? columnsNoHandChosen : columnsHandChosen}
      pagination={false}
      size="small"
    />
  );
};

export default Scale;
