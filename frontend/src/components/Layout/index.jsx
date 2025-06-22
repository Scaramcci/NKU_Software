import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  InfoCircleOutlined,
  BulbOutlined,
  EnvironmentOutlined,
  DatabaseOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  LogoutOutlined,
  RobotOutlined
} from '@ant-design/icons';
import AIFloatingChat from '../AIFloatingChat';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const role = user?.role || 'user';
  const [aiChatVisible, setAiChatVisible] = useState(false);

  const rawMenuItems = [
    {
      key: '/main-info',
      label: '主要信息',
      icon: <InfoCircleOutlined />,
      roles: ['user', 'farmer', 'admin']
    },
    {
      key: '/smart-center',
      label: '智能中心',
      icon: <BulbOutlined />,
      roles: ['user', 'farmer', 'admin']
    },
    {
      key: '/underwater-system',
      label: '水下系统',
      icon: <EnvironmentOutlined />,
      roles: ['farmer', 'admin']
    },
    {
      key: '/data-center',
      label: '数据中心',
      icon: <DatabaseOutlined />,
      roles: ['admin']
    },
    {
      key: '/admin-user-management',
      label: '管理员管理',
      icon: <UsergroupAddOutlined />,
      roles: ['admin']
    },
    {
      key: '/profile',
      label: '个人中心',
      icon: <UserOutlined />,
      roles: ['user', 'farmer', 'admin']
    },
    {
      key: '/logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      roles: ['user', 'farmer', 'admin'],
      onClick: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        navigate('/login');
      }
    }
  ];

  const menuItems = rawMenuItems
    .filter(item => item.roles.includes(role))
    .map(({ key, label, icon, onClick }) => ({
      key,
      label,
      icon,
      onClick: onClick || (() => navigate(key))
    }));

  return (
    <Layout style={{ height: '100vh', background: '#020d1f', overflow: 'hidden' }}>
      <Sider width={220} style={{
        background: 'rgba(0, 20, 40, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRight: '2px solid rgba(0, 200, 255, 0.3)'
      }}>
        <div style={{
          height: 80,
          margin: '16px 8px',
          color: '#ffffff',
          fontSize: 22,
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '80px',
          background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.2), rgba(0, 100, 200, 0.3))',
          borderRadius: '15px',
          border: '1px solid rgba(0, 200, 255, 0.3)',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #00ccff, #0088ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🌊 智慧渔场系统
          </span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => {
            const menuItem = menuItems.find(item => item.key === key);
            menuItem?.onClick();
          }}
          items={menuItems}
        />
        <div style={{ position: 'absolute', bottom: 20, left: 12, right: 12 }}>
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={() => setAiChatVisible(true)}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #00aaff, #0066cc)',
              border: 'none',
              fontSize: 15,
              fontWeight: 600
            }}
          >
            🤖 AI智能助手
          </Button>
        </div>
      </Sider>

      <Layout style={{ background: '#020d1f' }}>
        <Header style={{
          height: 64,
          padding: '0 24px',
          background: 'rgba(0, 20, 40, 0.85)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid rgba(0, 200, 255, 0.2)'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #00ccff, #0088ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600
          }}>
            🌊 欢迎，{user?.displayName || user?.username || '用户'}（{role}）
          </span>
        </Header>

        <Content style={{
          background: 'transparent',
          padding: 0,
          margin: 0,
          height: 'calc(100vh - 64px)',
          overflow: 'hidden'
        }}>
          <Outlet />
        </Content>
      </Layout>

      <AIFloatingChat visible={aiChatVisible} onClose={() => setAiChatVisible(false)} />
    </Layout>
  );
};

export default MainLayout;
