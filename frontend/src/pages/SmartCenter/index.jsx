import React, { useState } from 'react';
import { Row, Col } from 'antd';
import './SmartCenter.css'; // 请确保这个文件存在！

import EnvironmentGauge from './EnvironmentGauge';
import VideoRecognition from './VideoRecognition';
import FishInfo from './FishInfo';
import AIConditions from './AIConditions';
import WeatherAlert from './WeatherAlert';
import MapSection from '../MainInfo/MapSection';

const SmartCenter = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  return (
    <div className="smart-center-container">
      <Row gutter={[24, 24]}>
        <Col span={12}><EnvironmentGauge /></Col>
        <Col span={12}><VideoRecognition /></Col>
        <Col span={12}><FishInfo /></Col>
        <Col span={12}><AIConditions /></Col>
        <Col span={24}>
          <MapSection onSelectFarm={setSelectedPoint} />
          <WeatherAlert selectedPoint={selectedPoint} />
        </Col>
      </Row>
    </div>
  );
};

export default SmartCenter;
