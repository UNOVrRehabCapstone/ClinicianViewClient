import { Avatar, Dropdown, Layout, Menu, PageHeader, Spin } from 'antd';
import { Content } from 'antd/es/layout/layout';
import './GuestScreen.css';
import {
  LoadingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const GuestScreen = () => {
  const history = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item onClick={() => history('/login')}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  const DropdownMenu = () => (
    <Dropdown key="more" overlay={menu}>
      <div>
        <Avatar shape="square" icon={<UserOutlined />} />
        Guest
      </div>
    </Dropdown>
  );

  return (
    <Layout className="guest-screen">
      <PageHeader
        className="guest-header"
        ghost
        backIcon={false}
        title={<DropdownMenu />}
      />
      <Content className="content">
        <br />
        Waiting for unity connection...
        <br />
        <br />
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </Content>
    </Layout>
  );
};

export default GuestScreen;
