import api from './api';

// 模拟设备数据
const mockDevices = [
  {
    id: 1,
    name: '水泵A-01',
    type: 'pump',
    farmName: '南湖养殖场',
    status: 'online',
    powerStatus: 'on',
    lastUpdated: '2023-05-15 08:30:22'
  },
  {
    id: 2,
    name: '增氧机B-02',
    type: 'aerator',
    farmName: '南湖养殖场',
    status: 'online',
    powerStatus: 'on',
    lastUpdated: '2023-05-15 09:15:43'
  },
  {
    id: 3,
    name: '投饵机C-03',
    type: 'feeder',
    farmName: '东湖养殖场',
    status: 'offline',
    powerStatus: 'off',
    lastUpdated: '2023-05-14 18:22:10'
  },
  {
    id: 4,
    name: '水质传感器D-04',
    type: 'sensor',
    farmName: '东湖养殖场',
    status: 'warning',
    powerStatus: 'on',
    lastUpdated: '2023-05-15 10:05:37'
  },
  {
    id: 5,
    name: '监控摄像头E-05',
    type: 'camera',
    farmName: '西湖养殖场',
    status: 'online',
    powerStatus: 'on',
    lastUpdated: '2023-05-15 07:45:19'
  }
];

const deviceService = {
  // 获取设备列表
  getDevices: () => {
    // 模拟API响应
    return Promise.resolve({ data: mockDevices });
  },
  
  // 获取设备状态
  getDeviceStatus: (deviceId) => {
    const device = mockDevices.find(d => d.id === parseInt(deviceId));
    // 模拟API响应
    return Promise.resolve({ data: device ? device.status : 'unknown' });
  },
  
  // 控制设备
  controlDevice: (deviceId, action) => {
    const device = mockDevices.find(d => d.id === parseInt(deviceId));
    if (device) {
      // 根据操作更新设备状态
      switch(action) {
        case 'powerOn':
          device.powerStatus = 'on';
          break;
        case 'powerOff':
          device.powerStatus = 'off';
          break;
        // 其他操作...
      }
    }
    // 模拟API响应
    return Promise.resolve({ data: { success: true, message: '操作成功' } });
  }
};

export default deviceService;