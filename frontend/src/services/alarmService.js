import api from './api';

// 模拟预警数据
const mockAlarms = [
  {
    id: 1,
    type: 'temperature',
    farmId: 1,
    farmName: '南湖养殖场',
    pondId: 2,
    pondName: '2号养殖池',
    threshold: { min: 20, max: 30 },
    currentValue: 32.5,
    status: 'active',
    level: 'critical',
    message: '水温过高',
    createdAt: '2023-05-15 10:15:22',
    acknowledged: false
  },
  {
    id: 2,
    type: 'oxygen',
    farmId: 1,
    farmName: '南湖养殖场',
    pondId: 3,
    pondName: '3号养殖池',
    threshold: { min: 5, max: null },
    currentValue: 4.2,
    status: 'active',
    level: 'warning',
    message: '溶氧量偏低',
    createdAt: '2023-05-15 09:30:45',
    acknowledged: false
  },
  {
    id: 3,
    type: 'ph',
    farmId: 2,
    farmName: '东湖养殖场',
    pondId: 1,
    pondName: '1号养殖池',
    threshold: { min: 6.5, max: 8.5 },
    currentValue: 8.7,
    status: 'active',
    level: 'warning',
    message: 'pH值偏高',
    createdAt: '2023-05-15 08:45:33',
    acknowledged: false
  },
  {
    id: 4,
    type: 'ammonia',
    farmId: 3,
    farmName: '西湖养殖场',
    pondId: 2,
    pondName: '2号养殖池',
    threshold: { min: null, max: 0.5 },
    currentValue: 0.7,
    status: 'active',
    level: 'critical',
    message: '氨氮浓度过高',
    createdAt: '2023-05-15 11:20:18',
    acknowledged: false
  },
  {
    id: 5,
    type: 'temperature',
    farmId: 2,
    farmName: '东湖养殖场',
    pondId: 3,
    pondName: '3号养殖池',
    threshold: { min: 20, max: 30 },
    currentValue: 19.5,
    status: 'active',
    level: 'warning',
    message: '水温偏低',
    createdAt: '2023-05-15 07:55:10',
    acknowledged: false
  }
];

// 模拟阈值设置数据
const mockThresholds = [
  {
    id: 1,
    type: 'temperature',
    name: '水温',
    unit: '°C',
    min: 20,
    max: 30,
    farmId: null,
    pondId: null,
    isGlobal: true
  },
  {
    id: 2,
    type: 'oxygen',
    name: '溶氧量',
    unit: 'mg/L',
    min: 5,
    max: null,
    farmId: null,
    pondId: null,
    isGlobal: true
  },
  {
    id: 3,
    type: 'ph',
    name: 'pH值',
    unit: '',
    min: 6.5,
    max: 8.5,
    farmId: null,
    pondId: null,
    isGlobal: true
  },
  {
    id: 4,
    type: 'ammonia',
    name: '氨氮',
    unit: 'mg/L',
    min: null,
    max: 0.5,
    farmId: null,
    pondId: null,
    isGlobal: true
  }
];

// 模拟历史预警记录
const mockAlarmHistory = [
  {
    id: 101,
    type: 'temperature',
    farmId: 1,
    farmName: '南湖养殖场',
    pondId: 1,
    pondName: '1号养殖池',
    threshold: { min: 20, max: 30 },
    value: 31.2,
    level: 'warning',
    message: '水温偏高',
    createdAt: '2023-05-14 14:25:33',
    resolvedAt: '2023-05-14 15:10:22',
    duration: 45, // 分钟
    actions: ['启动水循环系统', '降低水温']
  },
  {
    id: 102,
    type: 'oxygen',
    farmId: 2,
    farmName: '东湖养殖场',
    pondId: 2,
    pondName: '2号养殖池',
    threshold: { min: 5, max: null },
    value: 4.3,
    level: 'warning',
    message: '溶氧量偏低',
    createdAt: '2023-05-13 18:40:15',
    resolvedAt: '2023-05-13 19:25:30',
    duration: 45, // 分钟
    actions: ['启动增氧机']
  },
  {
    id: 103,
    type: 'ph',
    farmId: 3,
    farmName: '西湖养殖场',
    pondId: 1,
    pondName: '1号养殖池',
    threshold: { min: 6.5, max: 8.5 },
    value: 6.2,
    level: 'warning',
    message: 'pH值偏低',
    createdAt: '2023-05-12 09:15:40',
    resolvedAt: '2023-05-12 10:30:25',
    duration: 75, // 分钟
    actions: ['添加调节剂']
  }
];

const alarmService = {
  // 获取当前预警列表
  getAlarms: () => {
    // 模拟API响应
    return Promise.resolve({ data: mockAlarms });
  },
  
  // 获取特定养殖场的预警
  getAlarmsByFarm: (farmId) => {
    const alarms = mockAlarms.filter(a => a.farmId === parseInt(farmId));
    // 模拟API响应
    return Promise.resolve({ data: alarms });
  },
  
  // 获取特定养殖池的预警
  getAlarmsByPond: (pondId) => {
    const alarms = mockAlarms.filter(a => a.pondId === parseInt(pondId));
    // 模拟API响应
    return Promise.resolve({ data: alarms });
  },
  
  // 确认预警
  acknowledgeAlarm: (alarmId) => {
    const alarm = mockAlarms.find(a => a.id === parseInt(alarmId));
    if (alarm) {
      alarm.acknowledged = true;
    }
    // 模拟API响应
    return Promise.resolve({ data: { success: true, message: '预警已确认' } });
  },
  
  // 获取阈值设置
  getThresholds: () => {
    // 模拟API响应
    return Promise.resolve({ data: mockThresholds });
  },
  
  // 更新阈值设置
  updateThreshold: (thresholdId, updates) => {
    const threshold = mockThresholds.find(t => t.id === parseInt(thresholdId));
    if (threshold) {
      Object.assign(threshold, updates);
    }
    // 模拟API响应
    return Promise.resolve({ data: { success: true, message: '阈值设置已更新' } });
  },
  
  // 获取预警历史记录
  getAlarmHistory: () => {
    // 模拟API响应
    return Promise.resolve({ data: mockAlarmHistory });
  },
  
  // 获取特定养殖场的预警历史
  getAlarmHistoryByFarm: (farmId) => {
    const history = mockAlarmHistory.filter(h => h.farmId === parseInt(farmId));
    // 模拟API响应
    return Promise.resolve({ data: history });
  },
  
  // 获取特定养殖池的预警历史
  getAlarmHistoryByPond: (pondId) => {
    const history = mockAlarmHistory.filter(h => h.pondId === parseInt(pondId));
    // 模拟API响应
    return Promise.resolve({ data: history });
  },
  
  // 订阅预警通知
  subscribeToAlarms: (userId, settings) => {
    // 模拟API响应
    return Promise.resolve({ 
      data: { 
        success: true, 
        message: '预警通知订阅已更新',
        settings: settings
      } 
    });
  }
};

export default alarmService;