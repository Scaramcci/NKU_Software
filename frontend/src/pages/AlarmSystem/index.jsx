import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAlarms, 
  fetchThresholds, 
  fetchAlarmHistory, 
  acknowledgeAlarm, 
  updateThreshold 
} from '../../redux/reducers/alarmSlice';
import { 
  Card, 
  Table, 
  Tag, 
  Button, 
  Tabs, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  message, 
  Badge, 
  Space, 
  Descriptions, 
  Timeline,
  Alert,
  Divider,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  WarningOutlined, 
  CheckCircleOutlined, 
  BellOutlined, 
  SettingOutlined, 
  HistoryOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const AlarmSystem = () => {
  const dispatch = useDispatch();
  const { alarms, thresholds, alarmHistory, loading, error } = useSelector(state => state.alarm);
  
  const [activeTab, setActiveTab] = useState('1');
  const [thresholdModalVisible, setThresholdModalVisible] = useState(false);
  const [selectedThreshold, setSelectedThreshold] = useState(null);
  const [form] = Form.useForm();
  
  // 获取数据
  useEffect(() => {
    dispatch(fetchAlarms());
    dispatch(fetchThresholds());
    dispatch(fetchAlarmHistory());
  }, [dispatch]);
  
  // 处理确认预警
  const handleAcknowledge = (alarmId) => {
    dispatch(acknowledgeAlarm(alarmId))
      .unwrap()
      .then(() => {
        message.success('预警已确认');
      })
      .catch((err) => {
        message.error(err || '确认预警失败');
      });
  };
  
  // 打开阈值设置模态框
  const openThresholdModal = (threshold) => {
    setSelectedThreshold(threshold);
    form.setFieldsValue({
      min: threshold.min,
      max: threshold.max,
    });
    setThresholdModalVisible(true);
  };
  
  // 处理阈值更新
  const handleThresholdUpdate = (values) => {
    dispatch(updateThreshold({ thresholdId: selectedThreshold.id, updates: values }))
      .unwrap()
      .then(() => {
        message.success('阈值设置已更新');
        setThresholdModalVisible(false);
      })
      .catch((err) => {
        message.error(err || '更新阈值设置失败');
      });
  };
  
  // 获取预警级别对应的标签颜色
  const getAlarmLevelColor = (level) => {
    switch(level) {
      case 'critical':
        return 'red';
      case 'warning':
        return 'orange';
      default:
        return 'blue';
    }
  };
  
  // 获取设备状态对应的标签颜色
  const getStatusColor = (status) => {
    switch(status) {
      case 'active':
        return 'red';
      case 'resolved':
        return 'green';
      default:
        return 'default';
    }
  };
  
  // 当前预警列表列定义
  const alarmColumns = [
    {
      title: '预警级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag color={getAlarmLevelColor(level)}>
          {level === 'critical' ? '严重' : level === 'warning' ? '警告' : '一般'}
        </Tag>
      ),
    },
    {
      title: '预警类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          'temperature': '水温',
          'oxygen': '溶氧量',
          'ph': 'pH值',
          'ammonia': '氨氮'
        };
        return typeMap[type] || type;
      }
    },
    {
      title: '养殖场',
      dataIndex: 'farmName',
      key: 'farmName',
    },
    {
      title: '养殖池',
      dataIndex: 'pondName',
      key: 'pondName',
    },
    {
      title: '当前值',
      key: 'currentValue',
      render: (record) => {
        const unitMap = {
          'temperature': '°C',
          'oxygen': 'mg/L',
          'ph': '',
          'ammonia': 'mg/L'
        };
        return `${record.currentValue} ${unitMap[record.type] || ''}`;
      },
    },
    {
      title: '阈值范围',
      key: 'threshold',
      render: (record) => {
        const { min, max } = record.threshold;
        const unitMap = {
          'temperature': '°C',
          'oxygen': 'mg/L',
          'ph': '',
          'ammonia': 'mg/L'
        };
        const unit = unitMap[record.type] || '';
        
        if (min !== null && max !== null) {
          return `${min} - ${max} ${unit}`;
        } else if (min !== null) {
          return `> ${min} ${unit}`;
        } else if (max !== null) {
          return `< ${max} ${unit}`;
        }
        return '未设置';
      },
    },
    {
      title: '预警信息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '发生时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '状态',
      key: 'status',
      render: (record) => (
        <Badge 
          status={record.acknowledged ? 'success' : 'processing'} 
          text={record.acknowledged ? '已确认' : '未确认'} 
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record) => (
        <Space>
          {!record.acknowledged && (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => handleAcknowledge(record.id)}
            >
              确认
            </Button>
          )}
          <Button type="link" size="small">详情</Button>
        </Space>
      ),
    },
  ];
  
  // 阈值设置列定义
  const thresholdColumns = [
    {
      title: '参数类型',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '最小值',
      dataIndex: 'min',
      key: 'min',
      render: (min) => min === null ? '未设置' : min,
    },
    {
      title: '最大值',
      dataIndex: 'max',
      key: 'max',
      render: (max) => max === null ? '未设置' : max,
    },
    {
      title: '适用范围',
      key: 'scope',
      render: (record) => (
        record.isGlobal ? '全局' : `${record.farmName || ''} ${record.pondName || ''}`
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record) => (
        <Button 
          type="primary" 
          size="small" 
          onClick={() => openThresholdModal(record)}
        >
          编辑
        </Button>
      ),
    },
  ];
  
  // 历史预警记录列定义
  const historyColumns = [
    {
      title: '预警级别',
      dataIndex: 'level',
      key: 'level',
      render: (level) => (
        <Tag color={getAlarmLevelColor(level)}>
          {level === 'critical' ? '严重' : level === 'warning' ? '警告' : '一般'}
        </Tag>
      ),
    },
    {
      title: '预警类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          'temperature': '水温',
          'oxygen': '溶氧量',
          'ph': 'pH值',
          'ammonia': '氨氮'
        };
        return typeMap[type] || type;
      }
    },
    {
      title: '养殖场',
      dataIndex: 'farmName',
      key: 'farmName',
    },
    {
      title: '养殖池',
      dataIndex: 'pondName',
      key: 'pondName',
    },
    {
      title: '异常值',
      key: 'value',
      render: (record) => {
        const unitMap = {
          'temperature': '°C',
          'oxygen': 'mg/L',
          'ph': '',
          'ammonia': 'mg/L'
        };
        return `${record.value} ${unitMap[record.type] || ''}`;
      },
    },
    {
      title: '预警信息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '发生时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '解决时间',
      dataIndex: 'resolvedAt',
      key: 'resolvedAt',
    },
    {
      title: '持续时间',
      key: 'duration',
      render: (record) => `${record.duration} 分钟`,
    },
    {
      title: '处理措施',
      dataIndex: 'actions',
      key: 'actions',
      render: (actions) => actions.join('、'),
    },
  ];
  
  // 统计数据
  const getAlarmStats = () => {
    const criticalCount = alarms.filter(a => a.level === 'critical' && !a.acknowledged).length;
    const warningCount = alarms.filter(a => a.level === 'warning' && !a.acknowledged).length;
    const totalCount = alarms.filter(a => !a.acknowledged).length;
    
    return { criticalCount, warningCount, totalCount };
  };
  
  const { criticalCount, warningCount, totalCount } = getAlarmStats();
  
  return (
    <div className="alarm-system-container">
      <Card title="预警系统" className="alarm-card">
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic 
                title="当前预警总数" 
                value={totalCount} 
                valueStyle={{ color: totalCount > 0 ? '#ff4d4f' : '#3f8600' }}
                prefix={<BellOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="严重预警" 
                value={criticalCount} 
                valueStyle={{ color: criticalCount > 0 ? '#ff4d4f' : '#3f8600' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="警告预警" 
                value={warningCount} 
                valueStyle={{ color: warningCount > 0 ? '#faad14' : '#3f8600' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <BellOutlined />
                当前预警
              </span>
            } 
            key="1"
          >
            <Table 
              columns={alarmColumns} 
              dataSource={alarms.map(alarm => ({ ...alarm, key: alarm.id }))} 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <SettingOutlined />
                阈值设置
              </span>
            } 
            key="2"
          >
            <Table 
              columns={thresholdColumns} 
              dataSource={thresholds.map(threshold => ({ ...threshold, key: threshold.id }))} 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <HistoryOutlined />
                历史记录
              </span>
            } 
            key="3"
          >
            <Table 
              columns={historyColumns} 
              dataSource={alarmHistory.map(history => ({ ...history, key: history.id }))} 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>
      
      {/* 阈值设置模态框 */}
      <Modal
        title="编辑阈值设置"
        visible={thresholdModalVisible}
        onCancel={() => setThresholdModalVisible(false)}
        footer={null}
      >
        {selectedThreshold && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleThresholdUpdate}
          >
            <Descriptions title="参数信息" column={1} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="参数类型">{selectedThreshold.name}</Descriptions.Item>
              <Descriptions.Item label="单位">{selectedThreshold.unit}</Descriptions.Item>
            </Descriptions>
            
            <Divider />
            
            <Form.Item
              name="min"
              label="最小值"
              rules={[{ message: '请输入有效的最小值' }]}
            >
              <InputNumber 
                placeholder="不设置请留空" 
                style={{ width: '100%' }}
                step={selectedThreshold.type === 'ph' ? 0.1 : 0.5}
              />
            </Form.Item>
            
            <Form.Item
              name="max"
              label="最大值"
              rules={[{ message: '请输入有效的最大值' }]}
            >
              <InputNumber 
                placeholder="不设置请留空" 
                style={{ width: '100%' }}
                step={selectedThreshold.type === 'ph' ? 0.1 : 0.5}
              />
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AlarmSystem;