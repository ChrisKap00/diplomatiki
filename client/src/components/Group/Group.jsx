import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/actions/groups";
import { fetchPosts } from "../../store/actions/posts";
import LoadingPost from "../LoadingPost/LoadingPost";
import Post from "../Posts/Post/Post";
import Member from "./Member/Member";
import Create from "../Posts/Create/Create";

const Group = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.groups);
  const { isLoading, data } = useSelector((state) => state.posts);
  const [group, setGroup] = useState(
    groups.filter((e) => e._id === location.pathname.split("/")[2])[0]
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchGroups());
    // dispatch(fetchPosts({}))
  }, []);

  useEffect(() => {
    setGroup(
      groups.filter((e) => e._id === location.pathname.split("/")[2])[0]
    );
  }, [groups]);

  useEffect(() => {
    if (group) dispatch(fetchPosts({ groupId: group._id, page }));
  }, [group]);

  return (
    <Box>
      <Box
        sx={{
          padding: "2rem 1rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          // backgroundColor: "yellow",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "600" }}>
          {group?.code}
          {" · "}
          {group?.name}
        </Typography>
      </Box>
      <Box
        sx={{
          padding: {
            xs: "0.5rem",
            md: "0.5rem 5rem",
            lg: "0.5rem 2rem",
            xl: "0.5rem 10rem",
          },
          // paddingBottom: 0,
          // backgroundColor: "blue",
        }}
      >
        <Card sx={{ padding: "1rem" }}>hi</Card>
      </Box>
      <Box
        sx={{
          padding: {
            xs: "1rem 0.5rem",
            md: "1rem 5rem",
            lg: "1rem 2rem",
            xl: "1rem 10rem",
          },
          // backgroundColor: "red",
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          <Box
            flex={2.5}
            sx={{
              paddingRight: { xs: 0, lg: "20px" },
              // backgroundColor: "lightgreen",
              width: "100%",
            }}
          >
            <Create group={group} />
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
          <Box
            flex={1}
            sx={{
              display: { xs: "none", lg: "block" },
            }}
          >
            {group?.users.map((user, index) => (
              <Member key={index} user={user} />
            ))}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Group;
