/**
 * 水质环境监测模块
 * 实现水质参数监测、评估和预警功能
 */

class WaterQualityMonitor {
    // 水质标准等级阈值
    static STANDARDS = {
        temperature: {
            description: '水温',
            unit: '°C',
            limits: '周平均最大温升≤1; 周平均最大温降≤2'
        },
        ph: {
            description: 'pH值',
            unit: '无量纲',
            range: [6, 9]
        },
        dissolvedOxygen: {
            description: '溶解氧',
            unit: 'mg/L',
            thresholds: [2, 3, 5, 6, 7.5],
            classes: ['V类', 'IV类', 'III类', 'II类', 'I类']
        },
        cod: {
            description: '高锰酸盐指数',
            unit: 'mg/L',
            thresholds: [2, 4, 6, 10, 15],
            classes: ['I类', 'II类', 'III类', 'IV类', 'V类']
        },
        ammoniaNitrogen: {
            description: '氨氮',
            unit: 'mg/L',
            thresholds: [0.15, 0.5, 1.0, 1.5, 2.0],
            classes: ['I类', 'II类', 'III类', 'IV类', 'V类']
        },
        totalPhosphorus: {
            description: '总磷',
            unit: 'mg/L',
            thresholds: [0.02, 0.1, 0.2, 0.3, 0.4],
            classes: ['I类', 'II类', 'III类', 'IV类', 'V类']
        }
    };

    constructor() {
        this.currentData = null;
        this.historicalData = [];
    }

    /**
     * 更新当前水质数据
     * @param {Object} data 水质数据对象
     */
    updateCurrentData(data) {
        this.currentData = data;
        this.historicalData.push({
            ...data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * 评估水质等级
     * @param {Object} data 水质数据
     * @returns {Object} 水质评估结果
     */
    evaluateWaterQuality(data = this.currentData) {
        if (!data) return null;

        const evaluation = {};
        
        // 评估各项指标
        for (const [param, value] of Object.entries(data)) {
            if (param in WaterQualityMonitor.STANDARDS) {
                const standard = WaterQualityMonitor.STANDARDS[param];
                
                if (standard.range) {
                    evaluation[param] = {
                        value,
                        status: value >= standard.range[0] && value <= standard.range[1] ? '正常' : '异常',
                        description: standard.description,
                        unit: standard.unit
                    };
                } else if (standard.thresholds) {
                    const classIndex = standard.thresholds.findIndex(threshold => value <= threshold);
                    evaluation[param] = {
                        value,
                        class: classIndex >= 0 ? standard.classes[classIndex] : '劣V类',
                        description: standard.description,
                        unit: standard.unit
                    };
                }
            }
        }

        return evaluation;
    }

    /**
     * 检测异常并生成预警
     * @param {Object} data 水质数据
     * @returns {Array} 预警信息列表
     */
    detectAnomalies(data = this.currentData) {
        if (!data) return [];

        const warnings = [];
        const evaluation = this.evaluateWaterQuality(data);

        for (const [param, result] of Object.entries(evaluation)) {
            if (result.status === '异常' || result.class === '劣V类') {
                warnings.push({
                    parameter: result.description,
                    value: result.value,
                    unit: result.unit,
                    message: `${result.description}异常：${result.value}${result.unit}`,
                    level: 'warning',
                    timestamp: new Date().toISOString()
                });
            }
        }

        return warnings;
    }

    /**
     * 获取历史数据趋势
     * @param {String} parameter 参数名称
     * @param {Number} limit 限制返回的数据点数量
     * @returns {Array} 历史趋势数据
     */
    getHistoricalTrend(parameter, limit = 100) {
        return this.historicalData
            .slice(-limit)
            .map(data => ({
                value: data[parameter],
                timestamp: data.timestamp
            }));
    }
}

export default WaterQualityMonitor;