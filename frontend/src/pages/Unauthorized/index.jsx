import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { USER_ROLES } from '../../services/authService';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  // 根据用户角色决定返回的页面
  const handleBackHome = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    switch (user.role) {
      case USER_ROLES.ADMIN:
        navigate('/admin/dashboard');
        break;
      case USER_ROLES.FARMER:
        navigate('/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Result
        status="403"
        title="无权访问"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={handleBackHome}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;