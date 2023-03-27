import { configureStore } from "@reduxjs/toolkit";
import theme from "./reducers/theme";
import auth from "./reducers/auth";
import groups from "./reducers/groups";

const store = configureStore({
  reducer: { theme, auth, groups },
});

export default store;
