import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    email: ''
  },
  reducers: {
    authLogin: (state, action) => {
        state.isLoggedIn = action.payload;
    },
  },
});

export const { authLogin } = authSlice.actions;
export default authSlice.reducer;
