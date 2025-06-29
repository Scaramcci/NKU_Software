import React, { useState, useEffect } from 'react';
import {
  Card,
  Upload,
  Button,
  Table,
  Select,
  DatePicker,
  Space,
  message,
  Statistic,
  Row,
  Col,
  Modal,
  Spin
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  BarChartOutlined,
  FileExcelOutlined,
  EyeOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import './DataManagement.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const DataManagement = () => {
  const [loading, setLoading] = useState(false);
  const [farmId, setFarmId] = useState(1);
  const [statistics, setStatistics] = useState({});
  const [trends, setTrends] = useState({});
  const [anomalies, setAnomalies] = useState([]);
  const [chartVisible, setChartVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState('trend');
  const [dateRange, setDateRange] = useState([]);

  // 获取数据统计
  const fetchStatistics = async (period = 'week') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/data-analysis/statistics/${farmId}?period=${period}`);
      const result = await response.json();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取趋势数据
  const fetchTrends = async (period = 'week') => {
    try {
      const response = await fetch(`/api/data-analysis/trends/${farmId}?period=${period}`);
      const result = await response.json();
      if (result.success) {
        setTrends(result.data);
      }
    } catch (error) {
      message.error('获取趋势数据失败');
    }
  };

  // 获取异常数据
  const fetchAnomalies = async () => {
    try {
      const response = await fetch(`/api/data-analysis/anomalies/${farmId}`);
      const result = await response.json();
      if (result.success) {
        setAnomalies(result.data);
      }
    } catch (error) {
      message.error('获取异常数据失败');
    }
  };

  // 文件上传处理
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('farmId', farmId);

    setLoading(true);
    try {
      const response = await fetch('/api/data-analysis/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (result.success) {
        message.success(result.data);
        fetchStatistics();
        fetchTrends();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('文件上传失败');
    } finally {
      setLoading(false);
    }
    
    return false; // 阻止默认上传行为
  };

  // 数据导出
  const handleExport = async () => {
    const startDate = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
    const endDate = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
    
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    try {
      const response = await fetch(`/api/data-analysis/export/${farmId}?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `environment_data_${farmId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        message.success('数据导出成功');
      } else {
        message.error('数据导出失败');
      }
    } catch (error) {
      message.error('数据导出失败');
    }
  };

  // 图表下载
  const handleChartDownload = (chartType) => {
    const chartDom = document.querySelector('.chart-container .echarts-for-react');
    if (chartDom) {
      const canvas = chartDom.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chartType}_chart_${dayjs().format('YYYY-MM-DD')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        message.success('图表下载成功');
      }
    }
  };

  // 趋势图配置
  const getTrendChartOption = () => {
    if (!trends.timeSeries || trends.timeSeries.length === 0) {
      return {};
    }

    return {
      title: {
        text: '环境数据趋势图',
        left: 'center',
        textStyle: { color: '#fff' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: ['水温', '盐度', '溶解氧', 'pH值'],
        top: 30,
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: trends.timeSeries.map(item => item.time),
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } }
      },
      yAxis: [
        {
          type: 'value',
          name: '水温(℃)',
          position: 'left',
          axisLabel: { color: '#fff' },
          axisLine: { lineStyle: { color: '#fff' } },
          splitLine: { lineStyle: { color: '#333' } }
        },
        {
          type: 'value',
          name: '其他指标',
          position: 'right',
          axisLabel: { color: '#fff' },
          axisLine: { lineStyle: { color: '#fff' } },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '水温',
          type: 'line',
          yAxisIndex: 0,
          data: trends.timeSeries.map(item => item.waterTemperature),
          smooth: true,
          lineStyle: { color: '#ff6b6b' }
        },
        {
          name: '盐度',
          type: 'line',
          yAxisIndex: 1,
          data: trends.timeSeries.map(item => item.salinity),
          smooth: true,
          lineStyle: { color: '#4ecdc4' }
        },
        {
          name: '溶解氧',
          type: 'line',
          yAxisIndex: 1,
          data: trends.timeSeries.map(item => item.dissolvedOxygen),
          smooth: true,
          lineStyle: { color: '#45b7d1' }
        },
        {
          name: 'pH值',
          type: 'line',
          yAxisIndex: 1,
          data: trends.timeSeries.map(item => item.ph),
          smooth: true,
          lineStyle: { color: '#f9ca24' }
        }
      ]
    };
  };

  // 统计图配置
  const getStatisticsChartOption = () => {
    if (!statistics || Object.keys(statistics).length === 0) {
      return {};
    }

    const indicators = ['waterTemperature', 'salinity', 'dissolvedOxygen', 'ph'];
    const names = ['水温', '盐度', '溶解氧', 'pH值'];
    
    return {
      title: {
        text: '环境数据统计图',
        left: 'center',
        textStyle: { color: '#fff' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['平均值', '最小值', '最大值'],
        top: 30,
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } },
        splitLine: { lineStyle: { color: '#333' } }
      },
      series: [
        {
          name: '平均值',
          type: 'bar',
          data: indicators.map(key => statistics[key]?.avg || 0),
          itemStyle: { color: '#4ecdc4' }
        },
        {
          name: '最小值',
          type: 'bar',
          data: indicators.map(key => statistics[key]?.min || 0),
          itemStyle: { color: '#45b7d1' }
        },
        {
          name: '最大值',
          type: 'bar',
          data: indicators.map(key => statistics[key]?.max || 0),
          itemStyle: { color: '#ff6b6b' }
        }
      ]
    };
  };

  // 异常数据表格列配置
  const anomalyColumns = [
    {
      title: '记录时间',
      dataIndex: 'recordedAt',
      key: 'recordedAt',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '水温(℃)',
      dataIndex: 'waterTemperature',
      key: 'waterTemperature',
      render: (value) => (
        <span style={{ color: value < 15 || value > 25 ? '#ff4d4f' : '#52c41a' }}>
          {value?.toFixed(2)}
        </span>
      )
    },
    {
      title: '盐度(PSU)',
      dataIndex: 'salinity',
      key: 'salinity',
      render: (value) => (
        <span style={{ color: value < 28 || value > 35 ? '#ff4d4f' : '#52c41a' }}>
          {value?.toFixed(2)}
        </span>
      )
    },
    {
      title: '溶解氧(mg/L)',
      dataIndex: 'dissolvedOxygen',
      key: 'dissolvedOxygen',
      render: (value) => (
        <span style={{ color: value < 5 || value > 10 ? '#ff4d4f' : '#52c41a' }}>
          {value?.toFixed(2)}
        </span>
      )
    },
    {
      title: 'pH值',
      dataIndex: 'ph',
      key: 'ph',
      render: (value) => (
        <span style={{ color: value < 7.0 || value > 8.5 ? '#ff4d4f' : '#52c41a' }}>
          {value?.toFixed(2)}
        </span>
      )
    }
  ];

  useEffect(() => {
    fetchStatistics();
    fetchTrends();
    fetchAnomalies();
  }, [farmId]);

  return (
    <div className="data-management">
      <Row gutter={[16, 16]}>
        {/* 数据操作区域 */}
        <Col span={24}>
          <Card title="数据管理" className="data-management-card">
            <Space wrap>
              <Select
                value={farmId}
                onChange={setFarmId}
                style={{ width: 120 }}
              >
                <Option value={1}>渔场1</Option>
                <Option value={2}>渔场2</Option>
                <Option value={3}>渔场3</Option>
              </Select>
              
              <Upload
                beforeUpload={handleUpload}
                accept=".csv,.xlsx,.xls"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} loading={loading}>
                  上传数据
                </Button>
              </Upload>
              
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder={['开始日期', '结束日期']}
              />
              
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                type="primary"
              >
                导出数据
              </Button>
              
              <Button
                icon={<BarChartOutlined />}
                onClick={() => setChartVisible(true)}
              >
                查看图表
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 统计信息 */}
        <Col span={24}>
          <Card title="数据统计" className="statistics-card">
            <Spin spinning={loading}>
              <Row gutter={16}>
                {Object.entries(statistics).map(([key, value]) => {
                  const names = {
                    waterTemperature: '水温(℃)',
                    salinity: '盐度(PSU)',
                    dissolvedOxygen: '溶解氧(mg/L)',
                    ph: 'pH值'
                  };
                  
                  return (
                    <Col span={6} key={key}>
                      <Card size="small">
                        <Statistic
                          title={names[key]}
                          value={value?.avg}
                          precision={2}
                          suffix={`(${value?.count || 0}条)`}
                        />
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                          最小值: {value?.min?.toFixed(2)} | 最大值: {value?.max?.toFixed(2)}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Spin>
          </Card>
        </Col>

        {/* 异常数据 */}
        <Col span={24}>
          <Card 
            title={`异常数据 (${anomalies.length}条)`} 
            className="anomalies-card"
            extra={
              <Button 
                size="small" 
                onClick={fetchAnomalies}
                icon={<EyeOutlined />}
              >
                刷新
              </Button>
            }
          >
            <Table
              columns={anomalyColumns}
              dataSource={anomalies}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表模态框 */}
      <Modal
        title="数据可视化"
        open={chartVisible}
        onCancel={() => setChartVisible(false)}
        width={1000}
        footer={[
          <Button key="download" onClick={() => handleChartDownload(selectedChart)}>
            <DownloadOutlined /> 下载图表
          </Button>,
          <Button key="close" onClick={() => setChartVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <Space style={{ marginBottom: 16 }}>
          <Select
            value={selectedChart}
            onChange={setSelectedChart}
            style={{ width: 120 }}
          >
            <Option value="trend">趋势图</Option>
            <Option value="statistics">统计图</Option>
          </Select>
        </Space>
        
        <div className="chart-container">
          <ReactECharts
            option={selectedChart === 'trend' ? getTrendChartOption() : getStatisticsChartOption()}
            style={{ height: '400px' }}
            theme="dark"
          />
        </div>
      </Modal>
    </div>
  );
};

export default DataManagement;