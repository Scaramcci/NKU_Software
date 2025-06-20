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
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider style={{
        background: 'rgba(0, 20, 40, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRight: '2px solid rgba(0, 200, 255, 0.3)',
        boxShadow: '4px 0 20px rgba(0, 150, 255, 0.1)'
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
          boxShadow: '0 4px 15px rgba(0, 150, 255, 0.2)',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #00ccff, #0088ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
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
        
        {/* AI智能助手按钮 */}
        <div style={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 12, 
          right: 12 
        }}>
          <Button
            type="primary"
            icon={<RobotOutlined style={{ fontSize: '18px' }} />}
            onClick={() => setAiChatVisible(true)}
            style={{
              width: '100%',
              height: 56,
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #00aaff, #0066cc, #004499)',
              border: '2px solid rgba(0, 200, 255, 0.4)',
              fontSize: 16,
              fontWeight: 700,
              color: '#ffffff',
              boxShadow: 
                '0 6px 20px rgba(0, 150, 255, 0.4), ' +
                '0 3px 10px rgba(0, 100, 200, 0.3), ' +
                'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = 
                '0 8px 25px rgba(0, 150, 255, 0.5), ' +
                '0 4px 15px rgba(0, 100, 200, 0.4), ' +
                'inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 
                '0 6px 20px rgba(0, 150, 255, 0.4), ' +
                '0 3px 10px rgba(0, 100, 200, 0.3), ' +
                'inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
          >
            🤖 AI智能助手
          </Button>
        </div>
      </Sider>
      <Layout style={{ background: 'transparent' }}>
        <Header style={{
          padding: '0 32px',
          background: 'rgba(0, 20, 40, 0.85)',
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid rgba(0, 200, 255, 0.3)',
          boxShadow: '0 2px 20px rgba(0, 150, 255, 0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          fontSize: 16,
          color: '#ffffff',
          borderRadius: '0 0 15px 0'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #00ccff, #0088ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 600,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            🌊 欢迎，{user?.displayName || user?.username || '用户'}（{role}）
          </span>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: '32px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(0, 200, 255, 0.2)',
          boxShadow: 
            '0 8px 40px rgba(0, 150, 255, 0.15), ' +
            '0 4px 20px rgba(0, 100, 200, 0.1), ' +
            'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          minHeight: 'calc(100vh - 140px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #00aaff, #00ccff, #0088ff)',
            borderRadius: '20px 20px 0 0'
          }} />
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
