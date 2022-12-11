import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css"; /* !important! must be after import of App */
import { api } from "../features/api";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import videoReducer from "../features/video";
import viewReducer from "../features/view";
import sourceReducer from "../features/source";

const store = configureStore({
  reducer: {
    video: videoReducer,
    view: viewReducer,
    source: sourceReducer,
    //
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
