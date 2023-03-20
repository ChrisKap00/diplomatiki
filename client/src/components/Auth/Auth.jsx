import { Box, Button, Card, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

import { signin, signup } from "../../store/actions/auth";
import CloseIcon from "@mui/icons-material/Close";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState(initialState);
  const [problems, setProblems] = useState([
    "Χρησιμοποιήστε διεύθυνση e-mail του πανεπιστημίου (@uth.gr).",
    "Ο κωδικός πρέπει να έχει μήκος τουλάχιστον 8 χαρακτήρες.",
    "Ο κωδικός πρέπει να περιέχει τουλάχιστον 3 αριθμούς",
    "Οι κωδικοί δεν ταριάζουν",
  ]);
  const [alert, setAlert] = useState({ error: 0, message: null });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (problems.length && isSignUp) {
      console.log("error");
      return;
    }
    console.log(formData);

    if (isSignUp) {
      dispatch(signup(formData, setAlert));
    } else {
      dispatch(signin(formData, navigate, setAlert));
    }
  };

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      if (
        e.target.value.endsWith("@uth.gr") &&
        problems.includes(
          "Χρησιμοποιήστε διεύθυνση e-mail του πανεπιστημίου (@uth.gr)."
        )
      ) {
        setProblems(
          problems.filter(
            (problem, index) =>
              problem !==
              "Χρησιμοποιήστε διεύθυνση e-mail του πανεπιστημίου (@uth.gr)."
          )
        );
      } else if (
        !e.target.value.endsWith("@uth.gr") &&
        !problems.includes(
          "Χρησιμοποιήστε διεύθυνση e-mail του πανεπιστημίου (@uth.gr)."
        )
      ) {
        setProblems([
          ...problems,
          "Χρησιμοποιήστε διεύθυνση e-mail του πανεπιστημίου (@uth.gr).",
        ]);
      }
    } else if (e.target.name === "password") {
      if (
        e.target.value !== formData.confirmPassword &&
        !problems.includes("Οι κωδικοί δεν ταριάζουν")
      ) {
        setProblems([...problems, "Οι κωδικοί δεν ταριάζουν"]);
      } else if (
        e.target.value === formData.confirmPassword &&
        problems.includes("Οι κωδικοί δεν ταριάζουν")
      ) {
        setProblems(
          problems.filter(
            (problem, filter) => problem !== "Οι κωδικοί δεν ταριάζουν"
          )
        );
      }
      if (
        e.target.value.length < 8 &&
        !problems.includes(
          "Ο κωδικός πρέπει να έχει μήκος τουλάχιστον 8 χαρακτήρες."
        )
      ) {
        setProblems([
          ...problems,
          "Ο κωδικός πρέπει να έχει μήκος τουλάχιστον 8 χαρακτήρες.",
        ]);
      } else if (
        e.target.value.length >= 8 &&
        problems.includes(
          "Ο κωδικός πρέπει να έχει μήκος τουλάχιστον 8 χαρακτήρες."
        )
      ) {
        setProblems(
          problems.filter(
            (problem, filter) =>
              problem !==
              "Ο κωδικός πρέπει να έχει μήκος τουλάχιστον 8 χαρακτήρες."
          )
        );
      }
      if (
        e.target.value.replace(/\D/g, "").length < 3 &&
        !problems.includes(
          "Ο κωδικός πρέπει να περιέχει τουλάχιστον 3 αριθμούς"
        )
      ) {
        setProblems([
          ...problems,
          "Ο κωδικός πρέπει να περιέχει τουλάχιστον 3 αριθμούς",
        ]);
      } else if (
        e.target.value.replace(/\D/g, "").length >= 3 &&
        problems.includes("Ο κωδικός πρέπει να περιέχει τουλάχιστον 3 αριθμούς")
      ) {
        setProblems(
          problems.filter(
            (problem, filter) =>
              problem !== "Ο κωδικός πρέπει να περιέχει τουλάχιστον 3 αριθμούς"
          )
        );
      }
    } else if (e.target.name === "confirmPassword") {
      if (
        e.target.value !== formData.password &&
        !problems.includes("Οι κωδικοί δεν ταριάζουν")
      ) {
        setProblems([...problems, "Οι κωδικοί δεν ταριάζουν"]);
      } else if (
        e.target.value === formData.password &&
        problems.includes("Οι κωδικοί δεν ταριάζουν")
      ) {
        setProblems(
          problems.filter(
            (problem, filter) => problem !== "Οι κωδικοί δεν ταριάζουν"
          )
        );
      }
    }
    // console.log(formData);
  };

  useEffect(() => {
    console.log(problems);
  }, [problems]);

  const switchMode = () => {
    setAlert({ error: 0, message: null });
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    setShowPassword(false);
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
          sx={{
            display: "flex",
            width: "60%",
            height: { xs: "fit-content", md: "65%" },
            minWidth: { xs: "90%", lg: "450px" },
          }}
        >
          <Box
            sx={{
              padding: { xs: "1rem 1.5rem", sm: "2rem 3rem" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              minWidth: { xs: "100%", md: "450px" },
              height: "100%",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <img
                src={require("../../assets/uth.png")}
                style={{ width: "50px" }}
              ></img>
              <hr style={{ width: "100%" }}></hr>
            </Box>
            <form
              onSubmit={handleSubmit}
              style={{
                paddingTop: "20px",
              }}
            >
              <Grid container spacing={2}>
                {isSignUp && (
                  <>
                    <Input
                      name="firstName"
                      label="First Name"
                      handleChange={handleChange}
                      autoFocus
                      half
                    />
                    <Input
                      name="lastName"
                      label="Last Name"
                      handleChange={handleChange}
                      half
                    />
                  </>
                )}
                <Input
                  name="email"
                  label="Email Address"
                  handleChange={handleChange}
                  type="email"
                />
                <Input
                  name="password"
                  label="Password"
                  handleChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  handleShowPassword={handleShowPassword}
                />
                {isSignUp && (
                  <Input
                    name="confirmPassword"
                    label="Confirm Password"
                    handleChange={handleChange}
                    type="password"
                  />
                )}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ marginTop: "1rem" }}
                onClick={handleChange}
                data-tooltip-id="problems-tooltip"
              >
                {isSignUp ? "ΕΓΓΡΑΦΗ" : "ΣΥΝΔΕΣΗ"}
              </Button>
              {problems.length && isSignUp ? (
                <Tooltip
                  id="problems-tooltip"
                  place="bottom"
                  style={{ backgroundColor: "#b50707" }}
                >
                  <Box sx={{ width: { xs: "300px", sm: "fit-content" } }}>
                    <ul>
                      {problems.map((problem, index) => (
                        <li key={index}>
                          <label style={{ wordBreak: "break-word" }}>
                            {problem}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </Box>
                </Tooltip>
              ) : null}
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Button onClick={switchMode}>
                    {isSignUp
                      ? "ΣΥΝΔΕΣΗ"
                      : "ΕΓΓΡΑΦΗ"}
                  </Button>
                </Grid>
              </Grid>
            </form>
            {alert.message !== null && (
              <Box
                sx={{
                  backgroundColor: alert.error === 1 ? "#fc4242" : "#6bf25e",
                  border: `1px solid ${alert.error === 1 ? "red" : "green"}`,
                  borderRadius: "10px",
                  width: "100%",
                  padding: "1rem",
                  marginTop: { xs: 0, sm: "15px" },
                  position: "relative",
                  color: alert.error === 1 ? "#610000" : "#086100",
                }}
              >
                {alert.message}
                <button
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: 0,
                    borderRadius: "10px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setAlert({ error: 0, message: null });
                  }}
                >
                  <CloseIcon sx={{ width: "20px" }} />
                </button>
              </Box>
            )}
          </Box>
          <img
            src={require("../../assets/login.png")}
            style={{
              width: "100%",
              maxWidth: "700px",
              objectFit: "cover",
            }}
          ></img>
        </Card>
      </Box>
    </Box>
  );
};

export default Auth;
