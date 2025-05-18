// src/pages/SmartCenter/WeatherAlert.jsx
import React, { useEffect, useState } from 'react';
import { Card, Typography, Alert, Space, Spin } from 'antd';
import {
  ThunderboltOutlined,
  CloudOutlined,
  WarningOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import './WeatherAlert.css';

const { Title, Text } = Typography;

const WeatherAlert = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 替换为真实后端接口
    fetch('/api/weather/current')
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('天气数据加载失败:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Card className="weather-alert-card">
      <Title level={4} className="weather-alert-title" style={{ color: '#fff' }}>天气预警</Title>
      {loading ? (
        <Spin tip="加载天气信息中..." />
      ) : (
        <>
          <div className="weather-status">
            <div className="weather-icon-wrapper">
              <CloudOutlined className="weather-icon" />
            </div>
            <div className="weather-details">
              <Text className="weather-info" style={{ color: '#fff' }}>🌡 当前温度：{weatherData?.temperature ?? '--'}°C</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>🌬 风速：{weatherData?.windSpeed ?? '--'} m/s</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>💧 湿度：{weatherData?.humidity ?? '--'}%</Text>
            </div>
          </div>

          <div className="ai-advice">
            <div className="ai-advice-header">
              <ExperimentOutlined className="ai-icon" />
              <Text className="ai-title">AI 智能建议</Text>
            </div>
            <div className="ai-text">
              <Text className="weather-info" style={{ color: '#fff' }}>🌡 温度建议：{weatherData?.recommendation?.temperature ?? '--'}</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>🧪 pH 建议：{weatherData?.recommendation?.ph ?? '--'}</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>🧂 盐度建议：{weatherData?.recommendation?.salinity ?? '--'}</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>☀️ 光照建议：{weatherData?.recommendation?.light ?? '--'}</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>💧 溶氧建议：{weatherData?.recommendation?.oxygen ?? '--'}</Text>
            </div>
          </div>

          <Space direction="vertical" className="weather-warning-list">
            {weatherData?.alerts?.length > 0 && weatherData.alerts.map((alert, index) => (
              <Alert
                key={index}
                message={<span style={{ fontSize: '16px', color: '#fff' }}>{alert.message}</span>}
                type={alert.type} // "warning" | "error" | "info"
                showIcon
                icon={alert.type === 'error' ? <ThunderboltOutlined /> : <WarningOutlined />}
              />
            ))}
          </Space>
        </>
      )}
    </Card>
  );
};

export default WeatherAlert;
