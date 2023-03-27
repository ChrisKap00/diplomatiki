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
} from "@mui/material";
import {
  Comment,
  Favorite,
  FavoriteBorder,
  FolderZip,
  InsertDriveFile,
} from "@mui/icons-material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import defaultPfp from "../../../assets/defaultPfp.jpg";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
// import { deletePost, likePost, postComment } from "../../store/actions/posts";

import CommentComponent from "./Comment/Comment";
import { Link, useLocation } from "react-router-dom";

const CommentForm = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: "10px",
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
  const [comment, setComment] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

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

  const commentOnPost = () => {
    console.log(`Commenting: ${comment.trim()}`);
    setComment("");
    // dispatch(
    //   postComment(
    //     {
    //       userId: user.result._id,
    //       userName: user.result.name,
    //       userOfPost: post.creatorId,
    //       postId: post._id,
    //       comment: comment.trim(),
    //     },
    //     location.pathname
    //   )
    // );
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const like = () => {
    console.log("Liking post");
    // dispatch(
    //   likePost(
    //     {
    //       liker: user.result._id,
    //       userId: post.creatorId,
    //       postId: post._id,
    //     },
    //     location.pathname
    //   )
    // );
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
    // dispatch(deletePost(post._id, post.creatorId, location.pathname));
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
        <MenuItem onClick={handleMenuClose}>Edit (not implemented)</MenuItem>
      )}
      {post.userId === user.result._id && (
        <MenuItem onClick={openDeleteConfirmationModal}>Delete</MenuItem>
      )}
    </Menu>
  );

  return (
    <>
      <Card
        sx={{
          width: { xs: "100%", xl: "90%" },
          marginBottom: "20px",
          opacity: post.temporary || post.temporaryDelete ? "50%" : "100%",
          pointerEvents:
            post.temporary || post.temporaryDelete ? "none" : "auto",
        }}
        elevation={10}
      >
        <CardHeader
          avatar={
            <Link
              to={`/profile?id=${post.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Avatar src={defaultPfp}></Avatar>
            </Link>
          }
          action={
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <Link
              to={`/profile?id=${post.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {post.userName}
            </Link>
          }
          subheader={
            post.temporary
              ? "Posting..."
              : post.temporaryDelete
              ? "Deleting..."
              : moment(post.postedAt).fromNow()
          }
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
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
                  {post.file.type === "zip" ? (
                    <FolderZip />
                  ) : (
                    <InsertDriveFile />
                  )}
                  <Typography sx={{ marginLeft: "5px" }}>
                    {post.file.name}
                  </Typography>
                </Box>
                <Typography>{post.file.size}</Typography>
              </Box>
            </>
          )}
        </CardContent>
        {post?.images?.length && (
          <CardMedia
            component="img"
            // height="50%"
            image={post.images[0]}
            sx={{ objectFit: "revert" }}
            alt="Paella dish"
          />
        )}
        <CardActions disableSpacing>
          {/* <IconButton aria-label="add to favorites"> */}
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            onClick={like}
            checked={post.likes.includes(user.result._id)}
          />
          {/* </IconButton> */}
          <Typography>{post.likes.length}</Typography>
          {/* <IconButton sx={{ marginLeft: 2 }} aria-label="share">
          <ShareIcon />
        </IconButton> */}
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
        <Collapse in={expanded} timeout="auto" unmountOnExit>
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
                // backgroundColor: "red",
              }}
            >
              <Avatar
                sx={{ height: "30px", width: "30px" }}
                src={defaultPfp}
              ></Avatar>
              <CommentForm
              // onSubmit={(e) => {
              //   // e.preventDefault();
              //   console.log(e);
              // }}
              >
                <StyledInputBase
                  disabled={post.loadingPostComment}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") {
                      if (shiftHeld) {
                        console.log("Shift is held down");
                      } else {
                        e.preventDefault();
                        if (comment.trim() !== "") {
                          commentOnPost();
                          e.target.value = "";
                        }
                      }
                    }
                  }}
                  onChange={(e) => {
                    if (e.code === "Enter") return;
                    // console.log(e.target.value);
                    setComment(e.target.value);
                  }}
                  name="inputName"
                  placeholder="Γράψτε ένα σχόλιο..."
                />
              </CommentForm>
            </div>
            {post.comments.map((comment, idx) => (
              <CommentComponent key={idx} comment={comment} />
            ))}
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
