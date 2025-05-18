// src/pages/MainInfo/VideoSection.jsx
import React, { useState } from 'react';
import { Card, Typography, Button } from 'antd';
import './VideoSection.css';

const { Text } = Typography;

const videoList = [
  { id: 1, label: '视频1', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, label: '视频2', src: 'https://www.w3schools.com/html/movie.mp4' },
  { id: 3, label: '视频3', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 4, label: '视频4', src: 'https://www.w3schools.com/html/movie.mp4' },
];

const VideoSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Card
      title={<Text className="video-title">监控视频</Text>}
      bordered={false}
      className="video-section-card"
      bodyStyle={{ padding: 24 }}
    >
      <div className="video-selector">
        {videoList.map((video, index) => (
          <Button
            key={video.id}
            type={index === activeIndex ? 'primary' : 'default'}
            className="video-tab"
            onClick={() => setActiveIndex(index)}
          >
            {video.label}
          </Button>
        ))}
      </div>
      <div className="video-container">
        <video width="100%" height="auto" controls>
          <source src={videoList[activeIndex].src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </Card>
  );
};

export default VideoSection;
