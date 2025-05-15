import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Tabs, Statistic, Alert, List, Tag, Divider, Typography, Select, Spin } from 'antd';
import { LineChartOutlined, BarChartOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { analyzeWaterQuality, generateWaterQualityTrendReport, generateWaterQualityAnomalyReport } from '../../services/dataService';
import { loadStationWaterQualityData, getAvailableStations } from '../../services/waterQualityService';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const WaterQualityReport = ({ year = '2021', month = '04' }) => {
  const [waterData, setWaterData] = useState(null);
  const [waterAnalysis, setWaterAnalysis] = useState(null);
  const [trendReport, setTrendReport] = useState(null);
  const [anomalyReport, setAnomalyReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    // 获取可用的监测点列表
    const fetchStations = async () => {
      try {
        const stationList = await getAvailableStations();
        setStations(stationList);
        if (stationList.length > 0 && !selectedStation) {
          setSelectedStation(stationList[0]);
        }
      } catch (error) {
        console.error('获取监测点列表失败:', error);
      }
    };
    
    fetchStations();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStation) return;
      
      setLoading(true);
      try {
        // 加载水质数据
        const { province, basin, station } = selectedStation;
        const data = await loadStationWaterQualityData(province, basin, station, year, month);
        setWaterData(data);
        
        // 分析水质数据
        if (data) {
          const analysis = analyzeWaterQuality(data);
          setWaterAnalysis(analysis);
          
          // 生成趋势报告
          const trends = generateWaterQualityTrendReport(data);
          setTrendReport(trends);
          
          // 生成异常报告
          const anomalies = generateWaterQualityAnomalyReport(data);
          setAnomalyReport(anomalies);
        }
      } catch (error) {
        console.error('加载水质报告数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [year, month, selectedStation]);
  
  // 处理监测点变化
  const handleStationChange = (value) => {
    const station = stations.find(s => `${s.province}-${s.basin}-${s.station}` === value);
    setSelectedStation(station);
  };

  // 水质趋势图表配置
  const getTrendChartOption = () => {
    if (!waterData) return {};
    
    return {
      title: { text: `${year}年${month}月水质参数趋势` },
      tooltip: { trigger: 'axis' },
      legend: { 
        data: ['水温(°C)', 'pH值', '溶解氧(mg/L)', '浊度(NTU)', '高锰酸盐指数(mg/L)'],
        type: 'scroll',
        bottom: 10
      },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: { type: 'category', data: waterData.days },
      yAxis: { type: 'value' },
      series: [
        { name: '水温(°C)', type: 'line', data: waterData.temperature },
        { name: 'pH值', type: 'line', data: waterData.ph },
        { name: '溶解氧(mg/L)', type: 'line', data: waterData.oxygen },
        { name: '浊度(NTU)', type: 'line', data: waterData.turbidity },
        { name: '高锰酸盐指数(mg/L)', type: 'line', data: waterData.permanganate }
      ],
      dataZoom: [{ type: 'inside', start: 0, end: 100 }, { start: 0, end: 100 }]
    };
  };

  // 水质参数分布图表配置
  const getParameterDistributionOption = () => {
    if (!waterData) return {};
    
    // 计算各参数的分布情况
    const calculateDistribution = (data, ranges) => {
      const distribution = ranges.map(range => ({ range: range.label, count: 0 }));
      
      data.forEach(value => {
        for (let i = 0; i < ranges.length; i++) {
          if (value >= ranges[i].min && value <= ranges[i].max) {
            distribution[i].count++;
            break;
          }
        }
      });
      
      return distribution;
    };
    
    // 定义pH值的范围
    const phRanges = [
      { min: 0, max: 6.5, label: '酸性 (<6.5)' },
      { min: 6.5, max: 7.5, label: '中性 (6.5-7.5)' },
      { min: 7.5, max: 8.5, label: '弱碱性 (7.5-8.5)' },
      { min: 8.5, max: 14, label: '碱性 (>8.5)' }
    ];
    
    // 定义溶解氧的范围
    const oxygenRanges = [
      { min: 0, max: 3, label: '严重缺氧 (<3)' },
      { min: 3, max: 5, label: '轻度缺氧 (3-5)' },
      { min: 5, max: 7, label: '良好 (5-7)' },
      { min: 7, max: 20, label: '优秀 (>7)' }
    ];
    
    const phDistribution = calculateDistribution(waterData.ph, phRanges);
    const oxygenDistribution = calculateDistribution(waterData.oxygen, oxygenRanges);
    
    return {
      title: { text: '水质参数分布' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left', top: 'center' },
      series: [
        {
          name: 'pH值分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['30%', '50%'],
          label: { formatter: '{b}: {c} ({d}%)' },
          data: phDistribution.map(item => ({
            value: item.count,
            name: item.range
          }))
        },
        {
          name: '溶解氧分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['75%', '50%'],
          label: { formatter: '{b}: {c} ({d}%)' },
          data: oxygenDistribution.map(item => ({
            value: item.count,
            name: item.range
          }))
        }
      ]
    };
  };

  // 水质类别分布图表配置
  const getWaterQualityCategoryOption = () => {
    if (!waterData || !waterData.days) return {};
    
    // 模拟水质类别数据（实际项目中应从API获取）
    // 基于水质参数计算每天的水质类别
    const calculateDailyWaterQuality = () => {
      const categories = [];
      const counts = { 'I': 0, 'II': 0, 'III': 0, 'IV': 0, 'V': 0, '劣V': 0 };
      
      for (let i = 0; i < waterData.days.length; i++) {
        const ph = waterData.ph[i];
        const oxygen = waterData.oxygen[i];
        const permanganate = waterData.permanganate[i];
        const ammonia = waterData.ammonia[i];
        const phosphorus = waterData.phosphorus[i];
        
        let category;
        
        if (ph >= 6.5 && ph <= 8.5 && oxygen >= 6 && permanganate <= 4 && ammonia <= 0.5 && phosphorus <= 0.1) {
          category = 'I';
        } else if (ph >= 6 && ph <= 9 && oxygen >= 5 && permanganate <= 6 && ammonia <= 1.0 && phosphorus <= 0.2) {
          category = 'II';
        } else if (ph >= 6 && ph <= 9 && oxygen >= 4 && permanganate <= 8 && ammonia <= 1.5 && phosphorus <= 0.3) {
          category = 'III';
        } else if (ph >= 6 && ph <= 9 && oxygen >= 3 && permanganate <= 10 && ammonia <= 2.0 && phosphorus <= 0.4) {
          category = 'IV';
        } else if (ph >= 6 && ph <= 9 && oxygen >= 2 && permanganate <= 15 && ammonia <= 3.0 && phosphorus <= 0.5) {
          category = 'V';
        } else {
          category = '劣V';
        }
        
        categories.push(category);
        counts[category]++;
      }
      
      return { categories, counts };
    };
    
    const { categories, counts } = calculateDailyWaterQuality();
    
    const categoryColors = {
      'I': '#52c41a',
      'II': '#91d5ff',
      'III': '#fadb14',
      'IV': '#fa8c16',
      'V': '#f5222d',
      '劣V': '#722ed1'
    };
    
    const categoryData = Object.keys(counts).map(key => ({
      value: counts[key],
      name: `${key}类`,
      itemStyle: { color: categoryColors[key] }
    }));
    
    return {
      title: { text: '水质类别分布' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '水质类别',
          type: 'pie',
          radius: '50%',
          data: categoryData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: { formatter: '{b}: {c} ({d}%)' }
        }
      ]
    };
  };

  // 异常数据表格列配置
  const anomalyColumns = [
    { title: '日期', dataIndex: 'day', key: 'day' },
    { title: '参数', dataIndex: 'parameter', key: 'parameter' },
    { 
      title: '数值', 
      dataIndex: 'value', 
      key: 'value',
      render: (text, record) => (
        <span style={{ color: record.severity === '过高' ? '#f5222d' : '#1890ff' }}>
          {text}
        </span>
      )
    },
    { title: '正常范围', dataIndex: 'normalRange', key: 'normalRange' },
    { 
      title: '异常类型', 
      dataIndex: 'severity', 
      key: 'severity',
      render: text => (
        <Tag color={text === '过高' ? 'error' : 'blue'}>{text}</Tag>
      )
    },
    { title: '潜在影响', dataIndex: 'impact', key: 'impact' }
  ];

  // 趋势报告表格列配置
  const trendColumns = [
    { title: '参数', dataIndex: 'parameter', key: 'parameter' },
    { title: '趋势', dataIndex: 'trend', key: 'trend' },
    { 
      title: '变化强度', 
      dataIndex: 'strength', 
      key: 'strength',
      render: (text) => {
        let color = 'blue';
        if (text === '显著') color = 'red';
        else if (text === '中等') color = 'orange';
        else if (text === '轻微') color = 'green';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { title: '建议措施', dataIndex: 'suggestion', key: 'suggestion' }
  ];

  // 生成趋势报告数据
  const getTrendReportData = () => {
    if (!trendReport) return [];
    
    const getSuggestion = (parameter, direction, strength) => {
      if (strength === '几乎无变化') return '继续保持现有管理方式';
      
      const suggestions = {
        temperature: {
          up: '注意控制水温，增加遮阳或水体循环',
          down: '注意保持适宜水温，必要时增加加热设备'
        },
        ph: {
          up: '监控pH值上升趋势，必要时添加调节剂',
          down: '监控pH值下降趋势，必要时添加碱性物质'
        },
        oxygen: {
          up: '良好趋势，继续保持',
          down: '注意溶解氧下降趋势，增加增氧设备运行时间'
        },
        conductivity: {
          up: '注意水体电导率上升，可能有污染物增加',
          down: '监控电导率变化，保持水质稳定'
        },
        turbidity: {
          up: '注意水体浊度上升，增加过滤或沉淀处理',
          down: '良好趋势，继续保持'
        },
        permanganate: {
          up: '注意有机物污染增加趋势，加强水处理',
          down: '有机物污染减少，良好趋势'
        },
        ammonia: {
          up: '氨氮上升趋势明显，增加换水频率或生物过滤',
          down: '氨氮下降，良好趋势'
        },
        phosphorus: {
          up: '总磷上升，注意控制饵料投放量',
          down: '总磷下降，良好趋势'
        },
        nitrogen: {
          up: '总氮上升，注意控制饵料投放量和排泄物处理',
          down: '总氮下降，良好趋势'
        }
      };
      
      return suggestions[parameter] ? 
        suggestions[parameter][direction === '上升' ? 'up' : 'down'] : 
        '保持监测，根据变化调整管理措施';
    };
    
    const parameterNames = {
      temperature: '水温',
      ph: 'pH值',
      oxygen: '溶解氧',
      conductivity: '电导率',
      turbidity: '浊度',
      permanganate: '高锰酸盐指数',
      ammonia: '氨氮',
      phosphorus: '总磷',
      nitrogen: '总氮'
    };
    
    return Object.keys(trendReport).map(key => ({
      key,
      parameter: parameterNames[key],
      trend: trendReport[key].direction,
      strength: trendReport[key].strength,
      suggestion: getSuggestion(key, trendReport[key].direction, trendReport[key].strength)
    }));
  };

  return (
    <div className="water-quality-report">
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>选择监测点</Typography.Title>
          <Select
            style={{ width: 300 }}
            placeholder="请选择监测点"
            value={selectedStation ? `${selectedStation.province}-${selectedStation.basin}-${selectedStation.station}` : undefined}
            onChange={handleStationChange}
          >
            {stations.map(station => (
              <Option key={`${station.province}-${station.basin}-${station.station}`} value={`${station.province}-${station.basin}-${station.station}`}>
                {station.province} - {station.basin} - {station.station}
              </Option>
            ))}
          </Select>
        </div>
      </Card>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>加载水质数据中...</p>
        </div>
      ) : (
        <Tabs defaultActiveKey="overview">
        <TabPane
          tab={<span><LineChartOutlined />水质概览</span>}
          key="overview"
        >
          {waterAnalysis && (
            <>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Alert
                    message={`水质综合评价: ${waterAnalysis.qualityLevel.level}类 (${waterAnalysis.qualityLevel.description})`}
                    description={`根据《地表水环境质量标准(GB3838-2002)》评估，当前水质为${waterAnalysis.qualityLevel.level}类水质，${waterAnalysis.qualityLevel.description}。`}
                    type={waterAnalysis.qualityLevel.level === 'I' || waterAnalysis.qualityLevel.level === 'II' ? 'success' : 
                          waterAnalysis.qualityLevel.level === 'III' ? 'warning' : 'error'}
                    showIcon
                  />
                </Col>
              </Row>
              
              <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col span={24}>
                  <Card title="水质参数平均值">
                    <Row gutter={[24, 24]}>
                      <Col span={8}>
                        <Statistic title="水温" value={waterAnalysis.averages.temperature} suffix="°C" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="pH值" value={waterAnalysis.averages.ph} />
                      </Col>
                      <Col span={8}>
                        <Statistic title="溶解氧" value={waterAnalysis.averages.oxygen} suffix="mg/L" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="电导率" value={waterAnalysis.averages.conductivity} suffix="μS/cm" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="浊度" value={waterAnalysis.averages.turbidity} suffix="NTU" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="高锰酸盐指数" value={waterAnalysis.averages.permanganate} suffix="mg/L" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="氨氮" value={waterAnalysis.averages.ammonia} suffix="mg/L" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="总磷" value={waterAnalysis.averages.phosphorus} suffix="mg/L" />
                      </Col>
                      <Col span={8}>
                        <Statistic title="总氮" value={waterAnalysis.averages.nitrogen} suffix="mg/L" />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              
              <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col span={24}>
                  <Card title="达标率统计">
                    <Row gutter={[24, 24]}>
                      <Col span={8}>
                        <Statistic 
                          title="pH值达标率" 
                          value={waterAnalysis.complianceRates.ph} 
                          valueStyle={{ color: parseFloat(waterAnalysis.complianceRates.ph) >= 90 ? '#52c41a' : '#f5222d' }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic 
                          title="溶解氧达标率" 
                          value={waterAnalysis.complianceRates.oxygen}
                          valueStyle={{ color: parseFloat(waterAnalysis.complianceRates.oxygen) >= 90 ? '#52c41a' : '#f5222d' }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic 
                          title="高锰酸盐指数达标率" 
                          value={waterAnalysis.complianceRates.permanganate}
                          valueStyle={{ color: parseFloat(waterAnalysis.complianceRates.permanganate) >= 90 ? '#52c41a' : '#f5222d' }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic 
                          title="氨氮达标率" 
                          value={waterAnalysis.complianceRates.ammonia}
                          valueStyle={{ color: parseFloat(waterAnalysis.complianceRates.ammonia) >= 90 ? '#52c41a' : '#f5222d' }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic 
                          title="总磷达标率" 
                          value={waterAnalysis.complianceRates.phosphorus}
                          valueStyle={{ color: parseFloat(waterAnalysis.complianceRates.phosphorus) >= 90 ? '#52c41a' : '#f5222d' }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </>
          )}
          
          {waterData && (
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card>
                  <ReactECharts option={getTrendChartOption()} style={{ height: 400 }} />
                </Card>
              </Col>
            </Row>
          )}
        </TabPane>
        
        <TabPane
          tab={<span><BarChartOutlined />水质分布</span>}
          key="distribution"
        >
          {waterData && (
            <>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Card>
                    <ReactECharts option={getParameterDistributionOption()} style={{ height: 400 }} />
                  </Card>
                </Col>
              </Row>
              
              <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col span={24}>
                  <Card>
                    <ReactECharts option={getWaterQualityCategoryOption()} style={{ height: 400 }} />
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </TabPane>
        
        <TabPane
          tab={<span><WarningOutlined />异常分析</span>}
          key="anomaly"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card title={`异常数据分析 (共${anomalyReport.length}条)`}>
                {anomalyReport.length > 0 ? (
                  <Table 
                    columns={anomalyColumns} 
                    dataSource={anomalyReport.map((item, index) => ({ ...item, key: index }))} 
                    pagination={{ pageSize: 10 }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                    <p style={{ marginTop: 16 }}>未检测到异常数据</p>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
          
          {trendReport && (
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card title="水质趋势分析">
                  <Table 
                    columns={trendColumns} 
                    dataSource={getTrendReportData()} 
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          )}
        </TabPane>
        
        <TabPane
          tab={<span><CheckCircleOutlined />综合评估</span>}
          key="assessment"
        >
          {waterAnalysis && trendReport && (
            <Card>
              <Typography>
                <Title level={4}>水质综合评估报告</Title>
                <Divider />
                
                <Paragraph>
                  <Text strong>监测时间：</Text> {year}年{month}月
                </Paragraph>
                
                <Paragraph>
                  <Text strong>水质等级：</Text> 
                  <Tag color={waterAnalysis.qualityLevel.color}>
                    {waterAnalysis.qualityLevel.level}类 ({waterAnalysis.qualityLevel.description})
                  </Tag>
                </Paragraph>
                
                <Paragraph>
                  <Text strong>水质状况概述：</Text>
                </Paragraph>
                
                <Paragraph>
                  根据《地表水环境质量标准(GB3838-2002)》评估，本月水质整体为
                  <Tag color={waterAnalysis.qualityLevel.color}>{waterAnalysis.qualityLevel.level}类</Tag>
                  水质，{waterAnalysis.qualityLevel.description}。
                  主要水质参数平均值：pH值{waterAnalysis.averages.ph}，
                  溶解氧{waterAnalysis.averages.oxygen}mg/L，
                  高锰酸盐指数{waterAnalysis.averages.permanganate}mg/L，
                  氨氮{waterAnalysis.averages.ammonia}mg/L，
                  总磷{waterAnalysis.averages.phosphorus}mg/L。
                </Paragraph>
                
                <Paragraph>
                  <Text strong>水质趋势分析：</Text>
                </Paragraph>
                
                <Paragraph>
                  <ul>
                    {Object.keys(trendReport).map(key => {
                      const paramNames = {
                        temperature: '水温',
                        ph: 'pH值',
                        oxygen: '溶解氧',
                        conductivity: '电导率',
                        turbidity: '浊度',
                        permanganate: '高锰酸盐指数',
                        ammonia: '氨氮',
                        phosphorus: '总磷',
                        nitrogen: '总氮'
                      };
                      
                      return (
                        <li key={key}>
                          {paramNames[key]}：{trendReport[key].description}趋势
                          {trendReport[key].strength !== '几乎无变化' && trendReport[key].direction === '上升' && key !== 'oxygen' ? 
                            '，需关注' : ''}
                        </li>
                      );
                    })}
                  </ul>
                </Paragraph>
                
                <Paragraph>
                  <Text strong>异常情况：</Text>
                </Paragraph>
                
                <Paragraph>
                  本月共检测到 {anomalyReport.length} 条异常数据。
                  {anomalyReport.length > 0 ? (
                    <ul>
                      {Array.from(new Set(anomalyReport.map(item => item.parameter))).map(param => {
                        const count = anomalyReport.filter(item => item.parameter === param).length;
                        return <li key={param}>{param}异常：{count}次</li>;
                      })}
                    </ul>
                  ) : '水质参数均在正常范围内。'}
                </Paragraph>
                
                <Paragraph>
                  <Text strong>建议措施：</Text>
                </Paragraph>
                
                <Paragraph>
                  <ul>
                    {getTrendReportData()
                      .filter(item => item.strength !== '几乎无变化')
                      .map(item => (
                        <li key={item.key}>{item.suggestion}</li>
                      ))}
                    {anomalyReport.length > 0 && (
                      <li>加强日常监测，特别关注异常参数的变化趋势</li>
                    )}
                    {waterAnalysis.qualityLevel.level === 'I' || waterAnalysis.qualityLevel.level === 'II' ? (
                      <li>继续保持现有水质管理措施</li>
                    ) : (
                      <li>加强水质管理，提高水质等级</li>
                    )}
                  </ul>
                </Paragraph>
              </Typography>
            </Card>
          )}
        </TabPane>
      </Tabs>
      )}
    </div>
  );
};

export default WaterQualityReport;