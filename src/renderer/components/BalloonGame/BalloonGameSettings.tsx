import { Button, Col, Input, Modal, Row, Select, Slider, Tooltip } from "antd";
import { FC, useState } from "react";
import { useSessionContext } from "renderer/context/SessionContext";
import { BalloonCareerMode } from "./BalloonCareerMode";
import { BalloonCustomMode } from "./BalloonCustomMode";
import { BalloonSettingsStatic, useSocketContext } from "renderer/context/SocketContext";
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
                defaultValue={BalloonSettingsStatic.balloonSettings.mode}
                disabled={socketContext.gameIsRunning}
                onChange={(e) =>{
                  if(e=="0"){
                    setShowCareerMode(true);

                  }
                  if(e =="1"){
                    setShowCareerMode(false);
                    socketContext.setShowBalloonSpawner(false)
                    socketContext.setIsManual(false);
                    socketContext.setSpawnMethod(e);
                  }
                  if(e == "2"){
                    socketContext.setShowBalloonSpawner(true)
                    socketContext.setIsManual(true);
                    socketContext.setSpawnMethod(e);
                    setShowCareerMode(false);
                  }
                  BalloonSettingsStatic.balloonSettings.mode = e;
                  socketContext.setMode(e);

                }
                }>
                <Option value="0">Career Mode</Option>
                <Option value="1">Custom - Automatic</Option>
                <Option value="2">Custom - Manual</Option>
              </Select>          
            </Tooltip>
        </Col>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: "280px",
            marginLeft: "75px",
            }}>
          <span>Scenery: </span>
            <Tooltip  color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Select what the scene should look like. A normal looking room or a meadow" placement="topLeft">
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={sessionContext.currentScenery}
                disabled={socketContext.gameIsRunning}
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
    
      {showCareerMode ? ( <BalloonCareerMode patient={patient}/>) : (<BalloonCustomMode patient={patient}/>)}
      
     
        </div>
    )
}
