import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import userReducer from "@/redux/slices/userSlice";
import studentReducer from "@/redux/slices/studentSlice";
import adminReducer from "@/redux/slices/adminSlice";
import dashboardReducer from "@/redux/slices/dashboardSlice";
import notificationReducer from "@/redux/slices/notificationSlice";
import themeReducer from "@/redux/slices/themeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  student: studentReducer,
  admin: adminReducer,
  dashboard: dashboardReducer,
  notification: notificationReducer,
  theme: themeReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
