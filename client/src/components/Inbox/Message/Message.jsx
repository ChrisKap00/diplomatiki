import { FolderZip, InsertDriveFile } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const Message = ({ message, withId }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Box
      sx={{
        position: "relative",
        // backgroundColor: "green",
        // border: "1px solid yellow",
        padding: "5px 20px",
        opacity: message.sentAt === "Sending..." ? "45%" : "100%",
      }}
    >
      {message.text ? (
        <Box
          sx={{
            color: "white",
            backgroundColor:
              message.senderId !== withId
                ? "#1976D2"
                : "rgba(255, 255, 255, 0.15)",
            width: "fit-content",
            maxWidth: "50%",
            postition: "absolute",
            marginLeft: message.senderId !== withId ? "auto" : "0",
            padding: "5px 15px",
            borderRadius: "20px",
            wordBreak: "break-word",
          }}
        >
          {message.text}
        </Box>
      ) : message.image ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              message.senderId === withId ? "flex-start" : "flex-end",
          }}
        >
          <img
            src={message.image}
            style={{
              width: "fit-content",
              maxWidth: "50%",
              right: 0,
              borderRadius: "20px",
              cursor: "pointer",
            }}
          ></img>
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            marginLeft: message.senderId !== withId ? "auto" : "0",
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
              anchor.download = message.file.name;
              anchor.href = message.file.base64;
              anchor.click();
            }}
          ></div>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {message.file.type === "zip" ? <FolderZip /> : <InsertDriveFile />}
            <Typography sx={{ marginLeft: "5px" }}>
              {message.file.name}
            </Typography>
          </Box>
          <Typography>{message.file.size}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Message;
