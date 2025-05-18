import React from 'react';
import { Row, Col, Card } from 'antd';
import VideoSection from './VideoSection';
import WaterInfo from './WaterInfo';
import MapSection from './MapSection';
import HistoryChart from './HistoryChart';
import ControlPanel from './ControlPanel';
import DeviceStatus from './DeviceStatus';

const MainInfo = () => {
  return (
    <div style={{ padding: 16 }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="监控视频">
            <VideoSection />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="水文气象数据">
            <WaterInfo />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="海洋牧场定位">
            <MapSection />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="历史记录">
            <HistoryChart />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="附加功能">
            <ControlPanel />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="设备状态">
            <DeviceStatus />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MainInfo;
