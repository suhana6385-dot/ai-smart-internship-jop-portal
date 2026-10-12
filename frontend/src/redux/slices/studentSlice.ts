import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ParsedResume, StudentProfile } from "@/types/student";

export interface StudentState {
  profile: StudentProfile | null;
  resume: ParsedResume | null;
  unreadNotificationCount: number;
}

const initialState: StudentState = {
  profile: null,
  resume: null,
  unreadNotificationCount: 0,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudentProfile: (state, action: PayloadAction<StudentProfile>) => {
      state.profile = action.payload;
    },
    updateStudentProfileFields: (state, action: PayloadAction<Partial<StudentProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setStudentResume: (state, action: PayloadAction<ParsedResume>) => {
      state.resume = action.payload;
    },
    setUnreadNotificationCount: (state, action: PayloadAction<number>) => {
      state.unreadNotificationCount = action.payload;
    },
    decrementUnreadNotificationCount: (state) => {
      state.unreadNotificationCount = Math.max(0, state.unreadNotificationCount - 1);
    },
  },
});

export const {
  setStudentProfile,
  updateStudentProfileFields,
  setStudentResume,
  setUnreadNotificationCount,
  decrementUnreadNotificationCount,
} = studentSlice.actions;

export default studentSlice.reducer;
