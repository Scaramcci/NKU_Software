import React, { useState } from 'react';
import { Row, Col } from 'antd';
import './SmartCenter.css';

import EnvironmentGauge from './EnvironmentGauge';
import VideoRecognition from './VideoRecognition';
import AIConditions from './AIConditions';
import FishInfo from './wangyiposun';
import RealTimeInfo from './RealTimeInfo';
import WeatherAlert from './WeatherAlert';

const SmartCenter = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  return (
    <div className="smart-center-wrapper">
      <Row gutter={16} className="smart-center-row">
        {/* 左列 */}
        <Col span={6}>
          <div className="column">
            <div className="panel top-panel"><EnvironmentGauge /></div>
            <div className="panel bottom-panel"><FishInfo /></div>
          </div>
        </Col>

        {/* 中列 */}
        <Col span={12}>
          <div className="column">
            <div className="panel top-panel"><VideoRecognition /></div>
            <div className="panel bottom-panel"><RealTimeInfo /></div>
          </div>
        </Col>

        {/* 右列 */}
        <Col span={6}>
          <div className="column">
            <div className="panel top-panel"><AIConditions /></div>
            <div className="panel bottom-panel"><WeatherAlert selectedPoint={selectedPoint} /></div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SmartCenter;
