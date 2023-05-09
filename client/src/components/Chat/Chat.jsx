import {
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.jpg";
import moment from "moment";

const Chat = ({ chat }) => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Link
      style={{ textDecoration: "none", color: "inherit" }}
      to={`/messages?id=${chat.withId}`}
    >
      <ListItem disablePadding>
        <ListItemButton
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              paddingBlock: "0.2rem",
            }}
          >
            <Avatar src={chat.withPfp ? chat.withPfp : defaultPfp} />
            <Box
              sx={{
                // backgroundColor: "blue",
                width: "70%",
                maxWidth: "100%",
                display: "block",
                paddingInline: "1rem",
                wordBreak: "break-word",
              }}
            >
              <Typography>{chat.withName}</Typography>
              <Typography
                sx={{
                  opacity: "70%",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  width: "160px",
                  whiteSpace: "nowrap",
                }}
              >
                {chat.data[chat.data.length - 1].image
                  ? "image"
                  : chat.data[chat.data.length - 1].file
                  ? "file"
                  : chat.data[chat.data.length - 1].text}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.67rem", width: "30%" }}>
              {chat.sentAt === "Sending..."
                ? "Sending..."
                : moment(chat.sentAt).fromNow()}
            </Typography>
          </Box>
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default Chat;
