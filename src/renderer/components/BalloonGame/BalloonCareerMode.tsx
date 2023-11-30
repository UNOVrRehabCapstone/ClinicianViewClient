import { Button, Col, Divider, Input, Modal, Row, Tooltip } from "antd";
import { FC, useState } from "react";
import { useSessionContext } from "renderer/context/SessionContext";

export const BalloonCareerMode: FC = () =>{
    const [showPatientNameModal, setShowPatientNameModal] = useState(false);
    const sessionContext = useSessionContext();
    const [patientName, setName] = useState('Patient')

    const changeName = () => {
        setShowPatientNameModal(true);
      }


    const onPatientNameChange = () => {
        console.log(patientName);
        if(sessionContext.patientList[0]){
          sessionContext.patientList[0].name=patientName
          sessionContext.loadPatientBalloonGameData(sessionContext.patientList[0].name)
        }
        setShowPatientNameModal(false);
      }

      const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setName(e.target.value)
    
      }


      return(<div className="session-screen">
        <Modal
      open={showPatientNameModal}
      onCancel={() => setShowPatientNameModal(false)}
      onOk={onPatientNameChange}
      okText="Change Name">
        <Input placeholder="New Name"
        value={patientName}
        onChange={handleInputChange}>

        </Input>
      </Modal>
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
          <span>Patient's Progression Profile: </span>
          <Button onClick={changeName}>
          {sessionContext.patientList[0] ? (<span>{sessionContext.patientList[0].name}</span>) : (<div></div>)}        
          </Button>
            <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Load a patient's game data" placement="topLeft">
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
          <span>Current Level: </span>
          <span>{sessionContext.balloonInfo.careerProgress}</span>
            <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Load a patient's game data" placement="topLeft">
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
            width: "300px"
            }}>
          <span><b><u>Level</u></b></span>
          <span></span>
          <span></span>
          <span><b><u>Score</u></b></span>
          <span></span>
          <span><b><u>Play Button</u></b></span>
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
          <span>Level One: </span>
          <span>{sessionContext.balloonInfo.levelOneScore} / 3</span>
          <Button>Play</Button>
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
          <span>Level Two: </span>
          <span>{sessionContext.balloonInfo.levelTwoScore} / 3</span>
          <Button>Play</Button>
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
          <span>Level Three: </span>
          <span>{sessionContext.balloonInfo.levelThreeScore} / 3</span>
          <Button>Play</Button>
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
          <span>Level Four: </span>
          <span>{sessionContext.balloonInfo.levelFourScore} / 3</span>
          <Button>Play</Button>
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
          <span>Level Five: </span>
          <span>{sessionContext.balloonInfo.levelFiveScore} / 3</span>
          <Button>Play</Button>
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
          <span>Achievement String: </span>
          <span>{sessionContext.balloonInfo.achievementProgress}</span>
        </Col>
      </Row>

      </div>
      )
}