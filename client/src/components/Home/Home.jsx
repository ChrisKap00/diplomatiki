import { Box, Stack } from "@mui/material";
import React from "react";
import Messages from "../Messages/Messages";
import MyGroups from "../MyGroups/MyGroups";
import Posts from "../Posts/Posts";

const Home = () => {
  return (
    <Stack direction="row" justifyContent="space-between">
      <MyGroups />
      <Posts />
      <Messages />
    </Stack>
  );
};

export default Home;
