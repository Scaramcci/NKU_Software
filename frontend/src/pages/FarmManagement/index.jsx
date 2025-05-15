import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal, Form, Input, InputNumber, Select, message, Tabs, Space, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, LineChartOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

// 模拟数据 - 实际项目中应从API获取
const mockFarms = [
  {
    id: 1,
    name: '东湖渔场',
    location: '南京市江宁区',
    area: 5000,
    waterType: 'freshwater',
    fishTypes: ['草鱼', '鲤鱼', '鲫鱼'],
    createdAt: '2023-01-15T08:00:00.000Z',
    status: 'active'
  },
  {
    id: 2,
    name: '西湖养殖基地',
    location: '杭州市西湖区',
    area: 8000,
    waterType: 'freshwater',
    fishTypes: ['黑鱼', '鲈鱼'],
    createdAt: '2023-02-20T09:30:00.000Z',
    status: 'active'
  },
  {
    id: 3,
    name: '南海养殖场',
    location: '广州市南沙区',
    area: 12000,
    waterType: 'saltwater',
    fishTypes: ['金鲳', '石斑鱼', '龙虾'],
    createdAt: '2023-03-10T10:15:00.000Z',
    status: 'maintenance'
  }
];

// 模拟环境数据
const mockEnvironmentData = {
  temperature: {
    today: [25.2, 25.5, 26.1, 26.8, 27.2, 27.0, 26.5, 26.0],
    week: [25.0, 25.5, 26.0, 25.8, 25.2, 25.5, 26.1]
  },
  ph: {
    today: [7.2, 7.3, 7.4, 7.3, 7.2, 7.1, 7.2, 7.3],
    week: [7.1, 7.2, 7.3, 7.4, 7.3, 7.2, 7.1]
  },
  oxygen: {
    today: [6.8, 6.7, 6.5, 6.3, 6.2, 6.4, 6.6, 6.8],
    week: [6.5, 6.6, 6.8, 6.7, 6.5, 6.3, 6.4]
  },
  turbidity: {
    today: [12, 13, 15, 14, 13, 12, 11, 12],
    week: [11, 12, 13, 14, 15, 13, 12]
  }
};

const FarmManagement = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFarm, setCurrentFarm] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('list');
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [environmentDataType, setEnvironmentDataType] = useState('today');

  // 获取渔场列表
  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      // 从本地存储获取数据，如果没有则使用模拟数据
      const storedFarms = localStorage.getItem('farms');
      const farmsData = storedFarms ? JSON.parse(storedFarms) : mockFarms;
      setFarms(farmsData);
      setLoading(false);
      
      // 如果是首次加载，将模拟数据保存到本地存储
      if (!storedFarms) {
        localStorage.setItem('farms', JSON.stringify(mockFarms));
      }
    }, 500);
  };

  // 打开新增/编辑模态框
  const showModal = (farm = null) => {
    setCurrentFarm(farm);
    form.resetFields();
    
    if (farm) {
      form.setFieldsValue({
        name: farm.name,
        location: farm.location,
        area: farm.area,
        waterType: farm.waterType,
        fishTypes: farm.fishTypes,
        status: farm.status
      });
    }
    
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = (values) => {
    const farmsData = [...farms];
    
    if (currentFarm) {
      // 更新现有渔场
      const index = farmsData.findIndex(farm => farm.id === currentFarm.id);
      if (index !== -1) {
        farmsData[index] = {
          ...currentFarm,
          ...values,
          updatedAt: new Date().toISOString()
        };
        message.success('渔场信息更新成功');
      }
    } else {
      // 添加新渔场
      const newFarm = {
        ...values,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: values.status || 'active'
      };
      farmsData.push(newFarm);
      message.success('渔场添加成功');
    }
    
    // 更新状态和本地存储
    setFarms(farmsData);
    localStorage.setItem('farms', JSON.stringify(farmsData));
    setModalVisible(false);
  };

  // 删除渔场
  const handleDelete = (id) => {
    const updatedFarms = farms.filter(farm => farm.id !== id);
    setFarms(updatedFarms);
    localStorage.setItem('farms', JSON.stringify(updatedFarms));
    message.success('渔场删除成功');
  };

  // 查看渔场详情
  const viewFarmDetails = (farmId) => {
    setSelectedFarmId(farmId);
    setActiveTab('details');
  };

  // 获取水质类型名称
  const getWaterTypeName = (type) => {
    const types = {
      'freshwater': '淡水',
      'saltwater': '海水',
      'brackish': '半咸水'
    };
    return types[type] || type;
  };

  // 获取状态标签颜色
  const getStatusColor = (status) => {
    const colors = {
      'active': 'green',
      'inactive': 'red',
      'maintenance': 'orange'
    };
    return colors[status] || 'blue';
  };

  // 获取状态名称
  const getStatusName = (status) => {
    const statuses = {
      'active': '运行中',
      'inactive': '已停用',
      'maintenance': '维护中'
    };
    return statuses[status] || status;
  };

  // 渔场列表表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '渔场名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      key: 'area',
      render: (text) => text.toLocaleString()
    },
    {
      title: '水质类型',
      dataIndex: 'waterType',
      key: 'waterType',
      render: (text) => getWaterTypeName(text)
    },
    {
      title: '养殖品种',
      dataIndex: 'fishTypes',
      key: 'fishTypes',
      render: (fishTypes) => (
        <span>{fishTypes.join(', ')}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: getStatusColor(status) }}>
          {getStatusName(status)}
        </span>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => viewFarmDetails(record.id)}
          >
            查看
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此渔场吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 环境数据图表配置
  const getChartOption = (dataType) => {
    const timeLabels = dataType === 'today' 
      ? ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
      : ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['温度(°C)', 'PH值', '溶解氧(mg/L)', '浊度(NTU)'] },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: timeLabels },
      yAxis: { type: 'value' },
      series: [
        { 
          name: '温度(°C)', 
          type: 'line', 
          data: mockEnvironmentData.temperature[dataType],
          smooth: true
        },
        { 
          name: 'PH值', 
          type: 'line', 
          data: mockEnvironmentData.ph[dataType],
          smooth: true 
        },
        { 
          name: '溶解氧(mg/L)', 
          type: 'line', 
          data: mockEnvironmentData.oxygen[dataType],
          smooth: true 
        },
        { 
          name: '浊度(NTU)', 
          type: 'line', 
          data: mockEnvironmentData.turbidity[dataType],
          smooth: true 
        }
      ]
    };
  };

  // 渔场详情组件
  const FarmDetails = () => {
    const farm = farms.find(f => f.id === selectedFarmId);
    
    if (!farm) {
      return <div>未找到渔场信息</div>;
    }
    
    return (
      <div>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>{farm.name} - 详细信息</Title>
          <Button type="primary" onClick={() => setActiveTab('list')}>返回列表</Button>
        </div>
        
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <Text strong>渔场ID：</Text> {farm.id}
            </div>
            <div>
              <Text strong>渔场名称：</Text> {farm.name}
            </div>
            <div>
              <Text strong>位置：</Text> {farm.location}
            </div>
            <div>
              <Text strong>面积：</Text> {farm.area.toLocaleString()} ㎡
            </div>
            <div>
              <Text strong>水质类型：</Text> {getWaterTypeName(farm.waterType)}
            </div>
            <div>
              <Text strong>状态：</Text> 
              <span style={{ color: getStatusColor(farm.status) }}>
                {getStatusName(farm.status)}
              </span>
            </div>
            <div>
              <Text strong>养殖品种：</Text> {farm.fishTypes.join(', ')}
            </div>
            <div>
              <Text strong>创建时间：</Text> {new Date(farm.createdAt).toLocaleString()}
            </div>
          </div>
        </Card>
        
        <Card 
          title="环境监测数据" 
          extra={
            <Select 
              defaultValue="today" 
              style={{ width: 120 }} 
              onChange={setEnvironmentDataType}
            >
              <Option value="today">今日数据</Option>
              <Option value="week">本周数据</Option>
            </Select>
          }
        >
          <ReactECharts option={getChartOption(environmentDataType)} style={{ height: 400 }} />
        </Card>
      </div>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="渔场列表" key="list">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4}>渔场管理</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
            >
              添加渔场
            </Button>
          </div>
          
          <Table 
            columns={columns} 
            dataSource={farms} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="渔场详情" key="details" disabled={!selectedFarmId}>
          <FarmDetails />
        </TabPane>
      </Tabs>

      <Modal
        title={currentFarm ? "编辑渔场" : "添加渔场"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            waterType: 'freshwater',
            status: 'active',
            fishTypes: []
          }}
        >
          <Form.Item
            name="name"
            label="渔场名称"
            rules={[{ required: true, message: '请输入渔场名称' }]}
          >
            <Input placeholder="请输入渔场名称" />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="位置"
            rules={[{ required: true, message: '请输入渔场位置' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="请输入渔场位置" />
          </Form.Item>
          
          <Form.Item
            name="area"
            label="面积(㎡)"
            rules={[{ required: true, message: '请输入渔场面积' }]}
          >
            <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入渔场面积" />
          </Form.Item>
          
          <Form.Item
            name="waterType"
            label="水质类型"
            rules={[{ required: true, message: '请选择水质类型' }]}
          >
            <Select placeholder="请选择水质类型">
              <Option value="freshwater">淡水</Option>
              <Option value="saltwater">海水</Option>
              <Option value="brackish">半咸水</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="fishTypes"
            label="养殖品种"
            rules={[{ required: true, message: '请选择养殖品种' }]}
          >
            <Select mode="tags" placeholder="请输入养殖品种">
              <Option value="草鱼">草鱼</Option>
              <Option value="鲤鱼">鲤鱼</Option>
              <Option value="鲫鱼">鲫鱼</Option>
              <Option value="黑鱼">黑鱼</Option>
              <Option value="鲈鱼">鲈鱼</Option>
              <Option value="金鲳">金鲳</Option>
              <Option value="石斑鱼">石斑鱼</Option>
              <Option value="龙虾">龙虾</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择渔场状态' }]}
          >
            <Select placeholder="请选择渔场状态">
              <Option value="active">运行中</Option>
              <Option value="inactive">已停用</Option>
              <Option value="maintenance">维护中</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              {currentFarm ? '更新' : '添加'}
            </Button>
            <Button onClick={() => setModalVisible(false)}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FarmManagement;