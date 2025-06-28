import React from 'react';
import ReactECharts from 'echarts-for-react';

const FishDistChart = () => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '鱼体重分布图',
      left: 'center',
      textStyle: {
        color: '#00eaff',   // 图表标题颜色
        fontSize: 18
      }
    },
    // 修改tooltip配置
    tooltip: {
      show: true,                  // 强制显示tooltip
      trigger: 'item',             // 按数据项触发
      alwaysShowContent: true,     // 始终显示内容
      showContent: true,           // 显示提示内容
      triggerOn: 'mousemove|click',// 鼠标移动或点击时触发
      enterable: true,             // 允许鼠标进入tooltip
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // 半透明背景
      borderColor: '#00eaff',      // 边框颜色
      borderWidth: 1,              // 边框宽度
      padding: 10,                 // 内边距
      textStyle: {
        color: '#ffffff',          // 文字颜色
        fontSize: 14
      },
      formatter: function(params) {
        // 打印完整参数用于调试
        console.log('Tooltip params:', params);
        
        // 最安全的数据访问方式
        if (!params || typeof params === 'undefined') {
          return '无数据';
        }
        
        // 适配不同触发模式的数据结构
        const name = params.name || params.dataIndex;
        const value = params.value !== undefined ? params.value : params.data;
        
        return `体重范围: ${name}<br/>数量: ${value} 尾`;
      }
    },
    xAxis: {
      type: 'category',
      data: ['0~1kg', '1~2kg', '2~3kg', '3~4kg', '4kg以上'],
      axisLine: {
        lineStyle: {
          color: '#00eaff'  // ✅ 横轴线颜色亮蓝
        }
      },
      axisLabel: {
        color: '#ffffff'    // ✅ 横轴文字白色
      }
    },
    yAxis: {
      type: 'value',
      name: '数量（尾）',
      nameTextStyle: {
        color: '#ffffff'    // ✅ 纵轴标题文字白色
      },
      axisLine: {
        lineStyle: {
          color: '#00eaff'  // ✅ 纵轴线颜色亮蓝
        }
      },
      axisLabel: {
        color: '#ffffff'    // ✅ 纵轴刻度文字白色
      },
      splitLine: {
        lineStyle: {
          color: '#1f3c52',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '数量',
        type: 'bar',
        // 将数据改为对象格式，确保tooltip能正确识别name和value
        data: [
          {name: '0~1kg', value: 120},
          {name: '1~2kg', value: 200},
          {name: '2~3kg', value: 150},
          {name: '3~4kg', value: 80},
          {name: '4kg以上', value: 40}
        ],
        itemStyle: { color: '#00eaff' },
        barWidth: '50%',
      }
    ]
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <ReactECharts option={option} style={{ height: '280px', width: '100%' }} />
    </div>
  );
};

export default FishDistChart;
