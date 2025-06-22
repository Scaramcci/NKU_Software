// src/pages/MainInfo/VideoSection.jsx
import React, { useState } from 'react';
import { Typography, Button } from 'antd';
import './VideoSection.css';

const { Text } = Typography;

const videoList = [
  { id: 1, label: '视频1', src: '/videos/vd2.mp4' },
  { id: 2, label: '视频2', src: '/videos/vd1.mp4' },
  { id: 3, label: '视频3', src: '/videos/vd3.mp4' },
  { id: 4, label: '视频4', src: '/videos/vd4.mp4' },
];

const VideoSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="video-section-card">
      <Text className="video-title">监控视频</Text>
      <div className="video-selector">
        {videoList.map((video, index) => (
          <Button
            key={video.id}
            type={index === activeIndex ? 'primary' : 'default'}
            className="video-tab"
            onClick={() => handleTabClick(index)}
          >
            {video.label}
          </Button>
        ))}
      </div>
      <div className="video-container">
        <video 
          key={videoList[activeIndex].id} // 添加key强制重新加载视频
          width="100%" 
          height="auto" 
          controls
          autoPlay
        >
          <source src={videoList[activeIndex].src} type="video/mp4" />
          您的浏览器不支持视频标签。
        </video>
      </div>
    </div>
  );
};

export default VideoSection;
