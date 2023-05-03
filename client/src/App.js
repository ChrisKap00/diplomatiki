import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Paper, Stack } from "@mui/material";
import { Box, Container } from "@mui/system";
import Auth from "./components/Auth/Auth";
import { useEffect } from "react";
import Verification from "./components/Verification/Verification";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Group from "./components/Group/Group";
import AllGroups from "./components/AllGroups/AllGroups";
import Profile from "./components/Profile/Profile";

function App() {
  const theme = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const location = useLocation();

  if (!theme) dispatch({ type: "INITIALIZE_THEME" });

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
