import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Stack,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import defaultPfp from "../../../../../assets/defaultPfp.jpg";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import {
  AttachFile,
  Favorite,
  FavoriteBorder,
  FolderZip,
  Image,
  InsertDriveFile,
  Logout,
  MoreHoriz,
  Person,
  Remove,
  Settings,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteComment,
  likeComment,
  postReply,
} from "../../../../../store/actions/posts";
import ReactImageFileToBase64 from "react-file-image-to-base64";
import FileBase from "react-file-base64";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Reply = ({ reply, postId, commentId }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const isProfileMenuOpen = Boolean(menuAnchorEl);
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    // handleMobileMenuClose();
  };

  const openDeleteConfirmationModal = () => {
    setOpen(true);
    handleMenuClose();
  };

  const closeDeleteConfirmationModal = () => setOpen(false);

  const handleDelete = () => {
    console.log(`Deleting reply ${reply._id}`);
    closeDeleteConfirmationModal();
    // dispatch(deleteComment({ postId, commentId, replyId: reply._id }));
  };

  const renderMenu = (
    <Menu
      anchorEl={menuAnchorEl}
      id="account-menu"
      open={isProfileMenuOpen}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {reply.userId === user.result._id && (
        <MenuItem onClick={openDeleteConfirmationModal}>Delete</MenuItem>
      )}
    </Menu>
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "20px",
          opacity:
            reply.postedAt === "Posting..." || reply.postedAt === "Deleting..."
              ? "50%"
              : "100%",
        }}
      >
        <Link
          to={`/profile/${reply.userId}`}
          style={{
            pointerEvents:
              reply.postedAt === "Posting..." ||
              reply.postedAt === "Deleting..."
                ? "none"
                : "auto",
          }}
        >
          <Avatar
            sx={{ height: "30px", width: "30px" }}
            src={defaultPfp}
          ></Avatar>
        </Link>
        <Box sx={{ width: "100%", paddingLeft: "10px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%" }}>
              {!reply.deleted ? (
                <Card
                  sx={{
                    width: "fit-content",
                    display: "block",
                    wordBreak: "break-word",
                    padding: "10px 15px",
                    borderRadius: "15px",
                  }}
                >
                  <Link
                    to={`/profile/${reply.userId}`}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      width: "fit-content",
                      cursor: "pointer",
                      pointerEvents:
                        reply.postedAt === "Posting..." ||
                        reply.postedAt === "Deleting..."
                          ? "none"
                          : "auto",
                    }}
                  >
                    <label style={{ fontWeight: "bold", cursor: "pointer" }}>
                      {reply.userName}
                    </label>
                    {/* </Typography> */}
                  </Link>
                  <Typography>{reply.text}</Typography>
                </Card>
              ) : (
                <Box
                  sx={{
                    width: "fit-content",
                    display: "block",
                    wordBreak: "break-word",
                  }}
                >
                  <Link
                    to={`/profile/${reply.userId}`}
                    style={{
                      color: "inherit",
                      textDecoration: "none",
                      width: "fit-content",
                      cursor: "pointer",
                      pointerEvents:
                        reply.postedAt === "Posting..." ||
                        reply.postedAt === "Deleting..."
                          ? "none"
                          : "auto",
                    }}
                  >
                    <label style={{ fontWeight: "bold", cursor: "pointer" }}>
                      {reply.userName}
                    </label>
                  </Link>
                  <Card
                    sx={{
                      width: "fit-content",
                      display: "block",
                      wordBreak: "break-word",
                      padding: "10px 15px",
                      borderRadius: "15px",
                      backgroundColor: "rgba(0, 0, 0, 0.15)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                    elevation={0}
                  >
                    <Typography>Η απάντηση έχει διαγραφεί.</Typography>
                  </Card>
                </Box>
              )}
              {reply?.images.length > 0 && !reply.deleted && (
                <Box
                  sx={{
                    width: "60%",
                    display: "flex",
                    borderRadius: "20px",
                    position: "relative",
                    marginTop: "5px",
                  }}
                >
                  <img
                    src={reply.images[0]}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  ></img>
                  {reply.images.length > 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(8px)",
                        top: "0",
                        left: "0",
                        right: "-1px",
                        bottom: "-1px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "20px",
                        cursor: "pointer",
                        pointerEvents:
                          reply.postedAt === "Posting..." ||
                          reply.postedAt === "Deleting..."
                            ? "none"
                            : "auto",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(20, 20, 20, 0.8)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "2rem", fontWeight: "600" }}
                        >
                          {reply.images.length}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
              {reply.file !== null && !reply.deleted && (
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    padding: "0.5rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    pointerEvents:
                      reply.postedAt === "Posting..." ||
                      reply.postedAt === "Deleting..."
                        ? "none"
                        : "auto",
                    position: "relative",
                    "&:hover": {
                      backgroundColor:
                        reply.postedAt === "Posting..." ||
                        reply.postedAt === "Deleting..."
                          ? "rgba(255, 255, 255, 0.08"
                          : "rgba(255, 255, 255, 0.15)",
                    },
                    marginTop: "5px",
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
                    onClick={() => {
                      const anchor = document.createElement("a");
                      anchor.download = reply.file.name;
                      anchor.href = reply.file.base64;
                      anchor.click();
                    }}
                  ></div>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {reply.file.type === "zip" ? (
                      <FolderZip />
                    ) : (
                      <InsertDriveFile />
                    )}
                    <Typography sx={{ marginLeft: "5px" }}>
                      {reply.file.name}
                    </Typography>
                  </Box>
                  <Typography>{reply.file.size}</Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                onClick={() => {
                  //   dispatch(
                  //     likeComment({
                  //       userId: user.result._id,
                  //       postId,
                  //       commentId: comment._id,
                  //     })
                  //   );
                }}
                checked={reply.likes.includes(user.result._id)}
                disabled={
                  reply.loadingLike ||
                  reply.postedAt === "Posting..." ||
                  reply.postedAt === "Deleting..."
                }
              />
              <Typography>{reply.likes.length}</Typography>
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", paddingTop: "5px" }}
          >
            {/* <div
              onClick={() => {
                // setRepliesOpen(!repliesOpen);
              }}
            >
              <Typography
                sx={{
                  opacity: "50%",
                  marginRight: "5px",
                  cursor: "pointer",
                  userSelect: "none",
                  pointerEvents:
                    comment.postedAt === "Posting..." ||
                    comment.postedAt === "Deleting..."
                      ? "none"
                      : "auto",
                }}
              >
                Απαντήστε
              </Typography>
            </div> */}
            {/* <Typography sx={{ opacity: "50%", marginRight: "5px" }}>
              ·
            </Typography> */}
            <Typography sx={{ opacity: "50%" }}>
              {reply.postedAt === "Posting..."
                ? "Posting..."
                : reply.postedAt === "Deleting..."
                ? "Deleting..."
                : moment(reply.postedAt).fromNow()}
            </Typography>
            <div
              style={{
                display: reply.userId === user?.result._id ? "flex" : "none",
                alignItems: "center",
                paddingLeft: "10px",
                cursor: "pointer",
                pointerEvents:
                  reply.postedAt === "Posting..." ||
                  reply.postedAt === "Deleting..."
                    ? "none"
                    : "auto",
              }}
            >
              <IconButton
                aria-controls="menu"
                size="small"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <MoreHoriz sx={{ fontSize: "1.6rem" }} />
              </IconButton>
            </div>
            {renderMenu}
          </Box>
          {/* <Collapse in={repliesOpen} unmountOnExit>
            <div
              style={{
                display: "flex",
                // marginBottom: "20px",
                // backgroundColor: "red",
              }}
            >
              <Avatar
                sx={{ height: "30px", width: "30px" }}
                src={defaultPfp}
              ></Avatar>
              <Box
                sx={{
                  width: "100%",
                  paddingLeft: "10px",
                }}
              >
                <CommentForm
                  sx={{
                    "&:hover": {
                      backgroundColor:
                        comment.postedAt === "Posting..." ||
                        comment.postedAt === "Deleting..."
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(255, 255, 255, 0.25)",
                    },
                  }}
                  // onSubmit={(e) => {
                  //   // e.preventDefault();
                  //   console.log(e);
                  // }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    <StyledInputBase
                      disabled={
                        comment.postedAt === "Posting..." ||
                        comment.postedAt === "Deleting..."
                      }
                      onKeyDown={(e) => {
                        if (e.code === "Enter") {
                          if (shiftHeld) {
                            console.log("Shift is held down");
                          } else {
                            e.preventDefault();
                            if (reply.text.trim() !== "") {
                              replyOnComment();
                              console.log(reply);
                              e.target.value = "";
                            }
                          }
                        }
                      }}
                      onChange={(e) => {
                        if (e.code === "Enter") return;
                        // console.log(e.target.value);
                        setReply({ ...reply, text: e.target.value });
                      }}
                      name="inputName"
                      placeholder="Γράψτε μια απάντηση..."
                    />
                  </Box>
                  <Stack
                    direction="row"
                    gap={1}
                    mt={2}
                    sx={{
                      padding: "0.5rem",
                      pointerEvents:
                        comment.postedAt === "Posting..." ||
                        comment.postedAt === "Deleting..."
                          ? "none"
                          : "auto",
                    }}
                  >
                    <IconButton component="label">
                      <Image color="primary" />
                      <div style={{ display: "none" }}>
                        <ReactImageFileToBase64
                          multiple={true}
                          onCompleted={(data) => {
                            console.log(data);
                            setReply({
                              ...reply,
                              images: [
                                ...reply.images,
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
                            setReply({
                              ...reply,
                              file: {
                                base64: data.base64,
                                name: data.name,
                                size: data.size,
                                type: data.type.substring(
                                  data.type.indexOf("/") + 1
                                ),
                              },
                            });
                          }}
                        />
                      </div>
                    </IconButton>
                  </Stack>
                  <Box sx={{ paddingInline: "1rem", paddingBottom: "0.1rem" }}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
                        gridGap: "1rem",
                        paddingBlock: comment.images.length > 0 ? "10px" : 0,
                      }}
                    >
                      {reply.images.map((image, idx) => (
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
                              setReply({
                                ...reply,
                                images: reply.images.filter(
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
                    {reply.file !== null && (
                      <Paper
                        sx={{
                          // backgroundColor: "rgba(255, 255, 255, 0.08)",
                          borderRadius: "10px",
                          padding: "0.5rem 1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          position: "relative",
                          // "&:hover": {
                          //   backgroundColor: "rgba(255, 255, 255, 0.15)",
                          // },
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
                            // zIndex: 100
                          }}
                          onClick={() => {
                            setReply({
                              ...reply,
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
                          {reply.file.type === "zip" ? (
                            <FolderZip />
                          ) : (
                            <InsertDriveFile />
                          )}
                          <Typography sx={{ marginLeft: "5px" }}>
                            {reply.file.name}
                          </Typography>
                        </Box>
                        <Typography>{reply.file.size}</Typography>
                      </Paper>
                    )}
                  </Box>
                </CommentForm>
              </Box>
            </div>
            {comment.replies.map((reply, idx) => (
              <Reply
                key={idx}
                reply={reply}
                postId={postId}
                commentId={comment._id}
              />
            ))}
          </Collapse> */}
        </Box>
      </div>
      <StyledModal
        open={open}
        onClose={closeDeleteConfirmationModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          //   width="fit-content"
          sx={{ width: { xs: "90%", sm: 500 } }}
          height="fit-content"
          bgcolor={"background.default"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
        >
          <Typography variant="h6" color="gray" textAlign="center">
            Διαγραφή απάντησης
          </Typography>
          <br></br>
          <Typography fontWeight={500} variant="span">
            Είστε σίγουροι ότι θέλετε να διαγράψετε την απάντηση;
          </Typography>
          <br></br>
          <br></br>
          <ButtonGroup fullWidth>
            <br></br>
            <Button variant="contained" onClick={closeDeleteConfirmationModal}>
              Ακύρωση
            </Button>
            <Button variant="contained" onClick={handleDelete}>
              Διαγραφή
            </Button>
          </ButtonGroup>
        </Box>
      </StyledModal>
    </>
  );
};

export default Reply;
