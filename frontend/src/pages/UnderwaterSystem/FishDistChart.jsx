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
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      textStyle: {
        color: '#ffffff',   // ✅ 悬浮提示文字改为白色
        fontSize: 14
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
        data: [120, 200, 150, 80, 40],
        itemStyle: {
          color: '#00eaff'  // ✅ 柱状图颜色统一亮蓝
        },
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
