import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stagesReducer from './slices/stagesSlice';
import userReducer from './slices/userSlice';
import companyReducer from './slices/companySlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stages: stagesReducer,
    user: userReducer,
    company: companyReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      ignoredActions: [],
      ignoredPaths: [],
    }),
});

export default store;
