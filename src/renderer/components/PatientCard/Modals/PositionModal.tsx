import React, { FC, useState } from 'react';
import { Button, InputNumber } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { useSessionContext } from '../../../context/SessionContext';
import { useSocketContext } from 'renderer/context/SocketContext';
import { IPatient } from 'renderer/interfaces/Session';

export interface IPatientPosition {
  patient: IPatient;
}

const PositionModal: FC<IPatientPosition> = ({ patient }: IPatientPosition) => {
  const sessionContext = useSessionContext();
  const socketContext = useSocketContext();
  const [playerXPosition, setPlayerXPosition] = useState<any>(0);
  const [playerYPosition, setPlayerYPosition] = useState<any>(0);
  const [playerZPosition, setPlayerZPosition] = useState<any>(0);
  interface DataType {
    key: string;
    option: string;
    x: any;
    y: any;
    z: any;
    reset: any;
    apply: any;
  }

  const handlePosition = () => {
    socketContext.updatePatientPosition(patient, {
      playerXPosition,
      playerYPosition,
      playerZPosition,
    });
  };

  const handleResetPosition = () => {
    setPlayerXPosition(0);
    setPlayerYPosition(0);
    setPlayerZPosition(0);
    socketContext.updatePatientPosition(patient, {
      playerXPosition,
      playerYPosition,
      playerZPosition,
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Axis',
      dataIndex: 'option',
      key: 'option',
      align: 'center',
    },
    {
      title: 'X',
      dataIndex: 'x',
      key: 'x',
      align: 'center',
    },
    {
      title: 'Y',
      dataIndex: 'y',
      key: 'y',
      align: 'center',
    },
    {
      title: 'Z',
      dataIndex: 'z',
      key: 'z',
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

  const data: DataType[] = [
    {
      key: '1',
      option: 'Inputs',
      x: (
        <InputNumber
          step={0.5}
          onChange={(value) => {
            setPlayerXPosition(value);
          }}
          value={playerXPosition}
        />
      ),
      y: (
        <InputNumber
          step={0.5}
          onChange={(value) => {
            setPlayerYPosition(value);
          }}
          value={playerYPosition}
        />
      ),
      z: (
        <InputNumber
          step={0.5}
          onChange={(value) => {
            setPlayerZPosition(value);
          }}
          value={playerZPosition}
        />
      ),
      reset: (
        <Button
          onClick={() => {
            handleResetPosition();
          }}
        >
          Reset
        </Button>
      ),
      apply: (
        <Button
          onClick={() => {
            handlePosition();
          }}
        >
          Apply
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      size="small"
      style={{ width: '100%' }}
    />
  );
};

/* <Row style={{ justifyContent: "space-around" }}>
        <InputNumber
          placeholder="X axis"
          style={{ margin: "10px" }}
          step={0.1}
          value={position["xPos"]}
          onChange={(e) => handleUpdatePosition(e, "xPos")}
        />
        <InputNumber
          placeholder="Y axis"
          style={{ margin: "10px" }}
          step={0.1}
          value={position["yPos"]}
          onChange={(e) => handleUpdatePosition(e, "yPos")}
        />
        <InputNumber
          placeholder="Z axis"
          style={{ margin: "10px" }}
          step={0.1}
          value={position["zPos"]}
          onChange={(e) => handleUpdatePosition(e, "zPos")}
        />
      </Row>
      <Row style={{ justifyContent: "space-around" }}>
        <Button onClick={sessionContext.updateClientPosition(position)}>
          Update Position
        </Button>
        <Button
          danger={true}
          onClick={() => {
            setPosition({ xPos: 0, yPos: 0, zPos: 0 });
            sessionContext.updateClientPosition(position);
          }}
        >
          Reset
        </Button>
      </Row> */

export default PositionModal;
