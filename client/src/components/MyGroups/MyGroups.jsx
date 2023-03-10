import { Box } from "@mui/material";
import React from "react";

const MyGroups = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "red",
        display: { xs: "none", md: "block" },
        position: "sticky",
        top: "64px",
        height: "calc(100vh - 70px)",
      }}
      flex={2}
      paddingY={2}
    >
      My Groups
    </Box>
  );
};

export default MyGroups;
