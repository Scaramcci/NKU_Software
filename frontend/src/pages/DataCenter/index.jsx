// src/pages/DataCenter/index.jsx
import React, { useState } from 'react';
import { Row, Col, Tabs } from 'antd';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import DataSummary from './DataSummary';
import HardwareStats from './HardwareStats';
import DataFlowChart from './DataFlowChart';
import DataMap from './DataMap';
import RadarChart from './RadarChart';
import SankeyChart from './SankeyChart';
import SensorInfo from './SensorInfo';
import DatabaseInfo from './DatabaseInfo';
import DataManagement from './DataManagement';
import './DataCenter.css';

const { TabPane } = Tabs;
const DataCenter = () => {
  const [activeTab, setActiveTab] = useState('visualization');

  return (
    <div className="data-center-wrapper">
      <div className="data-center-title">
        岸基数据中心 · 海洋牧场大数据可视化系统
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="data-center-tabs"
        size="large"
      >
        <TabPane 
          tab={
            <span>
              <BarChartOutlined />
              数据可视化
            </span>
          } 
          key="visualization"
        >
          <Row gutter={[16, 16]} className="data-center-row">
            {/* 左侧区域 */}
            <Col span={6}>
              <DataSummary />
              <HardwareStats />
              <DataFlowChart />
            </Col>
            {/* 中间区域 */}
            <Col span={12}>
              <DataMap />
              <RadarChart />
            </Col>
            {/* 右侧区域 */}
            <Col span={6}>
              <SankeyChart />
              <SensorInfo />
              <DatabaseInfo />
            </Col>
          </Row>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              数据管理
            </span>
          } 
          key="management"
        >
          <DataManagement />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default DataCenter;
