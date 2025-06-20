import React from 'react';
import './App.css';
import './styles/ocean-theme.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/Layout';
import UserAuth from './pages/UserAuth';
import Statistics from './pages/Statistics';
import Unauthorized from './pages/Unauthorized';
import UserProfile from './pages/UserProfile';
import AdminUserManagement from './pages/AdminUserManagement';
import FarmManagement from './pages/FarmManagement';
import AlarmSystem from './pages/AlarmSystem';
import DeviceControl from './pages/DeviceControl';
import MonitoringDashboard from './components/MonitoringDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { USER_ROLES } from './services/authService';
import MainInfo from './pages/MainInfo';
import SmartCenter from './pages/SmartCenter'; 
import UnderwaterSystem from './pages/UnderwaterSystem'; // 如果你是放在 pages/UnderwaterSystem/index.jsx

// 基础私有路由，只检查是否登录
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 管理员路由
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
      {children}
    </ProtectedRoute>
  );
};

// 养殖户路由
const FarmerRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={[USER_ROLES.FARMER, USER_ROLES.ADMIN]}>
      {children}
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<UserAuth />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      

      {/* 主框架：嵌套路由 */}
      <Route path="/" element={<MainLayout />}>
      {/* 首页默认跳转 */}
      <Route index element={<Navigate to="/main-info" replace />} />

      {/* 智能中心 */}
      <Route path="smart-center" element={
        <PrivateRoute>
          <SmartCenter />
        </PrivateRoute>
      } />
      <Route path="/underwater-system" element={
     <PrivateRoute>
    <UnderwaterSystem />
    </PrivateRoute>
    } />

        {/* 主要信息页面 */}
        <Route path="main-info" element={
          <PrivateRoute>
            <MainInfo />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <MonitoringDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/statistics" element={
          <PrivateRoute>
            <Statistics />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
        
<Route path="/admin-user-management" element={
  <AdminRoute>
    <AdminUserManagement />
  </AdminRoute>
} />
        
        <Route path="/farm/management" element={
          <FarmerRoute>
            <FarmManagement />
          </FarmerRoute>
        } />
        
        <Route path="/farm/control" element={
          <FarmerRoute>
            <DeviceControl />
          </FarmerRoute>
        } />
        
        <Route path="/farm/alarm" element={
          <FarmerRoute>
            <AlarmSystem />
          </FarmerRoute>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;