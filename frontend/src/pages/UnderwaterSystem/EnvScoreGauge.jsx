import React from 'react';
import ReactECharts from 'echarts-for-react';

const EnvScoreGauge = () => {
  const option = {
    backgroundColor: 'transparent',
   tooltip: {
  formatter: '{a} <br/>{b} : {c}分',
  textStyle: {
    color: '#ffffff',
    fontSize: 14
  }
},

    series: [
      {
        name: '环境评分',
        type: 'gauge',
        progress: {
          show: true,
          width: 12
        },
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, '#f5222d'],
              [0.7, '#faad14'],
              [1, '#52c41a']
            ]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          distance: -15,
          length: 10,
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12,
          distance: 20
        },
        pointer: {
          itemStyle: {
            color: '#00eaff'
          }
        },
        title: {
          show: true,
          offsetCenter: [0, '-30%'],
          color: '#00eaff',
          fontSize: 16
        },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          color: '#00eaff',
          offsetCenter: [0, '40%'],
          formatter: '{value}分'
        },
        data: [
          {
            value: 70,
            name: '环境得分'
          }
        ]
      }
    ]
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <ReactECharts option={option} style={{ height: '240px', width: '100%' }} />
    </div>
  );
};

export default EnvScoreGauge;
