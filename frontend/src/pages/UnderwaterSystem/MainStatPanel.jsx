import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  RadarChartOutlined,
  VideoCameraOutlined,
  CloudOutlined,
  SoundOutlined,
  AppstoreOutlined,
  PartitionOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import './MainStatPanel.css'; // ✅ 引入样式文件

const MainStatPanel = () => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        title={<span className="card-title">系统核心统计</span>}
        bodyStyle={{ backgroundColor: '#001c33', color: '#fff' }}
        style={{
          background: 'radial-gradient(circle, #003366, #001c33)',
          color: '#00eaff',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Statistic
              title="系统总数据量"
              value={159485}
              prefix={<RadarChartOutlined />}
              valueStyle={{ color: '#00f0ff', fontSize: 32 }}
              className="statistic-white"
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="鱼种"
              value="50+"
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#00eaff' }}
              className="statistic-white"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="鱼群数量"
              value="500 尾"
              prefix={<PartitionOutlined />}
              valueStyle={{ color: '#00eaff' }}
              className="statistic-white"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="生长数量"
              value="600 尾"
              prefix={<DeploymentUnitOutlined />}
              valueStyle={{ color: '#00eaff' }}
              className="statistic-white"
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="镜头"
              value="5+"
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#00eaff' }}
              className="statistic-white"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="云台"
              value="2"
              prefix={<CloudOutlined />}
              valueStyle={{ color: '#00eaff' }}
              className="statistic-white"
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="声呐"
              value="1"
              prefix={<SoundOutlined />}
              valueStyle={{ color: '#00eaff' }}
              className="statistic-white"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MainStatPanel;
