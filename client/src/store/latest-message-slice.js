import { createSlice } from "@reduxjs/toolkit";

const latestMessageSlice = createSlice({
  name: "latestMessage",
  initialState: {},
  reducers: {
    updateLatestMessage: (state, action) => {
      state.message = action.payload[0];
    },
  },
});

export const { updateLatestMessage } = latestMessageSlice.actions;
export default latestMessageSlice.reducer;
