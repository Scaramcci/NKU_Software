import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Papa from 'papaparse';

// 水质指标配置（名称、单位、最大值、归一化后最大值）
const INDICATORS = [
  { key: '水温(℃)', unit: '℃', max: 30, normalizedMax: 100 },
  { key: 'pH(无量纲)', unit: '', max: 14, normalizedMax: 100 },
  { key: '溶解氧(mg/L)', unit: 'mg/L', max: 15, normalizedMax: 100 },
  { key: '电导率(μS/cm)', unit: 'μS/cm', max: 2000, normalizedMax: 100 },
  { key: '浊度(NTU)', unit: 'NTU', max: 100, normalizedMax: 100 },
  { key: '高锰酸盐指数(mg/L)', unit: 'mg/L', max: 10, normalizedMax: 100 },
  { key: '氨氮(mg/L)', unit: 'mg/L', max: 2, normalizedMax: 100 },
  { key: '总磷(mg/L)', unit: 'mg/L', max: 1, normalizedMax: 100 },
  { key: '总氮(mg/L)', unit: 'mg/L', max: 10, normalizedMax: 100 },
];

// 示例数据 - 实际项目中应从CSV动态加载
const SAMPLE_DATA = [
  { subject: '水温', A: 16.1, fullMark: 30 },
  { subject: 'pH', A: 7.56, fullMark: 14 },
  { subject: '溶解氧', A: 5.76, fullMark: 15 },
  { subject: '电导率', A: 517.2, fullMark: 2000 },
  { subject: '浊度', A: 7.6, fullMark: 100 },
  { subject: '高锰酸盐指数', A: 3.11, fullMark: 10 },
  { subject: '氨氮', A: 0.751, fullMark: 2 },
  { subject: '总磷', A: 0.140, fullMark: 1 },
  { subject: '总氮', A: 3.14, fullMark: 10 },
];

// 数据归一化处理函数
const normalizeData = (rawValue, maxValue, normalizedMax = 100) => {
  return (rawValue / maxValue) * normalizedMax;
};

// Tooltip 格式化函数
// Tooltip 格式化函数 - 添加空值检查
// 修改Tooltip格式化函数参数和数据访问方式
const formatTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    // 确保entry和entry.A存在，提供默认值
    const rawValue = entry?.A ?? 0;
    // 查找指标时增加容错处理
    const indicator = INDICATORS.find(ind => ind.key.split('(')[0] === entry.subject) || {};
    // 防止除以零错误
    const percentage = indicator.max ? ((rawValue / indicator.max) * 100).toFixed(1) : '0.0';

    return (
      <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{entry.subject || '未知指标'}</p>
        <p style={{ margin: 0 }}>数值: {rawValue.toFixed(2)} {indicator.unit || ''}</p>

      </div>
    );
  }
  return null;
};

const RadarChartComponent = () => {
  const [radarData, setRadarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]); // 存储原始数据用于tooltip显示

  // 加载并解析CSV数据
  useEffect(() => {
    const loadWaterQualityData = async () => {
      try {
        // 实际项目中应根据选中的地点和日期动态加载对应CSV
        // const response = await fetch('@waterData/water_quality_by_name/四川省/长江流域/舵石盘/2021-04/舵石盘.csv');
        // const csvText = await response.text();
        // const parsedData = Papa.parse(csvText, { header: true }).data;
        // const latestData = parsedData[0]; // 取第一条数据示例

        // 格式化原始数据（用于tooltip显示）
        const formattedRawData = INDICATORS.map(indicator => {
          const subject = indicator.key.split('(')[0];
          const rawValue = SAMPLE_DATA.find(item => item.subject === subject)?.A || 0;
          return {
            subject,
            A: rawValue,
            fullMark: indicator.max
          };
        });

        // 格式化归一化数据（用于图表绘制）
        const normalizedData = formattedRawData.map(item => {
          const indicator = INDICATORS.find(ind => ind.key.split('(')[0] === item.subject);
          return {
            ...item,
            normalizedA: normalizeData(item.A, indicator.max, indicator.normalizedMax)
          };
        });

        setRawData(formattedRawData);
        setRadarData(normalizedData);
      } catch (error) {
        console.error('Failed to load water quality data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWaterQualityData();
  }, []);

  if (loading) {
    return (
      <Card title="多维指标雷达图" size="small">
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          数据加载中...
        </div>
      </Card>
    );
  }

  return (
    <Card title="多维指标雷达图" size="small">
      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#e8e8e8" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fontSize: 10 }} />
            <Radar
              name="水质指标"
              dataKey="normalizedA"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              animationDuration={1500}
            />
            <Tooltip
              content={formatTooltip}
              cursor={{ strokeDasharray: '3 3' }}
              animationDuration={300}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RadarChartComponent;
