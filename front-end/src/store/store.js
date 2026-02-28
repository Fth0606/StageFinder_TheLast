import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stagesReducer from './slices/stagesSlice';
import userReducer from './slices/userSlice';
import companyReducer from './slices/companySlice';
import adminReducer from './slices/adminSlice';
import messagesReducer from './slices/messagesSlice'; // ✅ NOUVEAU

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stages: stagesReducer,
    user: userReducer,
    company: companyReducer,
    admin: adminReducer,
    messages: messagesReducer, // ✅ NOUVEAU
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      ignoredActions: ['messages/addMessageToConversation'],
      ignoredPaths: ['messages.activeConversation'],
    }),
});

export default store;
