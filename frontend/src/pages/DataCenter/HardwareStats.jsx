import React from 'react';
import { Card, Progress } from 'antd';
const HardwareStats = () => (
  <Card title="硬件状态" size="small">
    <div>CPU 使用率</div>
    <Progress percent={35} status="active" />
    <div>内存使用率</div>
    <Progress percent={60} status="active" />
    <div>磁盘使用率</div>
    <Progress percent={45} status="active" />
  </Card>
);
export default HardwareStats;
