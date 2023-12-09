import { Button, Col, Input, Modal, Row, Select, Slider, Tooltip } from "antd";
import { FC, useState } from "react";
import { useSessionContext } from "renderer/context/SessionContext";
import { BalloonCareerMode } from "./BalloonCareerMode";
import { BalloonCustomMode } from "./BalloonCustomMode";
import { useSocketContext } from "renderer/context/SocketContext";
import { IPatient } from "renderer/interfaces/Session";

const { Option } = Select;

export interface IBalloonSettingsPage {
  patient: IPatient
}



export const BalloonSettings: FC<IBalloonSettingsPage> = ({
  patient
}) =>{
    const sessionContext = useSessionContext();
    const socketContext = useSocketContext();
    const [showCareerMode, setShowCareerMode] = useState(false);
    const [showDartAdjustModal, setShowDartAdjustModal] = useState(false);

    return(
        <div className="session-screen">
    <Row
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px',
          }}>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: "280px"
            }}>
          <span>Game Mode: </span>
            <Tooltip  color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Career - Progress through 5 levels!    Custom - Create your own custom rules!" placement="topLeft">
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={socketContext.currentBalloonGameMode}
                onChange={(e) =>{
                  if(e=="0"){
                    setShowCareerMode(true);

                  }
                  if(e =="1" || e =="2"){
                    setShowCareerMode(false);
                  }
                  socketContext.setCurrentBalloonGameMode(e)
                }
                }>
                <Option value="0">Career Mode</Option>
                <Option value="1">Custom Game</Option>
              </Select>          
            </Tooltip>
        </Col>
      </Row>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px',
          }}>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: "280px"
            }}>
          <span>Scenery: </span>
            <Tooltip  color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Select what the scene should look like. A normal looking room or a meadow" placement="topLeft">
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={sessionContext.currentScenery}
                onChange={(e) =>{
                  sessionContext.setCurrentScenery(e)
                }
                }>
                <Option value="0">Room</Option>
                <Option value="1">Meadow</Option>
              </Select>          
            </Tooltip>
        </Col>
      </Row>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px',
          }}>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: "270px"
            }}>
          <span>Adjust Darts: </span>
            <Tooltip  color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Move the darts higher / lower" placement="topLeft">
              <Button style={{width: "150px"}} type="primary" onClick={() => {setShowDartAdjustModal(true)}}>
                Click to Adjust
                </Button>     
            </Tooltip>
        </Col>
      </Row>
      <Modal
        open={showDartAdjustModal}
        onCancel={() => setShowDartAdjustModal(false)}
        onOk={() => {
          setShowDartAdjustModal(false)
        }}
      >
        <div style={{justifyContent: "center", width:"40px"}}>
        <Button type="primary" onClick={() => { socketContext.moveDart(patient,true);}}>
          Adjust Up
        </Button>
        <Button  type="primary" onClick={() => { socketContext.moveDart(patient,false);}}>
           Adjust Down
        </Button>
        </div>

        </Modal>     
      {showCareerMode ? ( <BalloonCareerMode patient={patient}/>) : (<BalloonCustomMode patient={patient}/>)}
      
     
        </div>
    )
}
