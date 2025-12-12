import { configureStore } from '@reduxjs/toolkit';
import thoughtsReducer from './thoughts/likeThought';

export const store = configureStore({
  reducer: {
    thoughts: thoughtsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
