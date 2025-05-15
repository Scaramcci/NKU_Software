import { createSlice } from '@reduxjs/toolkit';
import { USER_ROLES } from '../../services/authService';

// 检查本地存储中是否有用户信息和token
const token = localStorage.getItem('authToken');
const userStr = localStorage.getItem('currentUser');
let user = null;

try {
  user = userStr ? JSON.parse(userStr) : null;
} catch (e) {
  // 解析错误时清除本地存储
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}

const initialState = {
  isAuthenticated: !!token && !!user,
  user: user,
  token: token,
  loading: false,
  error: null,
  registering: false,
  registerError: null,
  userRole: user?.role || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userRole = action.payload.user.role || USER_ROLES.USER;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.registering = true;
      state.registerError = null;
    },
    registerSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userRole = action.payload.user.role || USER_ROLES.USER;
      state.registering = false;
      state.registerError = null;
    },
    registerFailure: (state, action) => {
      state.registering = false;
      state.registerError = action.payload;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('currentUser', JSON.stringify(state.user));
    },
    updateUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
        state.userRole = action.payload;
        localStorage.setItem('currentUser', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.userRole = null;
      state.loading = false;
      state.error = null;
      state.registering = false;
      state.registerError = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, updateUserProfile, updateUserRole, logout } = authSlice.actions;
export default authSlice.reducer;