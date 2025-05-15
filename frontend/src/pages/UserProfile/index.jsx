import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Avatar, Select, message, Divider, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile, updateUserRole } from '../../redux/reducers/authSlice';
import { USER_ROLES } from '../../services/authService';

const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        displayName: user.displayName || user.username,
        role: user.role || USER_ROLES.USER
      });
    }
  }, [user, form]);

  const handleSubmit = (values) => {
    // 更新用户信息
    const updatedUser = {
      ...user,
      displayName: values.displayName,
      email: values.email
    };

    dispatch(updateUserProfile(updatedUser));
    message.success('个人信息更新成功');
    setIsEditing(false);
  };

  const getRoleName = (role) => {
    const roleNames = {
      [USER_ROLES.USER]: '普通用户',
      [USER_ROLES.FARMER]: '养殖户',
      [USER_ROLES.ADMIN]: '管理员'
    };
    return roleNames[role] || '未知角色';
  };

  if (!user) {
    return (
      <Card style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
        <Text>请先登录</Text>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
            <div>
              <Title level={4}>{user.displayName || user.username}</Title>
              <Text type="secondary">{getRoleName(user.role)}</Text>
            </div>
          </div>
        }
        extra={
          <Button type="link" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '取消' : '编辑'}
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            username: user.username,
            email: user.email,
            displayName: user.displayName || user.username,
            role: user.role || USER_ROLES.USER
          }}
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
            <Input prefix={<UserOutlined />} disabled={!isEditing} />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} disabled={!isEditing} />
          </Form.Item>

          <Form.Item
            label="用户角色"
            name="role"
          >
            <Select disabled>
              <Option value={USER_ROLES.USER}>普通用户</Option>
              <Option value={USER_ROLES.FARMER}>养殖户</Option>
              <Option value={USER_ROLES.ADMIN}>管理员</Option>
            </Select>
          </Form.Item>

          {isEditing && (
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={loading}
              >
                保存修改
              </Button>
            </Form.Item>
          )}

          <Divider />

          <div style={{ marginTop: 16 }}>
            <Title level={5}>安全设置</Title>
            <Button type="link" disabled={!isEditing}>
              修改密码
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserProfile;