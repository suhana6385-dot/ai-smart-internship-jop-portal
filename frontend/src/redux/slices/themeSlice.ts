import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

/**
 * IMPORTANT: The app's actual dark/light mode is driven by
 * `src/context/ThemeContext.tsx` (`useTheme()`), which every existing
 * layout and component (Navbar, Sidebar, AuthLayout, DashboardLayout,
 * AppToaster, ...) already reads from and toggles the `dark` class on
 * `<html>` accordingly. That remains the single source of truth.
 *
 * This slice is provided so non-component logic or future
 * Redux-connected code can read/react to theme via `useSelector`
 * without importing the context hook. Nothing currently writes to
 * this slice automatically — if you use it, keep it in sync with
 * ThemeContext yourself (e.g. call `setTheme` wherever you already
 * call the context's `toggleTheme`) rather than treating this as an
 * independent switch.
 */
export interface ThemeState {
  value: Theme;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const initialState: ThemeState = {
  value: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.value = action.payload;
    },
    toggleTheme: (state) => {
      state.value = state.value === "light" ? "dark" : "light";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
