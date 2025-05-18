import React from 'react';
import ReactECharts from 'echarts-for-react';

const FishTrendChart = () => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: '#ffffff', // ✅ 悬浮提示文字为白色
        fontSize: 14
      }
    },
    xAxis: {
      type: 'category',
      data: ['5月11日', '5月12日', '5月13日', '5月14日', '5月15日', '5月16日', '5月17日'],
      axisLine: {
        lineStyle: { color: '#00eaff' } // ✅ 横轴线
      },
      axisLabel: {
        color: '#ffffff' // ✅ 横轴刻度文字白色
      }
    },
    yAxis: {
      type: 'value',
      name: '数量（尾）',
      nameTextStyle: {
        color: '#ffffff' // ✅ 纵轴名称文字白色
      },
      axisLine: {
        lineStyle: { color: '#00eaff' } // ✅ 纵轴线
      },
      axisLabel: {
        color: '#ffffff' // ✅ 纵轴刻度白色
      },
      splitLine: {
        lineStyle: { color: '#1f3c52', type: 'dashed' }
      }
    },
    series: [
      {
        name: '鱼群数量',
        type: 'line',
        smooth: true,
        data: [980, 985, 990, 1002, 1015, 1020, 1038],
        lineStyle: {
          color: '#00eaff',
          width: 3
        },
        itemStyle: {
          color: '#00eaff'
        },
        areaStyle: {
          color: 'rgba(0, 234, 255, 0.15)' // ✅ 区域渐变蓝
        }
      }
    ]
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <ReactECharts option={option} style={{ height: '240px', width: '100%' }} />
    </div>
  );
};

export default FishTrendChart;
