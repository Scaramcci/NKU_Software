import React, { useRef } from 'react';
import { Card, Button, Space, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
// 引入 echarts-for-react 提供的 ECharts 组件
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import dayjs from 'dayjs'; 

// 模拟海洋牧场大数据可视化系统相关数据，你可替换为真实数据
// 桑基图节点数据，包含名称和标识等信息
const nodes = [
    {
        "name": "数据采集",
        "id": "collect"
    },
    {
        "name": "传感器",
        "id": "sensor"
    },
    {
        "name": "水下设备",
        "id": "device"
    },
    {
        "name": "数据处理",
        "id": "process"
    },
    {
        "name": "数据存储",
        "id": "store"
    },
    {
        "name": "时序数据库",
        "id": "tsdb"
    },
    {
        "name": "关系型数据库",
        "id": "rdb"
    },
    {
        "name": "数据应用",
        "id": "apply"
    },
    {
        "name": "可视化大屏",
        "id": "dashboard"
    },
    {
        "name": "AI 分析",
        "id": "ai"
    },
    {
        "name": "移动端",
        "id": "mobile"
    },
    {
        "name": "温度传感器",
        "id": "temp_sensor"
    },
    {
        "name": "盐度传感器",
        "id": "salinity_sensor"
    },
    {
        "name": "溶氧传感器",
        "id": "do_sensor"
    },
    {
        "name": "PH 传感器",
        "id": "ph_sensor"
    },
    {
        "name": "养殖监测设备",
        "id": "farm_device"
    },
    {
        "name": "水下机器人",
        "id": "robot"
    }
];

// 桑基图边数据，描述节点之间的流向和流量大小
const links = [
    {
        "source": "collect",
        "target": "sensor",
        "value": 2000
    },
    {
        "source": "collect",
        "target": "device",
        "value": 800
    },
    {
        "source": "sensor",
        "target": "temp_sensor",
        "value": 500
    },
    {
        "source": "sensor",
        "target": "salinity_sensor",
        "value": 500
    },
    {
        "source": "sensor",
        "target": "do_sensor",
        "value": 400
    },
    {
        "source": "sensor",
        "target": "ph_sensor",
        "value": 600
    },
    {
        "source": "device",
        "target": "farm_device",
        "value": 500
    },
    {
        "source": "device",
        "target": "robot",
        "value": 300
    },
    {
        "source": "sensor",
        "target": "process",
        "value": 2000 * 0.9
    },
    {
        "source": "device",
        "target": "process",
        "value": 800 * 0.9
    },
    {
        "source": "process",
        "target": "store",
        "value": (2000 + 800) * 0.9
    },
    {
        "source": "store",
        "target": "tsdb",
        "value": (2000 + 800) * 0.9 * 0.7
    },
    {
        "source": "store",
        "target": "rdb",
        "value": (2000 + 800) * 0.9 * 0.3
    },
    {
        "source": "store",
        "target": "apply",
        "value": (2000 + 800) * 0.9
    },
    {
        "source": "apply",
        "target": "dashboard",
        "value": (2000 + 800) * 0.9 * 0.6
    },
    {
        "source": "apply",
        "target": "ai",
        "value": (2000 + 800) * 0.9 * 0.3
    },
    {
        "source": "apply",
        "target": "mobile",
        "value": (2000 + 800) * 0.9 * 0.1
    }
];

// 将节点数据和边数据转换为 ECharts 桑基图所需格式
function convertToSankeyData(nodes, links) {
    let nodeMap = {};
    nodes.forEach((node, index) => {
        nodeMap[node.id] = index;
    });
    let sankeyLinks = links.map(link => ({
        source: nodeMap[link.source],
        target: nodeMap[link.target],
        value: link.value
    }));
    return {
        nodes: nodes.map(node => ({ name: node.name })),
        links: sankeyLinks
    };
}

const SankeyChart = () => {
    const chartRef = useRef(null);

    // 下载图表为图片
    const downloadChart = async () => {
        try {
            if (chartRef.current) {
                const canvas = await html2canvas(chartRef.current, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true
                });
                
                const link = document.createElement('a');
                link.download = `数据流桑基图_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.png`;
                link.href = canvas.toDataURL();
                link.click();
                
                message.success('图表下载成功');
            }
        } catch (error) {
            console.error('下载图表失败:', error);
            message.error('下载图表失败');
        }
    };

    // 下载数据为CSV
    const downloadData = () => {
        try {
            const csvData = links.map(link => ({
                源节点: link.source,
                目标节点: link.target,
                数值: link.value
            }));
            
            const csv = Papa.unparse(csvData);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `桑基图数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`;
            link.click();
            
            message.success('数据下载成功');
        } catch (error) {
            console.error('下载数据失败:', error);
            message.error('下载数据失败');
        }
    };
    // 转换数据
    const sankeyData = convertToSankeyData(nodes, links);

    // 配置 ECharts 的 option
    const option = {
        title: {
            text: '海洋牧场大数据流向桑基图（模拟数据）',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                data: sankeyData.nodes,
                links: sankeyData.links,
                nodeWidth: 20,
                nodeGap: 10,
                label: {
                    color: '#000', // 调整标签颜色，适配白色背景等情况，可根据实际需求改
                    fontSize: 12
                },
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.5
                },
                emphasis: {
                    focus: 'adjacency'
                }
            }
        ]
    };

    return (
        <Card 
            title="数据流桑基图" 
            size="small" 
            style={{ marginBottom: 16 }}
            extra={
                <Space>
                    <Button 
                        type="primary" 
                        icon={<DownloadOutlined />} 
                        onClick={downloadChart}
                        size="small"
                    >
                        下载图表
                    </Button>
                    <Button 
                        icon={<DownloadOutlined />} 
                        onClick={downloadData}
                        size="small"
                    >
                        下载数据
                    </Button>
                </Space>
            }
        >
            <div ref={chartRef}>
                {/* 使用 ReactEcharts 组件渲染 ECharts 图表 */}
                <ReactEcharts
                    option={option}
                    style={{ height: '400px' }} // 设置图表高度，可根据需求调整
                />
            </div>
        </Card>
    );
};

export default SankeyChart;