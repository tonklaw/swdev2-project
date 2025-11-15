import { configureStore, combineReducers } from "@reduxjs/toolkit";
import bookSlice from "./features/bookSlice";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const isServer = typeof window === "undefined";

const persistStorage = isServer
  ? {
      getItem(_key: string) {
        return Promise.resolve(null);
      },
      setItem(_key: string, value: string) {
        return Promise.resolve(value);
      },
      removeItem(_key: string) {
        return Promise.resolve();
      },
    }
  : storage;

const persistConfig = {
  key: "rootPersist",
  storage: persistStorage,
};

const rootReducer = combineReducers({
  bookSlice,
});

const reduxPersistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: reduxPersistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
