/**
 * 设备控制服务
 * 处理设备控制逻辑和自动化控制
 */

import api from './api';
import { analyzeWaterQuality } from './dataService';

// 设备类型常量
export const DEVICE_TYPES = {
  PUMP: 'pump',
  AERATOR: 'aerator',
  FEEDER: 'feeder',
  SENSOR: 'sensor',
  CAMERA: 'camera',
  FILTER: 'filter'
};

// 设备状态常量
export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  WARNING: 'warning'
};

// 设备电源状态常量
export const POWER_STATUS = {
  ON: 'on',
  OFF: 'off'
};

/**
 * 获取所有设备列表
 * @returns {Promise} - 返回设备列表
 */
export const getAllDevices = async () => {
  try {
    // 在实际项目中，这里应该是一个API调用
    // const response = await api.get('/devices');
    // return response.data;
    
    // 由于我们没有实际的API，这里返回模拟数据
    return mockDevices;
  } catch (error) {
    console.error('获取设备列表失败:', error);
    throw error;
  }
};

/**
 * 获取设备状态
 * @param {number} deviceId - 设备ID
 * @returns {Promise} - 返回设备状态
 */
export const getDeviceStatus = async (deviceId) => {
  try {
    // 在实际项目中，这里应该是一个API调用
    // const response = await api.get(`/devices/${deviceId}/status`);
    // return response.data;
    
    // 由于我们没有实际的API，这里返回模拟数据
    const device = mockDevices.find(d => d.id === deviceId);
    if (!device) {
      throw new Error('设备不存在');
    }
    
    // 模拟随机状态变化
    if (Math.random() > 0.8) {
      device.status = Math.random() > 0.5 ? DEVICE_STATUS.ONLINE : DEVICE_STATUS.WARNING;
    }
    
    return {
      status: device.status,
      powerStatus: device.powerStatus,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
  } catch (error) {
    console.error(`获取设备${deviceId}状态失败:`, error);
    throw error;
  }
};

/**
 * 控制设备
 * @param {number} deviceId - 设备ID
 * @param {string} action - 控制动作，如 'start', 'stop', 'restart'
 * @returns {Promise} - 返回控制结果
 */
export const controlDeviceAction = async (deviceId, action) => {
  try {
    // 在实际项目中，这里应该是一个API调用
    // const response = await api.post(`/devices/${deviceId}/control`, { action });
    // return response.data;
    
    // 由于我们没有实际的API，这里返回模拟数据
    const device = mockDevices.find(d => d.id === deviceId);
    if (!device) {
      throw new Error('设备不存在');
    }
    
    // 模拟设备控制
    switch (action) {
      case 'start':
        device.powerStatus = POWER_STATUS.ON;
        break;
      case 'stop':
        device.powerStatus = POWER_STATUS.OFF;
        break;
      case 'restart':
        device.powerStatus = POWER_STATUS.OFF;
        setTimeout(() => {
          device.powerStatus = POWER_STATUS.ON;
        }, 2000);
        break;
      default:
        throw new Error('不支持的操作');
    }
    
    device.lastUpdated = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    return {
      success: true,
      message: `设备${deviceId}已${action === 'start' ? '启动' : action === 'stop' ? '停止' : '重启'}`,
      status: device.status,
      powerStatus: device.powerStatus,
      lastUpdated: device.lastUpdated
    };
  } catch (error) {
    console.error(`控制设备${deviceId}失败:`, error);
    throw error;
  }
};

/**
 * 设置设备自动控制规则
 * @param {number} deviceId - 设备ID
 * @param {Object} rules - 控制规则
 * @returns {Promise} - 返回设置结果
 */
export const setDeviceAutoControlRules = async (deviceId, rules) => {
  try {
    // 在实际项目中，这里应该是一个API调用
    // const response = await api.post(`/devices/${deviceId}/auto-control`, rules);
    // return response.data;
    
    // 由于我们没有实际的API，这里返回模拟数据
    return {
      success: true,
      message: '自动控制规则设置成功'
    };
  } catch (error) {
    console.error(`设置设备${deviceId}自动控制规则失败:`, error);
    throw error;
  }
};

/**
 * 根据水质参数自动控制设备
 * @param {Object} waterData - 水质数据
 * @param {Array} devices - 设备列表
 * @returns {Promise} - 返回控制结果
 */
export const autoControlDevicesByWaterQuality = async (waterData, devices) => {
  try {
    // 分析水质数据
    const analysis = analyzeWaterQuality(waterData);
    if (!analysis) {
      throw new Error('水质数据分析失败');
    }
    
    const controlResults = [];
    
    // 根据水质参数控制设备
    for (const device of devices) {
      let action = null;
      
      // 根据设备类型和水质参数决定控制动作
      switch (device.type) {
        case DEVICE_TYPES.AERATOR:
          // 当溶解氧低于5mg/L时，启动增氧机
          if (analysis.averages.oxygen < 5 && device.powerStatus === POWER_STATUS.OFF) {
            action = 'start';
          }
          // 当溶解氧高于8mg/L时，停止增氧机
          else if (analysis.averages.oxygen > 8 && device.powerStatus === POWER_STATUS.ON) {
            action = 'stop';
          }
          break;
          
        case DEVICE_TYPES.PUMP:
          // 当氨氮或总磷超标时，启动水泵进行换水
          if ((analysis.averages.ammonia > 1.0 || analysis.averages.phosphorus > 0.2) && 
              device.powerStatus === POWER_STATUS.OFF) {
            action = 'start';
          }
          // 当水质恢复正常时，停止水泵
          else if (analysis.averages.ammonia < 0.5 && analysis.averages.phosphorus < 0.1 && 
                  device.powerStatus === POWER_STATUS.ON) {
            action = 'stop';
          }
          break;
          
        case DEVICE_TYPES.FILTER:
          // 当浊度高时，启动过滤器
          if (analysis.averages.turbidity > 20 && device.powerStatus === POWER_STATUS.OFF) {
            action = 'start';
          }
          // 当浊度恢复正常时，停止过滤器
          else if (analysis.averages.turbidity < 10 && device.powerStatus === POWER_STATUS.ON) {
            action = 'stop';
          }
          break;
      }
      
      // 执行控制动作
      if (action) {
        try {
          const result = await controlDeviceAction(device.id, action);
          controlResults.push({
            deviceId: device.id,
            deviceName: device.name,
            action,
            success: true,
            message: result.message
          });
        } catch (error) {
          controlResults.push({
            deviceId: device.id,
            deviceName: device.name,
            action,
            success: false,
            message: error.message
          });
        }
      }
    }
    
    return controlResults;
  } catch (error) {
    console.error('自动控制设备失败:', error);
    throw error;
  }
};

// 模拟设备数据
const mockDevices = [
  {
    id: 1,
    name: '水泵A-01',
    type: DEVICE_TYPES.PUMP,
    farmName: '南湖养殖场',
    status: DEVICE_STATUS.ONLINE,
    powerStatus: POWER_STATUS.ON,
    lastUpdated: '2023-05-15 08:30:22',
    parameters: {
      flowRate: 50, // 流量 (L/min)
      pressure: 2.5 // 压力 (bar)
    }
  },
  {
    id: 2,
    name: '增氧机B-02',
    type: DEVICE_TYPES.AERATOR,
    farmName: '南湖养殖场',
    status: DEVICE_STATUS.ONLINE,
    powerStatus: POWER_STATUS.ON,
    lastUpdated: '2023-05-15 09:15:43',
    parameters: {
      oxygenOutput: 8.5, // 供氧量 (mg/L)
      powerConsumption: 1.2 // 功耗 (kW)
    }
  },
  {
    id: 3,
    name: '投饵机C-03',
    type: DEVICE_TYPES.FEEDER,
    farmName: '东湖养殖场',
    status: DEVICE_STATUS.OFFLINE,
    powerStatus: POWER_STATUS.OFF,
    lastUpdated: '2023-05-14 18:22:10',
    parameters: {
      feedAmount: 2.5, // 投饵量 (kg)
      feedInterval: 4 // 投饵间隔 (小时)
    }
  },
  {
    id: 4,
    name: '水质传感器D-04',
    type: DEVICE_TYPES.SENSOR,
    farmName: '东湖养殖场',
    status: DEVICE_STATUS.WARNING,
    powerStatus: POWER_STATUS.ON,
    lastUpdated: '2023-05-15 10:05:37',
    parameters: {
      accuracy: 0.01, // 精度
      batteryLevel: 75 // 电池电量 (%)
    }
  },
  {
    id: 5,
    name: '监控摄像头E-05',
    type: DEVICE_TYPES.CAMERA,
    farmName: '西湖养殖场',
    status: DEVICE_STATUS.ONLINE,
    powerStatus: POWER_STATUS.ON,
    lastUpdated: '2023-05-15 07:45:19',
    parameters: {
      resolution: '1080p', // 分辨率
      storageRemaining: 128 // 剩余存储空间 (GB)
    }
  },
  {
    id: 6,
    name: '过滤器F-06',
    type: DEVICE_TYPES.FILTER,
    farmName: '南湖养殖场',
    status: DEVICE_STATUS.ONLINE,
    powerStatus: POWER_STATUS.ON,
    lastUpdated: '2023-05-15 11:20:05',
    parameters: {
      filterEfficiency: 95, // 过滤效率 (%)
      maintenanceRequired: false // 是否需要维护
    }
  }
];

export default {
  getAllDevices,
  getDeviceStatus,
  controlDeviceAction,
  setDeviceAutoControlRules,
  autoControlDevicesByWaterQuality,
  DEVICE_TYPES,
  DEVICE_STATUS,
  POWER_STATUS
};