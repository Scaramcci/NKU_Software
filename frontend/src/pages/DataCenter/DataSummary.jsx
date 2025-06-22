// src/pages/DataCenter/components/DataSummary.jsx
import React from 'react';
import { Card, Statistic } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';

const DataSummary = () => {
  return (
    <Card className="data-panel" title={<span style={{color:'#fff'}}>数据总量</span>} bordered={false}>
      <Statistic 
        title="进程总量" 
        value={999} 
        prefix={<DatabaseOutlined />} 
        valueStyle={{ color: '#00ffff' }} 
      />
      <div style={{marginTop: 16, color:'#fff'}}>磁盘：已使用 1000T / 剩余 1500T</div>
    </Card>
  );
};

export default DataSummary;
