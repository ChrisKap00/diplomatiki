import { configureStore } from "@reduxjs/toolkit";
import theme from "./reducers/theme";
import auth from "./reducers/auth";

const store = configureStore({
  reducer: { theme, auth },
});

export default store;
