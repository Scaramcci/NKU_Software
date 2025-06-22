import React from 'react';
import './VideoRecognition.css';

const VideoRecognition = () => {
  return (
    <div className="video-container">
      {/* 主视频区域 */}
      <div className="main-video">
        <video controls>
          <source src="/videos/vd4.mp4" type="video/mp4" />
          您的浏览器不支持 video 标签。
        </video>
        <img src="/images/main_view.jpg" alt="主视角鱼群" className="video-image" />
      </div>

      {/* 侧边视频区域 */}
      <div className="side-videos">
        <div className="sub-video">
          <div className="sub-video-title">左目镜头</div>
          <video controls>
            <source src="/videos/vd4.mp4" type="video/mp4" />
          </video>
          <img src="/images/left_view.jpg" alt="左目鱼群" className="video-image" />
        </div>
        <div className="sub-video">
          <div className="sub-video-title">右目镜头</div>
          <video controls>
            <source src="/videos/vd4.mp4" type="video/mp4" />
          </video>
          <img src="/images/right_view.jpg" alt="右目鱼群" className="video-image" />
        </div>
      </div>
    </div>
  );
};

export default VideoRecognition;
