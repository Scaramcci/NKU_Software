import React from 'react';
import { Row, Col, Card } from 'antd';
import VideoSection from './VideoSection';
import WaterInfo from './WaterInfo';
import MapSection from './MapSection';
import HistoryChart from './HistoryChart';
import ControlPanel from './ControlPanel';
import DeviceStatus from './DeviceStatus';

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
  return (
    <div
      style={{
        height: '100vh',
        padding: 12,
        background: '#020d1f',
        overflow: 'hidden'
      }}
    >
      <Row gutter={[12, 12]} style={{ height: '100%' }}>
        {/* 左侧：监控视频 + 控制面板 */}
        <Col span={8} style={{ height: '100%' }}>
          <Row gutter={[0, 6]} style={{ height: '100%' }}>
            <Col span={24} style={{ height: '50%' }}>
              <Card title="监控视频" headStyle={{ color: '#fff' }} style={cardStyle} bodyStyle={bodyStyle}>
                <div style={{ height: '100%' }}>
                  <VideoSection />
                </div>
              </Card>
            </Col>
            <Col span={24} style={{ height: '48%' }}>
              <Card title="附加功能" headStyle={{ color: '#fff' }} style={cardStyle} bodyStyle={bodyStyle}>
                <div style={{ height: '100%' }}>
                  <ControlPanel />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 中间：水文气象 + 地图 */}
        <Col span={8} style={{ height: '100%' }}>
          <Row gutter={[0, 6]} style={{ height: '100%' }}>
            <Col span={24} style={{ height: '40%' }}>
              <Card title="水文气象" headStyle={{ color: '#fff' }} style={cardStyle} bodyStyle={bodyStyle}>
                <div style={{ height: '100%' }}>
                  <WaterInfo />
                </div>
              </Card>
            </Col>
            <Col span={24} style={{ height: '60%' }}>
              <Card title="历史记录" headStyle={{ color: '#fff' }} style={cardStyle} bodyStyle={bodyStyle}>
                <div style={{ height: '100%' }}>
                  <HistoryChart  />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 右侧：历史记录 + 设备状态 */}
        <Col span={8} style={{ height: '100%' }}>
          <Row gutter={[0, 6]} style={{ height: '100%' }}>
            <Col span={24} style={{ height: '65%' }}>
              <Card title="海洋牧场定位展示" headStyle={{ color: '#fff' }} style={cardStyle} bodyStyle={bodyStyle}>
                <div style={{ height: '100%' }}>
                  <MapSection />
                </div>
              </Card>
            </Col>
            <Col span={24} style={{ height: '35%' }}>
              <Card title="设备状态概览" headStyle={{ color: '#fff' }} style={cardStyle} bodyStyle={bodyStyle}>
                <div style={{ height: '100%' }}>
                  <DeviceStatus />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default MainInfo;
