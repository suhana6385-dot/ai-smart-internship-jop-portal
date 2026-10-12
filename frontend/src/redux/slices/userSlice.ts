import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types";

/**
 * `auth` slice owns session concerns: token, isAuthenticated, and the
 * user object as returned by the login/register response.
 *
 * This `user` slice owns the canonical profile entity for whoever is
 * currently signed in — the same shape, but meant to be updated
 * independently over the life of a session (e.g. after an avatar or
 * name change) without touching session state. Role-specific detail
 * (student profile, company profile, etc.) still lives in their own
 * slices; this is just the cross-role identity record.
 */
export interface UserState {
  current: AuthUser | null;
}

const initialState: UserState = {
  current: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<AuthUser>) => {
      state.current = action.payload;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.current) {
        state.current = { ...state.current, ...action.payload };
      }
    },
    clearCurrentUser: (state) => {
      state.current = null;
    },
  },
});

export const { setCurrentUser, updateCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
