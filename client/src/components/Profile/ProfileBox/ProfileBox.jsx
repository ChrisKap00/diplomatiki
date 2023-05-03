import { Avatar, Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchPosts } from "../../../store/actions/posts";
import defaultPfp from "../../../assets/defaultPfp.jpg";
import Post from "../../Posts/Post/Post";
import LoadingPost from "../../LoadingPost/LoadingPost";
import { Check, Clear, Edit } from "@mui/icons-material";
import ReactImageFileToBase64 from "react-file-image-to-base64";
import { changePfp } from "../../../store/actions/profile";

const ProfileBox = () => {
  const [profile, setProfile] = useState(null);
  const { user, isLoadingChangePfp } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const { isLoading, data } = useSelector((state) => state.posts);
  const [pfp, setPfp] = useState(null);

  useEffect(() => {
    const id = location.pathname.split("/")[2];
    console.log(id);
    if (user?.result._id === id)
      setProfile({
        _id: user.result._id,
        firstName: user.result.firstName,
        lastName: user.result.lastName,
        pfp: user.result.pfp,
        posts: user.result.posts,
        groups: user.result.groups,
      });
  }, []);

  useEffect(() => {
    if (!profile) return;
    console.log(profile);
    dispatch(fetchPosts({ profileId: profile._id, page }));
  }, [profile]);

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
        <Typography sx={{ marginTop: "10px" }} variant="h5">
          {`${profile?.firstName} ${profile?.lastName}`}
        </Typography>
        <hr width="90%" style={{ opacity: "60%" }}></hr>
        <br></br>
        {isLoading ? (
          <>
            <LoadingPost />
            <LoadingPost />
            <LoadingPost />
          </>
        ) : (
          data.map((post, index) => <Post key={index} post={post} />)
        )}
      </>
    </Box>
  );
};

export default ProfileBox;
