import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "video",

  initialState: {
    video: null,
    nextVideo: null,
    genre: "All",
    title: "",
    search: "title",
    audio: 1, //german: 1, english: 2
  },

  reducers: {
    selectVideo: (state, action) => {
      state.video = action.payload;
    },
    selectNext: (state, action) => {
      state.nextVideo = action.payload;
    },
    selectGenre: (state, action) => {
      state.genre = action.payload;
    },
    selectTitle: (state, action) => {
      state.title = action.payload;
    },
    selectSearch: (state, action) => {
      state.search = action.payload;
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
  selectSearch,
  selectAudio,
} = videoSlice.actions;
export default videoSlice.reducer;
