import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import defaultPfp from "../../../assets/defaultPfp.jpg";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();

  return (
    <Link
      to={`/profile/${user._id}`}
      style={{
        textDecoration: "none",
        color: "white",
      }}
    >
      <Card
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "10px",
          padding: "1rem",
          paddingBottom: 0,
          position: "relative",
          wordBreak: "break-word",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          },
          transition: "0.2s",
          flexGrow: 1,
          //   minWidth: "10px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              src={user.pfp || defaultPfp}
              sx={{ width: "60px", height: "60px" }}
            />
          </Box>
          <Typography sx={{ textAlign: "center", padding: "1rem" }}>
            {user.name}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};

export default UserCard;
