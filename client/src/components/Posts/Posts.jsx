import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import testImage from "../../assets/login_bg.jpg";
import Create from "./Create/Create";
import Post from "./Post/Post";
import { useDispatch, useSelector } from "react-redux";
import LoadingPost from "../LoadingPost/LoadingPost";
import { fetchPosts } from "../../store/actions/posts";

const Posts = () => {
  const { isLoading, data, lastFetched } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(window.scrollY);
  const [firstFetch, setFirstFetch] = useState(true);

  useEffect(() => {
    window.addEventListener(
      "scroll",
      () => {
        setScrollHeight(window.scrollY);
      },
      { passive: true }
    );
  }, []);

  useEffect(() => {
    console.log(page);
    dispatch(
      fetchPosts({
        userId: user?.result._id,
        groups: user?.result.groups,
        page,
      })
    );
    if (firstFetch) setFirstFetch(false);
  }, [page]);

  useEffect(() => {
    if (firstFetch || lastFetched) return;
    // console.log(scrollHeight, document.body.scrollHeight, isLoading);
    console.log(scrollHeight, window.innerHeight, document.body.clientHeight);
    if (
      scrollHeight + window.innerHeight >= document.body.clientHeight - 1700 &&
      !isLoading
    ) {
      // console.log(scrollHeight, document.body.scrollHeight);
      setPage(page + 1);
    }
  }, [scrollHeight]);

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
      <>
        {data.map((post, index) => (
          <Post key={index} post={post} />
        ))}
        {!lastFetched && <LoadingPost />}
        {!lastFetched && <LoadingPost />}
      </>
    </Box>
  );
};

export default Posts;
