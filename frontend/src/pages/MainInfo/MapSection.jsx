// src/pages/MainInfo/MapSection.jsx
import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import './MapSection.css';

const MapSection = ({ onSelectFarm }) => {
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    const map = new window.AMap.Map('map-container', {
      zoom: 5,
      center: [117.361, 35.894],
    });

    const fishingAreas = [
      {name: "舟山渔场", position: [122.2, 29.98]},
      {name: "渤海渔场", position: [121.267, 38.8], locationName: "大连市旅顺口区"}, // 旅顺口区坐标
      {name: "南海渔场", position: [113.57, 22.27], locationName: "广东省珠海市香洲区"}, // 香洲区坐标
      {name: "北部湾渔场", position: [108.35, 21.78], locationName: "广西防城港市防城区环岛东路"} // 防城区坐标
    ];

    fishingAreas.forEach(area => {
      const marker = new window.AMap.Marker({
        position: area.position,
        title: area.name
      });
      marker.on('click', () => {
        map.setZoomAndCenter(8, area.position);
        const selected = {
          name: area.name,
          lng: area.position[0],
          lat: area.position[1],
          // 添加更多渔场信息
          areaSize: '5000亩', // 示例数据
          fishTypes: ['草鱼', '鲤鱼', '鲫鱼'], // 示例数据
          waterType: '淡水' // 示例数据
        };
        setSelectedArea(selected);
        onSelectFarm && onSelectFarm(selected);
      });
      map.add(marker);
    });

    return () => map.destroy();
  }, []);

  return (
    <Card className="map-card">
      <div className="map-title">海洋牧场定位展示</div>
      <div id="map-container" className="map-container">
        {/* 地图容器 */}
      </div>
      {selectedArea && (
        <div className="coordinates-display">
          {selectedArea.name} - 经度: {selectedArea.lng}, 纬度: {selectedArea.lat}
        </div>
      )}
    </Card>
  );
};

export default MapSection;
