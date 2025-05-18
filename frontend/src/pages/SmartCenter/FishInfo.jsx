// src/pages/SmartCenter/modules/FishInfo.jsx

import React from 'react';
import { Card, Row, Col, Typography, Tag } from 'antd';
import {
  IdcardOutlined,
  GoldOutlined,
  ColumnHeightOutlined, // 代替 RulerOutlined
  DashboardOutlined,
  WarningOutlined,
  ClusterOutlined,
  AimOutlined,
  LineChartOutlined
} from '@ant-design/icons';

import './FishInfo.css';

const { Title, Text } = Typography;

const fishData = {
  id: 'fish-9527',
  species: 'moonfish',
  length: '10寸',
  weight: '5kg',
  alert: '疑似鱼源（畸）',
  groupStatus: '鱼群异常（集群）'
};

const FishInfo = () => {
  return (
    <Card className="fish-info-card">
      <Title level={4} className="fish-info-title"style={{ color: '#fff' }}>识别出的鱼的信息</Title>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <div className="fish-info-box">
            <IdcardOutlined className="fish-icon" />
            <Text className="fish-label">编号</Text>
            <Text className="fish-value">{fishData.id}</Text>
          </div>
        </Col>
        <Col span={6}>
          <div className="fish-info-box">
            <GoldOutlined className="fish-icon" />
            <Text className="fish-label">鱼种</Text>
            <Text className="fish-value">{fishData.species}</Text>
          </div>
        </Col>
        <Col span={6}>
          <div className="fish-info-box">
              <ColumnHeightOutlined className="fish-icon" />

            <Text className="fish-label">体长</Text>
            <Text className="fish-value">{fishData.length}</Text>
          </div>
        </Col>
        <Col span={6}>
          <div className="fish-info-box">
            <DashboardOutlined className="fish-icon" />
            <Text className="fish-label">体重</Text>
            <Text className="fish-value">{fishData.weight}</Text>
          </div>
        </Col>

        <Col span={6}>
          <div className="fish-info-box warning">
            <WarningOutlined className="fish-icon red" />
            <Text className="fish-label">报警</Text>
            <Tag color="error">{fishData.alert}</Tag>
          </div>
        </Col>

        <Col span={6}>
          <div className="fish-info-box warning">
            <ClusterOutlined className="fish-icon orange" />
            <Text className="fish-label">群体异常</Text>
            <Tag color="orange">{fishData.groupStatus}</Tag>
          </div>
        </Col>

        <Col span={6}>
          <div className="fish-info-box">
            <AimOutlined className="fish-icon" />
            <Text className="fish-label">轨迹追踪</Text>
            <Tag color="blue">启用</Tag>
          </div>
        </Col>

        <Col span={6}>
          <div className="fish-info-box">
            <LineChartOutlined className="fish-icon" />
            <Text className="fish-label">轨迹分析</Text>
            <Tag color="cyan">分析中</Tag>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default FishInfo;
