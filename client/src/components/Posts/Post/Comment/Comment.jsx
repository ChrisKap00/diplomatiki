import { Avatar, Box, Card, Checkbox, Grid, Typography } from "@mui/material";
import React from "react";
import defaultPfp from "../../../../assets/defaultPfp.jpg";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Favorite,
  FavoriteBorder,
  FolderZip,
  InsertDriveFile,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { likeComment } from "../../../../store/actions/posts";

const Comment = ({ comment, postId }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div
      style={{
        display: "flex",
        marginTop: "20px",
      }}
    >
      <Link to={`/profile/${comment.userId}`}>
        <Avatar
          sx={{ height: "30px", width: "30px" }}
          src={defaultPfp}
        ></Avatar>
      </Link>
      <Box sx={{ width: "100%", paddingLeft: "10px" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%" }}>
            <Card
              sx={{
                width: "fit-content",
                display: "block",
                wordBreak: "break-word",
                padding: "10px 15px",
                borderRadius: "15px",
                opacity: comment.postedAt === "Posting..." ? "50%" : "100%",
              }}
            >
              <Link
                to={`/profile/${comment.userId}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  width: "fit-content",
                  cursor: "pointer",
                }}
              >
                {/* <Typography
              sx={{
                fontWeight: "bold",
                backgroundColor: "red",
                width: "fit-content",
              }}
            > */}
                <label style={{ fontWeight: "bold", cursor: "pointer" }}>
                  {comment.userName}
                </label>
                {/* </Typography> */}
              </Link>
              <Typography>{comment.text}</Typography>
            </Card>
            {comment?.images.length > 0 && (
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
                  src={comment.images[0]}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                ></img>
                {comment.images.length > 1 && (
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
                      <Typography sx={{ fontSize: "2rem", fontWeight: "600" }}>
                        {comment.images.length}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            {comment.file !== null && (
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
                    anchor.download = comment.file.name;
                    anchor.href = comment.file.base64;
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
                  {comment.file.type === "zip" ? (
                    <FolderZip />
                  ) : (
                    <InsertDriveFile />
                  )}
                  <Typography sx={{ marginLeft: "5px" }}>
                    {comment.file.name}
                  </Typography>
                </Box>
                <Typography>{comment.file.size}</Typography>
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
                dispatch(
                  likeComment({
                    userId: user.result._id,
                    postId,
                    commentId: comment._id,
                  })
                );
              }}
              checked={comment.likes.includes(user.result._id)}
              disabled={comment.loadingLike}
            />
            <Typography>{comment.likes.length}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", paddingTop: "5px" }}>
          <Typography sx={{ opacity: "50%" }}>
            {comment.postedAt === "Posting..."
              ? "Posting..."
              : moment(comment.postedAt).fromNow()}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Comment;
