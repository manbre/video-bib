import { createSlice } from "@reduxjs/toolkit";

export const sourceSlice = createSlice({
  name: "source",

  initialState: { source: "" },

  reducers: {
    selectSource: (state, action) => {
      state.source = action.payload;
    },
  },
});

export const { selectSource } = sourceSlice.actions;
export default sourceSlice.reducer;
