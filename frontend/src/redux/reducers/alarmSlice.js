import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import alarmService from '../../services/alarmService';

// 异步 thunk actions
export const fetchAlarms = createAsyncThunk(
  'alarms/fetchAlarms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alarmService.getAlarms();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取预警列表失败');
    }
  }
);

export const fetchAlarmsByFarm = createAsyncThunk(
  'alarms/fetchAlarmsByFarm',
  async (farmId, { rejectWithValue }) => {
    try {
      const response = await alarmService.getAlarmsByFarm(farmId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取养殖场预警失败');
    }
  }
);

export const acknowledgeAlarm = createAsyncThunk(
  'alarms/acknowledgeAlarm',
  async (alarmId, { rejectWithValue }) => {
    try {
      const response = await alarmService.acknowledgeAlarm(alarmId);
      return { alarmId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || '确认预警失败');
    }
  }
);

export const fetchThresholds = createAsyncThunk(
  'alarms/fetchThresholds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alarmService.getThresholds();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取阈值设置失败');
    }
  }
);

export const updateThreshold = createAsyncThunk(
  'alarms/updateThreshold',
  async ({ thresholdId, updates }, { rejectWithValue }) => {
    try {
      const response = await alarmService.updateThreshold(thresholdId, updates);
      return { thresholdId, updates, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || '更新阈值设置失败');
    }
  }
);

export const fetchAlarmHistory = createAsyncThunk(
  'alarms/fetchAlarmHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alarmService.getAlarmHistory();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '获取预警历史记录失败');
    }
  }
);

const alarmSlice = createSlice({
  name: 'alarms',
  initialState: {
    alarms: [],
    thresholds: [],
    alarmHistory: [],
    loading: false,
    error: null,
    success: false,
    message: ''
  },
  reducers: {
    clearAlarmState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取预警列表
      .addCase(fetchAlarms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlarms.fulfilled, (state, action) => {
        state.loading = false;
        state.alarms = action.payload;
      })
      .addCase(fetchAlarms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取预警列表失败';
      })
      
      // 获取养殖场预警
      .addCase(fetchAlarmsByFarm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlarmsByFarm.fulfilled, (state, action) => {
        state.loading = false;
        state.alarms = action.payload;
      })
      .addCase(fetchAlarmsByFarm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取养殖场预警失败';
      })
      
      // 确认预警
      .addCase(acknowledgeAlarm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acknowledgeAlarm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || '预警已确认';
        // 更新预警状态
        const index = state.alarms.findIndex(alarm => alarm.id === parseInt(action.payload.alarmId));
        if (index !== -1) {
          state.alarms[index].acknowledged = true;
        }
      })
      .addCase(acknowledgeAlarm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '确认预警失败';
      })
      
      // 获取阈值设置
      .addCase(fetchThresholds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThresholds.fulfilled, (state, action) => {
        state.loading = false;
        state.thresholds = action.payload;
      })
      .addCase(fetchThresholds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取阈值设置失败';
      })
      
      // 更新阈值设置
      .addCase(updateThreshold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateThreshold.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || '阈值设置已更新';
        // 更新阈值设置
        const index = state.thresholds.findIndex(threshold => threshold.id === parseInt(action.payload.thresholdId));
        if (index !== -1) {
          state.thresholds[index] = { ...state.thresholds[index], ...action.payload.updates };
        }
      })
      .addCase(updateThreshold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '更新阈值设置失败';
      })
      
      // 获取预警历史记录
      .addCase(fetchAlarmHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlarmHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.alarmHistory = action.payload;
      })
      .addCase(fetchAlarmHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取预警历史记录失败';
      });
  }
});

export const { clearAlarmState } = alarmSlice.actions;
export default alarmSlice.reducer;