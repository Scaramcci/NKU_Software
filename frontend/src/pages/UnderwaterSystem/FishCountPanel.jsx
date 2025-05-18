import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  DotChartOutlined,
} from '@ant-design/icons';
import './FishCountPanel.css';  // ✅ 引入 CSS 文件

const FishCountPanel = () => {
  return (
    <Card
      title={<span className="card-title">鱼群数量监控</span>}
      style={{
        background: 'linear-gradient(145deg, #0d1b2a, #1b2f43)',
        color: '#e0f7ff',
        marginBottom: 20,
        border: '1px solid rgba(0, 255, 255, 0.1)',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
        borderRadius: 12,
      }}
      bodyStyle={{ backgroundColor: 'transparent' }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Statistic
            title="当前鱼群数量"
            value={1038}
            prefix={<DotChartOutlined />}
            valueStyle={{ color: '#00eaff', fontSize: 28 }}
            className="statistic-white"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="今日新增"
            value={8}
            prefix={<RiseOutlined />}
            valueStyle={{ color: '#52c41a' }}
            className="statistic-white"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="今日死亡"
            value={6}
            prefix={<FallOutlined />}
            valueStyle={{ color: '#f5222d' }}
            className="statistic-white"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default FishCountPanel;
