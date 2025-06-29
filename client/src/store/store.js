import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/api-slice";
import latestMessageReducer from "./latest-message-slice";
import { combineReducers } from "@reduxjs/toolkit";

const reducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  latestMessage: latestMessageReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
