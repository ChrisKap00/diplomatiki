import { FolderZip, InsertDriveFile } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import File from "../../File/File";

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
        <File file={message.file} senderId={message.senderId} withId={withId} />
      )}
    </Box>
  );
};

export default Message;
