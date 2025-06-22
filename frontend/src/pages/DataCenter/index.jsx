// src/pages/DataCenter/index.jsx
import React from 'react';
import { Row, Col } from 'antd';
import DataSummary from './DataSummary';
import HardwareStats from './HardwareStats';
import DataFlowChart from './DataFlowChart';
import DataMap from './DataMap';
import RadarChart from './RadarChart';
import SankeyChart from './SankeyChart';
import SensorInfo from './SensorInfo';
import DatabaseInfo from './DatabaseInfo';

import './DataCenter.css';

const DataCenter = () => {
  return (
    <div className="data-center-wrapper">
      <div className="data-center-title">
        岸基数据中心 · 海洋牧场大数据可视化系统
      </div>
      
      <Row gutter={[16, 16]} className="data-center-row">
        {/* 左侧区域 */}
        <Col span={6}>
          <DataSummary />
          <HardwareStats />
        </Col>

        {/* 中间区域 */}
        <Col span={12}>
          <DataMap />
          <DataFlowChart />
          <RadarChart />
        </Col>

        {/* 右侧区域 */}
        <Col span={6}>
          <SankeyChart />
          <SensorInfo />
          <DatabaseInfo />
        </Col>
      </Row>
    </div>
  );
};

export default DataCenter;
