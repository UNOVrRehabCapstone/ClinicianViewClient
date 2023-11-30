import { Button, Col, Input, Modal, Row, Select, Slider, Tooltip } from "antd";
import { FC, useState } from "react";
import { useSessionContext } from "renderer/context/SessionContext";
import { BalloonCareerMode } from "./BalloonCareerMode";
import { BalloonCustomMode } from "./BalloonCustomMode";

const { Option } = Select;


export const BalloonSettings: FC = () =>{
    const sessionContext = useSessionContext();
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
                defaultValue={"1"}
                onChange={(e) =>{
                  if(e=="0"){
                    setShowCareerMode(true);

                  }
                  if(e =="1"){
                    setShowCareerMode(false);
                  }
                  sessionContext.setCurrentBalloonGameMode(e)
                }
                }>
                <Option value="0">Career Mode</Option>
                <Option value="1">Custom Game</Option>
              </Select>          
            </Tooltip>
        </Col>
      </Row>

      {showCareerMode ? ( <BalloonCareerMode/>) : (<BalloonCustomMode/>)}
      
     
        </div>
    )
}
