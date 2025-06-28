import React from 'react';
import { Card, Input, Button } from 'antd';
import './DataFlowChart.css'; // 新增CSS文件用于自定义样式

const DataFlowChart = () => (
  <Card title="" size="small" style={{ marginBottom: 16, backgroundColor: '#0f172a' }}>
    <div className="database-stats-container">
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

export default DataFlowChart;
