import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 环境监测数据
  temperature: [],
  ph: [],
  oxygen: [],
  devices: {
    aerator: false,
    feeder: false
  },
  // 渔场管理数据
  farms: [],
  currentFarm: null,
  environmentData: {
    temperature: [],
    ph: [],
    oxygen: [],
    turbidity: []
  },
  environmentDataLoading: false,
  loading: false,
  error: null
};

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    // 原有的环境监测相关
    updateFarmData: (state, action) => {
      const { temperature, ph, oxygen } = action.payload;
      state.temperature = temperature;
      state.ph = ph;
      state.oxygen = oxygen;
    },
    toggleDevice: (state, action) => {
      const { device } = action.payload;
      state.devices[device] = !state.devices[device];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // 渔场管理相关
    fetchFarmsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFarmsSuccess: (state, action) => {
      state.farms = action.payload;
      state.loading = false;
    },
    fetchFarmsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentFarm: (state, action) => {
      state.currentFarm = action.payload;
    },
    addFarm: (state, action) => {
      state.farms.push(action.payload);
      // 更新本地存储
      localStorage.setItem('farms', JSON.stringify(state.farms));
    },
    updateFarm: (state, action) => {
      const index = state.farms.findIndex(farm => farm.id === action.payload.id);
      if (index !== -1) {
        state.farms[index] = { ...state.farms[index], ...action.payload };
        // 如果当前选中的渔场被更新，也更新currentFarm
        if (state.currentFarm && state.currentFarm.id === action.payload.id) {
          state.currentFarm = { ...state.currentFarm, ...action.payload };
        }
        // 更新本地存储
        localStorage.setItem('farms', JSON.stringify(state.farms));
      }
    },
    deleteFarm: (state, action) => {
      state.farms = state.farms.filter(farm => farm.id !== action.payload);
      // 如果删除的是当前选中的渔场，清空currentFarm
      if (state.currentFarm && state.currentFarm.id === action.payload) {
        state.currentFarm = null;
      }
      // 更新本地存储
      localStorage.setItem('farms', JSON.stringify(state.farms));
    },
    // 环境数据相关
    fetchEnvironmentDataStart: (state) => {
      state.environmentDataLoading = true;
    },
    fetchEnvironmentDataSuccess: (state, action) => {
      state.environmentData = action.payload;
      state.environmentDataLoading = false;
    },
    fetchEnvironmentDataFailure: (state, action) => {
      state.environmentDataLoading = false;
      state.error = action.payload;
    },
    // 初始化从本地存储加载数据
    initializeFromLocalStorage: (state) => {
      try {
        const storedFarms = localStorage.getItem('farms');
        if (storedFarms) {
          state.farms = JSON.parse(storedFarms);
        }
      } catch (error) {
        console.error('从本地存储加载渔场数据失败:', error);
      }
    }
  }
});

export const { 
  updateFarmData, 
  toggleDevice, 
  setLoading, 
  setError,
  fetchFarmsStart,
  fetchFarmsSuccess,
  fetchFarmsFailure,
  setCurrentFarm,
  addFarm,
  updateFarm,
  deleteFarm,
  fetchEnvironmentDataStart,
  fetchEnvironmentDataSuccess,
  fetchEnvironmentDataFailure,
  initializeFromLocalStorage
} = farmSlice.actions;
export default farmSlice.reducer;