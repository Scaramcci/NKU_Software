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
      <div className="map-info-horizontal">
        <div>数据中心：杭州</div>
        <div>服务商：阿里云</div>
        <div>连线：30ms</div>
      </div>
    </div>
    <Card title="海洋牧场分布地图" size="small" style={{ marginBottom: 8, height: 180 }}>
      <div style={{ height: 160, background: '#e6f7ff', textAlign: 'center', lineHeight: '120px' }}>
        地图占位
      </div>
    </Card>
  </Card>
);

export default DataMap;
