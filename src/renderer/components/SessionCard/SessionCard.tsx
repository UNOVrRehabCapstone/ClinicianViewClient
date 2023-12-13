import './SessionCard.css';

import React, { FC } from 'react';
import { Button, Col, List, Row, Tooltip, Space } from 'antd';
import {
  UserAddOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ISession } from '../../interfaces/Session';
import { useSocketContext } from '../../context/SocketContext';
import { useSessionContext } from '../../context/SessionContext';

export interface ISessionCard {
  session: ISession;
}

export const SessionCard: FC<ISessionCard> = ({ session }: ISessionCard) => {
  const socket = useSocketContext();
  const sessionContext = useSessionContext();

  const getBadgeIcon = () => {
    return (
      <>
        <Tooltip title="Add Patient" placement="left">
          <Button icon={<UserAddOutlined />} />
        </Tooltip>
      </>
    );
  };

  return (
    <List.Item className="session-card">
      <Row style={{ width: '100vw' }}>
        <Col style={{ textAlign: 'left', width: '45%' }}>
          <Space>
            <Button
              onClick={() => sessionContext.copyKey(session.sessionKey)}
              style={{ marginRight: 20 }}
            >
              {session.sessionKey}
              <CopyOutlined />
            </Button>
            {session.sessionName}
          </Space>
        </Col>
        <Col style={{ textAlign: 'right', width: '55%' }}>
          {/* {getBadgeIcon()} */}
          <Button
            style={{ marginLeft: 30 }}
            onClick={() => sessionContext.clinicianJoin(session)}
          >
            Join Session
          </Button>
          <Tooltip title="Close Session" placement="bottom">
            <Button
              danger
              style={{ marginLeft: 10 }}
              onClick={() => {
                if(sessionContext.patientList.length > 0){
                  sessionContext.deletePatientFromSession(sessionContext.patientList[0].name)
                }
                sessionContext.removeSession(session.sessionKey)
              }
              }
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Col>
      </Row>
    </List.Item>
  );
};
