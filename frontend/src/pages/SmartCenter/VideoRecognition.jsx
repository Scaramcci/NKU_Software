// src/pages/SmartCenter/VideoRecognition.jsx
import React from 'react';
import { Card, Typography } from 'antd';
import './VideoRecognition.css';

const { Title, Text } = Typography;

const VideoRecognition = () => {
  return (
    <Card className="video-recognition-card">
      <Title level={4} className="video-recognition-title"style={{ color: '#fff' }}>图像识别区域</Title>
      <div className="video-recognition-preview">
        <div className="video-recognition-box">
          <video width="100%" controls>
            <source src='/videos/vd4.mp4' type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="video-recognition-info">
          <Text className="video-info-text">识别对象：鱼群</Text>
          <Text className="video-info-text">当前活跃区域：A3 区域</Text>
          <Text className="video-info-text">识别准确率：92%</Text>
        </div>
      </div>
    </Card>
  );
};

export default VideoRecognition;
