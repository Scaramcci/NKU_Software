// src/pages/SmartCenter/modules/FishInfo.jsx
import React from 'react';
import { Card, Typography } from 'antd';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title
} from 'chart.js';
import { ToolOutlined } from '@ant-design/icons';
import './wangyiposun.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

const { Text } = Typography;

const data = {
  labels: ['1', '2', '3', '5', '7', '9', '11'], // 可以根据实际调整
  datasets: [
    {
      data: [2, 3, 5, 7, 9, 7, 3],
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 8,
      barThickness: 10
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: '网衣 / 鱼群检测',
      color: '#fff',
      font: { size: 18 }
    },
    tooltip: {
      backgroundColor: '#333',
      titleColor: '#fff',
      bodyColor: '#fff'
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#fff',
        callback: (value) => `${data.labels[value]}`,
        maxRotation: 45,
        minRotation: 45
      },
      grid: { display: false }
    },
    y: {
      ticks: { color: '#fff' },
      grid: {
        color: 'rgba(255, 255, 255, 0.2)'
      }
    }
  }
};

const FishInfo = () => {
  return (
    <Card
      className="fish-info-chart-card"
      bordered={false}
      style={{
        background: 'linear-gradient(145deg, #0f3d62, #082c47)',
        borderRadius: 20,
        color: '#fff',
        height: 300
      }}
    >
      <div style={{ height: 160 }}>
        <Bar data={data} options={options} />
      </div>
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <ToolOutlined style={{ color: '#d16a5d', marginRight: 8 }} />
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>
          网衣破损（2024-02-01）
        </Text>
      </div>
    </Card>
  );
};

export default FishInfo;
