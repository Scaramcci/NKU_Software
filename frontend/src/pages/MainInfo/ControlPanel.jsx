// src/pages/MainInfo/ControlPanel.jsx
import React from 'react';
import './ControlPanel.css';

const controls = [
  { label: '摄像机', icon: '📷', type: 'toggle', active: true },
  { label: '灯光', icon: '💡', type: 'toggle', active: true },
  { label: '清洁刷', icon: '🧽', type: 'toggle', active: false },
  { label: '视频回放', icon: '🔁', type: 'action' },
  { label: '视频同时播放', icon: '🖥️', type: 'action' },
  { label: '云台摄像机', icon: '🎥', type: 'action' },
];

const ControlPanel = () => {
  return (
    <div className="control-panel-container">
      <h3 className="control-panel-title">附加功能</h3>
      <div className="control-grid">
        {controls.map((item, idx) => (
          <div key={idx} className={`control-card ${item.type}`}>
            <div className="control-icon">{item.icon}</div>
            <div className="control-label">{item.label}</div>
            {item.type === 'toggle' && (
              <div className={`toggle-switch ${item.active ? 'on' : 'off'}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
