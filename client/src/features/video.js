import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "video",

  initialState: {
    video: null,
    next: null,
    genre: "All",
    title: "",
    audio: 1, //german: 1, english: 2
  },

  reducers: {
    selectVideo: (state, action) => {
      state.video = action.payload;
    },
    selectNext: (state, action) => {
      state.next = action.payload;
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
  selectNext,
  selectGenre,
  selectTitle,
  selectAudio,
} = videoSlice.actions;
export default videoSlice.reducer;
