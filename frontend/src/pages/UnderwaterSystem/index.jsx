import React from 'react';
import { Row, Col, Card } from 'antd';
import FishCountPanel from './FishCountPanel';
import EnvScoreGauge from './EnvScoreGauge';
import FishTrendChart from './FishTrendChart';
import MainStatPanel from './MainStatPanel';
import FishDistChart from './FishDistChart';
import HardwareInfoPanel from './HardwareInfoPanel';
import FishTypePieChart from './FishTypePieChart';

const UnderwaterSystem = () => {
return (
  <div style={{ padding: 24, background: '#001f3f', minHeight: '100vh' }}>
    <Row gutter={12}>
      {/* 左侧：鱼群数量 + 环境评分 + 历史变化 */}
      <Col span={6}>
        <FishCountPanel />
        <EnvScoreGauge />
        <FishTrendChart />
      </Col>

      {/* 中部：主统计 + 分布图 */}
      <Col span={12}>
        <MainStatPanel />
        <FishDistChart />
      </Col>

      {/* 右侧：硬件信息 + 饼图 */}
      <Col span={6}>
        <HardwareInfoPanel />
        <FishTypePieChart />
      </Col>
    </Row>
  </div>
);

};

export default UnderwaterSystem;
