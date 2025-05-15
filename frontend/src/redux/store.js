import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import farmReducer from './reducers/farmSlice';
import deviceReducer from './reducers/deviceSlice';
import alarmReducer from './reducers/alarmSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    farm: farmReducer,
    device: deviceReducer,
    alarm: alarmReducer
  }
});