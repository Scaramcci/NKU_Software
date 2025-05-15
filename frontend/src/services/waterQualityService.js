/**
 * 水质数据服务
 * 处理水质数据的加载和处理
 */

import axios from 'axios';
import { parseCsvData } from './dataService';

// 基础路径配置
const DATA_BASE_PATH = '/软件工程大作业数据';

/**
 * 加载指定监测点的水质数据
 * @param {string} province - 省份，如 '贵州省'
 * @param {string} basin - 流域，如 '长江流域'
 * @param {string} station - 监测点名称，如 '鱼塘大桥'
 * @param {string} year - 年份，如 '2021'
 * @param {string} month - 月份，如 '04'
 * @returns {Promise} - 返回水质数据
 */
export const loadStationWaterQualityData = async (province, basin, station, year, month) => {
  try {
    const response = await axios.get(
      `${DATA_BASE_PATH}/水质数据/water_quality_by_name/${province}/${basin}/${station}/${year}-${month}/${station}.csv`, 
      { responseType: 'text' }
    );
    return processWaterQualityData(parseCsvData(response.data));
  } catch (error) {
    console.error('加载监测点水质数据失败:', error);
    return null;
  }
};

/**
 * 处理水质CSV数据，转换为适合图表展示的格式
 * @param {Array} csvData - CSV解析后的数据数组
 * @returns {Object} - 处理后的水质数据
 */
const processWaterQualityData = (csvData) => {
  if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
    return null;
  }
  
  // 提取监测时间作为日期数组
  const days = csvData.map(item => item['监测时间'].split(' ')[0]);
  
  // 提取各项水质参数
  const temperature = csvData.map(item => parseFloat(item['水温(℃)']) || null);
  const ph = csvData.map(item => parseFloat(item['pH(无量纲)']) || null);
  const oxygen = csvData.map(item => parseFloat(item['溶解氧(mg/L)']) || null);
  const conductivity = csvData.map(item => parseFloat(item['电导率(μS/cm)']) || null);
  const turbidity = csvData.map(item => parseFloat(item['浊度(NTU)']) || null);
  const permanganate = csvData.map(item => {
    const value = item['高锰酸盐指数(mg/L)'];
    return value === '--' ? null : parseFloat(value) || null;
  });
  const ammonia = csvData.map(item => parseFloat(item['氨氮(mg/L)']) || null);
  const phosphorus = csvData.map(item => parseFloat(item['总磷(mg/L)']) || null);
  const nitrogen = csvData.map(item => {
    const value = item['总氮(mg/L)'];
    return value === '--' ? null : parseFloat(value) || null;
  });
  
  // 提取水质类别
  const waterQualityCategories = csvData.map(item => item['水质类别']);
  
  return {
    days,
    temperature,
    ph,
    oxygen,
    conductivity,
    turbidity,
    permanganate,
    ammonia,
    phosphorus,
    nitrogen,
    waterQualityCategories
  };
};

/**
 * 获取可用的监测点列表
 * @returns {Promise} - 返回监测点列表
 */
export const getAvailableStations = async () => {
  // 在实际项目中，这里应该是一个API调用
  // 由于我们没有实际的API，这里返回硬编码的数据
  return [
    { province: '贵州省', basin: '长江流域', station: '鱼塘大桥' },
    { province: '湖南省', basin: '长江流域', station: '鱼市' },
    { province: '陕西省', basin: '黄河流域', station: '鱼河' }
  ];
};

export default {
  loadStationWaterQualityData,
  getAvailableStations
};