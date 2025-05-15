import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Table } from 'antd';
import { Line } from '@ant-design/plots';
import WaterQualityMonitor from '../services/WaterQualityMonitor';

const WaterQualityDashboard = () => {
    const [monitor] = useState(() => new WaterQualityMonitor());
    const [currentData, setCurrentData] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [warnings, setWarnings] = useState([]);
    const [trendData, setTrendData] = useState({});

    // 模拟数据更新
    useEffect(() => {
        const updateData = () => {
            // 模拟实时数据
            const mockData = {
                temperature: 20 + Math.random() * 5,
                ph: 6 + Math.random() * 3,
                dissolvedOxygen: 5 + Math.random() * 3,
                cod: 4 + Math.random() * 8,
                ammoniaNitrogen: 0.5 + Math.random(),
                totalPhosphorus: 0.1 + Math.random() * 0.3
            };

            monitor.updateCurrentData(mockData);
            setCurrentData(mockData);
            setEvaluation(monitor.evaluateWaterQuality(mockData));
            setWarnings(monitor.detectAnomalies(mockData));

            // 更新趋势数据
            const trends = {};
            Object.keys(mockData).forEach(param => {
                trends[param] = monitor.getHistoricalTrend(param, 10);
            });
            setTrendData(trends);
        };

        updateData(); // 初始更新
        const interval = setInterval(updateData, 5000); // 每5秒更新一次

        return () => clearInterval(interval);
    }, [monitor]);

    // 渲染参数卡片
    const renderParameterCard = (param, data) => {
        if (!data || !evaluation) return null;

        const result = evaluation[param];
        if (!result) return null;

        const status = result.status === '异常' || result.class === '劣V类' ? 'error' : 'success';

        return (
            <Card
                title={result.description}
                size="small"
                style={{ marginBottom: 16 }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ margin: 0, color: status === 'error' ? '#ff4d4f' : '#52c41a' }}>
                        {result.value.toFixed(2)} {result.unit}
                    </h2>
                    <p style={{ margin: '8px 0 0' }}>
                        {result.class || result.status}
                    </p>
                </div>
            </Card>
        );
    };

    // 渲染趋势图
    const renderTrendChart = (param) => {
        if (!trendData[param] || trendData[param].length === 0) return null;

        const config = {
            data: trendData[param],
            xField: 'timestamp',
            yField: 'value',
            smooth: true,
            animation: false,
            point: {
                size: 3,
            },
        };

        return (
            <div style={{ marginTop: 16 }}>
                <Line {...config} height={200} />
            </div>
        );
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>水质环境监测面板</h1>
            
            {/* 预警信息 */}
            {warnings.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                    {warnings.map((warning, index) => (
                        <Alert
                            key={index}
                            message={warning.message}
                            type="warning"
                            showIcon
                            style={{ marginBottom: 8 }}
                        />
                    ))}
                </div>
            )}

            {/* 参数卡片 */}
            <Row gutter={16}>
                {Object.keys(WaterQualityMonitor.STANDARDS).map(param => (
                    <Col span={8} key={param}>
                        {renderParameterCard(param, currentData)}
                        {renderTrendChart(param)}
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default WaterQualityDashboard;