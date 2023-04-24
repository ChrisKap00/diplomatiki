import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import testImage from "../../assets/login_bg.jpg";
import Create from "./Create/Create";
import Post from "./Post/Post";
import { useDispatch, useSelector } from "react-redux";
import LoadingPost from "../LoadingPost/LoadingPost";
import { fetchPosts } from "../../store/actions/posts";

const Posts = () => {
  const { isLoading, data } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  useEffect(() => {
    console.log(page);
    dispatch(
      fetchPosts({
        userId: user?.result._id,
        groups: user?.result.groups,
        page,
      })
    );
  }, [page]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // backgroundColor: "blue",
        width: "100%",
      }}
      flex={5}
      p={2}
    >
      <Create />
      {isLoading ? (
        <>
          <LoadingPost />
          <LoadingPost />
          <LoadingPost />
        </>
      ) : (
        data.map((post, index) => <Post key={index} post={post} />)
      )}
    </Box>
  );
};

export default Posts;
