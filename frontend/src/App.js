import React from 'react';
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
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
        
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
        
        <Route path="/admin/users" element={
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