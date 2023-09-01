import React, { useEffect, useState } from 'react';
import { IPatient } from 'renderer/interfaces/Session';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, InputNumber, Tooltip } from 'antd';
import { EnterOutlined, PauseOutlined } from '@ant-design/icons';
import { useSessionContext } from 'renderer/context/SessionContext';
import { IPatientInfo } from 'renderer/interfaces/PatientInfo';
import PositionModal from 'renderer/components/PatientCard/Modals/PositionModal';
import Mirror from 'renderer/components/PatientCard/Modals/Hand/Mirror';
import Scale from 'renderer/components/PatientCard/Modals/Hand/Scale';
import { IKRigModal } from 'renderer/components/PatientCard/Modals/IKRigModal';

type Props = {
  patient: IPatient;
};

const PatientScreen = () => {
  const history = useNavigate();
  const sessionContext = useSessionContext();
  const { roomKey, name, id } = useParams();
  const [patient, setPatient] = useState<IPatientInfo | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    sessionContext
      .getPatient(id!, name!)
      .then((patientReceived: IPatientInfo) => {
        console.log(patientReceived);
        setPatient(patientReceived);
        return patientReceived;
      })
      .catch((error) => {
        console.log(error);
        setPatient(undefined);
      });
    console.log(window.location.href);
  }, []);

  const handlePatientPauseGame = () => {
    // sessionContext.pauseGame(patient.name, patient.socketId, isPaused);
    // setIsPaused(!isPaused);
  };

  return (
    <div style={{ maxHeight: '100vh', maxWidth: '100vw', overflow: 'hidden' }}>
      <div
        className="top"
        style={{
          margin: '50px auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div
          className="left"
          style={{
            backgroundColor: '#f2f2f2',
            height: '80vh',
            flex: 1,
            margin: '0 2rem',
          }}
        >
          <h1 style={{ textAlign: 'center' }}>
            PATIENT:
            <br />
            {patient?.userName.toUpperCase()}
          </h1>
          <div className="patient-info" style={{ marginLeft: '2rem' }}>
            <p>- {patient?.firstName}</p>
            <p>- {patient?.lastName}</p>
            <p>- {patient?.patientId}</p>
            <p>DOB</p>
          </div>
        </div>
        <div
          className="right"
          style={{
            backgroundColor: '#f2f2f2',
            height: '80vh',
            flex: 3,
            marginRight: '2rem',
          }}
        >
          <h3 style={{ textAlign: 'center', fontSize: 36 }}>OPTIONS</h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <div
              className="gaem"
              style={{
                display: 'flex',
                margin: '0 auto',
                alignContent: 'center',
              }}
            >
              <p>Current Game: {sessionContext.getCurrentGame()}</p>
              <Tooltip title="Pause Game" placement="top">
                <Button
                  icon={<PauseOutlined />}
                  onClick={handlePatientPauseGame}
                  danger={isPaused}
                />
              </Tooltip>
              <InputNumber />
            </div>
            <h3>Patient Postition</h3>
            <PositionModal />
            <h3>Hand Mirroring</h3>
            <Mirror />
            <h3>Hand Scaling</h3>
            <Scale />
            <h3>IK Rig</h3>
            <IKRigModal />
          </div>
        </div>
      </div>
      <div className="bottom">
        <Tooltip title="Exit" placement="top">
          <Button
            icon={<EnterOutlined />}
            onClick={() => history(`/session/${roomKey}`)}
            style={{ margin: '0 auto', display: 'block' }}
            danger
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default PatientScreen;
