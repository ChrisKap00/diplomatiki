import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/actions/groups";
import Messages from "../Messages/Messages";
import MyGroups from "../MyGroups/MyGroups";
import Posts from "../Posts/Posts";

const Home = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGroups());
  }, []);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <MyGroups open={open} setOpen={setOpen}/>
      <Posts open={open} setOpen={setOpen}/>
      <Messages />
    </Stack>
  );
};

export default Home;
