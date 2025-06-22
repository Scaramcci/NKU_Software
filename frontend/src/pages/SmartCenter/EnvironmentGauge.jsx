// src/pages/SmartCenter/modules/EnvironmentGauge.jsx
import React from 'react';
import ReactECharts from 'echarts-for-react';
import './EnvironmentGauge.css';
import { Typography } from 'antd';
const { Title } = Typography;

const EnvironmentGauge = () => {
  const option = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        radius: '100%',
        pointer: {
          icon: 'rect',
          width: 6,
          length: '60%',
          itemStyle: {
            color: '#00FFFF'
          }
        },
        axisLine: {
          lineStyle: {
            width: 18,
            color: [
              [0.25, '#ff4d4f'],
              [0.5, '#faad14'],
              [0.75, '#40a9ff'],
              [1, '#73d13d']
            ]
          }
        },
        splitLine: {
          distance: -18,
          length: 10,
          lineStyle: {
            color: '#888'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#ccc',
          distance: 12,
          fontSize: 11
        },
        detail: {
          valueAnimation: true,
          fontSize: 26,
          fontWeight: 'bold',
          color: '#00e0ff',
          offsetCenter: [0, '50%'],
          formatter: '{value}'
        },
        data: [
          {
            value: 70
          }
        ]
      }
    ]
  };

  return (
    <div className="environment-gauge-container">
      <Title level={5} className="environment-gauge-title">
        海洋牧场环境感知得分
      </Title>
      <ReactECharts option={option} style={{ height: '220px', width: '100%' }} />
    </div>
  );
};

export default EnvironmentGauge;
