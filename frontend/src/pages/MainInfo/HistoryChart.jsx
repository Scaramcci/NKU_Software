import React, { useState } from 'react';
import { Card, DatePicker, Button, Select, Space } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;

const generateData = (label) => {
  const values = {
    溶解氧: [6.1, 6.5, 6.0, 6.2, 6.3, 6.1, 6.4],
    电池电压: [24.0, 24.5, 25.2, 25.0, 24.8, 25.1, 25.3],
    盐度: [30.1, 30.4, 30.0, 30.3, 30.6, 30.5, 30.7]
  };
  return values[label] || [];
};

const HistoryChart = () => {
  const [range, setRange] = useState([dayjs().subtract(6, 'day'), dayjs()]);
  const [metric, setMetric] = useState('溶解氧');

  const labels = Array.from({ length: 7 }, (_, i) =>
    dayjs(range[0]).add(i, 'day').format('MM-DD')
  );

  const data = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: `${metric}`,
        data: generateData(metric),
        backgroundColor: 'rgba(0, 255, 255, 0.35)',
        borderColor: '#00e5ff',
        borderWidth: 1,
        borderRadius: 8
      },
      {
        type: 'line',
        label: '温度 (°C)',
        data: [10, 11, 13, 12, 15, 16, 17],
        borderColor: '#ffc107',
        backgroundColor: '#ffc107',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#00ffff',
          font: { weight: 'bold', size: 12 }
        }
      },
      title: {
        display: true,
        text: `历史 ${metric} 变化趋势`,
        color: '#00f0ff',
        font: { size: 16 },
        padding: { top: 4, bottom: 6 }
      }
    },
    layout: {
      padding: {
        top: 4,
        bottom: 0
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#aef',
          font: { size: 11 }
        },
        grid: { color: 'rgba(0,255,255,0.1)' }
      },
      y: {
        ticks: {
          color: '#aef',
          font: { size: 11 }
        },
        title: {
          display: true,
          text: metric,
          color: '#00ffff',
          font: { size: 12 }
        }
      },
      y1: {
        position: 'right',
        ticks: {
          color: '#ffc107',
          font: { size: 11 }
        },
        title: {
          display: true,
          text: '温度 (°C)',
          color: '#ffc107',
          font: { size: 12 }
        },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <Card
      className="history-chart-card"
      bodyStyle={{
        padding: '12px 14px 8px 14px',
        background: 'linear-gradient(135deg, #022c47, #004d70)',
        borderRadius: 12,
        color: '#fff',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <div className="chart-toolbar" style={{ marginBottom: 8 }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>统计时间：</span>
          <RangePicker
            size="small"
            value={range}
            onChange={(dates) => dates && setRange(dates)}
            inputReadOnly
            style={{
              backgroundColor: '#031d38',
              borderColor: '#00c0ff',
              color: '#fff',      
              fontSize: 12,
              width: 240
            }}
          />
          <Space wrap size={6}>
            <Button size="small" onClick={() => setRange([dayjs(), dayjs()])}>近一天</Button>
            <Button size="small" onClick={() => setRange([dayjs().subtract(6, 'day'), dayjs()])}>近一周</Button>
            <Button size="small" onClick={() => setRange([dayjs().subtract(1, 'month'), dayjs()])}>近一月</Button>
            <Button size="small" onClick={() => setRange([dayjs().subtract(1, 'year'), dayjs()])}>近一年</Button>
            <Select
              size="small"
              value={metric}
              style={{ width: 100 }}
              onChange={(val) => setMetric(val)}
              options={[
                { label: '溶解氧', value: '溶解氧' },
                { label: '电池电压', value: '电池电压' },
                { label: '盐度', value: '盐度' }
              ]}
            />
          </Space>
        </Space>
      </div>
      <div style={{ height: '220px', overflow: 'hidden' }}>
        <Chart type="bar" options={options} data={data} />
      </div>
    </Card>
  );
};

export default HistoryChart;
