import React, { useState } from 'react';
import './LoginScreen.css';
import { Form, Input, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';

const LoginScreen = () => {
  const auth = useUserContext();
  const history = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoginLoading(true);
    auth.login(values.username, values.password, () => {
      setLoginLoading(false);
    });
  };
  const onFinishFailed = (errorInfo: any) => {
    // message.error("Invalid Credentials!");
  };

  return (
    <div className="login-screen">
      {auth.loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      ) : (
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <br />
          <br /> <br />
          <br /> <br />
          <br />
          <Form.Item
            name="username"
            hasFeedback
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Username..." />
          </Form.Item>
          <Form.Item
            name="password"
            hasFeedback
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loginLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default LoginScreen;
