import React, { useState } from 'react';
import { Table, Button, InputNumber } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useSessionContext } from '../../../context/SessionContext';
import { IPatient } from 'renderer/interfaces/Session';
import { useSocketContext } from 'renderer/context/SocketContext';

export interface IKRig {
  shoulderWidth: number;
  headHeight: number;
  armLength: number;
  extendedArmThreshold: number;
  retractedArmThreshold: number;
}

interface IPatientIKRig {
  patient: IPatient;
}

export const IKRigModal = ({ patient }: IPatientIKRig) => {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [valueIKRig, setValueIKRig] = useState<IKRig>({
    shoulderWidth: 0.0,
    headHeight: 0.0,
    armLength: 0.0,
    extendedArmThreshold: 0.0,
    retractedArmThreshold: 0.0,
  });

  const updateRigMeasurements = (measurement: number, toMeasure: string) => {
    setValueIKRig((prevState) => ({
      ...prevState,
      [toMeasure]: measurement,
    }));
  };

  const handleSetIKMeasurements = () => {
    socketContext.ikRigMeasurements(patient, valueIKRig);
  };

  const handleResetIKMeasurements = () => {
    setValueIKRig({
      shoulderWidth: 0.0,
      headHeight: 0.0,
      armLength: 0.0,
      extendedArmThreshold: 0.0,
      retractedArmThreshold: 0.0,
    });
    socketContext.ikRigMeasurements(patient, valueIKRig);
  };

  interface DataType {
    key: React.Key;
    skeleton: any;
    shoulderWidth: any;
    headHeight: any;
    armLength: any;
    extendedArmThreshold: any;
    retractedArmThreshold: any;
    reset: any;
    apply: any;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Skeleton',
      dataIndex: 'skeleton',
      key: 'skeleton',
      align: 'center',
    },
    {
      title: 'Shoulder Width',
      dataIndex: 'shoulderWidth',
      key: 'shoulderWidth',
      align: 'center',
    },
    {
      title: 'Head Height',
      dataIndex: 'headHeight',
      key: 'headHeight',
      align: 'center',
    },
    {
      title: 'Arm Length',
      dataIndex: 'armLength',
      key: 'armLength',
      align: 'center',
    },
    {
      title: 'Extended Arm Threshold',
      dataIndex: 'extendedArmThreshold',
      key: 'extendedArmThreshold',
      align: 'center',
    },
    {
      title: 'Retracted Arm Threshold',
      dataIndex: 'retractedArmThreshold',
      key: 'retractedArmThreshold',
      align: 'center',
    },
    {
      title: 'Reset',
      dataIndex: 'reset',
      key: 'reset',
      align: 'center',
    },
    {
      title: 'Apply',
      dataIndex: 'apply',
      key: 'apply',
      align: 'center',
    },
  ];

  const data = [
    {
      key: '0',
      skeleton: (
        <Button
          danger={showSkeleton}
          onClick={() => {
            setShowSkeleton(!showSkeleton);
            socketContext.showIKSkeleton(patient);
          }}
        >
          Show Skeleton
        </Button>
      ),
      shoulderWidth: (
        <InputNumber
          step={0.1}
          value={valueIKRig.shoulderWidth}
          onStep={(value, info) => {
            updateRigMeasurements(value, 'shoulderWidth');
          }}
        />
      ),
      headHeight: (
        <InputNumber
          step={0.1}
          value={valueIKRig.headHeight}
          onStep={(value, info) => {
            updateRigMeasurements(value, 'headHeight');
          }}
        />
      ),
      armLength: (
        <InputNumber
          step={0.1}
          value={valueIKRig.armLength}
          onStep={(value, info) => {
            updateRigMeasurements(value, 'armLength');
          }}
        />
      ),
      extendedArmThreshold: (
        <InputNumber
          step={0.1}
          value={valueIKRig.extendedArmThreshold}
          onStep={(value, info) => {
            updateRigMeasurements(value, 'extendedArmThreshold');
          }}
        />
      ),
      retractedArmThreshold: (
        <InputNumber
          step={0.1}
          value={valueIKRig.retractedArmThreshold}
          onStep={(value, info) => {
            updateRigMeasurements(value, 'retractedArmThreshold');
          }}
        />
      ),
      reset: (
        <Button
          onClick={() => {
            handleResetIKMeasurements();
          }}
        >
          Reset
        </Button>
      ),
      apply: (
        <Button
          onClick={() => {
            handleSetIKMeasurements();
          }}
        >
          Apply
        </Button>
      ),
    },
  ];
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      size="small"
      style={{}}
    />
  );
};
