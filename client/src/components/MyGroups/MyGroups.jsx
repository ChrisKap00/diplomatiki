import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MyGroup from "./MyGroup/MyGroup";

const MyGroups = () => {
  const { groups } = useSelector((state) => state.groups);
  const { user } = useSelector((state) => state.auth);
  return (
    <Box
      sx={{
        // display: { xs: "none", lg: "flex" },
        // flexDirection: "column",
        // alignItems: "center",
        display: { xs: "none", lg: "block" },
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
      {groups &&
        groups.map(
          (group, index) =>
            group.users.findIndex((e) => e._id === user.result._id) > -1 && (
              <MyGroup key={index} group={group} />
            )
        )}
    </Box>
  );
};

export default MyGroups;
