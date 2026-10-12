import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AnalyticsDateRange = "7d" | "30d" | "90d" | "1y";

/**
 * Generic dashboard-shell UI state shared across roles (Student,
 * Company, Admin), independent of any one role's domain data.
 * `DashboardLayout` currently manages its own sidebar-collapsed state
 * locally; this slice exists so future dashboard widgets/pages can
 * read and persist shared UI preferences (date range filters, last
 * visited section, etc.) through Redux instead of prop-drilling.
 */
export interface DashboardState {
  sidebarCollapsed: boolean;
  analyticsDateRange: AnalyticsDateRange;
  lastVisitedRoute: string | null;
}

const initialState: DashboardState = {
  sidebarCollapsed: false,
  analyticsDateRange: "30d",
  lastVisitedRoute: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setAnalyticsDateRange: (state, action: PayloadAction<AnalyticsDateRange>) => {
      state.analyticsDateRange = action.payload;
    },
    setLastVisitedRoute: (state, action: PayloadAction<string>) => {
      state.lastVisitedRoute = action.payload;
    },
  },
});

export const {
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  setAnalyticsDateRange,
  setLastVisitedRoute,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
