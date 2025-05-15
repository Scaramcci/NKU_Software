import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Button, Tag, Modal, message, Spin, Row, Col, Statistic, Switch, Form, InputNumber, Slider, Tabs, Tooltip, Divider, Badge, Progress, Alert } from 'antd';
import { PoweroffOutlined, ReloadOutlined, SettingOutlined, DashboardOutlined, ThunderboltOutlined, WarningOutlined, CheckCircleOutlined, ClockCircleOutlined, RobotOutlined, CloseCircleOutlined, ControlOutlined } from '@ant-design/icons';
import { fetchDevices, fetchDeviceStatus, controlDevice } from '../../redux/reducers/deviceSlice';
import { getAllDevices, getDeviceStatus, controlDeviceAction, setDeviceAutoControlRules, DEVICE_TYPES, DEVICE_STATUS, POWER_STATUS } from '../../services/deviceControlService';
import { loadMonthlyWaterQualityData, analyzeWaterQuality } from '../../services/dataService';

const { TabPane } = Tabs;

const DeviceControl = () => {
  const dispatch = useDispatch();
  const { devices: reduxDevices, loading: reduxLoading, error, controlStatus } = useSelector((state) => state.device);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [controlModalVisible, setControlModalVisible] = useState(false);
  const [autoControlModalVisible, setAutoControlModalVisible] = useState(false);
  const [waterQualityData, setWaterQualityData] = useState(null);
  const [waterAnalysis, setWaterAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  
  // 加载设备列表和水质数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 加载设备列表
        const deviceList = await getAllDevices();
        setDevices(deviceList);
        
        // 加载水质数据
        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const waterQualityData = await loadMonthlyWaterQualityData(year, month);
        setWaterQualityData(waterQualityData);
        
        // 分析水质数据
        if (waterQualityData) {
          const analysis = analyzeWaterQuality(waterQualityData);
          setWaterAnalysis(analysis);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        message.error('加载数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    dispatch(fetchDevices());
  }, [dispatch]);

  // 定时刷新设备状态
  useEffect(() => {
    if (devices.length > 0) {
      const intervalId = setInterval(() => {
        devices.forEach(async (device) => {
          try {
            const status = await getDeviceStatus(device.id);
            setDevices(prevDevices => 
              prevDevices.map(d => 
                d.id === device.id ? { ...d, ...status } : d
              )
            );
          } catch (error) {
            console.error(`获取设备${device.id}状态失败:`, error);
          }
        });
      }, 30000); // 每30秒刷新一次

      return () => clearInterval(intervalId);
    }
  }, [devices]);

  // 处理错误信息
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // 手动刷新设备状态
  const handleRefreshStatus = async (deviceId) => {
    try {
      setLoading(true);
      const status = await getDeviceStatus(deviceId);
      setDevices(prevDevices => 
        prevDevices.map(d => 
          d.id === deviceId ? { ...d, ...status } : d
        )
      );
      message.success('设备状态已刷新');
    } catch (error) {
      message.error(`刷新设备状态失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 刷新所有设备状态
  const handleRefreshAllStatus = async () => {
    try {
      setLoading(true);
      const updatedDevices = await Promise.all(
        devices.map(async (device) => {
          const status = await getDeviceStatus(device.id);
          return { ...device, ...status };
        })
      );
      setDevices(updatedDevices);
      message.success('所有设备状态已刷新');
    } catch (error) {
      message.error(`刷新设备状态失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 打开控制面板
  const handleOpenControlPanel = (device) => {
    setSelectedDevice(device);
    setControlModalVisible(true);
  };
  
  // 打开自动控制规则设置面板
  const handleOpenAutoControlPanel = (device) => {
    setSelectedDevice(device);
    setAutoControlModalVisible(true);
  };

  // 控制设备
  const handleControlDevice = async (deviceId, action) => {
    try {
      setLoading(true);
      const result = await controlDeviceAction(deviceId, action);
      setDevices(prevDevices => 
        prevDevices.map(d => 
          d.id === deviceId ? { ...d, ...result } : d
        )
      );
      message.success(result.message);
    } catch (error) {
      message.error(`控制设备失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 设置设备自动控制规则
  const handleSetAutoControlRules = async (deviceId, rules) => {
    try {
      setLoading(true);
      const result = await setDeviceAutoControlRules(deviceId, rules);
      message.success(result.message);
      setAutoControlModalVisible(false);
    } catch (error) {
      message.error(`设置自动控制规则失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 获取设备状态标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case DEVICE_STATUS.ONLINE:
        return 'green';
      case DEVICE_STATUS.OFFLINE:
        return 'red';
      case DEVICE_STATUS.WARNING:
        return 'orange';
      default:
        return 'default';
    }
  };

  // 获取设备类型中文名称
  const getDeviceTypeName = (type) => {
    const typeMap = {
      [DEVICE_TYPES.PUMP]: '水泵',
      [DEVICE_TYPES.AERATOR]: '增氧机',
      [DEVICE_TYPES.FEEDER]: '投饵机',
      [DEVICE_TYPES.SENSOR]: '传感器',
      [DEVICE_TYPES.CAMERA]: '监控摄像头',
      [DEVICE_TYPES.FILTER]: '过滤器'
    };
    return typeMap[type] || type;
  };
  
  // 获取设备参数显示
  const getDeviceParameters = (device) => {
    if (!device || !device.parameters) return null;
    
    const { type, parameters } = device;
    
    switch (type) {
      case DEVICE_TYPES.PUMP:
        return (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic 
                title="流量" 
                value={parameters.flowRate} 
                suffix="L/min" 
                precision={1}
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="压力" 
                value={parameters.pressure} 
                suffix="bar" 
                precision={1}
              />
            </Col>
          </Row>
        );
      case DEVICE_TYPES.AERATOR:
        return (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic 
                title="供氧量" 
                value={parameters.oxygenOutput} 
                suffix="mg/L" 
                precision={1}
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="功耗" 
                value={parameters.powerConsumption} 
                suffix="kW" 
                precision={1}
              />
            </Col>
          </Row>
        );
      case DEVICE_TYPES.FEEDER:
        return (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Statistic 
                title="投饵量" 
                value={parameters.feedAmount} 
                suffix="kg" 
                precision={1}
              />
            </Col>
            <Col span={12}>
              <Statistic 
                title="投饵间隔" 
                value={parameters.feedInterval} 
                suffix="小时" 
                precision={0}
              />
            </Col>
          </Row>
        );
      default:
        return null;
    }
  };
  
  // 获取设备运行状态图标
  const getDeviceStatusIcon = (status, powerStatus) => {
    if (status === DEVICE_STATUS.OFFLINE) {
      return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    }
    
    if (status === DEVICE_STATUS.WARNING) {
      return <WarningOutlined style={{ color: '#faad14' }} />;
    }
    
    if (powerStatus === POWER_STATUS.ON) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
    
    return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
  };
  
  // 获取设备健康状态进度条
  const getDeviceHealthProgress = (device) => {
    if (!device) return 0;
    
    if (device.status === DEVICE_STATUS.OFFLINE) {
      return 0;
    }
    
    if (device.status === DEVICE_STATUS.WARNING) {
      return 50;
    }
    
    return 100;
  };
  
  // 获取设备健康状态颜色
  const getDeviceHealthColor = (device) => {
    if (!device) return '';
    
    if (device.status === DEVICE_STATUS.OFFLINE) {
      return '#f5222d';
    }
    
    if (device.status === DEVICE_STATUS.WARNING) {
      return '#faad14';
    }
    
    return '#52c41a';
  };

  // 表格列定义
  const columns = [
    {
      title: '设备ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>
          {getDeviceStatusIcon(record.status, record.powerStatus)}{' '}
          {text}
        </span>
      ),
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => getDeviceTypeName(type),
    },
    {
      title: '所属渔场',
      dataIndex: 'farmName',
      key: 'farmName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'online' ? '在线' : status === 'offline' ? '离线' : status}
        </Tag>
      ),
    },
    {
      title: '上次更新时间',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button 
            type="primary" 
            icon={<SettingOutlined />} 
            onClick={() => handleOpenControlPanel(record)}
            disabled={record.status === 'offline'}
            style={{ marginRight: 8 }}
          >
            控制
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => handleRefreshStatus(record.id)}
          >
            刷新
          </Button>
        </>
      ),
    },
  ];

  // 渲染设备卡片
  const renderDeviceCard = (device) => {
    return (
      <Card
        key={device.id}
        hoverable
        style={{ marginBottom: 16 }}
        actions={[
          <Tooltip title="控制设备">
            <ControlOutlined key="control" onClick={() => handleOpenControlPanel(device)} />
          </Tooltip>,
          <Tooltip title="自动控制规则">
            <RobotOutlined key="auto" onClick={() => handleOpenAutoControlPanel(device)} />
          </Tooltip>,
          <Tooltip title="刷新状态">
            <ReloadOutlined key="refresh" onClick={() => handleRefreshStatus(device.id)} />
          </Tooltip>
        ]}
      >
        <Card.Meta
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                {getDeviceStatusIcon(device.status, device.powerStatus)}{' '}
                {device.name}
              </span>
              <Tag color={getStatusColor(device.status)}>
                {device.status === DEVICE_STATUS.ONLINE ? '在线' : 
                 device.status === DEVICE_STATUS.OFFLINE ? '离线' : '警告'}
              </Tag>
            </div>
          }
          description={
            <>
              <p>类型: {getDeviceTypeName(device.type)}</p>
              <p>所属养殖场: {device.farmName}</p>
              <p>电源状态: 
                <Tag color={device.powerStatus === POWER_STATUS.ON ? 'green' : 'red'}>
                  {device.powerStatus === POWER_STATUS.ON ? '开启' : '关闭'}
                </Tag>
              </p>
              <p>最后更新: {device.lastUpdated}</p>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ marginTop: 8 }}>
                <Progress 
                  percent={getDeviceHealthProgress(device)} 
                  strokeColor={getDeviceHealthColor(device)}
                  size="small"
                  format={() => '设备健康度'}
                />
              </div>
              {getDeviceParameters(device)}
            </>
          }
        />
      </Card>
    );
  };

  return (
    <div className="device-control-container" style={{ padding: '24px' }}>
      <Card title="设备控制中心" extra={<Button type="primary" onClick={handleRefreshAllStatus}>刷新所有设备</Button>}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <p>加载设备数据中...</p>
          </div>
        ) : (
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            <TabPane tab="列表视图" key="1">
              <Table 
                columns={columns} 
                dataSource={devices} 
                rowKey="id" 
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab="卡片视图" key="2">
              <Row gutter={[16, 16]}>
                {devices.map(device => (
                  <Col xs={24} sm={12} md={8} lg={6} key={device.id}>
                    {renderDeviceCard(device)}
                  </Col>
                ))}
              </Row>
            </TabPane>
          </Tabs>
        )}
      </Card>

      {/* 设备控制面板 */}
      <Modal
        title={`设备控制 - ${selectedDevice?.name || ''}`}
        visible={controlModalVisible}
        onCancel={() => setControlModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedDevice && (
          <div>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Statistic title="设备类型" value={getDeviceTypeName(selectedDevice.type)} />
              </Col>
              <Col span={8}>
                <Statistic title="设备状态" value={selectedDevice.status === 'online' ? '在线' : '离线'} />
              </Col>
              <Col span={8}>
                <Statistic title="所属渔场" value={selectedDevice.farmName} />
              </Col>
            </Row>

            <Card title="控制面板" bordered={false}>
              <Row gutter={16}>
                <Col span={8}>
                  <Card type="inner" title="电源控制">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>电源状态:</span>
                      <Switch 
                        checkedChildren="开启" 
                        unCheckedChildren="关闭" 
                        checked={selectedDevice.powerStatus === 'on'}
                        onChange={(checked) => handleControlDevice(checked ? 'powerOn' : 'powerOff')}
                        loading={controlStatus[selectedDevice.id] === 'pending'}
                      />
                    </div>
                  </Card>
                </Col>
                
                {selectedDevice.type === 'pump' && (
                  <Col span={8}>
                    <Card type="inner" title="水泵控制">
                      <Button 
                        type="primary" 
                        onClick={() => handleControlDevice('startPump')}
                        loading={controlStatus[selectedDevice.id] === 'pending'}
                        block
                      >
                        启动水泵
                      </Button>
                      <Button 
                        danger 
                        onClick={() => handleControlDevice('stopPump')}
                        loading={controlStatus[selectedDevice.id] === 'pending'}
                        style={{ marginTop: 8 }}
                        block
                      >
                        停止水泵
                      </Button>
                    </Card>
                  </Col>
                )}
                
                {selectedDevice.type === 'aerator' && (
                  <Col span={8}>
                    <Card type="inner" title="增氧机控制">
                      <Button 
                        type="primary" 
                        onClick={() => handleControlDevice('startAerator')}
                        loading={controlStatus[selectedDevice.id] === 'pending'}
                        block
                      >
                        启动增氧
                      </Button>
                      <Button 
                        danger 
                        onClick={() => handleControlDevice('stopAerator')}
                        loading={controlStatus[selectedDevice.id] === 'pending'}
                        style={{ marginTop: 8 }}
                        block
                      >
                        停止增氧
                      </Button>
                    </Card>
                  </Col>
                )}
                
                {selectedDevice.type === 'feeder' && (
                  <Col span={8}>
                    <Card type="inner" title="投饵机控制">
                      <Button 
                        type="primary" 
                        onClick={() => handleControlDevice('startFeeding')}
                        loading={controlStatus[selectedDevice.id] === 'pending'}
                        block
                      >
                        开始投饵
                      </Button>
                      <Button 
                        onClick={() => handleControlDevice('adjustFeedingAmount')}
                        loading={controlStatus[selectedDevice.id] === 'pending'}
                        style={{ marginTop: 8 }}
                        block
                      >
                        调整投饵量
                      </Button>
                    </Card>
                  </Col>
                )}
              </Row>
            </Card>
          </div>
        )}
      </Modal>
      
      {/* 自动控制规则设置模态框 */}
      <Modal
        title={`设置自动控制规则: ${selectedDevice?.name || ''}`}
        visible={autoControlModalVisible}
        onCancel={() => setAutoControlModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedDevice && (
          <Form
            layout="vertical"
            onFinish={(values) => handleSetAutoControlRules(selectedDevice.id, values)}
            initialValues={{
              enabled: true,
              parameters: {
                oxygen: { min: 5, max: 8 },
                ph: { min: 6.5, max: 8.5 },
                temperature: { min: 18, max: 30 },
                ammonia: { max: 1.0 },
                phosphorus: { max: 0.2 },
                turbidity: { max: 20 }
              }
            }}
          >
            <Form.Item
              name="enabled"
              label="启用自动控制"
              valuePropName="checked"
            >
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            
            <Divider>水质参数阈值设置</Divider>
            
            {selectedDevice.type === DEVICE_TYPES.AERATOR && (
              <>
                <Form.Item label="溶解氧阈值 (mg/L)">
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item name={['parameters', 'oxygen', 'min']} noStyle>
                        <InputNumber min={0} max={20} placeholder="最小值" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name={['parameters', 'oxygen', 'max']} noStyle>
                        <InputNumber min={0} max={20} placeholder="最大值" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Form.Item name={['parameters', 'oxygen', 'range']} noStyle>
                      <Slider range min={0} max={20} />
                    </Form.Item>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Alert message="当溶解氧低于最小值时，增氧机将自动启动；当高于最大值时，将自动停止。" type="info" showIcon />
                  </div>
                </Form.Item>
              </>
            )}
            
            {selectedDevice.type === DEVICE_TYPES.PUMP && (
              <>
                <Form.Item label="氨氮阈值 (mg/L)">
                  <Form.Item name={['parameters', 'ammonia', 'max']} noStyle>
                    <InputNumber min={0} max={5} placeholder="最大值" style={{ width: '100%' }} />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    <Form.Item name={['parameters', 'ammonia', 'slider']} noStyle>
                      <Slider min={0} max={5} step={0.1} />
                    </Form.Item>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Alert message="当氨氮超过设定值时，水泵将自动启动进行换水。" type="info" showIcon />
                  </div>
                </Form.Item>
                
                <Form.Item label="总磷阈值 (mg/L)">
                  <Form.Item name={['parameters', 'phosphorus', 'max']} noStyle>
                    <InputNumber min={0} max={1} step={0.01} placeholder="最大值" style={{ width: '100%' }} />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    <Form.Item name={['parameters', 'phosphorus', 'slider']} noStyle>
                      <Slider min={0} max={1} step={0.01} />
                    </Form.Item>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Alert message="当总磷超过设定值时，水泵将自动启动进行换水。" type="info" showIcon />
                  </div>
                </Form.Item>
              </>
            )}
            
            {selectedDevice.type === DEVICE_TYPES.FILTER && (
              <>
                <Form.Item label="浊度阈值 (NTU)">
                  <Form.Item name={['parameters', 'turbidity', 'max']} noStyle>
                    <InputNumber min={0} max={100} placeholder="最大值" style={{ width: '100%' }} />
                  </Form.Item>
                  <div style={{ marginTop: 8 }}>
                    <Form.Item name={['parameters', 'turbidity', 'slider']} noStyle>
                      <Slider min={0} max={100} />
                    </Form.Item>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Alert message="当浊度超过设定值时，过滤器将自动启动。" type="info" showIcon />
                  </div>
                </Form.Item>
              </>
            )}
            
            {selectedDevice.type === DEVICE_TYPES.FEEDER && (
              <>
                <Form.Item label="投饵时间设置">
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item name={['parameters', 'feedTime', 'interval']} noStyle>
                        <InputNumber min={1} max={24} placeholder="间隔小时" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name={['parameters', 'feedTime', 'duration']} noStyle>
                        <InputNumber min={1} max={60} placeholder="持续时间(秒)" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div style={{ marginTop: 8 }}>
                    <Alert message="设置投饵间隔时间和每次投饵持续时间。" type="info" showIcon />
                  </div>
                </Form.Item>
              </>
            )}
            
            <Divider />
            
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<RobotOutlined />} block>
                保存自动控制规则
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default DeviceControl;