import React from 'react';
import { Card, Tabs } from 'antd';
import VideoSection from './VideoSection';
import WaterInfo from './WaterInfo';
import MapSection from './MapSection';
import HistoryChart from './HistoryChart';
import ControlPanel from './ControlPanel';
import DeviceStatus from './DeviceStatus';
import './MainInfoMobile.css';

const { TabPane } = Tabs;

const MainInfoMobile = () => {
  const tabItems = [
    {
      key: '1',
      label: '监控',
      children: (
        <div className="mobile-tab-content">
          <Card className="mobile-card" title="监控视频">
            <VideoSection />
          </Card>
          <Card className="mobile-card" title="设备状态">
            <DeviceStatus />
          </Card>
        </div>
      )
    },
    {
      key: '2',
      label: '数据',
      children: (
        <div className="mobile-tab-content">
          <Card className="mobile-card" title="水文气象">
            <WaterInfo />
          </Card>
          <Card className="mobile-card" title="历史记录">
            <HistoryChart />
          </Card>
        </div>
      )
    },
    {
      key: '3',
      label: '地图',
      children: (
        <div className="mobile-tab-content">
          <Card className="mobile-card" title="海洋牧场定位">
            <MapSection />
          </Card>
        </div>
      )
    },
    {
      key: '4',
      label: '控制',
      children: (
        <div className="mobile-tab-content">
          <Card className="mobile-card" title="附加功能">
            <ControlPanel />
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="main-info-mobile">
      <Tabs 
        defaultActiveKey="1" 
        centered
        size="large"
        className="mobile-tabs"
        items={tabItems}
      />
    </div>
  );
};

export default MainInfoMobile;