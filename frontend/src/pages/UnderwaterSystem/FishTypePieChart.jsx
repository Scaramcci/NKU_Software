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
      alwaysShowContent: true, // 强制显示tooltip
      triggerOn: 'mousemove', // 确保鼠标移动时触发
      // 增强tooltip格式化器，显示更详细信息
      formatter: function(params) {
        // 确保params和必要属性存在
        if (!params || !params.data) return '';
        
        // 计算总和用于百分比计算
        const total = option.series[0].data.reduce((sum, item) => sum + item.value, 0);
        const percent = total > 0 ? (params.data.value / total * 100) : 0;
        
        return `
          <div style='padding: 10px; background: rgba(0,0,0,0.7); border-radius: 4px;'>
            <div style='font-weight: bold; margin-bottom: 5px; color: #00eaff;'>${params.data.name}</div>
            <div style='color: #fff;'>数量: ${params.data.value} 尾</div>
            <div style='color: #fff;'>占比: ${percent.toFixed(2)}%</div>
          </div>
        `;
      },
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
