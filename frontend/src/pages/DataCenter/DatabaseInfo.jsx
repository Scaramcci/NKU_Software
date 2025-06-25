// src/pages/DataCenter/DatabaseInfo.jsx已改
import React from 'react';
import { Card, List, Tag } from 'antd';
import './DatabaseInfo.css';

const dbs = [
  { name: '环境监测库', status: '在线' },
  { name: '设备管理库', status: '在线' },
  { name: '历史数据仓库', status: '离线' },
  { name: '用户信息库', status: '在线' },
];

const DatabaseInfo = () => (
  <Card title="数据库信息" size="small" className="data-panel">
    <List
      size="small"
      dataSource={dbs}
      renderItem={item => (
        <List.Item>
          {item.name}
          <Tag color={item.status === '在线' ? 'blue' : 'red'} style={{ marginLeft: 8 }}>
            {item.status}
          </Tag>
        </List.Item>
      )}
    />
  </Card>
);

export default DatabaseInfo;
