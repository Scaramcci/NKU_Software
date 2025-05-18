// src/pages/SmartCenter/AIConditions.jsx
import React from 'react';
import { Card, Typography, List } from 'antd';
import { RobotOutlined, BulbOutlined } from '@ant-design/icons';
import './AIConditions.css';

const { Title, Text } = Typography;

const suggestions = [
  {
    title: '建议调整投喂量',
    description: '根据当前水温和鱼群活跃度，建议减少投喂量 10%。',
    icon: <BulbOutlined />
  },
  {
    title: '建议增氧作业',
    description: '溶解氧低于 6.0 mg/L，建议启动增氧泵。',
    icon: <RobotOutlined />
  }
];

const AIConditions = () => {
  return (
    <Card className="ai-conditions-card">
      <Title level={4} className="ai-conditions-title"style={{ color: '#fff' }}>AI 智能建议</Title>
      <List
        itemLayout="horizontal"
        dataSource={suggestions}
        renderItem={(item) => (
          <List.Item className="ai-suggestion-item">
            <List.Item.Meta
              avatar={<div className="ai-icon">{item.icon}</div>}
              title={<Text className="ai-suggestion-title">{item.title}</Text>}
              description={<Text className="ai-suggestion-desc">{item.description}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default AIConditions;
