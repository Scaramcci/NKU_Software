/**
 * 数据分析服务
 * 处理水质数据和鱼类数据的加载、分析和处理
 */

import axios from 'axios';

// 基础路径配置
const DATA_BASE_PATH = '/软件工程大作业数据';

/**
 * 加载水质数据
 * @param {string} year - 年份，如 '2020'
 * @param {string} month - 月份，如 '05'
 * @param {string} day - 日期，如 '08'
 * @returns {Promise} - 返回水质数据
 */
export const loadWaterQualityData = async (year = '2020', month = '05', day = '08') => {
  try {
    const response = await axios.get(`${DATA_BASE_PATH}/水质数据/${year}-${month}/${year}-${month}-${day}.json`);
    return response.data;
  } catch (error) {
    console.error('加载水质数据失败:', error);
    return null;
  }
};

/**
 * 加载指定月份的水质数据
 * @param {string} year - 年份，如 '2020'
 * @param {string} month - 月份，如 '05'
 * @returns {Promise} - 返回该月的水质数据汇总
 */
export const loadMonthlyWaterQualityData = async (year = '2020', month = '05') => {
  try {
    // 这里应该是一个API调用，获取整月的数据
    // 由于我们没有实际的API，这里模拟返回数据
    return generateMonthlyWaterQualityData(year, month);
  } catch (error) {
    console.error('加载月度水质数据失败:', error);
    return null;
  }
};

/**
 * 加载鱼类数据
 * @returns {Promise} - 返回鱼类数据
 */
export const loadFishData = async () => {
  try {
    const response = await axios.get(`${DATA_BASE_PATH}/Fish.csv`, { responseType: 'text' });
    return parseCsvData(response.data);
  } catch (error) {
    console.error('加载鱼类数据失败:', error);
    return null;
  }
};

/**
 * 解析CSV数据
 * @param {string} csvText - CSV文本数据
 * @returns {Array} - 解析后的数据数组
 */
export const parseCsvData = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',');
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    
    return obj;
  });
};

/**
 * 分析水质数据，计算各项指标的平均值、达标率和水质等级
 * @param {Object} waterData - 水质数据对象
 * @returns {Object} - 水质分析结果
 */
// 重命名函数以避免重复声明
export const analyzeWaterQualityData = (waterData) => {
  if (!waterData) return null;
  
  // 计算各参数平均值
  const calculateAverage = (data) => {
    const validData = data.filter(value => value !== null && !isNaN(value));
    return validData.length > 0 ? 
      +(validData.reduce((sum, value) => sum + value, 0) / validData.length).toFixed(2) : 0;
  };
  
  // 计算达标率
  const calculateComplianceRate = (data, standardMin, standardMax) => {
    const validData = data.filter(value => value !== null && !isNaN(value));
    if (validData.length === 0) return '0%';
    
    const compliantCount = validData.filter(value => 
      value >= standardMin && value <= standardMax
    ).length;
    
    return `${((compliantCount / validData.length) * 100).toFixed(1)}%`;
  };
  
  // 计算水质等级
  const determineWaterQualityLevel = (averages) => {
    const { ph, oxygen, permanganate, ammonia, phosphorus } = averages;
    
    if (ph >= 6.5 && ph <= 8.5 && oxygen >= 7.5 && permanganate <= 2 && ammonia <= 0.15 && phosphorus <= 0.02) {
      return { level: 'I', description: '水质优，适合各种用途' };
    } else if (ph >= 6 && ph <= 9 && oxygen >= 6 && permanganate <= 4 && ammonia <= 0.5 && phosphorus <= 0.1) {
      return { level: 'II', description: '水质良好，适合饮用水源及珍稀水生生物栖息' };
    } else if (ph >= 6 && ph <= 9 && oxygen >= 5 && permanganate <= 6 && ammonia <= 1.0 && phosphorus <= 0.2) {
      return { level: 'III', description: '水质一般，适合一般鱼类栖息及游泳' };
    } else if (ph >= 6 && ph <= 9 && oxygen >= 3 && permanganate <= 10 && ammonia <= 1.5 && phosphorus <= 0.3) {
      return { level: 'IV', description: '水质较差，适合一般工业用水' };
    } else if (ph >= 6 && ph <= 9 && oxygen >= 2 && permanganate <= 15 && ammonia <= 2.0 && phosphorus <= 0.4) {
      return { level: 'V', description: '水质差，仅适合农业用水及一般景观用水' };
    } else {
      return { level: '劣V', description: '水质极差，不适合常规用途' };
    }
  };
  
  // 计算平均值
  const averages = {
    temperature: calculateAverage(waterData.temperature),
    ph: calculateAverage(waterData.ph),
    oxygen: calculateAverage(waterData.oxygen),
    conductivity: calculateAverage(waterData.conductivity),
    turbidity: calculateAverage(waterData.turbidity),
    permanganate: calculateAverage(waterData.permanganate),
    ammonia: calculateAverage(waterData.ammonia),
    phosphorus: calculateAverage(waterData.phosphorus),
    nitrogen: calculateAverage(waterData.nitrogen)
  };
  
  // 计算达标率
  const complianceRates = {
    ph: calculateComplianceRate(waterData.ph, 6.5, 8.5),
    oxygen: calculateComplianceRate(waterData.oxygen, 5, 20),
    permanganate: calculateComplianceRate(waterData.permanganate, 0, 6),
    ammonia: calculateComplianceRate(waterData.ammonia, 0, 1.0),
    phosphorus: calculateComplianceRate(waterData.phosphorus, 0, 0.2)
  };
  
  // 确定水质等级
  const qualityLevel = determineWaterQualityLevel(averages);
  
  return {
    averages,
    complianceRates,
    qualityLevel
  };
};

/**
 * 生成月度水质数据（模拟数据）
 * @param {string} year - 年份
 * @param {string} month - 月份
 * @returns {Object} - 月度水质数据
 */
const generateMonthlyWaterQualityData = (year, month) => {
  // 生成该月的天数
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => `${day}日`);
  
  // 生成水质参数数据
  const generateParameterData = (baseValue, fluctuation) => {
    return Array.from({ length: daysInMonth }, () => {
      return +(baseValue + (Math.random() * 2 - 1) * fluctuation).toFixed(2);
    });
  };
  
  return {
    days,
    temperature: generateParameterData(24, 3),       // 水温，基准24℃，波动±3℃
    ph: generateParameterData(7.2, 0.5),            // pH值，基准7.2，波动±0.5
    oxygen: generateParameterData(6.5, 1),          // 溶解氧，基准6.5mg/L，波动±1mg/L
    conductivity: generateParameterData(300, 50),    // 电导率，基准300μS/cm，波动±50μS/cm
    turbidity: generateParameterData(15, 5),         // 浊度，基准15NTU，波动±5NTU
    permanganate: generateParameterData(4, 1),       // 高锰酸盐指数，基准4mg/L，波动±1mg/L
    ammonia: generateParameterData(0.5, 0.2),        // 氨氮，基准0.5mg/L，波动±0.2mg/L
    phosphorus: generateParameterData(0.2, 0.1),     // 总磷，基准0.2mg/L，波动±0.1mg/L
    nitrogen: generateParameterData(1.5, 0.5)        // 总氮，基准1.5mg/L，波动±0.5mg/L
  };
};

/**
 * 分析水质数据，评估水质等级
 * @param {Object} waterData - 水质数据
 * @returns {Object} - 水质评估结果
 */
export const analyzeWaterQuality = (waterData) => {
  if (!waterData) return null;
  
  // 根据《地表水环境质量标准(GB3838-2002)》评估水质等级
  // 这里简化处理，仅根据几个关键指标进行评估
  const getWaterQualityLevel = (ph, oxygen, permanganate, ammonia, phosphorus) => {
    // 简化的水质评估逻辑
    if (ph >= 6.5 && ph <= 8.5 && 
        oxygen >= 6 && 
        permanganate <= 4 && 
        ammonia <= 0.5 && 
        phosphorus <= 0.1) {
      return { level: 'I', description: '优', color: '#52c41a' };
    } else if (ph >= 6 && ph <= 9 && 
               oxygen >= 5 && 
               permanganate <= 6 && 
               ammonia <= 1.0 && 
               phosphorus <= 0.2) {
      return { level: 'II', description: '良', color: '#91d5ff' };
    } else if (ph >= 6 && ph <= 9 && 
               oxygen >= 4 && 
               permanganate <= 8 && 
               ammonia <= 1.5 && 
               phosphorus <= 0.3) {
      return { level: 'III', description: '轻度污染', color: '#fadb14' };
    } else if (ph >= 6 && ph <= 9 && 
               oxygen >= 3 && 
               permanganate <= 10 && 
               ammonia <= 2.0 && 
               phosphorus <= 0.4) {
      return { level: 'IV', description: '中度污染', color: '#fa8c16' };
    } else if (ph >= 6 && ph <= 9 && 
               oxygen >= 2 && 
               permanganate <= 15 && 
               ammonia <= 3.0 && 
               phosphorus <= 0.5) {
      return { level: 'V', description: '重度污染', color: '#f5222d' };
    } else {
      return { level: '劣V', description: '严重污染', color: '#722ed1' };
    }
  };
  
  // 计算平均值
  const calculateAverage = (data) => {
    if (!Array.isArray(data)) return data;
    return data.reduce((sum, value) => sum + value, 0) / data.length;
  };
  
  const avgPh = calculateAverage(waterData.ph);
  const avgOxygen = calculateAverage(waterData.oxygen);
  const avgPermanganate = calculateAverage(waterData.permanganate);
  const avgAmmonia = calculateAverage(waterData.ammonia);
  const avgPhosphorus = calculateAverage(waterData.phosphorus);
  
  const qualityLevel = getWaterQualityLevel(
    avgPh, avgOxygen, avgPermanganate, avgAmmonia, avgPhosphorus
  );
  
  // 计算各项指标的达标率
  const calculateComplianceRate = (data, standardValue, isLowerBetter = true) => {
    if (!Array.isArray(data)) return 0;
    const compliantCount = data.filter(value => 
      isLowerBetter ? value <= standardValue : value >= standardValue
    ).length;
    return (compliantCount / data.length * 100).toFixed(1);
  };
  
  return {
    qualityLevel,
    averages: {
      ph: avgPh.toFixed(1),
      oxygen: avgOxygen.toFixed(1),
      permanganate: avgPermanganate.toFixed(1),
      ammonia: avgAmmonia.toFixed(2),
      phosphorus: avgPhosphorus.toFixed(2),
      nitrogen: calculateAverage(waterData.nitrogen).toFixed(2),
      temperature: calculateAverage(waterData.temperature).toFixed(1),
      conductivity: calculateAverage(waterData.conductivity).toFixed(0),
      turbidity: calculateAverage(waterData.turbidity).toFixed(1)
    },
    complianceRates: {
      ph: calculateComplianceRate(waterData.ph, 8.5, false) + '%',
      oxygen: calculateComplianceRate(waterData.oxygen, 5, false) + '%',
      permanganate: calculateComplianceRate(waterData.permanganate, 6) + '%',
      ammonia: calculateComplianceRate(waterData.ammonia, 1.0) + '%',
      phosphorus: calculateComplianceRate(waterData.phosphorus, 0.2) + '%'
    }
  };
};

/**
 * 分析鱼类数据
 * @param {Array} fishData - 鱼类数据数组
 * @returns {Object} - 鱼类分析结果
 */
export const analyzeFishData = (fishData) => {
  if (!fishData || !Array.isArray(fishData) || fishData.length === 0) {
    return null;
  }
  
  // 按鱼类种类分组
  const speciesGroups = {};
  fishData.forEach(fish => {
    const species = fish.Species;
    if (!speciesGroups[species]) {
      speciesGroups[species] = [];
    }
    speciesGroups[species].push(fish);
  });
  
  // 计算每种鱼的平均体重和体长
  const speciesStats = Object.keys(speciesGroups).map(species => {
    const fishes = speciesGroups[species];
    const avgWeight = fishes.reduce((sum, fish) => sum + parseFloat(fish['Weight(g)']), 0) / fishes.length;
    const avgLength = fishes.reduce((sum, fish) => sum + parseFloat(fish['Length3(cm)']), 0) / fishes.length;
    const count = fishes.length;
    
    return {
      species,
      count,
      avgWeight: avgWeight.toFixed(1),
      avgLength: avgLength.toFixed(1)
    };
  });
  
  // 计算总体统计信息
  const totalCount = fishData.length;
  const speciesCount = Object.keys(speciesGroups).length;
  const totalWeight = fishData.reduce((sum, fish) => sum + parseFloat(fish['Weight(g)']), 0);
  const avgWeight = (totalWeight / totalCount).toFixed(1);
  
  return {
    speciesStats,
    totalStats: {
      totalCount,
      speciesCount,
      totalWeight: totalWeight.toFixed(1),
      avgWeight
    }
  };
};

/**
 * 生成水质趋势报告
 * @param {Object} waterData - 水质数据
 * @returns {Object} - 趋势报告
 */
export const generateWaterQualityTrendReport = (waterData) => {
  if (!waterData) return null;
  
  // 计算趋势（简单线性回归）
  const calculateTrend = (data) => {
    if (!Array.isArray(data) || data.length < 2) return 0;
    
    const n = data.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const sumX = indices.reduce((sum, x) => sum + x, 0);
    const sumY = data.reduce((sum, y) => sum + y, 0);
    const sumXY = indices.reduce((sum, x, i) => sum + x * data[i], 0);
    const sumXX = indices.reduce((sum, x) => sum + x * x, 0);
    
    // 计算斜率
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    return slope;
  };
  
  // 判断趋势方向和强度
  const getTrendDescription = (slope) => {
    const absSlope = Math.abs(slope);
    let direction = '';
    let strength = '';
    
    if (slope > 0) {
      direction = '上升';
    } else if (slope < 0) {
      direction = '下降';
    } else {
      direction = '稳定';
    }
    
    if (absSlope > 0.1) {
      strength = '显著';
    } else if (absSlope > 0.05) {
      strength = '中等';
    } else if (absSlope > 0.01) {
      strength = '轻微';
    } else {
      strength = '几乎无变化';
    }
    
    return { direction, strength, description: strength + direction };
  };
  
  return {
    temperature: getTrendDescription(calculateTrend(waterData.temperature)),
    ph: getTrendDescription(calculateTrend(waterData.ph)),
    oxygen: getTrendDescription(calculateTrend(waterData.oxygen)),
    conductivity: getTrendDescription(calculateTrend(waterData.conductivity)),
    turbidity: getTrendDescription(calculateTrend(waterData.turbidity)),
    permanganate: getTrendDescription(calculateTrend(waterData.permanganate)),
    ammonia: getTrendDescription(calculateTrend(waterData.ammonia)),
    phosphorus: getTrendDescription(calculateTrend(waterData.phosphorus)),
    nitrogen: getTrendDescription(calculateTrend(waterData.nitrogen))
  };
};

/**
 * 生成水质异常报告
 * @param {Object} waterData - 水质数据
 * @returns {Array} - 异常报告
 */
export const generateWaterQualityAnomalyReport = (waterData) => {
  if (!waterData || !waterData.days) return [];
  
  const anomalies = [];
  
  // 定义各参数的正常范围
  const normalRanges = {
    temperature: { min: 18, max: 30, name: '水温', unit: '°C' },
    ph: { min: 6.5, max: 8.5, name: 'pH值', unit: '' },
    oxygen: { min: 5, max: 20, name: '溶解氧', unit: 'mg/L' },
    conductivity: { min: 200, max: 500, name: '电导率', unit: 'μS/cm' },
    turbidity: { min: 0, max: 20, name: '浊度', unit: 'NTU' },
    permanganate: { min: 0, max: 6, name: '高锰酸盐指数', unit: 'mg/L' },
    ammonia: { min: 0, max: 1.0, name: '氨氮', unit: 'mg/L' },
    phosphorus: { min: 0, max: 0.2, name: '总磷', unit: 'mg/L' },
    nitrogen: { min: 0, max: 2.0, name: '总氮', unit: 'mg/L' }
  };
  
  // 检查每个参数的每一天是否有异常
  Object.keys(normalRanges).forEach(param => {
    if (!waterData[param] || !Array.isArray(waterData[param])) return;
    
    const { min, max, name, unit } = normalRanges[param];
    
    waterData[param].forEach((value, index) => {
      if (value < min || value > max) {
        anomalies.push({
          day: waterData.days[index],
          parameter: name,
          value: `${value}${unit}`,
          normalRange: `${min}-${max}${unit}`,
          severity: value < min ? '过低' : '过高',
          impact: getAnomalyImpact(param, value < min)
        });
      }
    });
  });
  
  return anomalies;
};

/**
 * 获取异常影响描述
 * @param {string} parameter - 参数名称
 * @param {boolean} isLow - 是否过低
 * @returns {string} - 影响描述
 */
const getAnomalyImpact = (parameter, isLow) => {
  const impacts = {
    temperature: {
      low: '鱼类生长缓慢，免疫力下降',
      high: '鱼类代谢加快，耗氧量增加，可能导致缺氧'
    },
    ph: {
      low: '水体酸化，影响鱼类生理功能',
      high: '水体碱化，可能导致氨毒性增加'
    },
    oxygen: {
      low: '鱼类缺氧，严重时可能导致死亡',
      high: '通常无负面影响'
    },
    conductivity: {
      low: '水中溶解盐类较少',
      high: '水中溶解盐类过多，可能影响鱼类渗透压调节'
    },
    turbidity: {
      low: '通常无负面影响',
      high: '影响光照透射，降低水中溶解氧，影响鱼类呼吸'
    },
    permanganate: {
      low: '通常无负面影响',
      high: '有机物污染严重，可能导致水质恶化'
    },
    ammonia: {
      low: '通常无负面影响',
      high: '氨毒性增加，影响鱼类呼吸和生长'
    },
    phosphorus: {
      low: '通常无负面影响',
      high: '可能导致水体富营养化，引发藻类过度繁殖'
    },
    nitrogen: {
      low: '通常无负面影响',
      high: '可能导致水体富营养化，影响水质'
    }
  };
  
  return impacts[parameter] ? (isLow ? impacts[parameter].low : impacts[parameter].high) : '未知影响';
};

const dataService = {
  loadWaterQualityData,
  loadMonthlyWaterQualityData,
  loadFishData,
  analyzeWaterQuality,
  analyzeFishData,
  generateWaterQualityTrendReport,
  generateWaterQualityAnomalyReport
};

export default dataService;