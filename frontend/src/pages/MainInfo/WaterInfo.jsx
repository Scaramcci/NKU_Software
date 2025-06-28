// src/pages/MainInfo/WaterInfo.jsx
import React from 'react';
import { Card, Progress, Typography, Row, Col } from 'antd';
import './WaterInfo.css';

const { Text } = Typography;

const parameters = [
  { name: '电池电压 (V)', value: 25.9, color: '#00c6ff' },
  { name: '盐度 (%)', value: 34.16, color: '#00e676' },
  { name: '溶解氧 (mg/L)', value: 0.0, color: '#f44336' },
  { name: '浊度 (NTU)', value: 2.05, color: '#2196f3' },
  { name: 'pH', value: 8.37, color: '#8e24aa' },
  { name: '水温 (°C)', value: 15, color: '#ff9800' },
];

const WaterInfo = () => {
  return (
    <Card
      title={<Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>水文气象</Text>}
      bordered={false}
      className="water-info-card"
      bodyStyle={{ background: 'linear-gradient(to right, #001f3f, #005f73)', borderRadius: 12, padding: 24 }}
    >
      <Row gutter={[16, 16]}>
        {parameters.map((param, index) => (
          <Col span={24} key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>{param.name}</Text>
              <Text style={{ color: param.color, fontSize: 16, fontWeight: 'bold' }}>{param.value}</Text>
            </div>
            <Progress
              percent={Math.min((param.value / 50) * 100, 100)}
              showInfo={false}
              strokeColor={param.color}
              style={{ marginTop: 4 }}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default WaterInfo;
