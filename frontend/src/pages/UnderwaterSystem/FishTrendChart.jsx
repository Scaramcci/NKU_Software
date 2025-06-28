import React from 'react';
import ReactECharts from 'echarts-for-react';

const FishTrendChart = () => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow' // 显示阴影指示器
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // 半透明黑色背景
      borderColor: '#00eaff', // 边框蓝色
      borderWidth: 1,
      padding: 10,
      formatter: function(params) {
        // params是一个数组，包含当前点的所有数据
        if (!params || params.length === 0) return '';
        
        const data = params[0];
        return `
          <div style='text-align: center; margin-bottom: 5px;'>${data.name}</div>
          <div style='color: #00eaff;'>鱼群数量: ${data.value} 尾</div>
          <div>较前日变化: ${data.value - (params[0].dataIndex > 0 ? option.series[0].data[params[0].dataIndex - 1] : data.value)} 尾</div>
        `;
      },
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
