import React from 'react';
import './DataCenter.css';
import DataSummary from './DataSummary';
import HardwareStats from './HardwareStats';
import DataFlowChart from './DataFlowChart';
import DataMap from './DataMap';
import RadarChart from './RadarChart';
import SankeyChart from './SankeyChart';
import SensorInfo from './SensorInfo';
import DatabaseInfo from './DatabaseInfo';

const DataCenter = () => (
  <div className="data-center-wrapper">
    <div className="data-center-title">岸基数据中心海洋牧场大数据可视化系统</div>
    <div className="data-center-content">
      <div className="data-center-left">
        <DataSummary />
        <HardwareStats />
        <DataFlowChart />
      </div>
      <div className="data-center-middle">
        <DataMap />
        <RadarChart />
        <SankeyChart />
      </div>
      <div className="data-center-right">
        <SensorInfo />
        <DatabaseInfo />
      </div>
    </div>
  </div>
);

export default DataCenter;
