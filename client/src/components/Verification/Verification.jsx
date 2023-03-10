import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verify } from "../../store/actions/auth";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import "./Verification.css";

const Verification = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ error: 0, message: null });
  const { isLoadingVerification } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(
  //     verify(
  //       location.pathname.substring(location.pathname.lastIndexOf("/") + 1)
  //     )
  //   );
  //   navigate("/auth");
  // }, []);

  const handleVerify = () => {
    dispatch(
      verify(
        location.pathname.substring(location.pathname.lastIndexOf("/") + 1),
        setAlert
      )
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        padding: 0,
      }}
    >
      <img
        src={require("../../assets/login_bg.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          margin: 0,
          padding: 0,
          marginBottom: "-10px",
        }}
      ></img>
      <Box
        sx={{
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(15px)",
          width: "100%",
          height: "100%",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          className="verificationCard"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1rem",
            width: { xs: "90%", sm: "fit-content" },
            maxWidth: "400px",
            backgroundColor: "#192a5c",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
          }}
          elevation={6}
        >
          <Typography>
            Πατήστε συνέχεια για να γίνει η επαλήθευση της ηλεκτρονικής σας
            διεύθυνσης
          </Typography>
          {isLoadingVerification ? (
            <CircularProgress />
          ) : alert.error === 0 ? (
            <Button
              type="button"
              variant="contained"
              sx={{ marginTop: "30px", backgroundColor: "#369e5c" }}
              onClick={handleVerify}
            >
              ΣΥΝΕΧΕΙΑ
            </Button>
          ) : (
            <Box
              sx={{
                backgroundColor: alert.error === -1 ? "#fc4242" : "#6bf25e",
                border: `1px solid ${alert.error === -1 ? "red" : "green"}`,
                borderRadius: "10px",
                width: "100%",
                padding: "1rem",
                marginTop: { xs: 0, sm: "15px" },
                position: "relative",
                color: alert.error === -1 ? "#610000" : "#086100",
              }}
            >
              {alert.message}
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default Verification;
