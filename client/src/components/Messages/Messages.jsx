import { Box } from "@mui/material";
import React from "react";
import MessagesBox from "./MessagesBox/MessagesBox";
import { useLocation } from "react-router-dom";

const Messages = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: location.pathname.split("/")[1] === "post" ? "block" : "none",
          xl: "block",
        },
        position: "sticky",
        top: "64px",
        height: "calc(100vh - 70px)",
      }}
      flex={2}
      paddingTop={2}
    >
      <MessagesBox />
    </Box>
  );
};

export default Messages;
