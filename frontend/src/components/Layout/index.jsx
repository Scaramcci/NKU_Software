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
  const role = user?.role || 'user'; // fallback 防止未登录
  const [aiChatVisible, setAiChatVisible] = useState(false);

  // 菜单配置（根据角色严格区分）
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
      roles: ['farmer', 'admin'] // ❌ 不含 user
    },
    {
      key: '/data-center',
      label: '数据中心',
      icon: <DatabaseOutlined />,
      roles: ['admin'] // ❌ 仅管理员
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

  // 根据用户角色过滤可见菜单项
  const menuItems = rawMenuItems
    .filter(item => item.roles.includes(role))
    .map(({ key, label, icon, onClick }) => ({
      key,
      label,
      icon,
      onClick: onClick || (() => navigate(key))
    }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{
          height: 64,
          margin: 16,
          color: '#fff',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '32px'
        }}>
          智慧牧场系统
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
        
        {/* AI智能助手按钮 */}
        <div style={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 16, 
          right: 16 
        }}>
          <Button
            type="primary"
            icon={<RobotOutlined />}
            onClick={() => setAiChatVisible(true)}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1890ff, #52c41a)',
              border: 'none',
              fontSize: 16,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
            }}
          >
            AI智能助手
          </Button>
        </div>
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          fontSize: 16
        }}>
          欢迎，{user?.displayName || user?.username || '用户'}（{role}）
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
      
      {/* AI浮窗聊天组件 */}
      <AIFloatingChat 
        visible={aiChatVisible} 
        onClose={() => setAiChatVisible(false)} 
      />
    </Layout>
  );
};

export default MainLayout;
