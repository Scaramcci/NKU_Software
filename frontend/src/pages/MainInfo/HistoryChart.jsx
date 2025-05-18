// src/pages/MainInfo/HistoryChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Card } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import './HistoryChart.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['周一', '周二', '周三', '周四', '周五'],
  datasets: [
    {
      label: '溶解氧 (mg/L)',
      data: [6.0, 6.1, 6.3, 6.0, 5.9],
      backgroundColor: 'rgba(0, 255, 255, 0.5)',
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#00e5ff'
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#00f0ff',
        font: { weight: 'bold' }
      },
      position: 'top'
    },
    title: {
      display: true,
      text: '溶解氧变化趋势',
      color: '#00f0ff',
      font: { size: 20 }
    }
  },
  scales: {
    x: {
      ticks: { color: '#aef' },
      grid: { color: 'rgba(0,255,255,0.1)' }
    },
    y: {
      ticks: { color: '#aef' },
      grid: { color: 'rgba(0,255,255,0.1)' }
    }
  }
};

const HistoryChart = () => {
  return (
    <Card className="history-chart-card">
      <Bar options={options} data={data} />
    </Card>
  );
};

export default HistoryChart;
