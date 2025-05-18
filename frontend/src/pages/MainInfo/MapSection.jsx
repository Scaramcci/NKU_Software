// src/pages/MainInfo/MapSection.jsx
import React from 'react';
import { Card } from 'antd';
import './MapSection.css';

const MapSection = () => {
  return (
    <Card className="map-card">
      <div className="map-title">海洋牧场定位展示</div>
      <div className="map-container">
        <p className="map-placeholder-text">地图区域（可集成百度地图 / 高德地图 / Leaflet）</p>
      </div>
    </Card>
  );
};

export default MapSection;
