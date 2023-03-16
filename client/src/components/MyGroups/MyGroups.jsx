import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const groups = [
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
];

const MyGroups = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // backgroundColor: "red",
        display: { xs: "none", md: "block" },
        position: "sticky",
        top: "64px",
        height: "calc(100vh - 70px)",
      }}
      flex={2}
      paddingY={2}
    >
      <Typography variant="h5" sx={{ fontWeight: "600" }}>
        Οι ομάδες μου
      </Typography>
      {groups.map((group, index) => (
        <Link key={index} style={{ textDecoration: "none", color: "white" }}>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderRadius: "10px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              position: "relative",
              marginTop: "10px",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              },
            }}
          >
            {group}
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default MyGroups;
