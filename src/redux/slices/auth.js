import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {
    authUpdated(state, action) {
      return {
        ...action.payload,
      };
    },
  },
});

export const { authUpdated } = authSlice.actions;
export default authSlice.reducer;
