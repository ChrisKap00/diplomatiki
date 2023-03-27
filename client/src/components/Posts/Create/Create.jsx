import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup } from "../../../store/actions/groups";

const MyTextField = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginTop: "10px",
  width: "100%",
  height: "fit-content",
}));

const StyledInputBase = styled(TextareaAutosize)(({ theme }) => ({
  color: "inherit",
  backgroundColor: "transparent",
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
  minWidth: "100%",
}));

const Create = () => {
  const [mode, setMode] = useState(1);
  const [groupData, setGroupData] = useState({ code: "", name: "" });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoadingCreateGroup } = useSelector((state) => state.groups);
  const codeRef = useRef();
  const nameRef = useRef();

  return (
    <Card
      sx={{
        width: { xs: "100%", xl: "90%" },
        marginBottom: "20px",
        pointerEvents: isLoadingCreateGroup ? "none" : "auto",
        opacity: isLoadingCreateGroup ? 0.5 : 1,
      }}
    >
      <Box>
        {mode === 1 && (
          <>
            <Box sx={{ padding: "1rem" }}>
              <Typography>Κωδικός</Typography>
              <MyTextField>
                <StyledInputBase
                  onKeyDown={(e) => {
                    if (e.code === "Enter") e.preventDefault();
                  }}
                  onChange={(e) => {
                    if (e.code === "Enter") return;
                    setGroupData({ ...groupData, code: e.target.value });
                  }}
                  ref={codeRef}
                />
              </MyTextField>
            </Box>
            <Box sx={{ padding: "1rem" }}>
              <Typography>Όνομα</Typography>
              <MyTextField>
                <StyledInputBase
                  onKeyDown={(e) => {
                    if (e.code === "Enter") e.preventDefault();
                  }}
                  onChange={(e) => {
                    if (e.code === "Enter") return;
                    setGroupData({ ...groupData, name: e.target.value });
                  }}
                  ref={nameRef}
                />
              </MyTextField>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "1rem",
              }}
            >
              <Button
                variant="contained"
                disabled={
                  groupData.code.trim() === "" || groupData.name.trim() === ""
                }
                onClick={() => {
                  dispatch(createGroup(groupData, user.result));
                  // console.log(codeRef.current.value);
                  codeRef.current.value = "";
                  nameRef.current.value = "";
                }}
              >
                Δημιουργια
              </Button>
            </Box>
          </>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          position: "relative",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            height: "100%",
            width: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            left: mode === 0 ? "0" : "50%",
            cursor: "pointer",
            transition: "0.2s ease-out",
          }}
        ></Box>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            // backgroundColor: "red",
            cursor: "pointer",
            padding: "1rem",
          }}
          onClick={() => {
            setMode(0);
          }}
        >
          Νέα δημοσίευση
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            // backgroundColor: "blue",
            padding: "1rem",
            cursor: "pointer",
          }}
          onClick={() => {
            setMode(1);
          }}
        >
          Νέα ομάδα
        </div>
      </Box>
    </Card>
  );
};

export default Create;
