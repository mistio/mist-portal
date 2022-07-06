import { configureStore } from '@reduxjs/toolkit';
import configReducer from './slices/config.js';
import sectionsReducer from './slices/sections.js';
import authReducer from './slices/auth.js';
import orgReducer from './slices/org.js';

export const store = configureStore({
  reducer: {
    config: configReducer,
    sections: sectionsReducer,
    auth: authReducer,
    org: orgReducer,
  },
});
