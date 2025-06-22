// 设备检测工具函数

/**
 * 检测是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export const isMobileDevice = () => {
  // 检查用户代理字符串
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // 移动设备关键词
  const mobileKeywords = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
    /Mobile/i
  ];
  
  // 检查是否匹配移动设备关键词
  const isMobileUA = mobileKeywords.some(keyword => keyword.test(userAgent));
  
  // 检查屏幕宽度（小于768px认为是移动设备）
  const isMobileScreen = window.innerWidth <= 768;
  
  // 检查触摸支持
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // 综合判断
  return isMobileUA || (isMobileScreen && isTouchDevice);
};

/**
 * 检测是否为平板设备
 * @returns {boolean} 是否为平板设备
 */
export const isTabletDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const screenWidth = window.innerWidth;
  
  // 平板设备特征
  const isTabletUA = /iPad/i.test(userAgent) || 
                     (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent));
  
  // 屏幕宽度在768-1024之间且支持触摸
  const isTabletScreen = screenWidth >= 768 && screenWidth <= 1024 && 
                         ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  
  return isTabletUA || isTabletScreen;
};

/**
 * 检测是否为桌面设备
 * @returns {boolean} 是否为桌面设备
 */
export const isDesktopDevice = () => {
  return !isMobileDevice() && !isTabletDevice();
};

/**
 * 获取设备类型
 * @returns {string} 设备类型：'mobile' | 'tablet' | 'desktop'
 */
export const getDeviceType = () => {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
};

/**
 * 检测屏幕方向
 * @returns {string} 屏幕方向：'portrait' | 'landscape'
 */
export const getScreenOrientation = () => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

/**
 * 监听设备方向变化
 * @param {Function} callback 回调函数
 * @returns {Function} 清理函数
 */
export const onOrientationChange = (callback) => {
  const handleOrientationChange = () => {
    // 延迟执行，等待屏幕尺寸更新
    setTimeout(() => {
      callback({
        deviceType: getDeviceType(),
        orientation: getScreenOrientation(),
        width: window.innerWidth,
        height: window.innerHeight
      });
    }, 100);
  };
  
  window.addEventListener('resize', handleOrientationChange);
  window.addEventListener('orientationchange', handleOrientationChange);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleOrientationChange);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};

/**
 * 获取视口信息
 * @returns {Object} 视口信息
 */
export const getViewportInfo = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    deviceType: getDeviceType(),
    orientation: getScreenOrientation(),
    pixelRatio: window.devicePixelRatio || 1,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
  };
};