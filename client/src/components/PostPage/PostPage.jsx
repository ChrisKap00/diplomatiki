import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProfileBox from "../Profile/ProfileBox/ProfileBox";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Messages from "../Messages/Messages";
import { fetchPost } from "../../store/actions/posts";
import LoadingPost from "../LoadingPost/LoadingPost";
import Post from "../Posts/Post/Post";
import { Block } from "@mui/icons-material";

const PostPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.posts);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const [show, setShow] = useState(0);

  useEffect(() => {
    const postId = location.pathname.split("/")[2];
    const postTemp = data.find((post) => post._id === postId);
    if (postTemp) {
      setIsLoading(false);
      return;
    } else {
      dispatch(fetchPost({ userId: user?.result._id, postId }, setIsLoading, setShow));
    }
  }, []);

  return (
    <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
      <Box
        p={2}
        flex={5}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {isLoading && show === 0 ? (
          <LoadingPost />
        ) : show !== 2 ? (
          <Post post={data.find((post) => post._id === location.pathname.split("/")[2])} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: { xs: "13rem", sm: 0 },
              }}
            >
              <Block sx={{ fontSize: "5rem" }} />
              <Typography sx={{ textAlign: "center" }}>
                Δεν είστε εγγεγραμμένος στην ομάδα που έχει γίνει η δημιοσιίευση
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Messages />
    </Stack>
  );
};

export default PostPage;
