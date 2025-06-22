

import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import {
  IdcardOutlined,
  GoldOutlined,
  ColumnHeightOutlined,
  DashboardOutlined,
  WarningOutlined,
  ClusterOutlined,
  AimOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import './RealTimeInfo.css';

const { Title } = Typography;

const fishData = [
  {
    icon: <IdcardOutlined />,
    label: '编号',
    value: 'fish-9527'
  },
  {
    icon: <GoldOutlined />,
    label: '鱼种',
    value: 'moonfish'
  },
  {
    icon: <ColumnHeightOutlined />,
    label: '体长',
    value: '10寸'
  },
  {
    icon: <DashboardOutlined />,
    label: '体重',
    value: '5kg'
  },
  {
    icon: <WarningOutlined className="fish-icon-red" />,
    label: '报警',
    value: '疑似鱼源（畸）',
    cardClass: 'warning'
  },
  {
    icon: <ClusterOutlined className="fish-icon-orange" />,
    label: '群体异常',
    value: '鱼群异常（集群）',
    cardClass: 'warning'
  },
  {
    icon: <AimOutlined />,
    label: '轨迹追踪',
    value: '启用'
  },
  {
    icon: <LineChartOutlined />,
    label: '轨迹分析',
    value: '分析中'
  }
];

const FishInfo = () => {
  return (
    <Card className="fish-info-panel" bordered={false}>
      <Title level={5} className="fish-info-header">识别出的鱼的信息</Title>
      <Row gutter={[16, 16]}>
        {fishData.map((item, idx) => (
          <Col key={idx} xs={12} sm={8} md={6}>
            <div className={`fish-info-card ${item.cardClass || ''}`}>
              <div className="fish-info-icon">{item.icon}</div>
              <div className="fish-info-label">{item.label}</div>
              <div className="fish-info-value">{item.value}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default FishInfo;
