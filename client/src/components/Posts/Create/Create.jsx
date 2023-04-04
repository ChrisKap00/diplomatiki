import {
  Add,
  ArrowDropDown,
  AttachFile,
  EmojiEmotions,
  FolderZip,
  Image,
  InsertDriveFile,
  PersonAdd,
  Remove,
  VideoCameraBack,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup } from "../../../store/actions/groups";
import Dropdown from "../../Dropdown/Dropdown";
import FileBase from "react-file-base64";
import ReactImageFileToBase64 from "react-file-image-to-base64";
import { post } from "../../../store/actions/posts";
import { useLocation } from "react-router-dom";

const MyTextField = styled("form")(({ theme }) => ({
  position: "relative",
  paddingBlock: "5px",
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginTop: "20px",
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

const Create = ({ group }) => {
  const [mode, setMode] = useState(0);
  const [groupData, setGroupData] = useState({ code: "", name: "" });
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { groups } = useSelector((state) => state.groups);
  const { isLoadingCreateGroup } = useSelector((state) => state.groups);
  const codeRef = useRef();
  const nameRef = useRef();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [postData, setPostData] = useState({
    userId: user.result._id,
    userName: `${user.result.firstName} ${user.result.lastName}`,
    userPfp: user.result.pfp,
    groupId: null,
    groupName: null,
    text: "",
    images: [],
    file: null,
  });
  const textRef = useRef();

  useEffect(() => {
    if (!group) return;
    setPostData({ ...postData, groupId: group._id, groupName: group.name });
  }, [group]);

  useEffect(() => {
    console.log(postData);
  }, [postData]);

  return (
    <Card
      sx={{
        width:
          location.pathname.split("/")[1] === "group"
            ? { xs: "100%", lg: "97%" }
            : { xs: "100%", xl: "90%" },
        marginBottom: "20px",
        pointerEvents: isLoadingCreateGroup ? "none" : "auto",
        opacity: isLoadingCreateGroup ? 0.5 : 1,
      }}
    >
      <Box>
        {mode === 0 ? (
          <Box sx={{ padding: "1rem" }}>
            {location.pathname.split("/")[1] !== "group" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ marginRight: "10px" }}>Ομάδα: </Typography>
                <Dropdown
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                  postData={postData}
                  setPostData={setPostData}
                />
              </Box>
            )}
            <MyTextField
              onChange={(e) => {
                setPostData({ ...postData, text: e.target.value });
              }}
              sx={{
                marginTop:
                  location.pathname.split("/")[1] === "group" ? 0 : "20px",
              }}
            >
              <StyledInputBase
                ref={textRef}
                minRows={4}
                placeholder="Γράψτε δυο λόγια..."
              />
            </MyTextField>
            <Stack direction="row" gap={1} mt={2}>
              <IconButton component="label">
                <Image color="primary" />
                <div style={{ display: "none" }}>
                  <ReactImageFileToBase64
                    multiple={true}
                    onCompleted={(data) => {
                      console.log(data);
                      setPostData({
                        ...postData,
                        images: [
                          ...postData.images,
                          ...data.map((e) => e.base64_file),
                        ],
                      });
                    }}
                  />
                </div>
              </IconButton>
              <IconButton component="label">
                <AttachFile color="primary" />
                <div style={{ display: "none" }}>
                  <FileBase
                    multiple={false}
                    onDone={(data) => {
                      console.log(data);
                      setPostData({
                        ...postData,
                        file: {
                          base64: data.base64,
                          name: data.name,
                          size: data.size,
                          type: data.type.substring(data.type.indexOf("/") + 1),
                        },
                      });
                    }}
                  />
                </div>
              </IconButton>
            </Stack>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
                gridGap: "1rem",
                paddingBlock: postData.images.length > 0 ? "10px" : 0,
              }}
            >
              {postData.images.map((image, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    marginRight: "20px",
                    marginBottom: "20px",
                    width: "120px",
                  }}
                >
                  <img
                    src={image}
                    style={{
                      width: "120px",
                      aspectRatio: 1,
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  ></img>
                  <button
                    type="button"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      transform: "translate(30%, -30%)",
                      color: "white",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      border: "none",
                      // display: "flex",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // height: "20px",
                      aspectRatio: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setPostData({
                        ...postData,
                        images: postData.images.filter(
                          (image2, idx2) => idx2 !== idx
                        ),
                      });
                    }}
                  >
                    <Remove sx={{ width: "15px" }} />
                  </button>
                </Box>
              ))}
            </Box>
            {postData.file !== null && (
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  padding: "0.5rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  },
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    // backgroundColor: "red",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderRadius: "10px",
                  }}
                ></div>
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    transform: "translate(30%, -30%)",
                    color: "white",
                    backgroundColor: "red",
                    borderRadius: "50%",
                    border: "none",
                    // display: "flex",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // height: "20px",
                    aspectRatio: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPostData({
                      ...postData,
                      file: null,
                    });
                  }}
                >
                  <Remove sx={{ width: "15px" }} />
                </button>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {postData.file.type === "zip" ? (
                    <FolderZip />
                  ) : (
                    <InsertDriveFile />
                  )}
                  <Typography sx={{ marginLeft: "5px" }}>
                    {postData.file.name}
                  </Typography>
                </Box>
                <Typography>{postData.file.size}</Typography>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                // padding: "1rem",
              }}
            >
              <Button
                variant="contained"
                disabled={
                  postData.groupId === null ||
                  (postData.text.trim() === "" &&
                    postData.images.length === 0 &&
                    postData.file === null)
                }
                onClick={() => {
                  dispatch(post(postData));
                  textRef.current.value = "";
                  if (!group) setSelectedGroup(null);
                  setPostData({
                    ...postData,
                    groupId: group ? group._id : null,
                    text: "",
                    images: [],
                    file: null,
                  });
                }}
              >
                Δημοσιευση
              </Button>
            </Box>
          </Box>
        ) : (
          !group && (
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
          )
        )}
      </Box>
      {!group && (
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
      )}
    </Card>
  );
};

export default Create;
