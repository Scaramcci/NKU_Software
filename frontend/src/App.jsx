import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/Layout';
import Login from './Login';
import MainInfo from './pages/MainInfo';
import SmartCenter from './pages/SmartCenter';
import UnderwaterSystem from './pages/UnderwaterSystem';
import DataCenter from './pages/DataCenter';
import AdminUserManagement from './pages/AdminUserManagement';
import UserProfile from './pages/UserProfile';
import './App.css';

// 角色定义
const USER_ROLES = {
  USER: 'user',
  FARMER: 'farmer',
  ADMIN: 'admin'
};

// 权限路由封装
const PrivateRoute = ({ children, roles }) => {
  const { user } = useSelector(state => state.auth);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页 */}
        <Route path="/login" element={<Login />} />

        {/* 主框架 */}
        <Route path="/" element={<MainLayout />}>
          {/* 默认首页 → main-info */}
          <Route index element={
            <PrivateRoute>
              <MainInfo />
            </PrivateRoute>
          } />

          {/* 所有人可访问 */}
          <Route path="main-info" element={
            <PrivateRoute>
              <MainInfo />
            </PrivateRoute>
          } />
          <Route path="smart-center" element={
            <PrivateRoute>
              <SmartCenter />
            </PrivateRoute>
          } />
          <Route path="profile" element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          } />

          {/* 农户和管理员 */}
          <Route path="underwater-system" element={
            <PrivateRoute roles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}>
              <UnderwaterSystem />
            </PrivateRoute>
          } />

          {/* 管理员和（可选）农户 */}
          <Route path="data-center" element={
            <PrivateRoute roles={[USER_ROLES.ADMIN, USER_ROLES.FARMER]}>
              <DataCenter />
            </PrivateRoute>
          } />

          {/* 仅管理员 */}
          <Route path="admin-user-management" element={
            <PrivateRoute roles={[USER_ROLES.ADMIN]}>
              <AdminUserManagement />
            </PrivateRoute>
          } />
        </Route>

        {/* 未知路径重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
