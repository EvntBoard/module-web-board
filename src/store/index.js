import { configureStore } from "@reduxjs/toolkit";

import boardMiddleware from "./board/middleware";
import boardReducer from "./board"

const store = configureStore({
  reducer: {
    board: boardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(boardMiddleware),
});

export default store;
