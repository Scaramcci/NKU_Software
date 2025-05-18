import React from 'react';
import { Card, List, Badge } from 'antd';
import {
  VideoCameraOutlined,
  RadarChartOutlined,
  CloudServerOutlined,
} from '@ant-design/icons';

const hardwareData = [
  {
    title: '水下传感器',
    count: 8,
    icon: <RadarChartOutlined />,
    status: '在线'
  },
  {
    title: '水面摄像头',
    count: 3,
    icon: <VideoCameraOutlined />,
    status: '在线'
  },
  {
    title: '云台装置',
    count: 2,
    icon: <CloudServerOutlined />,
    status: '部分离线'
  }
];

const HardwareInfoPanel = () => {
  return (
    <Card
      title={<span style={{ color: '#ffffff', fontWeight: 'bold' }}>硬件信息状态</span>} // ✅ 白色标题
      style={{
        background: 'linear-gradient(145deg, #0d1b2a, #1b2f43)',
        color: '#ffffff',
        border: '1px solid rgba(0, 255, 255, 0.1)',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
        borderRadius: 12,
        marginBottom: 20
      }}
      bodyStyle={{ backgroundColor: 'transparent' }}
    >
      <List
        itemLayout="horizontal"
        dataSource={hardwareData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <span style={{ fontSize: 24, color: '#ffffff' }}>
                  {item.icon}
                </span>
              }
              title={
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {item.title}
                </span>
              }
              description={
                <span style={{ color: '#ffffff' }}>
                  数量：{item.count}　|　状态：
                  <Badge
                    status={item.status === '在线' ? 'success' : 'warning'}
                    text={<span style={{ color: '#ffffff' }}>{item.status}</span>}
                  />
                </span>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default HardwareInfoPanel;
