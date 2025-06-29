import React, { useRef } from 'react';
import { Card, Input, Button, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import './DataFlowChart.css'; // 新增CSS文件用于自定义样式

const DataFlowChart = () => {
  const chartRef = useRef(null);

  // 数据库统计数据
  const statsData = [
    { label: '数据库', value: 'MySQL，HBase' },
    { label: '查询次数', value: '567890' },
    { label: '成功次数', value: '567890' },
    { label: '查询时间', value: '0.1s' }
  ];

  // 下载图表为图片
  const downloadChart = async () => {
    try {
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, {
          backgroundColor: '#0f172a',
          scale: 2,
          useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = `数据库统计_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        message.success('图表下载成功');
      }
    } catch (error) {
      console.error('下载图表失败:', error);
      message.error('下载图表失败');
    }
  };

  // 下载数据为CSV
  const downloadData = () => {
    try {
      const csv = Papa.unparse(statsData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `数据库统计数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`;
      link.click();
      
      message.success('数据下载成功');
    } catch (error) {
      console.error('下载数据失败:', error);
      message.error('下载数据失败');
    }
  };

  return (
  <Card 
    title="数据库交互统计" 
    size="small" 
    style={{ marginBottom: 16, backgroundColor: '#0f172a' }}
    extra={
      <Space>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={downloadChart}
          size="small"
        >
          下载图表
        </Button>
        <Button 
          icon={<DownloadOutlined />} 
          onClick={downloadData}
          size="small"
        >
          下载数据
        </Button>
      </Space>
    }
  >
    <div ref={chartRef} className="database-stats-container">
      {/* 标题 */}
      <h2 className="stats-title">数据库交互统计</h2>

      {/* 服务信息输入框 */}
      <Input
        placeholder="服务信息"
        className="service-input"
        style={{
          marginBottom: 16,
          backgroundColor: '#1e293b',
          borderColor: '#3b82f6',
          color: '#ffffff'
        }}
      />

      {/* 统计数据列表 */}
      <div className="stats-list">
        <div className="stats-item">
          <span className="circle-marker"></span>
          <span className="stats-text">数据库：MySQL，HBase</span>
        </div>
        <div className="stats-item">
          <span className="circle-marker"></span>
          <span className="stats-text">查询次数：567890</span>
        </div>
        <div className="stats-item">
          <span className="circle-marker"></span>
          <span className="stats-text">成功次数：567890</span>
        </div>
        <div className="stats-item">
          <span className="circle-marker"></span>
          <span className="stats-text">查询时间：0.1s</span>
        </div>
      </div>

      {/* 操作按钮 */}
      <Button
        type="primary"
        className="access-button"
        style={{
          width: '100%',
          marginTop: 20,
          backgroundColor: '#3b82f6',
          borderColor: '#3b82f6',
          height: 40,
          fontSize: 16
        }}
      >
        访问数据服务系统
      </Button>
    </div>
  </Card>
  );
};

export default DataFlowChart;
