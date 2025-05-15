import React, { useState } from 'react';
import { Button, Form, Input, Tabs, message, Typography, Select } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure } from '../../redux/reducers/authSlice';
import api from '../../services/api';
import { USER_ROLES } from '../../services/authService';

const { Text } = Typography;
const { Option } = Select;

const UserAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('login');

  const onLoginFinish = async (values) => {
    dispatch(loginStart());
    try {
      // 从本地存储获取用户数据
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      const user = usersData.find(u => u.username === values.username && u.password === values.password);
      
      if (user) {
        // 创建模拟响应
        const mockResponse = {
          user: { username: user.username, email: user.email },
          token: `token_${Date.now()}`
        };
        
        dispatch(loginSuccess(mockResponse));
        localStorage.setItem('authToken', mockResponse.token);
        localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
        message.success('登录成功');
        navigate('/dashboard');
      } else {
        dispatch(loginFailure('用户名或密码错误'));
        message.error('用户名或密码错误');
      }
    } catch (error) {
      dispatch(loginFailure(error.message || '登录失败'));
      message.error(error.message || '登录失败');
    }
  };

  const onRegisterFinish = async (values) => {
    dispatch(registerStart());
    try {
      // 从本地存储获取现有用户
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      
      // 检查用户名是否已存在
      if (usersData.some(user => user.username === values.username)) {
        dispatch(registerFailure('用户名已存在'));
        message.error('用户名已存在');
        return;
      }
      
      // 创建新用户
      const newUser = {
        username: values.username,
        password: values.password,
        email: values.email,
        role: values.role,
        displayName: values.displayName,
        createdAt: new Date().toISOString()
      };
      
      // 保存到本地存储
      usersData.push(newUser);
      localStorage.setItem('users', JSON.stringify(usersData));
      
      // 创建模拟响应
      const mockResponse = {
        user: { 
          username: newUser.username, 
          email: newUser.email,
          role: newUser.role,
          displayName: newUser.displayName
        },
        token: `token_${Date.now()}`
      };
      
      dispatch(registerSuccess(mockResponse));
      localStorage.setItem('authToken', mockResponse.token);
      localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
      
      message.success('注册成功');
      navigate('/dashboard');
    } catch (error) {
      dispatch(registerFailure(error.message || '注册失败'));
      message.error(error.message || '注册失败');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'login',
            label: '用户登录',
            children: (
              <Form onFinish={onLoginFinish}>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="用户名" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                  登录
                </Button>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">没有账号？ </Text>
                  <a onClick={() => setActiveTab('register')}>立即注册</a>
                </div>
              </Form>
            )
          },
          {
            key: 'register',
            label: '用户注册',
            children: (
              <Form onFinish={onRegisterFinish} layout="vertical">
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="用户名" />
                </Form.Item>
                <Form.Item
                  name="displayName"
                  rules={[{ required: true, message: '请输入显示名称' }]}
                >
                  <Input prefix={<IdcardOutlined />} placeholder="显示名称" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码长度不能少于6个字符' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="邮箱" />
                </Form.Item>
                <Form.Item
                  name="role"
                  rules={[{ required: true, message: '请选择用户角色' }]}
                  initialValue={USER_ROLES.USER}
                >
                  <Select placeholder="选择用户角色">
                    <Option value={USER_ROLES.USER}>普通用户</Option>
                    <Option value={USER_ROLES.FARMER}>养殖户</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                    注册
                  </Button>
                </Form.Item>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">已有账号？ </Text>
                  <a onClick={() => setActiveTab('login')}>立即登录</a>
                </div>
              </Form>
            ),
          },
        ]}
      />
    </div>
  );
};

export default UserAuth;