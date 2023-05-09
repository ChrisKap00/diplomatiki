import { Send } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  IconButton,
  InputBase,
  List,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Message from "./Message/Message";
import Chat from "../Chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import defaultPfp from "../../assets/defaultPfp.jpg";
import { fetchInfoForChat, sendMessage } from "../../store/actions/messages";

const SendForm = styled("form")(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "fit-content",
  display: "flex",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  backgroundColor: "transparent",
  borderRadius: "20px",
  border: "none",
  outline: "none",
  resize: "none",
  font: "inherit",
  overflow: "hidden",
  height: "fit-content",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0.5, 2, 0.5, 2),
  wordBreak: "break-word",
  // minWidth: "90%",
  width: "100%",
}));

const Inbox = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [info, setInfo] = useState(null);
  const [messageData, setMessageData] = useState({
    text: null,
    image: null,
    file: null,
  });
  const messageRef = useRef();
  const { messages, isLoadingMessages } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (location.search) {
      setId(location.search.substring(4));
      const chat = messages.find(
        (chat) => chat.withId === location.search.substring(4)
      );
      if (chat) {
        setInfo({ pfp: chat.withPfp, name: chat.name });
      } else {
        dispatch(fetchInfoForChat(location.search.substring(4), setInfo));
      }
    }
  }, [location]);

  useEffect(() => {
    const topPos = document.getElementById("dummy").offsetTop;
    document.getElementById("scrollBox").scrollTop = topPos;
  }, [messages]);

  return (
    <Box
      sx={{
        // backgroundColor: "red",
        height: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", lg: "1100px", xl: "1200px" },
          height: { xs: "100%", lg: "95%" },
          display: "flex",
        }}
      >
        <Stack direction="row" sx={{ width: "100%" }}>
          <Box
            sx={{ borderRight: "1px solid rgba(255, 255, 255, 0.1)" }}
            flex={2}
          >
            <List sx={{ padding: 0 }}>
              {messages?.map((e, index) => (
                <Chat key={index} chat={e} />
              ))}
            </List>
          </Box>
          <Box flex={3.5}>
            {id && (
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={info?.pfp || defaultPfp}
                  sx={{ marginRight: "10px" }}
                />
                <Typography sx={{ fontSize: "1.1rem" }}>
                  {info !== null && info.name}
                </Typography>
              </Box>
            )}
            <Box
              sx={{ height: "calc(100% - 106px)", overflow: "auto" }}
              component="div"
              id="scrollBox"
              onLoad={() => {
                const topPos = document.getElementById("dummy").offsetTop;
                document.getElementById("scrollBox").scrollTop = topPos;
              }}
            >
              {id !== null &&
                messages
                  ?.find((e) => e.withId === id)
                  ?.data?.map((message, index) => (
                    <Message
                      key={index}
                      message={message}
                      withId={messages?.find((el) => el.withId === id)?.withId}
                    />
                  ))}
            </Box>
            <div id="dummy"></div>
            <Box
              sx={{
                width: "100%",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingInline: "15px 10px",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              }}
            >
              <SendForm
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <StyledInputBase
                  placeholder="Write a message..."
                  inputProps={{ "aria-label": "search" }}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  }}
                  ref={messageRef}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      e.preventDefault();
                      dispatch(
                        sendMessage(
                          {
                            senderId: user.result._id,
                            receiverId: id,
                            message: messageData,
                            fetchChat:
                              messages.filter((chat) => chat.withId === id)
                                .length === 0,
                          },
                          info
                        )
                      );
                      e.target.value = "";
                      setMessageData({ text: null, image: null, file: null });
                    }
                  }}
                  onChange={(e) => {
                    setMessageData({ ...messageData, text: e.target.value });
                  }}
                />
                <IconButton type="submit" sx={{ marginLeft: "10px" }}>
                  <Send color="primary" />
                </IconButton>
              </SendForm>
            </Box>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};

export default Inbox;
