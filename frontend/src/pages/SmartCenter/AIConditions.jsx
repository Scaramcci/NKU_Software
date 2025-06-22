import React from 'react';
import { Card } from 'antd';
import { BulbOutlined, RobotOutlined } from '@ant-design/icons';
import './AIConditions.css';

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
    <Card className="ai-card" bordered={false}>
      <div className="ai-title">AI 智能建议</div>
      <div className="ai-content">
        {suggestions.map((item, index) => (
          <div className="ai-item" key={index}>
            <div className="ai-icon">{item.icon}</div>
            <div className="ai-texts">
              <div className="ai-item-title">{item.title}</div>
              <div className="ai-item-desc">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIConditions;
