// // src/pages/DataCenter/DataFlowChart.jsx
// import React from 'react';
// import { Card } from 'antd';
// import { Line } from '@ant-design/plots';
// import './DataFlowChart.css';

// const DataFlowChart = () => {
//   const data = [
//     { time: '00:00', value: 200 },
//     { time: '02:00', value: 300 },
//     { time: '04:00', value: 260 },
//     { time: '06:00', value: 400 },
//     { time: '08:00', value: 600 },
//     { time: '10:00', value: 580 },
//     { time: '12:00', value: 750 },
//     { time: '14:00', value: 700 },
//     { time: '16:00', value: 820 },
//     { time: '18:00', value: 880 },
//     { time: '20:00', value: 940 },
//     { time: '22:00', value: 1020 }
//   ];

//   const config = {
//     data,
//     xField: 'time',
//     yField: 'value',
//     smooth: true,
//     lineStyle: {
//       stroke: '#00ffff',
//       lineWidth: 2
//     },
//     point: {
//       size: 4,
//       style: {
//         fill: '#00ffff',
//         stroke: '#fff',
//         lineWidth: 1
//       }
//     },
//     color: '#00ffff',
//     xAxis: {
//       label: { style: { fill: '#fff' } },
//       line: { style: { stroke: '#aaa' } }
//     },
//     yAxis: {
//       label: { style: { fill: '#fff' } },
//       grid: { line: { style: { stroke: '#333' } } }
//     },
//     tooltip: {
//       domStyles: {
//         'g2-tooltip': { backgroundColor: '#001529', color: '#fff' }
//       }
//     }
//   };

//   return (
//     <Card
//       className="data-panel"
//       title={<span style={{ color: '#fff', fontWeight: 'bold' }}>数据流趋势</span>}
//       bordered={false}
//     >
//       <div className="chart-container">
//         <Line {...config} />
//       </div>
//     </Card>
//   );
// };

// export default DataFlowChart;
