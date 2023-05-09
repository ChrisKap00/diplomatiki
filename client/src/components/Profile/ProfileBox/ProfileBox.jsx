import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchPosts } from "../../../store/actions/posts";
import defaultPfp from "../../../assets/defaultPfp.jpg";
import Post from "../../Posts/Post/Post";
import LoadingPost from "../../LoadingPost/LoadingPost";
import { Check, Clear, Edit, Message } from "@mui/icons-material";
import ReactImageFileToBase64 from "react-file-image-to-base64";
import { changePfp, fetchProfileInfo } from "../../../store/actions/profile";

const ProfileBox = () => {
  const [profile, setProfile] = useState(null);
  const { user, isLoadingChangePfp } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const { isLoading, data, lastFetched } = useSelector((state) => state.posts);
  const [pfp, setPfp] = useState(null);
  const [scrollHeight, setScrollHeight] = useState(window.scrollY);
  const [firstFetch, setFirstFetch] = useState(true);
  const navigate = useNavigate();

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
    setPage(0);
    dispatch(
      fetchPosts({ profileId: location.pathname.split("/")[2], page: 0 })
    );
    if (firstFetch) setFirstFetch(false);
    const id = location.pathname.split("/")[2];
    console.log(id);
    if (user?.result._id === id)
      setProfile({
        _id: user.result._id,
        firstName: user.result.firstName,
        lastName: user.result.lastName,
        pfp: user.result.pfp,
      });
    else
      dispatch(fetchProfileInfo(location.pathname.split("/")[2], setProfile));
  }, [location]);

  useEffect(() => {
    if (page === 0 || firstFetch) return;
    console.log(page);
    dispatch(fetchPosts({ profileId: location.pathname.split("/")[2], page }));
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
      flex={5}
      p={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={pfp ? pfp : profile?.pfp ? profile.pfp : defaultPfp}
            sx={{
              width: "100px",
              height: "100px",
              cursor: user?.result?._id === profile?._id ? "pointer" : "auto",
              position: "relative",
            }}
          ></Avatar>
          {user?.result._id === profile?._id && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "50%",
                opacity: isLoadingChangePfp ? 1 : 0,
                "&:hover": { opacity: 1 },
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              component="label"
            >
              {!isLoadingChangePfp ? (
                <>
                  <Edit sx={{ fontSize: "2rem" }} />
                  <div style={{ display: "none" }}>
                    <ReactImageFileToBase64
                      multiple={false}
                      onCompleted={(data) => {
                        console.log(data);
                        setPfp(data[0].base64_file);
                      }}
                    />
                  </div>
                </>
              ) : (
                <CircularProgress />
              )}
            </Box>
          )}
        </Box>
        {pfp !== null && (
          <Box
            sx={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              style={{
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                setPfp(null);
              }}
              disabled={isLoadingChangePfp}
            >
              <Clear />
            </button>
            <button
              style={{
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(changePfp(user?.result._id, pfp));
              }}
              disabled={isLoadingChangePfp}
            >
              <Check />
            </button>
          </Box>
        )}
        {profile !== null && (
          <Box
            sx={{
              marginTop: "10px",
              position: "relative",
              width: "90%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{}} variant="h5">
              {`${profile?.firstName} ${profile?.lastName}`}
            </Typography>
            {profile?._id !== user?.result?._id && (
              <IconButton
                sx={{ position: "absolute", right: 0 }}
                onClick={() => {
                  navigate(`/messages?id=${profile._id}`);
                }}
              >
                <Message />
              </IconButton>
            )}
          </Box>
        )}
        <hr width="90%" style={{ opacity: "60%" }}></hr>
        <br></br>
        <>
          {data.map((post, index) => (
            <Post key={index} post={post} />
          ))}
          {!lastFetched && <LoadingPost />}
          {!lastFetched && <LoadingPost />}
        </>
      </>
    </Box>
  );
};

export default ProfileBox;
