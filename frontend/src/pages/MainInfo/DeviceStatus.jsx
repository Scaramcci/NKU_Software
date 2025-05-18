// src/pages/MainInfo/DeviceStatus.jsx
import React from 'react';
import { Card, Tag, Space, Typography } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './DeviceStatus.css';

const { Text } = Typography;

const devices = [
  { name: '摄像头 A', status: '正常' },
  { name: '传感器 B', status: '离线' },
  { name: '推进器 C', status: '正常' },
  { name: '灯光系统', status: '维护中' },
];

const DeviceStatus = () => {
  return (
    <Card
      title={<Text style={{ color: '#fff', fontSize: 18 }}>设备状态概览</Text>}
      bordered={false}
      className="device-status-card"
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {devices.map((item, index) => (
          <div key={index} className="device-item">
            <Text className="device-name">{item.name}</Text>
            <Tag icon={getIcon(item.status)} color={getColor(item.status)} style={{ fontSize: 14, padding: '2px 8px' }}>{item.status}</Tag>
          </div>
        ))}
      </Space>
    </Card>
  );
};

const getColor = (status) => {
  switch (status) {
    case '正常': return 'green';
    case '离线': return 'error';
    case '维护中': return 'warning';
    default: return 'default';
  }
};

const getIcon = (status) => {
  switch (status) {
    case '正常': return <CheckCircleOutlined />;
    case '离线': return <CloseCircleOutlined />;
    case '维护中': return <ExclamationCircleOutlined />;
    default: return null;
  }
};

export default DeviceStatus;
