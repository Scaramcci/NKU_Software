import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import { isMobileDevice } from '../../utils/deviceDetection';
import VideoSection from './VideoSection';
import WaterInfo from './WaterInfo';
import MapSection from './MapSection';
import HistoryChart from './HistoryChart';
import ControlPanel from './ControlPanel';
import DeviceStatus from './DeviceStatus';
import MainInfoMobile from './MainInfoMobile';
import './index.css';

const cardStyle = {
  borderRadius: 10,
  background: '#061e3c',
  color: '#fff',
  height: '100%',
  margin: 0  // ✅ 去除上下留白
};

const bodyStyle = {
  padding: 6,  // ✅ 更紧凑
  height: '100%',
  overflow: 'hidden'
};

const MainInfo = () => {
  const [isMobile, setIsMobile] = useState(isMobileDevice());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 移动端使用专门的移动端组件
  if (isMobile) {
    return <MainInfoMobile />;
  }

  // 桌面端使用原有布局
  return (
    <div className="main-info-container">
      <Row gutter={[16, 16]} style={{ height: '100%' }}>
        {/* 左侧列 */}
        <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ height: '100%' }}>
          <Row gutter={[16, 16]} style={{ height: '100%' }}>
            {/* 视频区域 */}
            <Col span={24} style={{ height: '60%' }}>
              <VideoSection />
            </Col>
            {/* 设备状态 */}
            <Col span={24} style={{ height: '40%' }}>
              <DeviceStatus />
            </Col>
          </Row>
        </Col>
        
        {/* 右侧列 */}
        <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ height: '100%' }}>
          <Row gutter={[16, 16]} style={{ height: '100%' }}>
            {/* 水质信息 */}
            <Col span={24} style={{ height: '50%' }}>
              <WaterInfo />
            </Col>
            {/* 历史图表 */}
            <Col span={24} style={{ height: '50%' }}>
              <HistoryChart />
            </Col>
          </Row>
        </Col>
      </Row>
      
      {/* 底部区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <MapSection />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <ControlPanel />
        </Col>
      </Row>
    </div>
  );
};

export default MainInfo;
