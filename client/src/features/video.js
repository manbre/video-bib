import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "video",

  initialState: { video: null, type: "Movies", genre: "All", title: "" },

  reducers: {
    selectVideo: (state, action) => {
      state.video = action.payload;
    },
    selectType: (state, action) => {
      state.type = action.payload;
    },
    selectGenre: (state, action) => {
      state.genre = action.payload;
    },
    selectTitle: (state, action) => {
      state.title = action.payload;
    },
  },
});

export const {
  selectVideo,
  selectType,
  selectGenre,
  selectTitle,
} = videoSlice.actions;
export default videoSlice.reducer;
