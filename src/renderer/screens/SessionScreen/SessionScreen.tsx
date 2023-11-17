import React, { FC, useEffect, useState } from 'react';
import './SessionScreen.css';
import { Button, Col, List, message, Modal, Row, Select, Tooltip, Slider } from 'antd';
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
  const [showBalloonSpawner, setShowBalloonSpawner]=useState(false);
  const [showLives, setShowLives]=useState(false);
  const [showAddPatientsModal, setShowAddPatientsModal] = useState(false);
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [showBalloonRatioSlider, setshowBalloonRatioSlider] = useState(false);
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
          padding: '10px',
          height: '10%'
          }}>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: "280px"
            }}>
          {showGameOptions ? (<span>Game Mode: </span>) : (<div></div>)}
          {showGameOptions ? (
            <Tooltip title="Manual - Manually spawn balloons Relaxed - Auto spawns, infinite lives
              Normal - Auto spawns, limited lives" placement="topLeft">
              <Select
                style={{ width: 150, marginRight: 10 }}
                placeholder="Game Mode"
                onChange={(e) =>{
                  if(e =="2"){
                    setShowBalloonGoal(false)
                    setShowBalloonSpawner(true)
                    setShowLives(false)
                  }
                  if(e =="1"){
                  
                    setShowBalloonGoal(true)
                    setShowBalloonSpawner(false)
                    setShowLives(true)
                  }
                  if(e=="0"){
                    setShowBalloonGoal(true)
                    setShowBalloonSpawner(false)
                    setShowLives(false)
                  }
                  sessionContext.setCurrentBalloonGameMode(e)
                }
                }>
                <Option value="2">Manual</Option>
                <Option value="0">Relaxed</Option>
                <Option value="1">Normal</Option>
              </Select>          
            </Tooltip>
          ) : (<div></div>)
          }
        </Col>
      </Row>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px',
          height: '10%'
        }}>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: "280px"
          }}>
          {showGameOptions ? (<span>Pattern: </span>) : (<div></div>)}
          {showGameOptions ? (
            <Tooltip title="Alternating - Spawn left THEN right Concurrent - Spawn left AND right Ratio - Chance based spawning" placement="topLeft">
              <Select
                style={{ width: 150, marginRight: 10 }}
                placeholder="Spawn pattern"
                onChange={(e) =>{
                  if(e == "2"){
                    setshowBalloonRatioSlider(true)
                  }
                  else{
                    setshowBalloonRatioSlider(false)
                  }
                  sessionContext.setCurrentSpawnPattern(e)

                }
                }>
                <Option value="1">Alternating</Option>
                <Option value="0">Concurrent</Option>
                <Option value="2">Ratio</Option>
              </Select>          
            </Tooltip>
          ) : (<div></div>)
          }
          </Col>
      </Row>
      {showBalloonRatioSlider ? (
        <Row
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            height: '10%'
            }}>
            <Col
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: "340px"
              }}>
                <span> Left / Right spawn ratio </span>
                  <Slider style={
                    {width:"220px"}}
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={0.5} 
                    onChange={(e) =>{sessionContext.setCurrentLeftRightRatio(e.toString())}}></Slider>
            </Col>
        </Row>  
            ) : ( <div></div>)}
      {showBalloonGoal  ? (
        <Row
          style={{
            display: 'flex',
            padding: '10px',
            justifyContent: 'flex-start',
            height: '10%'
          }}>
          <Col
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: "280px"
            }}>
            <span>Point Goal: </span>
            <Tooltip title="Set how many points need to be scored to win" placement='topLeft'>
              <Select
                style={{ width: 150, marginRight: 10 }}
                placeholder="Balloons to pop"
                onChange={(e) =>{
                  sessionContext.setCurrentBalloonTarget(e)
                }}
              >
                <Option value="5">5</Option>
                <Option value="10">10</Option>
                <Option value="15">15</Option>
              </Select>
            </Tooltip>
          </Col>
        </Row>  
          ) : ( <div></div>)}
      {showBalloonSpawner ? (
        <Row
          style={{
            display: 'flex',
            padding: '10px',
            justifyContent: 'flex-start',
            height: '10%'
            }}>
            <Col
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: "280px"
              }}>
                <Button type="primary" style={{width: "290px"}} onClick={() =>{sessionContext.manuallySpawnBalloon()}}>
                  Spawn Balloon
                </Button>
            </Col>
        </Row>  
            ) : ( <div></div>)}

      {showLives ? (
        <Row
          style={{
            display: 'flex',
            padding: '10px',
            justifyContent: 'flex-start',
            height: '10%'
          }}>
          <Col
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: "280px"
            }}>
              <span>Lives:</span>
          <Tooltip title="How many balloons can the player miss before losing" placement='topLeft'>
            <Select
              style={{ width: 150, marginRight: 10 }}
              placeholder="Lives"
              onChange={(e) =>{
                sessionContext.setCurrentMaxLives(e);
              }
              }>
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="5">5</Option>
            </Select>
          </Tooltip>
          </Col>
        </Row>  
            ) : ( <div></div>)}
      <Row
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px',
          height: '10%'
        }}>
          <Col style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: "280px"
          }}>
          {showGameOptions && !showBalloonSpawner ? (<span>Special Frequency: </span>) : (<div></div>)}
          {showGameOptions && !showBalloonSpawner ? (
            <Tooltip title="How many special balloons to spawn" placement='topLeft'>
              <Select
                style={{ width: 150, marginRight: 10 }}
                placeholder="Special Balloon Frequency"
                onChange={(e) =>{
                  sessionContext.setCurrentPowerupFreq(e);
                }
                }>
                <Option value="None">None</Option>
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </Tooltip>
          ) : (<div></div>)
          }
          </Col>
      </Row>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px',
          height: '10%'
        }}>
        <Col style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: "280px"
        }}>
          {showGameOptions && !showBalloonSpawner ? (<span>Hand:</span>) : (<div></div>)}
          {showGameOptions && !showBalloonSpawner ? (
          <Tooltip title="Select which hand(s) are able to score points" placement="topLeft">
            <Select
              style={{ width: 150, marginRight: 10 }}
              placeholder="Hand"
              onChange={(e) =>{
                sessionContext.setCurrentValidHand(e);
              }
              }>
            <Option value="0">Left</Option>
            <Option value="1">Right</Option>
            <Option value="2">Both</Option>
            </Select>
          </Tooltip>
          ) : (<div></div>)
          }    
        </Col>
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
