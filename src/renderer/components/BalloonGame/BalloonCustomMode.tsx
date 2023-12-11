import { Button, Col, Divider, Row, Select, Slider, Tooltip } from "antd";
import { SliderMarks } from "antd/lib/slider";
import { FC, useState } from "react"
import { useSessionContext } from "renderer/context/SessionContext";
import { useSocketContext } from "renderer/context/SocketContext";
import { IBalloonSettingsPage } from "./BalloonGameSettings";


export const BalloonCustomMode: FC<IBalloonSettingsPage>= ({
  patient
}) =>{

    const sessionContext = useSessionContext();
    const socketContext = useSocketContext();
    const { Option } = Select;
    const [showBalloonSpawner, setShowBalloonSpawner]=useState(false);
    const [showBalloonRatioSlider, setShowBalloonRatioSlider] = useState((socketContext.currentSpawnPattern == "2"));

    
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
      <Divider orientation='center'  style={{border:'10px'}} >
          Custom Game Options
        </Divider>
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
                defaultValue={socketContext.currentBalloonGameMode}
                onChange={(e) =>{
                  if(e == "1"){
                    setShowBalloonSpawner(false)
                  }
                  else{
                    setShowBalloonSpawner(true)
                  }
                  socketContext.setCurrentBalloonGameMode(e)
                }
                }>
                <Option value="1">Automatic</Option>
                <Option value="2">Manual</Option>
              </Select>          
            </Tooltip>
          </Col>
          <Col
            style={{
              display: 'flex',
              marginLeft:'75px',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: "280px"
            }}>
            <span>Speed Modifier: </span>
            <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0}  title="Set how fast balloons float upwards" placement='topLeft'>
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={socketContext.currentBalloonSpeedModifier}
                onChange={(e) =>{
                  socketContext.setCurrentBalloonSpeedModifier(e)
                }}
              >
                <Option value="0.25">0.25</Option>
                <Option value="0.50">0.50</Option>
                <Option value="0.75">0.75</Option>
                <Option value="1.00">1.00</Option>
                <Option value="1.25">1.25</Option>
                <Option value="1.50">1.50</Option>
                <Option value="1.75">1.75</Option>
                <Option value="2.00">2.00</Option>
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
                defaultValue={socketContext.currentSpawnPattern}
                onChange={(e) =>{
                  
                  if(e == "2"){
                    setShowBalloonRatioSlider(true)
                  }
                  else{
                    setShowBalloonRatioSlider(false)
                  }
                  socketContext.setCurrentSpawnPattern(e)
                  console.log(socketContext.currentSpawnPattern == "2");
                }
                }>
                <Option value="1">Alternating</Option>
                <Option value="0">Concurrent</Option>
                <Option value="2">Ratio</Option>
              </Select>          
            </Tooltip>
          </Col>
            <Col
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft:'75px',
                width: "270px"
              }}>
                <Slider disabled={!showBalloonRatioSlider} style={
                    {width:"270px"}}
                    trackStyle={{background:"rgba(14,118,254,1)"}}
                    tooltip={{formatter}}
                    min={0}
                    max={1}
                    step={0.01}
                    defaultValue={0.5} 
                    marks={marks}
                    onChange={(e) =>{socketContext.setCurrentLeftRightRatio(e.toString())}}></Slider> 
            </Col>
      </Row>
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
            <span>Balloon Limit: </span>
            <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0}  title="Limit how many balloons be can spawned at once" placement='topLeft'>
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={socketContext.currentNumOfBalloonsAtOnce}
                onChange={(e) =>{
                  socketContext.setCurrentNumOfBalloonsAtOnce(e)
                }}
              >
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
                <Option value="6">6</Option>
              </Select>
            </Tooltip>
          </Col>
          <Col style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: "280px",
                    marginLeft:'75px',
                  }}>
                    <span>Hand:</span>
                    <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Select which hand(s) are able to score points" placement="topLeft">
                      <Select
                        style={{ width: 150, marginRight: 10 }}
                        defaultValue={socketContext.currentValidHand}
                        onChange={(e) =>{
                          socketContext.setCurrentValidHand(e);
                        }
                        }>
                      <Option value="0">Left</Option>
                      <Option value="1">Right</Option>
                      <Option value="2">Both</Option>
                      </Select>
                    </Tooltip>
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
            <span>Spawn Rate: </span>
            <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0}  title="Time in seconds between each spawn" placement='topLeft'>
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={socketContext.currentTimeBetweenSpawns}
                onChange={(e) =>{
                  socketContext.setCurrentTimeBetweenSpawns(e)
                }}
              >
                <Option value="1.00">1.00</Option>
                <Option value="1.25">1.25</Option>
                <Option value="1.50">1.50</Option>
                <Option value="2.00">2.00</Option>
                <Option value="2.50">2.50</Option>
                <Option value="3.00">3.00</Option>
                <Option value="3.50">3.50</Option>
                <Option value="4.00">4.00</Option>
                <Option value="4.50">4.50</Option>
                <Option value="5.00">5.00</Option>
              </Select>
            </Tooltip>
          </Col>
          <Col style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     width: "280px",
                     marginLeft:'75px',
                   }}>
                   <span>Special Frequency: </span>
                     <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0} title="How many special balloons to spawn" placement='topLeft'>
                       <Select
                         style={{ width: 150, marginRight: 10 }}
                         defaultValue={socketContext.currentBalloonPowerupFreq}
                         onChange={(e) =>{
                          socketContext.setCurrentPowerupFreq(e);
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
                defaultValue={socketContext.currentBalloonTarget}
                onChange={(e) =>{
                  socketContext.setCurrentBalloonTarget(e)
                }}
              >
                <Option value="5">5</Option>
                <Option value="10">10</Option>
                <Option value="15">15</Option>
                <Option value="15">20</Option>
              </Select>
            </Tooltip>
          </Col>
          <Col
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: "280px",
              marginLeft:'75px',
            }}>
              <span>Lives:</span>
          <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0} title="How many balloons can the player miss before losing" placement='topLeft'>
            <Select
              style={{ width: 150, marginRight: 10 }}
              defaultValue={socketContext.currentMaxLives}
              onChange={(e) =>{
                socketContext.setCurrentMaxLives(e);
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
                    <Button type="primary" style={{width: "290px"}} onClick={() =>{socketContext.manuallySpawnBalloon(patient)}}>
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
                justifyContent: 'flex-start',
                padding: '10px',
                height: '10%'
              }}>
              <Col style={{width:"680px"}}>
              <Tooltip color={"rgba(14,118,254,1)"}  title="Begin a custom game with the above settings" mouseLeaveDelay={0}>
              <Button style={{width:"280px"}}type="primary" onClick={() =>{
                sessionContext.startGame(sessionContext.currentSession?.sessionKey)
                socketContext.sendBalloonGameSettings(patient);
              }}>Begin Custom Game</Button>
              </Tooltip>
      
              </Col>
            </Row>
      ) : (
        <Row
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '10px',
          height: '10%'
        }}>
        <Col>
        <Tooltip color={"rgba(14,118,254,1)"}  title="Begin a custom game with the above settings" mouseLeaveDelay={0}>
        <Button style={{width:"280px"}}type="primary" onClick={() =>{
          sessionContext.startGame(sessionContext.currentSession?.sessionKey)
          socketContext.sendBalloonGameSettings(patient);
        }}>Begin Custom Game</Button>
        </Tooltip>

        </Col>
      </Row>
      )}

    </div>)
}