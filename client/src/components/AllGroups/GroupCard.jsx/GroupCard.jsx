import { Box, Button, Card, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { followGroup } from "../../../store/actions/groups";

const GroupCard = ({ group }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Link
      to={`/group/${group._id}`}
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
              // backgroundColor: "red",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                width: "fit-content",
                minWidth: "70px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "15px",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                padding: "1rem",
              }}
            >
              <Typography>{group.code}</Typography>
            </Box>
          </Box>
          <Typography sx={{ textAlign: "center", padding: "1rem" }}>{group.name}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{ width: "fit-content" }}
            color={
              group.users.findIndex((e) => e._id === user.result._id) > -1 ? "error" : "primary"
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(followGroup(user?.result._id, group._id));
            }}
            disabled={group.loadingFollow}
          >
            {group.users.findIndex((e) => e._id === user.result._id) > -1 ? "Απεγγραφή" : "Εγγραφή"}
          </Button>
        </Box>
      </Card>
    </Link>
  );
};

export default GroupCard;
