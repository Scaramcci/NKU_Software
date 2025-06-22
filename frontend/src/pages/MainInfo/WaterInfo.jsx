import React from 'react';
import { Progress, Typography } from 'antd';
import './WaterInfo.css';

const { Text } = Typography;

const parameters = [
  { name: '电池电压 (V)', value: 25.9, color: '#00c6ff' },
  { name: '盐度 (%)', value: 34.16, color: '#00e676' },
  { name: '溶解氧 (mg/L)', value: 0.0, color: '#f44336' },
  { name: '浊度 (NTU)', value: 2.05, color: '#2196f3' },
  { name: 'pH', value: 8.37, color: '#8e24aa' },
  { name: '水温 (°C)', value: 15, color: '#ff9800' }
];

const WaterInfo = () => {
  return (
    <div className="water-info-card">
      <div className="param-list">
        {parameters.map((param, index) => (
          <div className="param-row" key={index}>
            <div className="param-label">{param.name}</div>
            <div className="param-bar">
              <Progress
                percent={Math.min((param.value / 50) * 100, 100)}
                showInfo={false}
                strokeColor={param.color}
                strokeWidth={10}
              />
            </div>
            <div className="param-value" style={{ color: param.color }}>
              {param.value.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterInfo;
