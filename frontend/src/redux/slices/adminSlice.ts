import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PlatformSettings } from "@/types/admin";

export interface AdminState {
  platformSettings: PlatformSettings | null;
  unreadNotificationCount: number;
}

const initialState: AdminState = {
  platformSettings: null,
  unreadNotificationCount: 0,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setPlatformSettings: (state, action: PayloadAction<PlatformSettings>) => {
      state.platformSettings = action.payload;
    },
    setAdminUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadNotificationCount = action.payload;
    },
    decrementAdminUnreadCount: (state) => {
      state.unreadNotificationCount = Math.max(0, state.unreadNotificationCount - 1);
    },
  },
});

export const { setPlatformSettings, setAdminUnreadCount, decrementAdminUnreadCount } =
  adminSlice.actions;

export default adminSlice.reducer;
