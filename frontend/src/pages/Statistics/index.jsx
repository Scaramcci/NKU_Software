import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tabs } from 'antd';
import { BarChartOutlined, LineChartOutlined, PieChartOutlined, AlertOutlined, AreaChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import api from '../../services/api';
import WaterQualityReportPage from './WaterQualityReportPage';

const { TabPane } = Tabs;

const Statistics = () => {
  // 模拟数据 - 实际项目中应从API获取
  const [environmentData, setEnvironmentData] = useState({
    temperature: [23.5, 24.1, 23.8, 24.3, 24.5, 24.2, 23.9],
    oxygen: [6.8, 6.7, 6.9, 7.0, 6.8, 6.7, 6.6],
    ph: [7.2, 7.3, 7.1, 7.2, 7.3, 7.4, 7.2],
    turbidity: [12, 14, 13, 15, 16, 14, 13],
    dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  });

  const [fishData, setFishData] = useState({
    species: ['草鱼', '鲤鱼', '鲫鱼', '鲢鱼', '鳙鱼'],
    quantity: [1200, 800, 1500, 600, 400],
    growth: [0.8, 0.6, 0.7, 0.5, 0.4],
    health: [95, 92, 97, 90, 93]
  });

  const [deviceData, setDeviceData] = useState({
    devices: ['增氧机', '喂食器', '水质监测仪', '摄像头', '水泵'],
    status: ['正常', '正常', '正常', '异常', '正常'],
    uptime: [720, 680, 700, 300, 690],
    efficiency: [92, 88, 95, 60, 90]
  });

  useEffect(() => {
    // 实际项目中应从API获取数据
    const fetchData = async () => {
      try {
        // const envResponse = await api.get('/statistics/environment');
        // setEnvironmentData(envResponse.data);
        
        // const fishResponse = await api.get('/statistics/fish');
        // setFishData(fishResponse.data);
        
        // const deviceResponse = await api.get('/statistics/devices');
        // setDeviceData(deviceResponse.data);
      } catch (error) {
        console.error('数据获取失败:', error);
      }
    };
    
    fetchData();
  }, []);

  // 环境数据图表配置
  const environmentChartOption = {
    title: { text: '环境数据趋势' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['水温(°C)', 'pH值', '溶氧量(mg/L)', '浊度(NTU)'] },
    xAxis: { type: 'category', data: environmentData.dates },
    yAxis: { type: 'value' },
    series: [
      { name: '水温(°C)', type: 'line', data: environmentData.temperature },
      { name: 'pH值', type: 'line', data: environmentData.ph },
      { name: '溶氧量(mg/L)', type: 'line', data: environmentData.oxygen },
      { name: '浊度(NTU)', type: 'line', data: environmentData.turbidity }
    ]
  };

  // 鱼群分布图表配置
  const fishDistributionOption = {
    title: { text: '鱼群分布' },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [
      {
        name: '鱼群数量',
        type: 'pie',
        radius: '50%',
        data: fishData.species.map((species, index) => ({
          value: fishData.quantity[index],
          name: species
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // 鱼群生长情况图表配置
  const fishGrowthOption = {
    title: { text: '鱼群生长情况' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['日均生长率(cm)'] },
    xAxis: { type: 'category', data: fishData.species },
    yAxis: { type: 'value' },
    series: [
      {
        name: '日均生长率(cm)',
        type: 'bar',
        data: fishData.growth
      }
    ]
  };

  // 设备运行状态图表配置
  const deviceStatusOption = {
    title: { text: '设备运行效率' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['效率(%)'] },
    xAxis: { type: 'category', data: deviceData.devices },
    yAxis: { type: 'value', max: 100 },
    series: [
      {
        name: '效率(%)',
        type: 'bar',
        data: deviceData.efficiency
      }
    ]
  };

  // 设备状态表格列配置
  const deviceColumns = [
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '运行状态', dataIndex: 'status', key: 'status',
      render: (text) => (
        <span style={{ color: text === '正常' ? '#52c41a' : '#f5222d' }}>
          {text}
        </span>
      )
    },
    { title: '运行时间(h)', dataIndex: 'uptime', key: 'uptime' },
    { title: '运行效率(%)', dataIndex: 'efficiency', key: 'efficiency',
      render: (value) => <Progress percent={value} size="small" />
    }
  ];

  // 设备状态表格数据
  const deviceTableData = deviceData.devices.map((device, index) => ({
    key: index,
    name: device,
    status: deviceData.status[index],
    uptime: deviceData.uptime[index],
    efficiency: deviceData.efficiency[index]
  }));

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="environment">
        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              环境数据统计
            </span>
          }
          key="environment"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card>
                <ReactECharts option={environmentChartOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均水温"
                  value={environmentData.temperature.reduce((a, b) => a + b, 0) / environmentData.temperature.length}
                  precision={1}
                  suffix="°C"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均pH值"
                  value={environmentData.ph.reduce((a, b) => a + b, 0) / environmentData.ph.length}
                  precision={1}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均溶氧量"
                  value={environmentData.oxygen.reduce((a, b) => a + b, 0) / environmentData.oxygen.length}
                  precision={1}
                  suffix="mg/L"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均浊度"
                  value={environmentData.turbidity.reduce((a, b) => a + b, 0) / environmentData.turbidity.length}
                  precision={1}
                  suffix="NTU"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <PieChartOutlined />
              鱼群统计
            </span>
          }
          key="fish"
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Card>
                <ReactECharts option={fishDistributionOption} style={{ height: 400 }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <ReactECharts option={fishGrowthOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="鱼群总数"
                  value={fishData.quantity.reduce((a, b) => a + b, 0)}
                  suffix="尾"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="鱼种类数"
                  value={fishData.species.length}
                  suffix="种"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均健康度"
                  value={fishData.health.reduce((a, b) => a + b, 0) / fishData.health.length}
                  precision={1}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均生长率"
                  value={fishData.growth.reduce((a, b) => a + b, 0) / fishData.growth.length}
                  precision={2}
                  suffix="cm/天"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <AlertOutlined />
              设备状态
            </span>
          }
          key="devices"
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card>
                <ReactECharts option={deviceStatusOption} style={{ height: 400 }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card>
                <Table columns={deviceColumns} dataSource={deviceTableData} pagination={false} />
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <AreaChartOutlined />
              水质数据报表
            </span>
          }
          key="waterQualityReport"
        >
          <WaterQualityReportPage />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Statistics;