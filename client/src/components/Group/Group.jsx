import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, Button, Card, InputBase, Stack, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/actions/groups";
import { fetchPosts } from "../../store/actions/posts";
import LoadingPost from "../LoadingPost/LoadingPost";
import Post from "../Posts/Post/Post";
import Member from "./Member/Member";
import Create from "../Posts/Create/Create";

const Search = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.spacing(20),
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  padding: theme.spacing(0.5, 1, 0.5, 0),
  // vertical padding + font size from searchIcon
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create("width"),
  width: "100%",
}));

const Group = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.groups);
  const { isLoading, data } = useSelector((state) => state.posts);
  const [group, setGroup] = useState(
    groups.filter((e) => e._id === location.pathname.split("/")[2])[0]
  );
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

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
        <Card sx={{ padding: "1rem 0" }}>
          <Search
            onSubmit={(e) => {
              e.preventDefault();
              setPage(0);
              dispatch(fetchPosts({ groupId: group._id, page, search }));
              setSearch("");
            }}
            onChange={(e) => setSearch(e.target.value)}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Αναζητήστε δημιοσιεύσεις..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Card>
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
