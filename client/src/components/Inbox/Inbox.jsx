import {
  ArrowBack,
  AttachFile,
  Image,
  InboxOutlined,
  InboxRounded,
  Send,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CircularProgress,
  IconButton,
  InputBase,
  List,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Message from "./Message/Message";
import Chat from "../Chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import defaultPfp from "../../assets/defaultPfp.jpg";
import {
  fetchInfoForChat,
  fetchMessages,
  fetchPfp,
  sendMessage,
} from "../../store/actions/messages";
import ReactImageFileToBase64 from "react-file-image-to-base64";
import FileBase from "react-file-base64";

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

const Inbox = ({ socket }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [info, setInfo] = useState(null);
  const [mobileChatsOpen, setMobileChatsOpen] = useState(!location.search.substring(4));
  const navigate = useNavigate();
  const [messageData, setMessageData] = useState({
    text: null,
    image: null,
    file: null,
  });
  const messageRef = useRef();
  const { messages, isLoadingMessages, isLoadingSendMessage } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!messages.length) dispatch(fetchMessages(user?.result._id));
  }, []);

  useEffect(() => {
    if (location.search) {
      setId(location.search.substring(4));
      const chat = messages.find((chat) => chat.withId === location.search.substring(4));
      if (chat) {
        setInfo({ pfp: chat.withPfp, name: chat.withName });
      } else {
        dispatch(fetchInfoForChat(location.search.substring(4), setInfo));
      }
    }
  }, [location]);

  useEffect(() => {
    setMobileChatsOpen(location.search.substring(4) ? false : true);
  }, [location]);

  useEffect(() => {
    const topPos = document.getElementById("dummy").offsetTop;
    document.getElementById("scrollBox").scrollTop = topPos;
  }, [messages, info]);

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
            sx={{
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              display: {
                xs: mobileChatsOpen ? (isLoadingMessages ? " flex" : "block") : "none",
                lg: isLoadingMessages ? " flex" : "block",
              },
              alignItems: "center",
              justifyContent: "center",
            }}
            flex={2}
          >
            {isLoadingMessages ? (
              <CircularProgress />
            ) : (
              <List sx={{ padding: 0 }}>
                {messages?.map((e, index) => (
                  <Chat key={index} chat={e} />
                ))}
              </List>
            )}
          </Box>
          <Box
            flex={3.5}
            sx={{
              display: {
                xs: !mobileChatsOpen ? "block" : "none",
                lg: "block",
              },
            }}
          >
            {id && (
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{
                    marginRight: "15px",
                    display: { sx: "block", lg: "none" },
                    // padding: 0,
                  }}
                  onClick={() => {
                    navigate("/messages");
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <Avatar src={info?.pfp || defaultPfp} sx={{ marginRight: "10px" }} />
                <Typography sx={{ fontSize: "1.1rem" }}>{info !== null && info.name}</Typography>
              </Box>
            )}
            <Box
              sx={{
                height: location.search ? "calc(100% - 106px)" : "100%",
                overflow: "auto",
                display: isLoadingMessages || !location.search.substring(4) ? "flex" : "block",
                justifyContent: "center",
                alignItems: "center",
              }}
              component="div"
              id="scrollBox"
              onLoad={() => {
                const topPos = document.getElementById("dummy").offsetTop;
                document.getElementById("scrollBox").scrollTop = topPos;
              }}
            >
              {!location.search.substring(4) ? (
                <InboxRounded sx={{ fontSize: "4rem" }} />
              ) : isLoadingMessages ? (
                <CircularProgress></CircularProgress>
              ) : (
                <>
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
                </>
              )}
            </Box>
            <div id="dummy"></div>
            <Box
              sx={{
                width: "100%",
                height: "50px",
                display: location.search.substring(4) ? "flex" : "none",
                alignItems: "center",
                justifyContent: "space-between",
                paddingInline: "10px 10px",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* <Stack direction="row" gap={1} mt={2}> */}
              <IconButton component="label" disabled={isLoadingSendMessage}>
                <Image color="primary" />
                <div style={{ display: "none" }}>
                  <ReactImageFileToBase64
                    multiple={false}
                    onCompleted={(data) => {
                      dispatch(
                        sendMessage(
                          {
                            senderId: user.result._id,
                            receiverId: id,
                            message: {
                              ...messageData,
                              image: data[0].base64_file,
                            },
                            fetchChat: messages.filter((chat) => chat.withId === id).length === 0,
                          },
                          info,
                          socket
                        )
                      );
                      setMessageData({ text: null, image: null, file: null });
                      messageRef.current.firstChild.value = "";
                    }}
                  />
                </div>
              </IconButton>
              <IconButton component="label" disabled={isLoadingSendMessage}>
                <AttachFile color="primary" />
                <div style={{ display: "none" }}>
                  <FileBase
                    multiple={false}
                    onDone={(data) => {
                      dispatch(
                        sendMessage(
                          {
                            senderId: user.result._id,
                            receiverId: id,
                            message: {
                              ...messageData,
                              file: {
                                base64: data.base64,
                                name: data.name,
                                size: data.size,
                                type: data.type.substring(data.type.indexOf("/") + 1),
                              },
                            },
                            fetchChat: messages.filter((chat) => chat.withId === id).length === 0,
                          },
                          info,
                          socket
                        )
                      );
                      setMessageData({ text: null, image: null, file: null });
                      messageRef.current.firstChild.value = "";
                    }}
                  />
                </div>
              </IconButton>
              {/* </Stack> */}
              <SendForm
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                sx={{ pointerEvents: isLoadingSendMessage ? "none" : "auto" }}
              >
                <StyledInputBase
                  placeholder="Write a message..."
                  inputProps={{ "aria-label": "search" }}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    pointerEvents: isLoadingSendMessage ? "none" : "auto",
                  }}
                  disabled={isLoadingSendMessage}
                  ref={messageRef}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      e.preventDefault();
                      dispatch(
                        sendMessage(
                          {
                            senderId: user.result._id,
                            receiverId: id,
                            senderName: `${user?.result.firstName} ${user?.result.lastName}`,
                            message: messageData,
                            fetchChat: messages.filter((chat) => chat.withId === id).length === 0,
                          },
                          info,
                          socket
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
                <IconButton
                  type="submit"
                  sx={{ marginLeft: "10px" }}
                  onClick={() => {
                    dispatch(
                      sendMessage(
                        {
                          senderId: user.result._id,
                          receiverId: id,
                          message: messageData,
                          fetchChat: messages.filter((chat) => chat.withId === id).length === 0,
                        },
                        info
                      )
                    );
                    setMessageData({ text: null, image: null, file: null });
                    messageRef.current.firstChild.value = "";
                  }}
                  disabled={
                    (messageData.text === null &&
                      messageData.image === null &&
                      messageData.file === null) ||
                    isLoadingSendMessage
                  }
                >
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
