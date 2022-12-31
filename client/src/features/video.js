import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "video",

  initialState: {
    video: null,
    genre: "All",
    title: "",
  },

  reducers: {
    selectVideo: (state, action) => {
      state.video = action.payload;
    },
    selectGenre: (state, action) => {
      state.genre = action.payload;
    },
    selectTitle: (state, action) => {
      state.title = action.payload;
    },
  },
});

export const { selectVideo, selectGenre, selectTitle } = videoSlice.actions;
export default videoSlice.reducer;
