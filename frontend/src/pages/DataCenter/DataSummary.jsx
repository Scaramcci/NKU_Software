// src/pages/DataCenter/components/DataSummary.jsx
import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
const summaryData = [
  { title: '传感器数量', value: 128 },
  { title: '数据库数量', value: 6 },
  { title: '数据总量(GB)', value: 1024 },
  { title: '在线设备', value: 120 },
];
const DataSummary = () => (
  <Card title="数据总览" size="small" style={{ marginBottom: 16 }}>
    <Row gutter={16}>
      {summaryData.map((item, idx) => (
        <Col span={12} key={idx}>
          <Statistic title={item.title} value={item.value} />
        </Col>
      ))}
    </Row>
  </Card>
);
export default DataSummary;
