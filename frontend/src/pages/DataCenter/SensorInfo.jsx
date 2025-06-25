import React from 'react';
import { Card, List, Tag } from 'antd';

const sensors = [
  { name: '温度传感器', status: '正常' },
  { name: '盐度传感器', status: '正常' },
  { name: '溶氧传感器', status: '异常' },
  { name: 'pH传感器', status: '正常' },
];

const SensorInfo = () => (
  <Card title="传感器信息" size="small" style={{ marginBottom: 16 }}>
    <List
      size="small"
      dataSource={sensors}
      renderItem={item => (
        <List.Item>
          {item.name}
          <Tag color={item.status === '正常' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
            {item.status}
          </Tag>
        </List.Item>
      )}
    />
  </Card>
);

export default SensorInfo;
