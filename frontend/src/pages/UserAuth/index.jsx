
import React, { useState } from 'react';
import { Button, Form, Input, Tabs, message, Typography, Select } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginStart, loginSuccess, loginFailure,
  registerStart, registerSuccess, registerFailure
} from '../../redux/reducers/authSlice';
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
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = usersData.find(u => u.username === values.username && u.password === values.password);

      if (foundUser) {
        const mockResponse = {
          user: {
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
            displayName: foundUser.displayName || foundUser.username
          },
          token: `token_${Date.now()}`
        };
        dispatch(loginSuccess(mockResponse));
        localStorage.setItem('authToken', mockResponse.token);
        localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
        message.success('登录成功');
        navigate('/main-info');
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
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');

      if (usersData.some(user => user.username === values.username)) {
        dispatch(registerFailure('用户名已存在'));
        message.error('用户名已存在');
        return;
      }

      const newUser = {
        id: Date.now(), // ✅ 保证唯一性
        username: values.username,
        password: values.password,
        email: values.email,
        role: values.role,
        displayName: values.displayName,
        createdAt: new Date().toISOString()
      };

      usersData.push(newUser);
      localStorage.setItem('users', JSON.stringify(usersData));

      const mockResponse = {
        user: {
           id: Date.now(), // ✅ 加上唯一 id
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
      navigate('/main-info');
    } catch (error) {
      dispatch(registerFailure(error.message || '注册失败'));
      message.error(error.message || '注册失败');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Microsoft YaHei, sans-serif' }}>
      <div style={{
        flex: 1,
        backgroundImage: 'url("/loginbg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40
      }}>
        <div style={{
          background: 'rgba(10, 32, 80, 0.78)',
          padding: '40px 32px',
          borderRadius: 20,
          color: 'white',
          maxWidth: 480,
          boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: '50%',
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24
          }}>
            <img src="/logo.jpg" alt="logo" style={{ width: 40, height: 40, borderRadius: '50%' }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 24 }}>智慧海洋牧场可视化系统</h1>
          <ul style={{ fontSize: 14, lineHeight: '1.8', paddingLeft: 20 }}>
            <li>请使用注册账号和密码登录系统，确保信息安全。</li>
            <li>如遇无法登录、忘记密码等问题，请联系管理员协助处理。</li>
            <li>建议定期修改密码，提高账号安全性。</li>
            <li>请勿将账号密码泄露给他人，防止信息被盗用。</li>
            <li>如有功能建议或系统异常，欢迎及时反馈。</li>
          </ul>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.85)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          padding: 36,
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} centered items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form onFinish={onLoginFinish} layout="vertical">
                  <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                    <Input prefix={<UserOutlined />} placeholder="用户名" />
                  </Form.Item>
                  <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                      登录
                    </Button>
                  </Form.Item>
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">没有账号？</Text>
                    <a onClick={() => setActiveTab('register')}>立即注册</a>
                  </div>
                </Form>
              )
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <Form onFinish={onRegisterFinish} layout="vertical">
                  <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input prefix={<UserOutlined />} placeholder="用户名" />
                  </Form.Item>
                  <Form.Item name="displayName" rules={[{ required: true, message: '请输入显示名称' }]}>
                    <Input prefix={<IdcardOutlined />} placeholder="显示名称" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true }, { min: 6 }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                  </Form.Item>
                  <Form.Item name="confirmPassword" dependencies={['password']} rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    })
                  ]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
                  </Form.Item>
                  <Form.Item name="email" rules={[{ required: true }, { type: 'email' }]}>
                    <Input prefix={<MailOutlined />} placeholder="邮箱" />
                  </Form.Item>
                  <Form.Item name="role" rules={[{ required: true }]} initialValue={USER_ROLES.USER}>
                    <Select placeholder="选择用户角色">
                      <Option value={USER_ROLES.USER}>普通用户</Option>
                      <Option value={USER_ROLES.FARMER}>养殖户</Option>
                      <Option value={USER_ROLES.ADMIN}>管理员</Option>
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
              )
            }
          ]} />
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
