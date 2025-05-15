import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Alert, Divider, Badge, Switch, Tooltip, Button } from 'antd';
import { WarningOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { loadMonthlyWaterQualityData, analyzeWaterQuality, generateWaterQualityAnomalyReport } from '../../services/dataService';
import { getAllDevices, getDeviceStatus, autoControlDevicesByWaterQuality, POWER_STATUS } from '../../services/deviceControlService';

const MonitoringDashboard = () => {
  const [waterData, setWaterData] = useState(null);
  const [waterAnalysis, setWaterAnalysis] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoControl, setAutoControl] = useState(false);
  const [thresholds, setThresholds] = useState({
    oxygen: { min: 5, max: 8 },
    ph: { min: 6.5, max: 8.5 },
    temperature: { min: 18, max: 30 },
    ammonia: { min: 0, max: 1.0 },
    phosphorus: { min: 0, max: 0.2 },
    turbidity: { min: 0, max: 20 }
  });

  // 加载水质数据和设备数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 加载水质数据
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const waterQualityData = await loadMonthlyWaterQualityData(year, month);
        setWaterData(waterQualityData);
        
        // 分析水质数据
        if (waterQualityData) {
          const analysis = analyzeWaterQuality(waterQualityData);
          setWaterAnalysis(analysis);
          
          // 生成异常报告
          const anomalyReport = generateWaterQualityAnomalyReport(waterQualityData);
          setAnomalies(anomalyReport);
        }
        
        // 加载设备数据
        const deviceList = await getAllDevices();
        setDevices(deviceList);
      } catch (error) {
        console.error('加载监控数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // 定时刷新数据
    const intervalId = setInterval(() => {
      fetchData();
    }, 300000); // 每5分钟刷新一次
    
    return () => clearInterval(intervalId);
  }, []);
  
  // 自动控制设备
  useEffect(() => {
    if (autoControl && waterData && devices.length > 0) {
      const performAutoControl = async () => {
        try {
          const results = await autoControlDevicesByWaterQuality(waterData, devices);
          console.log('自动控制结果:', results);
          
          // 更新设备状态
          const updatedDevices = await Promise.all(
            devices.map(async (device) => {
              const status = await getDeviceStatus(device.id);
              return { ...device, ...status };
            })
          );
          setDevices(updatedDevices);
        } catch (error) {
          console.error('自动控制设备失败:', error);
        }
      };
      
      performAutoControl();
    }
  }, [autoControl, waterData, devices]);
  
  // 刷新数据
  const handleRefresh = async () => {
    try {
      setLoading(true);
      // 加载水质数据
      const date = new Date();
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const waterQualityData = await loadMonthlyWaterQualityData(year, month);
      setWaterData(waterQualityData);
      
      // 分析水质数据
      if (waterQualityData) {
        const analysis = analyzeWaterQuality(waterQualityData);
        setWaterAnalysis(analysis);
        
        // 生成异常报告
        const anomalyReport = generateWaterQualityAnomalyReport(waterQualityData);
        setAnomalies(anomalyReport);
      }
      
      // 加载设备数据
      const deviceList = await getAllDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error('刷新监控数据失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取参数状态颜色
  const getParameterStatusColor = (value, parameter) => {
    const { min, max } = thresholds[parameter] || { min: 0, max: 100 };
    if (value < min || value > max) {
      return '#f5222d'; // 红色，异常
    }
    return '#52c41a'; // 绿色，正常
  };
  
  // 生成水质参数图表选项
  const getWaterQualityChartOption = () => {
    if (!waterData) return {};
    
    return {
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['水温', 'pH值', '溶解氧', '氨氮', '总磷'],
        bottom: 0
      },
      grid: { left: '3%', right: '4%', bottom: '10%', top: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: waterData.days
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '水温',
          type: 'line',
          data: waterData.temperature,
          markLine: {
            silent: true,
            lineStyle: { color: '#f5222d' },
            data: [
              { yAxis: thresholds.temperature.min, name: '最低水温' },
              { yAxis: thresholds.temperature.max, name: '最高水温' }
            ]
          }
        },
        {
          name: 'pH值',
          type: 'line',
          data: waterData.ph,
          markLine: {
            silent: true,
            lineStyle: { color: '#f5222d' },
            data: [
              { yAxis: thresholds.ph.min, name: '最低pH' },
              { yAxis: thresholds.ph.max, name: '最高pH' }
            ]
          }
        },
        {
          name: '溶解氧',
          type: 'line',
          data: waterData.oxygen,
          markLine: {
            silent: true,
            lineStyle: { color: '#f5222d' },
            data: [
              { yAxis: thresholds.oxygen.min, name: '最低溶解氧' },
              { yAxis: thresholds.oxygen.max, name: '最高溶解氧' }
            ]
          }
        },
        {
          name: '氨氮',
          type: 'line',
          data: waterData.ammonia,
          markLine: {
            silent: true,
            lineStyle: { color: '#f5222d' },
            data: [
              { yAxis: thresholds.ammonia.max, name: '氨氮上限' }
            ]
          }
        },
        {
          name: '总磷',
          type: 'line',
          data: waterData.phosphorus,
          markLine: {
            silent: true,
            lineStyle: { color: '#f5222d' },
            data: [
              { yAxis: thresholds.phosphorus.max, name: '总磷上限' }
            ]
          }
        }
      ]
    };
  };
  
  // 生成设备状态图表选项
  const getDeviceStatusChartOption = () => {
    if (!devices || devices.length === 0) return {};
    
    const onlineCount = devices.filter(d => d.status === 'online').length;
    const offlineCount = devices.filter(d => d.status === 'offline').length;
    const warningCount = devices.filter(d => d.status === 'warning').length;
    
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: '设备状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: '18', fontWeight: 'bold' }
          },
          labelLine: { show: false },
          data: [
            { value: onlineCount, name: '在线', itemStyle: { color: '#52c41a' } },
            { value: offlineCount, name: '离线', itemStyle: { color: '#f5222d' } },
            { value: warningCount, name: '警告', itemStyle: { color: '#faad14' } }
          ]
        }
      ]
    };
  };
  
  return (
    <div style={{ padding: '16px' }}>
      <Card 
        title="水质监控面板" 
        extra={
          <div>
            <Tooltip title="自动控制">
              <Switch 
                checked={autoControl} 
                onChange={setAutoControl} 
                style={{ marginRight: '16px' }} 
                checkedChildren="自动控制开" 
                unCheckedChildren="自动控制关"
              />
            </Tooltip>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>刷新</Button>
          </div>
        }
      >
        {waterAnalysis && (
          <Alert 
            message={`当前水质等级: ${waterAnalysis.qualityLevel.level} (${waterAnalysis.qualityLevel.description})`}
            type={waterAnalysis.qualityLevel.level === 'I' || waterAnalysis.qualityLevel.level === 'II' ? 'success' : 
                 waterAnalysis.qualityLevel.level === 'III' ? 'warning' : 'error'}
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}
        
        <Row gutter={[16, 16]}>
          {/* 水质参数统计 */}
          <Col span={24} lg={12}>
            <Card title="实时水质参数" bordered={false}>
              <Row gutter={[16, 16]}>
                {waterAnalysis && (
                  <>
                    <Col span={8}>
                      <Statistic 
                        title="水温 (°C)" 
                        value={waterAnalysis.averages.temperature} 
                        valueStyle={{ color: getParameterStatusColor(parseFloat(waterAnalysis.averages.temperature), 'temperature') }}
                        prefix={parseFloat(waterAnalysis.averages.temperature) >= thresholds.temperature.min && 
                               parseFloat(waterAnalysis.averages.temperature) <= thresholds.temperature.max ? 
                               <CheckCircleOutlined /> : <WarningOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="pH值" 
                        value={waterAnalysis.averages.ph} 
                        valueStyle={{ color: getParameterStatusColor(parseFloat(waterAnalysis.averages.ph), 'ph') }}
                        prefix={parseFloat(waterAnalysis.averages.ph) >= thresholds.ph.min && 
                               parseFloat(waterAnalysis.averages.ph) <= thresholds.ph.max ? 
                               <CheckCircleOutlined /> : <WarningOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="溶解氧 (mg/L)" 
                        value={waterAnalysis.averages.oxygen} 
                        valueStyle={{ color: getParameterStatusColor(parseFloat(waterAnalysis.averages.oxygen), 'oxygen') }}
                        prefix={parseFloat(waterAnalysis.averages.oxygen) >= thresholds.oxygen.min && 
                               parseFloat(waterAnalysis.averages.oxygen) <= thresholds.oxygen.max ? 
                               <CheckCircleOutlined /> : <WarningOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="氨氮 (mg/L)" 
                        value={waterAnalysis.averages.ammonia} 
                        valueStyle={{ color: getParameterStatusColor(parseFloat(waterAnalysis.averages.ammonia), 'ammonia') }}
                        prefix={parseFloat(waterAnalysis.averages.ammonia) <= thresholds.ammonia.max ? 
                               <CheckCircleOutlined /> : <WarningOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="总磷 (mg/L)" 
                        value={waterAnalysis.averages.phosphorus} 
                        valueStyle={{ color: getParameterStatusColor(parseFloat(waterAnalysis.averages.phosphorus), 'phosphorus') }}
                        prefix={parseFloat(waterAnalysis.averages.phosphorus) <= thresholds.phosphorus.max ? 
                               <CheckCircleOutlined /> : <WarningOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic 
                        title="浊度 (NTU)" 
                        value={waterAnalysis.averages.turbidity} 
                        valueStyle={{ color: getParameterStatusColor(parseFloat(waterAnalysis.averages.turbidity), 'turbidity') }}
                        prefix={parseFloat(waterAnalysis.averages.turbidity) <= thresholds.turbidity.max ? 
                               <CheckCircleOutlined /> : <WarningOutlined />}
                      />
                    </Col>
                  </>
                )}
              </Row>
            </Card>
          </Col>
          
          {/* 设备状态统计 */}
          <Col span={24} lg={12}>
            <Card title="设备状态概览" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic 
                    title="设备总数" 
                    value={devices.length} 
                    suffix={`台`}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="在线设备" 
                    value={devices.filter(d => d.status === 'online').length} 
                    valueStyle={{ color: '#52c41a' }}
                    suffix={`台`}
                    prefix={<Badge status="success" />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="运行设备" 
                    value={devices.filter(d => d.powerStatus === POWER_STATUS.ON).length} 
                    valueStyle={{ color: '#1890ff' }}
                    suffix={`台`}
                    prefix={<Badge status="processing" />}
                  />
                </Col>
              </Row>
              <Divider style={{ margin: '16px 0' }} />
              <ReactECharts option={getDeviceStatusChartOption()} style={{ height: '200px' }} />
            </Card>
          </Col>
          
          {/* 水质趋势图 */}
          <Col span={24}>
            <Card title="水质参数趋势" bordered={false}>
              <ReactECharts option={getWaterQualityChartOption()} style={{ height: '300px' }} />
            </Card>
          </Col>
          
          {/* 异常警报 */}
          <Col span={24}>
            <Card 
              title={<span><WarningOutlined style={{ color: '#f5222d' }} /> 水质异常警报</span>} 
              bordered={false}
            >
              {anomalies && anomalies.length > 0 ? (
                anomalies.map((anomaly, index) => (
                  <Alert
                    key={index}
                    message={`${anomaly.day} - ${anomaly.parameter}${anomaly.severity}`}
                    description={`测量值: ${anomaly.value}, 正常范围: ${anomaly.normalRange}, 影响: ${anomaly.impact}`}
                    type="error"
                    showIcon
                    style={{ marginBottom: '8px' }}
                  />
                ))
              ) : (
                <Alert message="当前无水质异常" type="success" showIcon />
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MonitoringDashboard;