import { Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import MyGroup from "./MyGroup/MyGroup";

const groups = [
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
  "frwsfvfsfevfs",
  "TEST NAME",
  "LONG TEST NAME GSRRZVSECR 45W4QD3WWERCZSECERCWER 3AWX",
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
        overflow: "auto",
        paddingRight: "10px",
      }}
      flex={2}
      paddingY={2}
    >
      <Typography variant="h5" sx={{ fontWeight: "600" }}>
        Οι ομάδες μου
      </Typography>
      {groups.map((group, index) => (
        <MyGroup key={index} name={group} />
      ))}
    </Box>
  );
};

export default MyGroups;
