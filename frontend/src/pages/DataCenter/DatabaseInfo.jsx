// src/pages/DataCenter/DatabaseInfo.jsx已改
import React from 'react';
import { Card, Descriptions, Button } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import './DatabaseInfo.css';

const DatabaseInfo = () => {
  const dbDetails = [
    { label: '数据库类型', value: 'PostgreSQL' },
    { label: '版本', value: '15.3' },
    { label: '连接状态', value: '已连接' },
    { label: '当前连接数', value: '42' },
    { label: '平均响应时间', value: '28 ms' },
  ];

  return (
    <Card
      className="data-panel"
      title={
        <span style={{ color: '#fff' }}>
          <DatabaseOutlined style={{ marginRight: 8 }} />
          数据库交互信息
        </span>
      }
      bordered={false}
    >
      <Descriptions
        column={1}
        colon={false}
        contentStyle={{ color: '#fff' }}
        labelStyle={{ color: '#00ffff', fontWeight: 'bold' }}
      >
        {dbDetails.map((item) => (
          <Descriptions.Item key={item.label} label={item.label}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Button type="primary" size="small">
          查看更多
        </Button>
      </div>
    </Card>
  );
};

export default DatabaseInfo;
