import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    isEditor: false /* false: closed*/,
    viewType: 1 /* 1: Movies, 2: TVShows */,
    editorType: 1 /* 1: Movies, 2: TVShows */,
    isLoad: false,
    card: null,
    muted: true,
  },
  reducers: {
    toggleEditor: (state) => {
      state.isEditor = !state.isEditor;
    },
    toggleType: (state, action) => {
      state.viewType = action.payload;
    },
    toggleEditorType: (state, action) => {
      state.editorType = action.payload;
    },
    isLoad: (state, action) => {
      state.isLoad = action.payload;
    },
    markCard: (state, action) => {
      state.card = action.payload;
    },
    muteTrailer: (state, action) => {
      state.muted = action.payload;
    },
  },
});

export const {
  toggleEditor,
  toggleType,
  toggleEditorType,
  isLoad,
  markCard,
  muteTrailer,
} = viewSlice.actions;
export default viewSlice.reducer;
