import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "video",

  initialState: {
    video: null,
    genre: "All",
    title: "",
    audio: 1, //german: 1, english: 2
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
    selectAudio: (state, action) => {
      state.audio = action.payload;
    },
  },
});

export const {
  selectVideo,
  selectGenre,
  selectTitle,
  selectAudio,
} = videoSlice.actions;
export default videoSlice.reducer;
