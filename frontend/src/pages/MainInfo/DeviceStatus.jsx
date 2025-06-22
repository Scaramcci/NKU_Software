import React from 'react';
import './DeviceStatus.css';

const DeviceStatus = () => {
  return (
    <div className="device-status-card">
      <div className="device-status-title">设备状态</div>

      <div className="device-tab-row">
        <div className="device-tab active">主控</div>
        <div className="device-tab">时间校准</div>
        <div className="device-tab">通道</div>
        <div className="device-tab">
          告警 <span className="device-tab-badge">2</span>
        </div>
      </div>

      <div className="device-status-info">
        <div className="status-line">
          <span className="dot" />
          <span className="label">设备ID：</span>
          <span className="value">8D19C331-4F08-47A1</span>
        </div>

        <div className="status-line">
          <span className="dot" />
          <span className="label">主控状态：</span>
        </div>
        <div className="status-subblock">
          <div className="status-pair">
            <span className="label">版本：</span>
            <span className="value">V0.1.1</span>
          </div>
          <div className="status-pair">
            <span className="label">温度：</span>
            <span className="value" style={{ color: '#00ff66' }}>39.64℃</span>
          </div>
        </div>

        <div className="status-line">
          <span className="dot" />
          <span className="label">次控状态：</span>
        </div>
        <div className="status-subblock">
          <div className="status-pair">
            <span className="label">连接：</span>
            <span className="value" style={{ color: 'red' }}>断开</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceStatus;
