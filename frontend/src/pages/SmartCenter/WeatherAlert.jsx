// src/pages/SmartCenter/WeatherAlert.jsx
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Typography, 
  Alert, 
  Space, 
  Spin,
  message
} from 'antd';
import {
  ThunderboltOutlined,
  CloudOutlined,
  WarningOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import './WeatherAlert.css';

const { Title, Text } = Typography;

const WeatherAlert = ({ selectedPoint }) => {
  // 渔场数据映射
  const FISHING_AREA_DATA = {
    '渤海渔场': {
      areaSize: '8000亩',
      waterType: '海水',
      fishTypes: ['小黄鱼', '带鱼', '对虾']
    },
    '舟山渔场': {
      areaSize: '12000亩', 
      waterType: '海水',
      fishTypes: ['大黄鱼', '小黄鱼', '带鱼', '墨鱼']
    },
    '南海渔场': {
      areaSize: '10000亩',
      waterType: '海水',
      fishTypes: ['金枪鱼', '马鲛鱼', '石斑鱼']
    },
    '北部湾渔场': {
      areaSize: '9000亩',
      waterType: '海水',
      fishTypes: ['绯鲤', '红笛鲷', '金线鱼']
    }
  };

  // 生成AI建议
  const generateRecommendations = (weather) => {
    const temp = parseFloat(weather.temperature);
    const humidity = parseFloat(weather.humidity);
    const windPower = parseInt(weather.windpower) || 0;
    
    // 基础建议
    const baseRecommendations = {
      temperature: temp > 28 ? '高温预警：建议增加水体循环和遮阳设施' : 
                  temp < 10 ? '低温预警：注意保温措施，减少投喂量' : '温度适宜养殖',
      ph: '建议保持pH值在7.5-8.5之间，每日监测',
      salinity: humidity > 80 ? '高湿度可能稀释盐度，建议增加盐度监测频率' : '盐度正常',
      light: '建议每日光照8-10小时，避免强光直射',
      oxygen: '保持溶氧量在5mg/L以上，必要时使用增氧设备',
      wind: windPower > 6 ? '大风预警：检查网箱固定，减少投喂' : '风力条件正常'
    };
  
    // 渔场特色建议
    const areaRecommendations = selectedPoint && FISHING_AREA_DATA[selectedPoint.name] ? {
      fishTips: `当前适合养殖：${FISHING_AREA_DATA[selectedPoint.name].fishTypes.join('、')}`,
      feeding: temp > 25 ? '建议增加投喂频率' : '按常规投喂即可',
      management: windPower > 5 ? '注意检查网箱固定情况' : '可进行常规管理操作'
    } : {};
  
    return {
      ...baseRecommendations,
      ...areaRecommendations
    };
  };
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPoint) {
      getWeatherByLocation([selectedPoint.lng, selectedPoint.lat]);
    } else {
      // 默认显示舟山渔场天气
      getWeatherByLocation([122.2, 29.98]);
    }
  }, [selectedPoint]);

  const getWeatherByLocation = (lnglat) => {
    setLoading(true);
    console.log('开始获取天气数据，位置:', lnglat);
    
    // 首先尝试获取精确位置的天气
    fetch(`https://restapi.amap.com/v3/geocode/regeo?key=9238743e5d83039e6f3486a437f5eb0d&location=${lnglat[0]},${lnglat[1]}`)
      .then(res => {
        if (!res.ok) throw new Error('网络请求失败');
        return res.json();
      })
      .then(geoData => {
        console.log('地理位置API返回:', geoData);
        if (geoData.status !== '1') {
          throw new Error('获取地理位置失败');
        }
        const adcode = geoData.regeocode.addressComponent.adcode;
        return fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=9238743e5d83039e6f3486a437f5eb0d&city=${adcode}`);
      })
      .then(res => {
        if (!res.ok) throw new Error('天气请求失败');
        return res.json();
      })
      .then(data => {
        console.log('天气API返回:', data);
        if (data.status !== '1' || !data.lives || data.lives.length === 0) {
          // 如果精确位置获取失败，尝试获取附近城市的天气
          return fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=9238743e5d83039e6f3486a437f5eb0d&extensions=base&location=${lnglat[0]},${lnglat[1]}`);
        }
        setWeatherData(data.lives[0]);
        return null;
      })
      .then(nearbyData => {
        if (nearbyData) {
          return nearbyData.json().then(data => {
            if (data.status === '1' && data.lives && data.lives.length > 0) {
              setWeatherData(data.lives[0]);
            } else {
              throw new Error('无法获取附近城市天气数据');
            }
          });
        }
      })
      .catch(error => {
        console.error('请求失败:', error);
        message.error('获取天气数据失败: ' + error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card className="weather-alert-card">
      <Title level={4} className="weather-alert-title" style={{ color: '#fff' }}>天气预警</Title>
      {selectedPoint && (
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ color: '#00eaff' }}>当前渔场: {selectedPoint.name}</Text>
          <div style={{ marginTop: 8 }}>
            <Text style={{ color: '#fff' }}>面积: {FISHING_AREA_DATA[selectedPoint.name]?.areaSize || '--'}</Text>
            <Text style={{ color: '#fff', marginLeft: 16 }}>养殖类型: {FISHING_AREA_DATA[selectedPoint.name]?.waterType || '--'}</Text>
            <Text style={{ color: '#fff', display: 'block', marginTop: 4 }}>
              主要鱼种: {FISHING_AREA_DATA[selectedPoint.name]?.fishTypes?.join('、') || '--'}
            </Text>
          </div>
        </div>
      )}
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
              <Text className="weather-info" style={{ color: '#fff' }}>🌬 风速：{weatherData?.windpower ?? weatherData?.windSpeed ?? '--'} 级</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>🧭 风向：{weatherData?.winddirection ?? '--'}</Text>
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
              <Text className="weather-info" style={{ color: '#fff' }}>🌬 风力建议：{weatherData?.recommendation?.wind ?? '--'}</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>🍽 投喂建议：{weatherData?.recommendation?.feeding ?? '--'}</Text>
              <Text className="weather-info" style={{ color: '#fff' }}>🛠 管理建议：{weatherData?.recommendation?.management ?? '--'}</Text>
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
