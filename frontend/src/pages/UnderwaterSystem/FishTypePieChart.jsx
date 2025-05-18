import React from 'react';
import ReactECharts from 'echarts-for-react';

const FishTypePieChart = () => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '鱼种占比',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#00eaff',
        fontSize: 18
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 尾 ({d}%)',
      textStyle: {
        color: '#ffffff',  // ✅ 悬浮提示改为白色
        fontSize: 14
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#ffffff'  // ✅ 图例文字白色
      },
      data: ['青鱼', '鲈鱼', '鲤鱼']
    },
    series: [
      {
        name: '鱼种分布',
        type: 'pie',
        radius: '70%',
        center: ['50%', '55%'],
        data: [
          { value: 500, name: '青鱼' },
          { value: 300, name: '鲈鱼' },
          { value: 200, name: '鲤鱼' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          color: '#ffffff',  // ✅ 饼图标签白色
          formatter: '{b}: {d}%'
        },
        labelLine: {
          lineStyle: {
            color: '#00eaff'  // ✅ 标签连线蓝色
          }
        }
      }
    ]
  };

  return (
    <div style={{ marginTop: 12 }}>
      <ReactECharts option={option} style={{ height: '280px', width: '100%' }} />
    </div>
  );
};

export default FishTypePieChart;
