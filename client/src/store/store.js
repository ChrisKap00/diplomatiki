import { configureStore } from "@reduxjs/toolkit";
import theme from "./reducers/theme";
import auth from "./reducers/auth";
import groups from "./reducers/groups";
import posts from "./reducers/posts";
import messages from "./reducers/messages";

const store = configureStore({
  reducer: { theme, auth, groups, posts, messages },
});

export default store;
