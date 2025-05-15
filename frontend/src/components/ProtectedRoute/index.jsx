import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { checkPermission } from '../../services/authService';

/**
 * 受保护的路由组件，用于基于角色的访问控制
 * @param {Object} props 组件属性
 * @param {React.ReactNode} props.children 子组件
 * @param {Array} props.allowedRoles 允许访问的角色数组
 * @returns {React.ReactNode} 渲染的组件
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();

  // 如果用户未登录，重定向到登录页面，并记录当前尝试访问的路径
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果指定了允许的角色，检查用户是否有权限访问
  if (allowedRoles.length > 0) {
    const hasPermission = checkPermission(user, allowedRoles);
    
    // 如果用户没有权限，重定向到无权限页面或仪表板
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 用户已登录且有权限，渲染子组件
  return children;
};

export default ProtectedRoute;