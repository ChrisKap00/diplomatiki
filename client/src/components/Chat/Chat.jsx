import {
  Avatar,
  Box,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.jpg";
import moment from "moment";

const Chat = ({ chat }) => {
  const location = useLocation();
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
            backgroundColor:
              location.pathname.split("/")[1] === "messages" &&
              location.search &&
              location.search.substring(4) === chat.withId &&
              "rgba(255, 255, 255, 0.05)",
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
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                // backgroundColor: "green",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  // backgroundColor: "blue",
                  // backgroundColor: "blue",
                  // width: "70%",
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
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  width: "100%",
                  // backgroundColor: "red",
                  textAlign: "right",
                }}
              >
                {chat.data[chat.data.length - 1].sentAt === "Sending..."
                  ? "Sending..."
                  : moment(
                      new Date(chat.data[chat.data.length - 1].sentAt)
                    ).fromNow()}
              </Typography>
            </Box>
          </Box>
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default Chat;
