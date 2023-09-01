import React, { useState } from 'react';
import { Button, Row } from 'antd';
import Mirror from './Hand/Mirror';
import Scale from './Hand/Scale';
import { IPatient } from 'renderer/interfaces/Session';

interface IPatientHand {
  patient: IPatient;
}

const HandModal = ({ patient }: IPatientHand) => {
  const [currentOption, setCurrentOption] = useState('NONE');

  const renderOption = (modalToRender: string) => {
    switch (modalToRender) {
      case 'SCALE':
        return <Scale patient={patient} />;
      case 'MIRROR':
        return <Mirror patient={patient} />;
      default:
        return <h2>Select A Hand Mode</h2>;
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <Row
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          danger={currentOption === 'NONE'}
          onClick={() => {
            setCurrentOption('NONE');
          }}
        >
          None
        </Button>
        <Button
          danger={currentOption === 'SCALE'}
          onClick={() => {
            setCurrentOption('SCALE');
          }}
          disabled
        >
          Scale
        </Button>
        <Button
          danger={currentOption === 'MIRROR'}
          onClick={() => {
            setCurrentOption('MIRROR');
          }}
        >
          Mirror
        </Button>
      </Row>
      <Row>{renderOption(currentOption)}</Row>
    </div>
  );
};

export default HandModal;
