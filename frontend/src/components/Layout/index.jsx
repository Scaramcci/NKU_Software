import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  DashboardOutlined,
  ControlOutlined,
  BarChartOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  UserOutlined,
  BellOutlined
} from '@ant-design/icons';
import { USER_ROLES } from '../../services/authService';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const isFarmer = user?.role === USER_ROLES.FARMER || user?.role === USER_ROLES.ADMIN;

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '监控面板',
      onClick: () => navigate('/dashboard')
    },
    ...(isFarmer ? [
      {
        key: 'farm-management',
        icon: <EnvironmentOutlined />,
        label: '渔场管理',
        onClick: () => navigate('/farm/management')
      },
      {
        key: 'farm-control',
        icon: <ControlOutlined />,
        label: '设备控制',
        onClick: () => navigate('/farm/control')
      },
            {
        key: 'farm-alarm',
        icon: <BellOutlined />,
        label: '预警系统',
        onClick: () => navigate('/farm/alarm')
      },
    ] : []),
    {
      key: 'statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
      onClick: () => navigate('/statistics')
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;