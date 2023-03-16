import { Box } from "@mui/material";
import React from "react";

const Messages = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // backgroundColor: "yellow",
        display: { xs: "none", xl: "block" },
        position: "sticky",
        top: "64px",
        height: "calc(100vh - 70px)",
      }}
      flex={2}
      paddingY={2}
    >
      Messages
    </Box>
  );
};

export default Messages;
