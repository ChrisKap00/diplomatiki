import { Box, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/actions/groups";
import Messages from "../Messages/Messages";
import MyGroups from "../MyGroups/MyGroups";
import Posts from "../Posts/Posts";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGroups());
  }, []);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <MyGroups />
      <Posts />
      <Messages />
    </Stack>
  );
};

export default Home;
