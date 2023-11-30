import React, { FC, useEffect, useState } from 'react';
import './SessionScreen.css';
import { Button, Col, List, message, Modal, Row, Select, Tooltip, Slider, Divider } from 'antd';
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
import { IPatientInfo } from 'renderer/interfaces/PatientInfo';
import Input from 'antd/lib/input/Input';
import { BalloonSettings } from 'renderer/components/BalloonGame/BalloonGameSettings';

const { Option } = Select;

export interface ISessionScreen {
  currentSession: ISession;
}

export const SessionScreen: FC<ISessionScreen> = ({
  currentSession,
}: ISessionScreen) => {
  const history = useNavigate();
  const sessionContext = useSessionContext();
  const [showStartGameButton, setShowStartGameButton] = useState(false);
  const [showAddPatientsModal, setShowAddPatientsModal] = useState(false);
  const [showBalloonSettings, setShowBalloonSettings] = useState(false);
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
      <Divider orientation='center'  style={{border:'10px'}} >
          Session Setup
        </Divider>
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
          <Tooltip color={"rgba(64,168,254,1)"} mouseLeaveDelay={0} title="Leave Session" placement="bottomLeft">
            <Button
              style={{ marginRight: 10 }}
              icon={<CloseOutlined />}
              onClick={() =>{
                sessionContext.leaveSession(
                  sessionContext.currentSession?.sessionKey
                )
              }
              }
            />
          </Tooltip>
          <Select
            style={{ width: 150, marginRight: 10 }}
            placeholder="Select Game"
            defaultValue={"0"}
            onChange={(e) =>{
              sessionContext.setCurrentGame(e)
              if(e == "0" || e == "2"){
                setShowStartGameButton(true);
              }
              else{
                setShowStartGameButton(false);
              }
            }
            }
          >
            <Option value="0">Initialize</Option>
            <Option value="2">Balloons</Option>
            <Option value="1">Box and Blocks (Old)</Option>
            {/* FIXME: Add the other games here */}
            <Option value="3">Planes (Old)</Option>
          </Select>
          {showStartGameButton ? (          
          <Tooltip color={"rgba(64,168,254,1)"} mouseLeaveDelay={0} title="Change the currently loaded game for the patient" placement="bottomLeft">
            <Button
              style={{ marginRight: 10 }}
              type="primary"
              icon={<PlayCircleOutlined/>}
              onClick={() =>{
                if(sessionContext.getCurrentGame() == "2"){
                  setShowBalloonSettings(true);
                }
                else{
                  setShowBalloonSettings(false);
                }
                sessionContext.startGame(
                  sessionContext.currentSession?.sessionKey
                )
                
              }
              }
          >Load Game</Button>
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
          <Tooltip color={"rgba(64,168,254,1)"} mouseLeaveDelay={0} title="Add Patients" placement="bottom">
            <Button
              style={{ marginLeft: 10 }}
              icon={<UserAddOutlined />}
              onClick={() => {
                sessionContext.getWaitingClients();
                setShowAddPatientsModal(true);
              }}
            />
          </Tooltip>
          <Tooltip color={"rgba(64,168,254,1)"} title="Close Session" placement="bottom">
            <Button
              danger
              style={{ marginLeft: 10 }}
              onClick={handleDelete}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Col>
      </Row>
      <Row>
      <Divider orientation='center'  style={{border:'10px'}} >
          Patient Information
        </Divider>
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


      {showBalloonSettings ? (<div>
        <Divider orientation='center' style={{border:'10px'}} >
          Balloon Game
        </Divider>
        <BalloonSettings/>
        </div>) : (<div></div>)}


    </div>
  );
};
