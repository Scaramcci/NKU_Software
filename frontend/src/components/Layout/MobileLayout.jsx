import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
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
  RobotOutlined,
  MenuOutlined
} from '@ant-design/icons';
import AIFloatingChat from '../AIFloatingChat';
import './MobileLayout.css';

const { Header, Content } = Layout;

const MobileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const role = user?.role || 'user';
  const [aiChatVisible, setAiChatVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

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
        setDrawerVisible(false);
      }
    }
  ];

  const menuItems = rawMenuItems
    .filter(item => item.roles.includes(role))
    .map(({ key, label, icon, onClick }) => ({
      key,
      label,
      icon,
      onClick: onClick || (() => {
        navigate(key);
        setDrawerVisible(false);
      })
    }));

  return (
    <Layout className="mobile-layout">
      <Header className="mobile-header">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          className="mobile-menu-button"
        />
        <div className="mobile-title">
          🌊 智慧渔场
        </div>
        <Button
          type="text"
          icon={<RobotOutlined />}
          onClick={() => setAiChatVisible(true)}
          className="mobile-ai-button"
        />
      </Header>

      <Content className="mobile-content">
        <Outlet />
      </Content>

      <Drawer
        title={
          <div className="mobile-drawer-title">
            <span className="mobile-drawer-icon">🌊</span>
            <span>智慧渔场系统</span>
          </div>
        }
        placement="left"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="mobile-drawer"
        width={280}
      >
        <div className="mobile-user-info">
          <div className="mobile-user-avatar">
            <UserOutlined />
          </div>
          <div className="mobile-user-details">
            <div className="mobile-user-name">
              {user?.displayName || user?.username || '用户'}
            </div>
            <div className="mobile-user-role">
              {role === 'admin' ? '管理员' : role === 'farmer' ? '养殖户' : '用户'}
            </div>
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className="mobile-menu"
          onClick={({ key }) => {
            const menuItem = menuItems.find(item => item.key === key);
            menuItem?.onClick();
          }}
          items={menuItems}
        />
      </Drawer>

      <AIFloatingChat 
        visible={aiChatVisible} 
        onClose={() => setAiChatVisible(false)}
      />
    </Layout>
  );
};

export default MobileLayout;