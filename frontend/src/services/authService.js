import api from './api';

// 用户角色常量
export const USER_ROLES = {
  USER: 'user',         // 普通用户
  FARMER: 'farmer',     // 养殖户
  ADMIN: 'admin'        // 管理员
};

// 登录服务
export const login = async (credentials) => {
  try {
    // 实际项目中应该调用后端API
    // return await api.post('/auth/login', credentials);
    
    // 模拟API调用
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const user = usersData.find(u => 
      u.username === credentials.username && 
      u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('用户名或密码错误');
    }
    
    // 创建包含用户角色的响应
    const response = {
      user: {
        id: user.id || Date.now(),
        username: user.username,
        email: user.email,
        role: user.role || USER_ROLES.USER, // 默认为普通用户
        displayName: user.displayName || user.username
      },
      token: `jwt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    };
    
    return response;
  } catch (error) {
    throw error;
  }
};

// 注册服务
export const register = async (userData) => {
  try {
    // 实际项目中应该调用后端API
    // return await api.post('/auth/register', userData);
    
    // 模拟API调用
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    
    // 检查用户名是否已存在
    if (usersData.some(user => user.username === userData.username)) {
      throw new Error('用户名已存在');
    }
    
    // 创建新用户，默认为普通用户角色
    const newUser = {
      id: Date.now(),
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: userData.role || USER_ROLES.USER,
      displayName: userData.displayName || userData.username,
      createdAt: new Date().toISOString()
    };
    
    // 保存到本地存储
    usersData.push(newUser);
    localStorage.setItem('users', JSON.stringify(usersData));
    
    // 创建响应
    const response = {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        displayName: newUser.displayName
      },
      token: `jwt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    };
    
    return response;
  } catch (error) {
    throw error;
  }
};

// 获取当前用户信息
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

// 检查用户是否有特定角色
export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role;
};

// 检查用户是否有权限访问
export const checkPermission = (user, requiredRoles) => {
  if (!user) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(user.role);
};

// 退出登录
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};