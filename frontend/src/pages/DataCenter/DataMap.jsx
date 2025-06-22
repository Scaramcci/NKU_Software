// src/pages/DataCenter/DataMap.jsx
import React from 'react';
import { Card } from 'antd';
import './DataMap.css';

const DataMap = () => (
  <Card
    className="data-panel"
    title={<span style={{ color: '#fff', fontWeight: 'bold' }}>数据中心分布</span>}
    bordered={false}
  >
    <div className="map-panel">
      <span className="map-icon">🌐</span>
      <div className="map-info">
        <div>数据中心：杭州</div>
        <div>服务商：阿里云</div>
        <div>连线：30ms</div>
      </div>
    </div>
  </Card>
);

export default DataMap;
