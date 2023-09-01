import './SessionGrid.css';

import React from 'react';
import { List, Tabs } from 'antd';
import { SessionCard } from '../SessionCard/SessionCard';
import { useSessionContext } from '../../context/SessionContext';
import { useUserContext } from '../../context/UserContext';

const { TabPane } = Tabs;

const SessionGrid = () => {
  const session = useSessionContext();
  const auth = useUserContext();

  return (
    <Tabs
      defaultActiveKey="1"
      className="session-grid"
      style={{ margin: '0', width: '100%', padding: '0 1.5rem' }}
    >
      <TabPane tab="My Sessions" key="1">
        <List
          itemLayout="horizontal"
          dataSource={session.sessionList.filter(
            (itm) => itm.createdByName === auth.currentUser?.username
          )}
          split
          loading={session.sessionListLoading}
          renderItem={(item) => <SessionCard session={item} />}
        />
      </TabPane>
      <TabPane tab="Other Sessions" key="2">
        <List
          itemLayout="horizontal"
          dataSource={session.sessionList.filter(
            (itm) => itm.createdByName !== auth.currentUser?.username
          )}
          split
          loading={session.sessionListLoading}
          renderItem={(item) => <SessionCard session={item} />}
        />
      </TabPane>
    </Tabs>
  );
};

export default SessionGrid;
