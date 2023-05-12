import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const MyGroup = ({ group, drawer }) => {
  return (
    <Link
      to={`/group/${group._id}`}
      style={{
        textDecoration: "none",
        color: "white",
      }}
    >
      <Box
        sx={{
          // minWidth: drawer ? "300px" : "auto",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "10px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          position: "relative",
          marginTop: "10px",
          wordBreak: "break-word",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          },
          transition: "0.2s",
        }}
      >
        {group.name}
      </Box>
    </Link>
  );
};

export default MyGroup;
