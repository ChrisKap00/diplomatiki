import React, { useEffect } from "react";
import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Stack,
} from "@mui/material";
import {
  AttachFile,
  Comment,
  Favorite,
  FavoriteBorder,
  FolderZip,
  Image,
  InsertDriveFile,
  KeyboardArrowRightRounded,
  Remove,
} from "@mui/icons-material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import defaultPfp from "../../../assets/defaultPfp.jpg";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
// import { deletePost, likePost, postComment } from "../../store/actions/posts";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import CommentComponent from "./Comment/Comment";
import { Link, useLocation } from "react-router-dom";
import { deletePost, likePost, postComment } from "../../../store/actions/posts";
import ReactImageFileToBase64 from "react-file-image-to-base64";
import FileBase from "react-file-base64";
import ImageCarousel from "../../ImageCarousel/ImageCarousel";

const CommentForm = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
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
  wordBreak: "break-word",
  // minWidth: "100%",
  width: "100%",
  padding: 0,
  // padding: theme.spacing(1.5, 2, 0.5, 2),
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({}));

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function Post({ post }) {
  const [comment, setComment] = useState({ text: "", images: [], file: null });
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [shiftHeld, setShiftHeld] = useState(false);

  const location = useLocation();

  function downHandler({ key }) {
    if (key === "Shift") {
      setShiftHeld(true);
    }
  }

  function upHandler({ key }) {
    if (key === "Shift") {
      setShiftHeld(false);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  useEffect(() => {
    console.log(images);
    if (!images) document.body.style.overflowY = "auto";
    else {
      document.body.style.overflowY = "hidden";
    }
  }, [images]);

  const commentOnPost = () => {
    setComment({ text: "", images: [], file: null });
    dispatch(
      postComment(
        {
          userId: user.result._id,
          userName: `${user.result.firstName} ${user.result.lastName}`,
          userPfp: user.result.pfp,
          postId: post._id,
          comment: { ...comment, text: comment.text.trim() },
        },
        location.pathname
      )
    );
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const like = () => {
    // console.log("Liking post");
    dispatch(
      likePost({
        userId: user.result._id,
        postId: post._id,
      })
    );
  };

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openDeleteConfirmationModal = () => {
    setOpen(true);
    handleMenuClose();
  };

  const closeDeleteConfirmationModal = () => setOpen(false);

  const handleDelete = () => {
    console.log(`Deleting post ${post._id}`);
    closeDeleteConfirmationModal();
    dispatch(deletePost(post._id));
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {post.userId === user.result._id && (
        <MenuItem onClick={openDeleteConfirmationModal}>Delete</MenuItem>
      )}
    </Menu>
  );

  return (
    <>
      {images && <ImageCarousel images={images} setImages={setImages} />}
      <Card
        sx={{
          width: location.pathname.split("/")[1] === "group" ? "100%" : { xs: "100%", xl: "90%" },
          marginBottom: "20px",
          opacity:
            post.postedAt === "Posting..." || post.postedAt === "Deleting..." ? "50%" : "100%",
          pointerEvents:
            post.postedAt === "Posting..." || post.postedAt === "Deleting..." ? "none" : "auto",
        }}
        elevation={10}
      >
        <CardHeader
          avatar={
            <Link
              to={`/profile/${post.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Avatar src={post?.userPfp ? post.userPfp : defaultPfp}></Avatar>
            </Link>
          }
          action={
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {post.userName}
              </Link>
              <KeyboardArrowRightRounded />
              <Link
                to={`/group/${post.groupId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {post.groupName}
              </Link>
            </Box>
          }
          subheader={
            post.postedAt === "Posting..." || post.postedAt === "Deleting..."
              ? post.postedAt
              : moment(post.postedAt).fromNow()
          }
        />
        <Link
          to={`/post/${post._id}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            pointerEvents: location.pathname.split("/")[1] === "post" ? "none" : "auto",
          }}
        >
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
              {post.text}
            </Typography>
            {post?.file && (
              <>
                <br></br>
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
                      anchor.download = post.file.name;
                      anchor.href = post.file.base64;
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
                    {post.file.type === "zip" ? <FolderZip /> : <InsertDriveFile />}
                    <Typography sx={{ marginLeft: "5px" }}>{post.file.name}</Typography>
                  </Box>
                  <Typography>{post.file.size}</Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Link>
        {post?.images.length > 0 && (
          <Box sx={{ position: "relative" }}>
            <img src={post.images[0]} style={{ cursor: "pointer", width: "100%" }}></img>
            {post.images.length > 1 && (
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(5px)",
                  top: "0",
                  left: "0",
                  right: "-1px",
                  bottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  pointerEvents:
                    post.postedAt === "Posting..." || post.postedAt === "Deleting..."
                      ? "none"
                      : "auto",
                }}
                onClick={() => {
                  setImages(post.images);
                }}
              >
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(20, 20, 20, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "2rem", fontWeight: "600" }}>
                    {post.images.length}
                  </Typography>
                </Box>
              </div>
            )}
          </Box>
        )}
        <CardActions disableSpacing>
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            onClick={like}
            checked={post.likes.includes(user.result._id)}
            disabled={post.loadingLike}
          />
          <Typography>{post.likes.length}</Typography>
          <ExpandMore
            sx={{ marginLeft: 2 }}
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <Comment />
          </ExpandMore>
          <Typography>{post.comments.length}</Typography>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
          <hr
            style={{
              width: "95%",
              // display: "block",
              height: "1px",
              border: 0,
              borderTop: "1px solid lightblue",
              // margin: "1em 0",
              padding: 0,
            }}
          ></hr>
          <CardContent>
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
                width: "100%",
                // backgroundColor: "red",
              }}
            >
              <Avatar
                sx={{ height: "30px", width: "30px" }}
                src={user?.result?.pfp || defaultPfp}
              ></Avatar>
              <Box
                sx={{
                  width: "calc(100% - 30px)",
                  paddingLeft: "10px",
                }}
              >
                <CommentForm
                  sx={{
                    "&:hover": {
                      backgroundColor: post.loadingPostComment
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
                      disabled={post.loadingPostComment}
                      onKeyDown={(e) => {
                        if (e.code === "Enter") {
                          if (shiftHeld) {
                            console.log("Shift is held down");
                          } else {
                            e.preventDefault();
                            if (comment.text.trim() !== "") {
                              commentOnPost();
                              e.target.value = "";
                            }
                          }
                        }
                      }}
                      onChange={(e) => {
                        if (e.code === "Enter") return;
                        // console.log(e.target.value);
                        setComment({ ...comment, text: e.target.value });
                      }}
                      name="inputName"
                      placeholder="Γράψτε ένα σχόλιο..."
                    />
                  </Box>
                  <Stack
                    direction="row"
                    gap={1}
                    mt={2}
                    sx={{
                      padding: "0.5rem",
                      pointerEvents: post.loadingPostComment ? "none" : "auto",
                    }}
                  >
                    <IconButton component="label">
                      <Image color="primary" />
                      <div style={{ display: "none" }}>
                        <ReactImageFileToBase64
                          multiple={true}
                          onCompleted={(data) => {
                            console.log(data);
                            setComment({
                              ...comment,
                              images: [...comment.images, ...data.map((e) => e.base64_file)],
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
                            setComment({
                              ...comment,
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
                  <Box sx={{ paddingInline: "1rem", paddingBottom: "0.1rem" }}>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
                        gridGap: "1rem",
                        paddingBlock: comment.images.length > 0 ? "10px" : 0,
                      }}
                    >
                      {comment.images.map((image, idx) => (
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
                              setComment({
                                ...comment,
                                images: comment.images.filter((image2, idx2) => idx2 !== idx),
                              });
                            }}
                          >
                            <Remove sx={{ width: "15px" }} />
                          </button>
                        </Box>
                      ))}
                    </Box>
                    {comment.file !== null && (
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
                            setComment({
                              ...comment,
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
                          {comment.file.type === "zip" ? <FolderZip /> : <InsertDriveFile />}
                          <Typography sx={{ marginLeft: "5px" }}>{comment.file.name}</Typography>
                        </Box>
                        <Typography>{comment.file.size}</Typography>
                      </Paper>
                    )}
                  </Box>
                </CommentForm>
              </Box>
            </div>
            <div
              style={{
                width: "100%",
                // overflow: "auto",
                // backgroundColor: "darkred",
              }}
            >
              {post.comments.map((comment, idx) => (
                <CommentComponent key={idx} comment={comment} postId={post._id} />
              ))}
            </div>
          </CardContent>
        </Collapse>
      </Card>
      {renderMenu}
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
            Delete post
          </Typography>
          <br></br>
          <Typography fontWeight={500} variant="span">
            Are you sure you want to delete this post?
          </Typography>
          <br></br>
          <br></br>
          <ButtonGroup fullWidth>
            <br></br>
            <Button variant="contained" onClick={closeDeleteConfirmationModal}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </ButtonGroup>
        </Box>
      </StyledModal>
    </>
  );
}
