import { Box, CircularProgress, List } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../../Chat/Chat";
import { fetchMessages } from "../../../store/actions/messages";

const MessagesBox = () => {
  const { messages, isLoadingMessages } = useSelector(
    (state) => state.messages
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!messages.length) dispatch(fetchMessages(user?.result._id));
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: "10px",
        height: "100%",
        display: isLoadingMessages ? " flex" : "block",
        alignItems: "center",
        justifyContent: "center",
      }}
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
  );
};

export default MessagesBox;
