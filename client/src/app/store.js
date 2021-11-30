import { configureStore } from '@reduxjs/toolkit';
import alertsReducer from '../features/alertsSlice';
import authReducer from '../features/authSlice';
import profileReducer from '../features/profileSlice';
import postsReducer from '../features/postsSlice';

export default configureStore({
  reducer: {
    alerts: alertsReducer,
    auth: authReducer,
    profile: profileReducer,
    posts: postsReducer,
  },
});
