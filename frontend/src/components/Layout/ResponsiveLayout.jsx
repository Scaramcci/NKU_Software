import React, { useState, useEffect } from 'react';
import { isMobileDevice, onOrientationChange } from '../../utils/deviceDetection';
import MainLayout from './index';
import MobileLayout from './MobileLayout';

const ResponsiveLayout = () => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始检测
    setIsMobile(isMobileDevice());
    setIsLoading(false);

    // 监听设备方向和尺寸变化
    const cleanup = onOrientationChange((info) => {
      const newIsMobile = info.deviceType === 'mobile' || info.width <= 768;
      setIsMobile(newIsMobile);
    });

    return cleanup;
  }, []);

  // 加载状态
  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#020d1f',
        color: '#ffffff'
      }}>
        <div style={{
          textAlign: 'center',
          fontSize: '18px'
        }}>
          🌊 加载中...
        </div>
      </div>
    );
  }

  // 根据设备类型返回对应布局
  return isMobile ? <MobileLayout /> : <MainLayout />;
};

export default ResponsiveLayout;