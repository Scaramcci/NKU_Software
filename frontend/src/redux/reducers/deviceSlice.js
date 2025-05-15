import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import deviceService from '../../services/deviceService';

// 异步获取设备列表
export const fetchDevices = createAsyncThunk(
  'device/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deviceService.getDevices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取设备列表失败');
    }
  }
);

// 异步获取设备状态
export const fetchDeviceStatus = createAsyncThunk(
  'device/fetchDeviceStatus',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await deviceService.getDeviceStatus(deviceId);
      return { id: deviceId, status: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取设备状态失败');
    }
  }
);

// 异步控制设备
export const controlDevice = createAsyncThunk(
  'device/controlDevice',
  async ({ deviceId, action }, { rejectWithValue }) => {
    try {
      const response = await deviceService.controlDevice(deviceId, action);
      return { id: deviceId, result: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || '设备控制操作失败');
    }
  }
);

const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    devices: [],
    loading: false,
    error: null,
    controlStatus: {}
  },
  reducers: {
    clearDeviceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取设备列表
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取设备列表失败';
      })
      
      // 获取设备状态
      .addCase(fetchDeviceStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const deviceIndex = state.devices.findIndex(device => device.id === id);
        if (deviceIndex !== -1) {
          state.devices[deviceIndex].status = status;
        }
      })
      .addCase(fetchDeviceStatus.rejected, (state, action) => {
        state.error = action.payload || '获取设备状态失败';
      })
      
      // 控制设备
      .addCase(controlDevice.pending, (state, action) => {
        const { deviceId } = action.meta.arg;
        state.controlStatus[deviceId] = 'pending';
      })
      .addCase(controlDevice.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.controlStatus[id] = 'success';
        // 更新设备状态
        const deviceIndex = state.devices.findIndex(device => device.id === id);
        if (deviceIndex !== -1) {
          // 假设控制成功后，设备状态会相应变化
          // 实际应用中可能需要重新获取设备状态
        }
      })
      .addCase(controlDevice.rejected, (state, action) => {
        const { deviceId } = action.meta.arg;
        state.controlStatus[deviceId] = 'failed';
        state.error = action.payload || '设备控制操作失败';
      });
  }
});

export const { clearDeviceError } = deviceSlice.actions;
export default deviceSlice.reducer;