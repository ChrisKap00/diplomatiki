import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import defaultPfp from "../../../assets/defaultPfp.jpg";

const Member = ({ user }) => {
  return (
    <Link
      to={`/profile/${user._id}`}
      style={{ textDecoration: "none", color: "white" }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "10px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          position: "relative",
          marginBottom: "10px",
          wordBreak: "break-word",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          },
          transition: "0.2s",
          display: "flex",
          alignItems: "center",
          paddingBlock: "10px",
        }}
      >
        <Avatar src={user.pfp ? user.pfp : defaultPfp}></Avatar>
        <Typography sx={{ marginLeft: "15px" }}>
          {user.firstName} {user.lastName}
        </Typography>
      </Box>
    </Link>
  );
};

export default Member;
