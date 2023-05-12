import { FolderZip, InsertDriveFile } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";

const File = ({ file, senderId, withId }) => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          marginLeft: senderId !== withId ? "auto" : "0",
          maxWidth: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "10px",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          position: "relative",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          },
        }}
      >
        <div
          style={{
            position: "absolute",
            // backgroundColor: "red",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: "10px",
          }}
          onClick={() => {
            const anchor = document.createElement("a");
            anchor.download = file.name;
            anchor.href = file.base64;
            anchor.click();
          }}
        ></div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "75%",
          }}
        >
          {file.type === "zip" ? <FolderZip /> : <InsertDriveFile />}
          <Typography
            sx={{
              marginLeft: "5px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: "100%",
              whiteSpace: "nowrap",
              // backgroundColor: "red",
            }}
          >
            {file.name}
          </Typography>
        </Box>
        <Typography sx={{ width: "25%", textAlign: "right" }}>
          {file.size}
        </Typography>
      </Box>
    </>
  );
};

export default File;
