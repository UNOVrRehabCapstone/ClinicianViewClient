import { Button, Col, Input, Modal, Row, Select, Slider, Tooltip } from "antd";
import { session } from "electron";
import { FC, useState } from "react";
import { useSessionContext } from "renderer/context/SessionContext";
import { PlaneSettingsStatic, useSocketContext } from "renderer/context/SocketContext";
import { IPatient } from "renderer/interfaces/Session";
import { debuglog } from "util";

const { Option } = Select;

export interface IPlaneGameSettings {
    patient: IPatient
}

export const PlaneSettings: FC<IPlaneGameSettings> = ({
    patient
}) => {
    const sessionContext = useSessionContext();
    const socketContext = useSocketContext();
    
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
            <span>Plane Spawn: </span>
            <Tooltip color={"rgba(14, 118, 254, 1)"} mouseLeaveDelay={0} title="Where should the plane spawn?" placement="topLeft">
                <Select
                    style={{ width: 150, marginRight: 10}}
                    defaultValue="0"
                    disabled={socketContext.gameIsRunning}
                    onChange={(e) =>{
                        if(e=="0"){
                            PlaneSettingsStatic.planeSettings.leftSideSpawnOnly = false;
                            PlaneSettingsStatic.planeSettings.rightSideSpawnOnly = false;
                            //console.log("All Spawns, Left: " + PlaneSettingsStatic.planeSettings.leftSideSpawnOnly + " Right: " + PlaneSettingsStatic.planeSettings.rightSideSpawnOnly);
                        }
                        if(e=="1"){
                            PlaneSettingsStatic.planeSettings.leftSideSpawnOnly = true;
                            PlaneSettingsStatic.planeSettings.rightSideSpawnOnly = false;
                            //console.log("Left Spawns, Left: " + PlaneSettingsStatic.planeSettings.leftSideSpawnOnly + " Right: " + PlaneSettingsStatic.planeSettings.rightSideSpawnOnly);
                        }
                        if(e=="2"){
                            PlaneSettingsStatic.planeSettings.leftSideSpawnOnly = false;
                            PlaneSettingsStatic.planeSettings.rightSideSpawnOnly = true;
                            //console.log("Right Spawns, Left: " + PlaneSettingsStatic.planeSettings.leftSideSpawnOnly + " Right: " + PlaneSettingsStatic.planeSettings.rightSideSpawnOnly);
                        }
                        
                    }}  
                    >
                        <Option value="0">Any Spawn</Option>
                        <Option value="1">Left Spawns Only</Option>
                        <Option value="2">Right Spawns Only</Option>
                    </Select>
            </Tooltip>
        </Col>
        <Col
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: "280px"
            }}>
            <span>Targets Spawned: </span>
            <Tooltip color={"rgba(14, 118, 254, 1)"} mouseLeaveDelay={0} title="How many targets should be spanwed?" placement="bottomLeft">
                <Select
                    style={{ width: 150, marginRight: 10}}
                    defaultValue="1"
                    disabled={socketContext.gameIsRunning}
                    onChange={(e) =>{
                        if(e == "1"){
                            PlaneSettingsStatic.planeSettings.targets = 1;
                        }
                        if(e == "2"){
                            PlaneSettingsStatic.planeSettings.targets = 2;
                        }
                        if(e == "3"){
                            PlaneSettingsStatic.planeSettings.targets = 3;
                        }
                        if(e == "4"){
                            PlaneSettingsStatic.planeSettings.targets = 4;
                        }
                        if(e == "5"){
                            PlaneSettingsStatic.planeSettings.targets = 5;
                        }
                        if(e == "6"){
                            PlaneSettingsStatic.planeSettings.targets = 6;
                        }
                        if(e == "7"){
                            PlaneSettingsStatic.planeSettings.targets = 7;
                        }
                        if(e == "8"){
                            PlaneSettingsStatic.planeSettings.targets = 8;
                        }
                        if(e == "9"){
                            PlaneSettingsStatic.planeSettings.targets = 9;
                        }
                        if(e == "10"){
                            PlaneSettingsStatic.planeSettings.targets = 10;
                        }
                    }}>
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                        <Option value="6">6</Option>
                        <Option value="7">7</Option>
                        <Option value="8">8</Option>
                        <Option value="9">9</Option>
                        <Option value="10">10</Option>
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

            <span>Gripless Grabbing: </span>
            <Tooltip color={"rgba(14, 118, 254, 1)"} mouseLeaveDelay={0} title="Activate Gripless Grabbing.  Gripless Grabbing must be active to use auto aim." placement="topLeft">
                <Select
                    style={{ width: 200, marginRight: 10}}
                    defaultValue="0"
                    disabled={socketContext.gameIsRunning}
                    onChange={(e) =>{
                        if(e=="0"){
                            PlaneSettingsStatic.planeSettings.griplessGrabbing = false;
                            sessionContext.setShowAdvancedPlaneSettings(false);
                            //console.log("Advanced: " + sessionContext.showAdvancedPlaneSettings);
                        }
                        if(e=="1"){
                            PlaneSettingsStatic.planeSettings.griplessGrabbing = true;
                            sessionContext.setShowAdvancedPlaneSettings(true);
                        }
                }}>
                    <Option value="0">Off</Option>
                    <Option value="1">On</Option>
                </Select>
            </Tooltip>
        </Col>
        <Col
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: "280px"
        }}>
            {sessionContext.showAdvancedPlaneSettings ? (<div>
                <span>Use Auto Aim:  </span>
                <Tooltip color={"rgba(14, 118, 254, 1)"} mouseLeaveDelay={0} title="Automatically Aim at the target." placement="topLeft">
                    <Select
                        style={{ width: 150, marginRight: 10}}
                        disabled={socketContext.gameIsRunning}
                        defaultValue="0"
                        onChange={(e) =>{
                            if(e== "0"){
                                PlaneSettingsStatic.planeSettings.useAutoAim = false;
                            }
                            if(e == "1"){
                                PlaneSettingsStatic.planeSettings.useAutoAim = true;
                            }
                        }}>
                            <Option value="0">Off</Option>
                            <Option value="1">On</Option>
                        </Select>
                </Tooltip>
            </div>) : <div></div>}
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
            <span>Release Mechanism: </span>
            <Tooltip color={"rgba(14, 118, 254, 1)"} mouseLeaveDelay={0} title="How will the patinet release the plane?" placement="topLeft">
                <Select 
                    style={{ width: 200, marginRight: 10}}
                    defaultValue="0"
                    disabled={socketContext.gameIsRunning}
                    onChange={(e) => {
                        if(e =="0"){
                            PlaneSettingsStatic.planeSettings.useDistanceFromHeadThrow = false;
                            PlaneSettingsStatic.planeSettings.useButtonPressForThrow = true;
                            PlaneSettingsStatic.planeSettings.useAutoReleaseTimerThrow = false;
                            sessionContext.setShowButtonSettings(true);
                            sessionContext.setShowDistanceSettings(false);
                            sessionContext.setShowAutoSettings(false);
                        }
                        if(e == "1"){
                            PlaneSettingsStatic.planeSettings.useDistanceFromHeadThrow = true;
                            PlaneSettingsStatic.planeSettings.useButtonPressForThrow = false;
                            PlaneSettingsStatic.planeSettings.useAutoReleaseTimerThrow = false;
                            sessionContext.setShowDistanceSettings(true);
                            sessionContext.setShowAutoSettings(false);
                            sessionContext.setShowButtonSettings(false);
                        }
                        if(e == "2"){
                            PlaneSettingsStatic.planeSettings.useDistanceFromHeadThrow = false;
                            PlaneSettingsStatic.planeSettings.useButtonPressForThrow = false;
                            PlaneSettingsStatic.planeSettings.useAutoReleaseTimerThrow = true;
                            sessionContext.setShowAutoSettings(true);
                            sessionContext.setShowDistanceSettings(false);
                            sessionContext.setShowButtonSettings(false);
                        }
                    }}>
                        <Option value="0">Button Press</Option>
                        <Option value="1">Distance From Head</Option>
                        <Option value="2">Auto Release Timer</Option>
                </Select>
            </Tooltip>
        </Col>
        <Col
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: "280px"
            }}>
            {sessionContext.showButtonSettings ? (<div>
                <span>Throw Button: </span>
                <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="What button will the patient press to release the plane?" placement="topLeft">
                    <Select
                        style={{ width: 150, marginRight: 10}}
                        disabled={socketContext.gameIsRunning}
                        defaultValue="Trigger"
                        onChange={(e) =>{
                            if(e == "A"){
                                PlaneSettingsStatic.planeSettings.releaseButton = "A";
                            }
                            if(e == "B"){
                                PlaneSettingsStatic.planeSettings.releaseButton = "B";
                            }
                            if(e == "Joystick"){
                                PlaneSettingsStatic.planeSettings.releaseButton = "Joystick";
                            }
                            if(e == "Trigger"){
                                PlaneSettingsStatic.planeSettings.releaseButton = "Trigger";
                            }
                            if(e == "Grip"){
                                PlaneSettingsStatic.planeSettings.releaseButton = "Grip";
                            }
                            
                        }}>       
                        <Option value="A">A</Option>
                        <Option value="B">B</Option>
                        <Option value="Joystick">Joystick</Option>
                        <Option value="Trigger">Trigger</Option>
                        <Option value="Grip">Grip</Option>
                    </Select>
                </Tooltip>
            </div>) : null}
            {sessionContext.showDistanceSettings ? (<div>
                <span>Distance: </span>
                <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="How far of an extention to throw the plane? (In cm)" placement="bottomLeft">
                    <Select
                        style={{ width: 150, marginRight: 10}}
                        disabled={socketContext.gameIsRunning}
                        defaultValue="35"
                        onChange={(e) => {
                            if(e == "5"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 5;
                            }
                            if(e == "10"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 10;
                            }
                            if(e == "15"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 15;
                            }
                            if(e == "20"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 20;
                            }
                            if(e == "25"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 25;
                            }
                            if(e == "30"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 30;
                            }
                            if(e == "35"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 35;
                            }
                            if(e == "40"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 40;
                            }
                            if(e == "45"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 45;
                            }
                            if(e == "50"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 50;
                            }
                            if(e == "55"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 55;
                            }
                            if(e == "60"){
                                PlaneSettingsStatic.planeSettings.throwThreshold = 60;
                            }
                        }}>
                        <Option value="5">5 cm</Option>
                        <Option value="10">10 cm</Option>
                        <Option value="15">15 cm</Option>
                        <Option value="20">20 cm</Option>
                        <Option value="25">25 cm</Option>
                        <Option value="30">30 cm</Option>
                        <Option value="35">35 cm</Option>
                        <Option value="40">40 cm</Option>
                        <Option value="45">45 cm</Option>
                        <Option value="50">50 cm</Option>
                        <Option value="55">55 cm</Option>
                        <Option value="60">60 cm</Option>
                    </Select>
                </Tooltip>
            </div>) : null}
            {sessionContext.showAutoSettings ? (<div>
                <span>Time: </span>
                <Tooltip color={"rgba(14,118,254,1)"} mouseLeaveDelay={0} title="How long does the patient need to hold aim?" placement="bottomLeft">
                    <Select
                    style={{ width: 150, marginRight: 10}}
                    disabled={socketContext.gameIsRunning}
                    defaultValue="3.0"
                    onChange={(e) =>{
                        if(e == "0.5"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 0.5;
                        }
                        if(e == "1.0"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 1.0;
                        }
                        if(e == "1.5"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 1.5;
                        }
                        if(e == "2.0"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 2.0;
                        }
                        if(e == "2.5"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 2.5;
                        }
                        if(e == "3.0"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 3.0;
                        }
                        if(e == "3.5"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 3.5;
                        }
                        if(e == "4.0"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 4.0;
                        }
                        if(e == "4.5"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 4.5;
                        }
                        if(e == "5.0"){
                            PlaneSettingsStatic.planeSettings.requiredAimTime = 5.0;
                        }
                    }}>
                        <Option value="0.5">0.5 seconds</Option>
                        <Option value="1.0">1.0 seconds</Option>
                        <Option value="1.5">1.5 seconds</Option>
                        <Option value="2.0">2.0 seconds</Option>
                        <Option value="2.5">2.5 seconds</Option>
                        <Option value="3.0">3.0 seconds</Option>
                        <Option value="3.5">3.5 seconds</Option>
                        <Option value="4.0">4.0 seconds</Option>
                        <Option value="4.5">4.5 seconds</Option>
                        <Option value="5.0">5.0 seconds</Option>
                    </Select>
                </Tooltip>
            </div>) : null}
        </Col>
    </Row>
        </div>
    )
}