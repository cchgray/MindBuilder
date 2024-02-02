import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Update this import to your actual reducers

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(/* ...your middlewares */),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
