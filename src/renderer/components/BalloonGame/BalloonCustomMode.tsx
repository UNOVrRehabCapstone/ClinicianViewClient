import { Button, Col, Divider, Modal, Row, Select, Slider, Tooltip } from "antd";
import { SliderMarks } from "antd/lib/slider";
import { FC, useState } from "react"
import { useSessionContext } from "renderer/context/SessionContext";
import { useSocketContext } from "renderer/context/SocketContext";
import { IBalloonSettingsPage } from "./BalloonGameSettings";
import { BalloonSettingsStatic } from "renderer/context/SocketContext";
export const BalloonCustomMode: FC<IBalloonSettingsPage>= ({
  patient
}) =>{

    const sessionContext = useSessionContext();
    const socketContext = useSocketContext();
    const { Option } = Select;
    const [showBalloonRatioSlider, setShowBalloonRatioSlider] = useState((socketContext.patternState == "2"));
    const [showDartAdjustModal, setShowDartAdjustModal] = useState(false);


    const updateSettingsWhileLive = () =>{
      if(socketContext.gameIsRunning){
        socketContext.sendBalloonGameSettings(patient);
      }
    }
    
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
              disabled={socketContext.isManual || socketContext.gameIsRunning}
              style={{ width: 150, marginRight: 10 }}
              defaultValue={socketContext.targetState}
              onChange={(e) =>{
                BalloonSettingsStatic.balloonSettings.target = e
                socketContext.setTarget(e);
              }}
            >
              <Option value="5">5</Option>
              <Option value="10">10</Option>
              <Option value="15">15</Option>
              <Option value="20">20</Option>
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
            disabled={socketContext.isManual || socketContext.gameIsRunning}
            defaultValue={socketContext.livesState}
            onChange={(e) =>{
              BalloonSettingsStatic.balloonSettings.lives = e;
              socketContext.setLives(e);
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
                     width: "280px",
                   }}>
                     <span>Scoring Hand:</span>
                     <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Select which hand(s) are able to score points" placement="topLeft">
                       <Select
                         style={{ width: 150, marginRight: 10 }}
                         defaultValue={socketContext.handState}
                         disabled={socketContext.gameIsRunning || socketContext.modeState == "2"}
                         onChange={(e) =>{
                           socketContext.setHand(e);
                           BalloonSettingsStatic.balloonSettings.hand = e;
                         }
                         }>
                       <Option value="0">Left</Option>
                       <Option value="1">Right</Option>
                       <Option value="2">Both</Option>
                       </Select>
                     </Tooltip>
                   </Col>
      </Row>
        
       
      <Divider/>
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
                 defaultValue={socketContext.numOfBalloonsSpawnedAtOnceState}
                 disabled={socketContext.modeState == "2"}
                 onChange={(e) =>{
                   socketContext.setNumOfBalloonsSpawnedAtOnce(e);
                   BalloonSettingsStatic.balloonSettings.numBalloonsSpawnedAtOnce = e
                   updateSettingsWhileLive();
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
                    <span>Special Frequency: </span>
                      <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0} title="How many special balloons to spawn" placement='topLeft'>
                        <Select
                          style={{ width: 150, marginRight: 10 }}
                          defaultValue={socketContext.freqState}
                          disabled={socketContext.modeState == "2"}
                          onChange={(e) =>{
                           socketContext.setFreq(e);
                           BalloonSettingsStatic.balloonSettings.freq = e;
                           updateSettingsWhileLive();
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
            <span>Speed Modifier: </span>
            <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0}  title="Set how fast balloons float upwards" placement='topLeft'>
              <Select
                style={{ width: 150, marginRight: 10 }}
                defaultValue={socketContext.modifierState}
                onChange={(e) =>{
                  socketContext.setModifier(e);
                  BalloonSettingsStatic.balloonSettings.modifier = e;
                  updateSettingsWhileLive();
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
              <Col
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: "280px",
                marginLeft: "75px",
              }}>
              <span>Spawn Rate: </span>
              <Tooltip color={"rgba(14,118,254,1)"}  mouseLeaveDelay={0}  title="Time in seconds between each spawn" placement='topLeft'>
                <Select
                  style={{ width: 150, marginRight: 10 }}
                  defaultValue={socketContext.timeBetweenSpawnsState}
                  disabled={socketContext.modeState =="2"}
                  onChange={(e) =>{
                    BalloonSettingsStatic.balloonSettings.timeBetweenSpawns = e;
                    socketContext.setTimeBetweenSpawns(e);
                    updateSettingsWhileLive();
                    
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
           <span>Spawn Pattern: </span>
             <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Alternating - Spawn left THEN right Concurrent - Spawn left AND right Ratio - Chance based spawning" placement="topLeft">
               <Select
                 style={{ width: 150, marginRight: 10 }}
                 defaultValue={socketContext.patternState}
                 onChange={(e) =>{
                   
                   if(e == "2"){
                     setShowBalloonRatioSlider(true)
                   }
                   else{
                     setShowBalloonRatioSlider(false)
                   }
                   BalloonSettingsStatic.balloonSettings.pattern = e;
                   socketContext.setPattern(e);
                   updateSettingsWhileLive();
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
                     onChange={(e) =>{
                      BalloonSettingsStatic.balloonSettings.ratio = e.toString()
                      updateSettingsWhileLive();
                      }}></Slider> 
             </Col>
       </Row> 
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
            width: "270px",
            }}>
          <span>Adjust Darts: </span>
            <Tooltip  color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="Move the darts higher / lower" placement="topLeft">
              <Button style={{width: "150px"}} disabled={!socketContext.gameIsRunning} type="primary" onClick={() => {setShowDartAdjustModal(true)}}>
                Click to Adjust
                </Button>     
            </Tooltip>
          </Col>
          <Col style={{
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center',
           width: "280px",
           marginLeft: "75px",
          }}>
           <Tooltip color={"rgba(64,168,254,1"} mouseLeaveDelay={0} title="Click to spawn a balloon. Make sure to start the game first using the button below!">
             <Button type="primary"  style={{width: "290px"}} disabled={!socketContext.gameIsRunning || socketContext.modeState !="2"} onClick={() =>{socketContext.manuallySpawnBalloon(patient)}}>
                Spawn Balloon
              </Button>
           </Tooltip>
          </Col>
       </Row>
       <Row
         style={{
           display: 'flex',
           justifyContent: 'flex-start',
           padding: '10px',
           height: "10%",
          }}>

          {!socketContext.gameIsRunning? (
            <Col style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: "280px",
            }}>
            <Tooltip color={"rgba(14,118,254,1)"}  title="Begin a custom game with the above settings" mouseLeaveDelay={0}>
            <Button style={{width:"280px"}}type="primary" onClick={() =>{
              sessionContext.startGame(sessionContext.currentSession?.sessionKey)
              socketContext.sendBalloonGameSettings(patient);
              socketContext.setGameIsRunning(true);
            }}>Begin Custom Game</Button>
            </Tooltip>
            </Col>
 
 
            ) : (
              <Col style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: "280px",
              }}>
                <Tooltip color={"rgba(14,118,254,1)"}  title="Stop the game" mouseLeaveDelay={0}>
                <Button style={{width:"280px"}}type="primary" onClick={() =>{
                    socketContext.setGameIsRunning(false);
                    sessionContext.startGame(sessionContext.currentSession?.sessionKey);
                }}>Stop Game</Button>
                </Tooltip>
                </Col>
             )}
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

    </div>)
}

