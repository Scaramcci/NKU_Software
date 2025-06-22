import React from 'react';

const DataSummary = () => (
  <div className="data-panel">
    <div className="panel-title">数据总量</div>
    {/* 这里放统计数据 */}
    <div>进程总量：999</div>
    <div>磁盘：已使用1000T / 剩余1500T</div>
  </div>
);

export default DataSummary;
