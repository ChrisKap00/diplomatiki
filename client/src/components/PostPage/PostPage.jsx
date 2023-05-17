import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProfileBox from "../Profile/ProfileBox/ProfileBox";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Messages from "../Messages/Messages";
import { fetchPost } from "../../store/actions/posts";
import LoadingPost from "../LoadingPost/LoadingPost";
import Post from "../Posts/Post/Post";

const PostPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data } = useSelector((state) => state.posts);

  useEffect(() => {
    const postId = location.pathname.split("/")[2];
    const postTemp = data.find((post) => post._id === postId);
    if (postTemp) {
      setPost(postTemp);
      setIsLoading(false);
    } else {
      dispatch(fetchPost(postId, setPost, setIsLoading));
    }
  }, []);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ width: "100%" }}
    >
      <Box
        p={2}
        flex={5}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {isLoading ? <LoadingPost /> : <Post post={post} />}
      </Box>
      <Messages />
    </Stack>
  );
};

export default PostPage;
