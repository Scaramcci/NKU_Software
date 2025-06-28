import React from 'react';
import { Card } from 'antd';
// 引入 echarts-for-react 提供的 ECharts 组件
import ReactEcharts from 'echarts-for-react'; 

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
        <Card title="数据流桑基图" size="small" style={{ marginBottom: 16 }}>
            {/* 使用 ReactEcharts 组件渲染 ECharts 图表 */}
            <ReactEcharts
                option={option}
                style={{ height: '400px' }} // 设置图表高度，可根据需求调整
            />
        </Card>
    );
};

export default SankeyChart;