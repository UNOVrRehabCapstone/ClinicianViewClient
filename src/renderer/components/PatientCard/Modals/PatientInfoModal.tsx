import React, { useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { IPatientInfo } from '../../../interfaces/PatientInfo';
import { useSessionContext } from '../../../context/SessionContext';

const PatientSettingModal = (patient: any) => {
  const sessionContext = useSessionContext();
  const [settingLoading, setSettingLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    userName: patient.name,
  });

  const test = (values: IPatientInfo) => {
    // use api call and await result to change loading
    setSettingLoading(true);
    setTimeout(() => {
      sessionContext.updatePatientInfo(values);
      setSettingLoading(false);
    }, 3000);
  };

  return (
    <div className="patient-setting">
      {settingLoading ? (
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 50 }} />}
          style={{ margin: 'auto', width: '100%', height: '100%' }}
        />
      ) : (
        <Form
          name="basic"
          onFinish={test}
          autoComplete="off"
          style={{
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Form.Item name="firstname">
            <Input placeholder="Edit Patients First Name" />
          </Form.Item>
          <Form.Item name="lastname">
            <Input placeholder="Edit Patients Last Name" />
          </Form.Item>
          <Form.Item name="username">
            <Input placeholder="Edit Patients User Name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={settingLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default PatientSettingModal;
