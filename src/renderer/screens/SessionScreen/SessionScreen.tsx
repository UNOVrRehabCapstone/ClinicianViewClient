import React, { FC, useEffect, useState } from 'react';
import './SessionScreen.css';
import { Button, Col, List, message, Modal, Row, Select, Tooltip } from 'antd';
import {
  DeleteOutlined,
  CloseOutlined,
  UserAddOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ISession } from '../../interfaces/Session';
import PatientCard from '../../components/PatientCard';
import { useSessionContext } from '../../context/SessionContext';
import FormItemLabel from 'antd/es/form/FormItemLabel';

const { Option } = Select;

export interface ISessionScreen {
  currentSession: ISession;
}

export const SessionScreen: FC<ISessionScreen> = ({
  currentSession,
}: ISessionScreen) => {
  const history = useNavigate();
  const sessionContext = useSessionContext();
  const [showGameOptions, setShowOptions] = useState(false);
  const [showStartGameButton, setShowStartGameButton] = useState(false);
  const [showBalloonGoal, setShowBalloonGoal]=useState(false);
  const [showAddPatientsModal, setShowAddPatientsModal] = useState(false);
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [selectedPatientsToAdd, setSelectedPatientsToAdd] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sessionContext.getPatientsInSession(currentSession.sessionKey);
    console.log(window.location.href);
  }, [currentSession]);

  const addPatientsToRoom = () => {
    setLoading(true);

    if (selectedPatientsToAdd.length <= 0) return;
    sessionContext.addClientsToSession(
      selectedPatientsToAdd,
      currentSession.sessionKey
    );
    setSelectedPatientsToAdd([]);
    setShowAddPatientsModal(false);
    sessionContext.getWaitingClients();
    sessionContext
      .getPatientsInSession(currentSession.sessionKey)
      .then(() => setLoading(false))
      .catch((err) => message.error(err));
  };

  const handleDelete = () => {
    sessionContext.removeSession(currentSession.sessionKey);
    history('/dashboard');
  };

  return (
    <div className="session-screen">
      <Modal
        visible={showAddPatientsModal}
        onOk={addPatientsToRoom}
        onCancel={() => setShowAddPatientsModal(false)}
        confirmLoading={loading}
        maskClosable={false}
      >
        <Select
          mode="multiple"
          loading={sessionContext.clientListLoading}
          style={{ width: '90%', margin: 15 }}
          allowClear
          optionFilterProp="children"
          value={selectedPatientsToAdd}
          onChange={(value: any) => setSelectedPatientsToAdd(value)}
          filterOption={(input, option) => {
            const label: any = option?.children;
            if (label) {
              return label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }
            return false;
          }}
        >
          {sessionContext.waitingClients &&
            sessionContext.waitingClients.map((r) => {
              return (
                <Option value={r.socketId} key={r.socketId}>
                  {r.name}
                </Option>
              );
            })}
        </Select>
      </Modal>

      <Row
        style={{
          height: '15%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Col
          style={{
            padding: 10,
            width: '50%',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Tooltip title="Leave Session" placement="bottomLeft">
            <Button
              style={{ marginRight: 10 }}
              icon={<CloseOutlined />}
              onClick={() =>
                sessionContext.leaveSession(
                  sessionContext.currentSession?.sessionKey
                )
              }
            />
          </Tooltip>
          <Select
            style={{ width: 150, marginRight: 10 }}
            placeholder="Select Game"
            onChange={(e) =>{
              sessionContext.selectGame(e)
              if(e == "2" || e == "0"){
                setShowStartGameButton(true)
              }
              else{
                setShowStartGameButton(false)
              }
              if(e == "2"){
                setShowOptions(true)
              }
              else{
                setShowOptions(false)
                setShowBalloonGoal(false)
              }
            }
            }
          >
            <Option value="0">Initialize</Option>
            <Option value="1">Box and Blocks</Option>
            <Option value="2">Balloons</Option>
            {/* FIXME: Add the other games here */}
            <Option value="3">Planes</Option>
          </Select>
          {showStartGameButton ? (          
          <Tooltip title="Start Game" placement="bottomLeft">
            <Button
              style={{ marginRight: 10 }}
              icon={<PlayCircleOutlined/>}
              onClick={() =>{
                sessionContext.startGame(
                  sessionContext.currentSession?.sessionKey
                )
              }

              }
            />
          </Tooltip>) : (<div></div>)}


          {/* <Button icon={<CaretRightOutlined />} /> */}
        </Col>
        <Col style={{ padding: 10, width: '30%', textAlign: 'left' }} />
        <Col
          style={{
            padding: 10,
            width: '20%',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Tooltip title="Add Patients" placement="bottom">
            <Button
              style={{ marginLeft: 10 }}
              icon={<UserAddOutlined />}
              onClick={() => {
                sessionContext.getWaitingClients();
                setShowAddPatientsModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Close Session" placement="bottom">
            <Button
              danger
              style={{ marginLeft: 10 }}
              onClick={handleDelete}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Col>
      </Row>
      <Row
      style={{
          display: 'flex',
          justifyContent: 'flex-start',
          }}>
        {showGameOptions ? (
        <Select
          style={{ width: 150, marginRight: 10 }}
          placeholder="Gamemode"
          onChange={(e) =>{
            if(e =="Endless"){
              setShowBalloonGoal(false)
            }
            else{
              setShowBalloonGoal(true)
            }
            sessionContext.setCurrentBalloonGameMode(e)
          }
        }>
          <Option value="0">Relaxed</Option>
          <Option value="1">Normal</Option>
          <Option value="2">Endless</Option>
          </Select>
          ) : (<div></div>)
          }
          {showBalloonGoal ? (
          <Select
            style={{ width: 150, marginRight: 10 }}
            placeholder="Balloons to pop"
            onChange={(e) =>{
              sessionContext.setCurrentBalloonTargetAmount(e)
            }}
            >
            <Option value="5">5</Option>
            <Option value="10">10</Option>
            <Option value="15">15</Option>
          </Select>
          ) : (<div></div>)
          }
          {showGameOptions ? (
        <Select
          style={{ width: 150, marginRight: 10 }}
          placeholder="Powerup Frequency"
          onChange={(e) =>{
            sessionContext.setCurrentPowerupFrequency(e);
          }
        }>
          <Option value="None">None</Option>
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
          </Select>
          ) : (<div></div>)
          }
      </Row>
      <Row style={{ height: '60%' }}>
        <List
          className="client-grid"
          itemLayout="horizontal"
          dataSource={sessionContext.patientList}
          split
          renderItem={(item) => (
            <PatientCard
              patient={item}
              patientGame={sessionContext.getCurrentGame()}
            />
          )}
        />
      </Row>
    </div>
  );
};
