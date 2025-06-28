import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import './DataMap.css';

const DataMap = () => {
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    const map = new window.AMap.Map('map-container', {
      zoom: 5,
      center: [117.361, 35.894],
    });

    const fishingAreas = [
      {name: "舟山渔场", position: [122.2, 29.98]},
      {name: "渤海渔场", position: [121.267, 38.8], locationName: "大连市旅顺口区"},
      {name: "南海渔场", position: [113.57, 22.27], locationName: "广东省珠海市香洲区"},
      {name: "北部湾渔场", position: [108.35, 21.78], locationName: "广西防城港市防城区环岛东路"}
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
          areaSize: '5000亩',
          fishTypes: ['草鱼', '鲤鱼', '鲫鱼'],
          waterType: '淡水'
        };
        setSelectedArea(selected);
      });
      map.add(marker);
    });

    return () => map.destroy();
  }, []);

  return (
    <Card
      className="data-panel"
      title={<span style={{ color: '#fff', fontWeight: 'bold' }}>数据中心分布</span>}
      bordered={false}
    >
      <div className="map-panel">
        <div className="map-info-horizontal">
          <div>数据中心：杭州</div>
          <div>服务商：阿里云</div>
          <div>连线：30ms</div>
        </div>
      </div>
      <Card title="海洋牧场分布地图" size="small" style={{ marginBottom: 8, height: 400 }}> {/* 增加高度到400px */}
        <div id="map-container" style={{ height: '350px', width: '100%' }}> {/* 设置具体像素高度 */}
          {/* 地图容器 */}
        </div>
        {selectedArea && (
          <div className="coordinates-display">
            {selectedArea.name} - 经度: {selectedArea.lng}, 纬度: {selectedArea.lat}
          </div>
        )}
      </Card>
    </Card>
  );
};

export default DataMap;
