import { Button, Col, Row, Select, Slider, Tooltip } from "antd";
import { SliderMarks } from "antd/lib/slider";
import { FC, useState } from "react"
import { useSessionContext } from "renderer/context/SessionContext";


export const BalloonCustomMode: FC = () =>{

    const { Option } = Select;
    const [showBalloonSpawner, setShowBalloonSpawner]=useState(false);
    const [showManualSettings, setShowManualSettings] = useState(false);
    const [showBalloonRatioSlider, setshowBalloonRatioSlider] = useState(false);
    const sessionContext = useSessionContext();
    
    const marks: SliderMarks = {
        0.0: " Left",
        0.5: "50 / 50",
        0.99: "Right"
    }
    const formatter = (value: any) => {
        let newVal = Math.round(value*100)
        if(value < 0.5){
            return `${100-newVal}% Left`
        }
        if(value == 0.5){
            return "50% / 50%"
        }
        else return `${newVal}% Right`
    }

    return(<div className="session-screen">
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
          <span>Balloon Spawning: </span>
            <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Choose if balloons should automatically spawn or not" placement="topLeft">
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={"1"}
                onChange={(e) =>{
                  if(e == "1"){
                    setShowBalloonSpawner(false)
                  }
                  else{
                    setShowBalloonSpawner(true)
                  }
                  sessionContext.setCurrentBalloonGameMode(e)
                }
                }>
                <Option value="1">Automatic</Option>
                <Option value="2">Manual</Option>
              </Select>          
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
          <span>Pattern: </span>
            <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Alternating - Spawn left THEN right Concurrent - Spawn left AND right Ratio - Chance based spawning" placement="topLeft">
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={"1"}
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
                marginLeft:"15px",
                width: "270px"
              }}>
                <Slider style={
                    {width:"270px"}}
                    trackStyle={{background:"rgba(14,118,254,1)"}}
                    tooltip={{formatter}}
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={0.5} 
                    marks={marks}
                    onChange={(e) =>{sessionContext.setCurrentLeftRightRatio(e.toString())}}></Slider> 
            </Col>
        </Row>  
            ) : ( <div></div>)}
      {!showBalloonSpawner ?  (
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
            <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0}  title="Set how many points need to be scored to win" placement='topLeft'>
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={"10"}
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
                <Tooltip color={"rgba(64,168,254,1"} mouseLeaveDelay={0} title="Click to spawn a balloon. Make sure to start the game first using the button below!">
                    <Button type="primary" style={{width: "290px"}} onClick={() =>{sessionContext.manuallySpawnBalloon()}}>
                        Spawn Balloon
                    </Button>
                </Tooltip>

            </Col>
        </Row>  
            ) : ( <div></div>)}

      {!showBalloonSpawner ? (
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
          <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0} title="How many balloons can the player miss before losing" placement='topLeft'>
            <Select
              style={{ width: 150, marginRight: 10 }}
              defaultValue={"5"}
              onChange={(e) =>{
                sessionContext.setCurrentMaxLives(e);
              }
              }>
              <Option value="1">1</Option>
              <Option value="3">3</Option>
              <Option value="5">5</Option>
              <Option value="10">10</Option>
              <Option value="100">Infinite</Option>
            </Select>
          </Tooltip>
          </Col>
        </Row>  
            ) : ( <div></div>)}
            {!showBalloonSpawner ? (
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
                   <span>Special Frequency: </span>
                     <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0} title="How many special balloons to spawn" placement='topLeft'>
                       <Select
                         style={{ width: 150, marginRight: 10 }}
                         defaultValue={"Low"}
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
                   </Col>
               </Row>
            ) : (<div></div>)}
            {!setShowBalloonSpawner ? (
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
                    <span>Hand:</span>
                    <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Select which hand(s) are able to score points" placement="topLeft"  mouseLeaveDelay={0}>
                      <Select
                        style={{ width: 150, marginRight: 10 }}
                        defaultValue={"2"}
                        onChange={(e) =>{
                          sessionContext.setCurrentValidHand(e);
                        }
                        }>
                      <Option value="0">Left</Option>
                      <Option value="1">Right</Option>
                      <Option value="2">Both</Option>
                      </Select>
                    </Tooltip>
                  </Col>
                </Row>
            ) : (<div></div>)}
      <Row
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px',
          height: '10%'
        }}>
        <Col >
        <Tooltip color={"rgba(14,118,254,1)"}  title="Begin a custom game with the above settings" mouseLeaveDelay={0}>
        <Button style={{width:"280px"}}type="primary" onClick={() =>{
          sessionContext.startGame(sessionContext.currentSession?.sessionKey)
          sessionContext.sendBalloonGameSettings(sessionContext.currentSession?.sessionKey);
        }}>Begin Custom Game</Button>
        </Tooltip>

        </Col>
      </Row>
    </div>)
}