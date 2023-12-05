import { Button, Col, Divider, Input, Modal, Row, Tooltip } from "antd";
import { FC, useState } from "react";
import { useSessionContext } from "renderer/context/SessionContext";

export const BalloonCareerMode: FC = () =>{

  const startCareerLevel = async (level: string) =>{
    await sessionContext.setCareerModeLevelToPlay(level);
    await sessionContext.startGame(sessionContext.currentSession?.sessionKey)
     sessionContext.sendBalloonGameSettings(sessionContext.currentSession?.sessionKey)

  }

    const sessionContext = useSessionContext();
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
          <Button onClick={ () =>{
            startCareerLevel("0");
          }


          }>Play</Button>
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
          <Button onClick={ () =>{
            startCareerLevel("1");
          }


          }>Play</Button>
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
          <Button onClick={ () =>{
            startCareerLevel("2");
          }


          }>Play</Button>
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
          <Button onClick={ () =>{
            startCareerLevel("3");
          }


          }>Play</Button>
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
          <Button onClick={ () =>{
            startCareerLevel("4");
          }


          }>Play</Button>
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