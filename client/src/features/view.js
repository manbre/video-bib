import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    isEditor: false /* false: closed*/,
    viewType: 1 /* 1: Movies, 2: TVShows */,
    EditorType: 1 /* 1: Movies, 2: TVShows */,
  },
  reducers: {
    toggleEditor: (state) => {
      state.isEditor = !state.isEditor;
    },
    toggleType: (state, action) => {
      state.viewType = action.payload;
    },
    toggleEditorType: (state, action) => {
      state.EditorType = action.payload;
    },
  },
});

export const { toggleEditor, toggleType, toggleEditorType } = viewSlice.actions;
export default viewSlice.reducer;
