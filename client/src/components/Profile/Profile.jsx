import { Stack } from "@mui/material";
import React from "react";
import ProfileBox from "./ProfileBox/ProfileBox";
import Messages from "../Messages/Messages";

const Profile = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <ProfileBox />
      <Messages />
    </Stack>
  );
};

export default Profile;
