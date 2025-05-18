import React, { useState } from 'react';
import { Row, Col, Card, Tabs, Typography } from 'antd';
import { LineChartOutlined, ControlOutlined, DashboardOutlined, AlertOutlined } from '@ant-design/icons';
import MonitoringDashboard from '../../components/MonitoringDashboard';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TabPane } = Tabs;

const FarmDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');

  // 处理设备控制页面导航
  const handleDeviceControlNav = () => {
    navigate('/device-control');
  };

  // 处理报警系统页面导航
  const handleAlarmSystemNav = () => {
    navigate('/alarm-system');
  };

  return (
    <div style={{ padding: 16 }}>
      <Title level={2} style={{ marginBottom: 24 }}>渔场智能监控中心</Title>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        size="large"
        tabBarStyle={{ marginBottom: 16 }}
        tabBarExtraContent={{
          right: (
            <div>
              <ControlOutlined 
                onClick={handleDeviceControlNav} 
                style={{ fontSize: '20px', marginRight: 16, cursor: 'pointer' }} 
                title="设备控制中心"
              />
              <AlertOutlined 
                onClick={handleAlarmSystemNav} 
                style={{ fontSize: '20px', cursor: 'pointer' }} 
                title="报警系统"
              />
            </div>
          ),
        }}
      >
        <TabPane 
          tab={<span><DashboardOutlined />监控面板</span>} 
          key="1"
        >
          <MonitoringDashboard />
        </TabPane>
        
        <TabPane 
          tab={<span><LineChartOutlined />数据分析</span>} 
          key="2"
        >
          <Card title="水质数据分析" style={{ marginBottom: 16 }}>
            <p>此处可以集成更详细的水质数据分析图表和报告。</p>
          </Card>
          
          <Card title="鱼类生长数据分析">
            <p>此处可以集成鱼类生长数据分析图表和报告。</p>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FarmDashboard;