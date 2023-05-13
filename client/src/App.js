import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Paper, Stack } from "@mui/material";
import { Box, Container } from "@mui/system";
import Auth from "./components/Auth/Auth";
import { useEffect, useRef, useState } from "react";
import Verification from "./components/Verification/Verification";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Group from "./components/Group/Group";
import AllGroups from "./components/AllGroups/AllGroups";
import Profile from "./components/Profile/Profile";
import Inbox from "./components/Inbox/Inbox";
import { fetchMessages, fetchPfp } from "./store/actions/messages";

import { io } from "socket.io-client";
import Search from "./components/Search/Search";

function App() {
  const [socket, setSocket] = useState(useRef());
  const theme = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.messages);

  const dispatch = useDispatch();
  const location = useLocation();

  if (!theme) dispatch({ type: "INITIALIZE_THEME" });

  useEffect(() => {
    if (!user) return;
    setSocket({ ...socket, current: io("http://localhost:5000") });
  }, [user?.result._id]);

  useEffect(() => {
    console.log("HERE");
    if (!socket.current) return;
    console.log(socket.current);
    socket.current.emit("add-user", user?.result._id);
    socket.current.on("receive-msg", (message) => {
      console.log(message);
      dispatch({ type: "RECEIVE_MESSAGE", payload: message });
      if (!messages.find((chat) => chat.withId === message.senderId))
        dispatch(fetchPfp(message.senderId));
      // const audio = new Audio("../../assets/message_notification.wav");
      // audio.play();
      // dispatch({ type: "ADD_RECEIVED_MESSAGE", payload: message });
    });
    socket.current.on("receive-notification", (notification) => {
      console.log(notification);
      // dispatch({ type: "RECEIVE_NOTIFICATION", payload: notification });
    });
  }, [socket]);

  useEffect(() => {
    console.log(socket.current);
  }, [location]);

  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  useEffect(() => {
    dispatch({
      type: "UPDATE_USER_ON_ACTION",
      payload: JSON.parse(localStorage.getItem("user")),
    });
    dispatch({ type: "CLEAR_POSTS" });
    // console.log(location.search.split("=")[1]);
  }, [location]);

  useEffect(() => {
    if (!user) return;
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ marginInline: user ? { sm: "8%" } : 0 }}>
        {user && <NavBar />}
        <Routes>
          <Route
            path="/"
            exact
            element={!user ? <Navigate to="/auth" replace /> : <Home />}
          />
          <Route
            path="/profile/:id"
            exact
            element={!user ? <Navigate to="/auth" replace /> : <Profile />}
          />
          <Route
            path="/group/:id"
            exact
            element={!user ? <Navigate to="/auth" replace /> : <Group />}
          />
          <Route
            path="/groups"
            exact
            element={!user ? <Navigate to="/auth" replace /> : <AllGroups />}
          />
          <Route
            path="/messages"
            exact
            element={
              !user ? (
                <Navigate to="/auth" replace />
              ) : (
                <Inbox socket={socket} />
              )
            }
          />
          <Route
            path="/search"
            exact
            element={!user ? <Navigate to="/auth" replace /> : <Search />}
          />
          <Route
            path="/auth"
            exact
            element={!user ? <Auth /> : <Navigate to="/" replace />}
          ></Route>
          <Route
            path="/verification/:token"
            exact
            element={!user ? <Verification /> : <Navigate to="/" replace />}
          ></Route>
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
