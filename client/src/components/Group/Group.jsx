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
import { Block } from "@mui/icons-material";

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
  const { user } = useSelector((state) => state.auth);
  const { isLoading, data, lastFetched } = useSelector((state) => state.posts);
  const [group, setGroup] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState(null);
  const [scrollHeight, setScrollHeight] = useState(window.scrollY);
  const [firstFetch, setFirstFetch] = useState(true);
  const [show, setShow] = useState(0);
  let toggleSearch = false;

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
    if (groups.length > 0) return;
    dispatch(fetchGroups());
    // dispatch(fetchPosts({}))
  }, []);

  useEffect(() => {
    setGroup(groups.filter((e) => e._id === location.pathname.split("/")[2])[0]);
  }, [groups]);

  useEffect(() => {
    if (toggleSearch) {
      console.log("TOGGLE SEARCH");
      return;
    }
    console.log(page);
    dispatch(
      fetchPosts(
        {
          userId: user?.result._id,
          groupId: location.pathname.split("/")[2],
          page,
          search,
        },
        setShow
      )
    );
    if (firstFetch) setFirstFetch(false);
  }, [page]);

  useEffect(() => {
    console.log(data.map((e) => e.text));
  }, [data]);

  useEffect(() => {
    if (firstFetch || lastFetched) return;
    // console.log(scrollHeight, document.body.scrollHeight, isLoading);
    console.log(scrollHeight, window.innerHeight, document.body.clientHeight);
    if (scrollHeight + window.innerHeight >= document.body.clientHeight - 1700 && !isLoading) {
      // console.log(scrollHeight, document.body.scrollHeight);
      setPage(page + 1);
    }
  }, [scrollHeight]);

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
        {show === 1 && (
          <Card sx={{ padding: "1rem 0" }}>
            <Search
              onSubmit={(e) => {
                e.preventDefault();
                dispatch({ type: "CLEAR_POSTS" });
                toggleSearch = true;
                setPage(0);
                dispatch(fetchPosts({ groupId: group._id, page: 0, search }));
                // setSearch("");
                toggleSearch = false;
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
        )}
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
              width: "100%",
            }}
          >
            {show === 1 && <Create group={group} />}
            <>
              {data.map((post, index) => (
                <Post key={index} post={post} />
              ))}
              {!lastFetched && show !== 2 && <LoadingPost />}
              {!lastFetched && show !== 2 && <LoadingPost />}
            </>
            {show === 2 && (
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
                    paddingTop: { xs: "8rem", sm: "10rem" },
                  }}
                >
                  <Block sx={{ fontSize: "5rem" }} />
                  <Typography sx={{ textAlign: "center" }}>
                    Εγγραφείτε στην ομάδα για να μπορείτε να δείτε τις δημιοσιεύσεις.
                  </Typography>
                </Box>
              </Box>
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
