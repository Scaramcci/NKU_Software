import React from 'react';
import { Card, Descriptions } from 'antd';
import './ServiceInfo.css';

const serviceInfo = [
  { label: '数据库', value: 'MySQL，HBase' },
  { label: '查询次数', value: '567890' },
  { label: '成功次数', value: '567890' },
  { label: '查询时间', value: '0.1s' }
];

const ServiceInfo = () => (
  <Card className="data-panel" title={<span className="data-panel-title">服务信息</span>} bordered={false} style={{marginTop:12}}>
    <Descriptions column={1} colon={false} contentStyle={{color:'#fff'}} labelStyle={{color:'#00ffff',fontWeight:'bold'}}>
      {serviceInfo.map(item => (
        <Descriptions.Item key={item.label} label={item.label}>{item.value}</Descriptions.Item>
      ))}
    </Descriptions>
    <div style={{marginTop:16, textAlign:'center'}}>
      <button className="data-center-btn">访问数据服务系统</button>
    </div>
  </Card>
);

export default ServiceInfo;
