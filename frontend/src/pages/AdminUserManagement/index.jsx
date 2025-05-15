import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space, Popconfirm } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import { USER_ROLES } from '../../services/authService';

const { Option } = Select;

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 获取所有用户
  const fetchUsers = () => {
    setLoading(true);
    try {
      // 从本地存储获取用户数据
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(usersData);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 打开编辑模态框
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role || USER_ROLES.USER,
      displayName: user.displayName || user.username
    });
    setModalVisible(true);
  };

  // 删除用户
  const handleDelete = (userId) => {
    try {
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = usersData.filter(user => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      message.success('用户删除成功');
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  // 提交表单
  const handleSubmit = (values) => {
    try {
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = usersData.map(user => {
        if (user.id === editingUser.id) {
          return {
            ...user,
            ...values,
            updatedAt: new Date().toISOString()
          };
        }
        return user;
      });

      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      message.success('用户信息更新成功');
      setModalVisible(false);
    } catch (error) {
      message.error('更新用户信息失败');
    }
  };

  // 获取角色标签颜色
  const getRoleTagColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'red';
      case USER_ROLES.FARMER:
        return 'green';
      case USER_ROLES.USER:
        return 'blue';
      default:
        return 'default';
    }
  };

  // 获取角色名称
  const getRoleName = (role) => {
    const roleNames = {
      [USER_ROLES.USER]: '普通用户',
      [USER_ROLES.FARMER]: '养殖户',
      [USER_ROLES.ADMIN]: '管理员'
    };
    return roleNames[role] || '未知角色';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text, record) => text || record.username
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleTagColor(role)}>
          {getRoleName(role)}
        </Tag>
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
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此用户吗？"
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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>用户管理</h2>
        <Button type="primary" onClick={() => fetchUsers()}>刷新列表</Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={users.map(user => ({ ...user, key: user.id }))} 
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />

      <Modal
        title="编辑用户"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="用户名"
            name="username"
          >
            <Input prefix={<UserOutlined />} disabled />
          </Form.Item>

          <Form.Item
            label="显示名称"
            name="displayName"
            rules={[{ required: true, message: '请输入显示名称' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择用户角色' }]}
          >
            <Select>
              <Option value={USER_ROLES.USER}>普通用户</Option>
              <Option value={USER_ROLES.FARMER}>养殖户</Option>
              <Option value={USER_ROLES.ADMIN}>管理员</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button onClick={() => setModalVisible(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUserManagement;