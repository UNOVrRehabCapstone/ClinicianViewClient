import React, { FC, useEffect, useState } from 'react';
import './DashboardScreen.css';
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Modal,
  PageHeader,
  Tooltip,
  MenuProps,
} from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { useUserContext } from '../../context/UserContext';
import SessionGrid from '../../components/SessionGrid';
import { useSessionContext } from '../../context/SessionContext';
import SessionScreen from '../SessionScreen';

export interface IDashboardScreen {
  session?: boolean | undefined;
}

export const DashboardScreen: FC<IDashboardScreen> = ({ session }) => {
  const auth = useUserContext();
  const sessionContext = useSessionContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  useEffect(() => {
    sessionContext.updateSessionList();
  }, [auth.currentUser]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Menu>
          <Menu.Item onClick={() => auth.logout()} key="logout">
            <LogoutOutlined /> Logout
          </Menu.Item>
        </Menu>
      ),
    },
  ];

  const DropdownMenu = () => (
    <Dropdown key="more" menu={{ items }}>
      <div>
        <Avatar shape="square" icon={<UserOutlined />} />
        {auth.currentUser?.username}
      </div>
    </Dropdown>
  );

  const onCreateModal = () => {
    setIsCreateLoading(true);
    sessionContext.createSession(sessionName, () => {
      setIsCreateLoading(false);
      setShowCreateModal(false);
      setSessionName('');
    });
  };

  const getHeaderButton = () => {
    return (
      <Tooltip title="Create New Session" placement="left">
        <Button
          style={{ marginRight: 15 }}
          type="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusOutlined />
        </Button>
      </Tooltip>
    );
  };

  return (
    <Layout className="dashboard-screen">
      <PageHeader
        className="dashboard-header"
        ghost
        backIcon={false}
        title={<DropdownMenu />}
        extra={[getHeaderButton()]}
      />
      <Content
        className="content"
        style={{ width: '100%', overflowX: 'hidden' }}
      >
        <Modal
          open={showCreateModal}
          title="New Session"
          onOk={onCreateModal}
          confirmLoading={isCreateLoading}
          onCancel={() => setShowCreateModal(false)}
          okText="Create"
        >
          <Input
            placeholder="Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </Modal>
        {session && sessionContext.currentSession ? (
          <SessionScreen currentSession={sessionContext.currentSession} />
        ) : (
          <SessionGrid />
        )}
        {/* <Spin indicator={antIcon}/> */}
        {/* <div className="loading">Waiting for client connection...</div> */}
      </Content>
    </Layout>
  );
};
