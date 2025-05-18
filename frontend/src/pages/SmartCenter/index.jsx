import React from 'react';
import { Row, Col } from 'antd';
import './SmartCenter.css'; // 请确保这个文件存在！

import EnvironmentGauge from './EnvironmentGauge';
import VideoRecognition from './VideoRecognition';
import FishInfo from './FishInfo';
import AIConditions from './AIConditions';
import WeatherAlert from './WeatherAlert';

const SmartCenter = () => {
  return (
    <div className="smart-center-container">
      <Row gutter={[24, 24]}>
        <Col span={12}><EnvironmentGauge /></Col>
        <Col span={12}><VideoRecognition /></Col>
        <Col span={12}><FishInfo /></Col>
        <Col span={12}><AIConditions /></Col>
        <Col span={24}><WeatherAlert /></Col>
      </Row>
    </div>
  );
};

export default SmartCenter;
