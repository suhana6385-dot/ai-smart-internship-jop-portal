import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

/**
 * Generic in-app notification feed, independent of the role-specific
 * notification data already fetched via TanStack Query in the Student
 * and Admin modules (`useNotificationsQuery`, `useAdminNotificationsQuery`).
 * This slice is for client-originated, ephemeral notifications — e.g.
 * a background sync finishing, a websocket push, or a locally queued
 * action — that need to show up in a bell/dropdown without a network
 * round-trip.
 */
export interface NotificationState {
  items: AppNotification[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.items.unshift(action.payload);
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  markNotificationRead,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
