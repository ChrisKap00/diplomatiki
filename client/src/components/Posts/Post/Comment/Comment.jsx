import { Avatar, Card, Grid, Typography } from "@mui/material";
import React from "react";
import defaultPfp from "../../../../assets/defaultPfp.jpg";
import moment from "moment";

const Comment = ({ comment }) => {
  return (
    <div
      style={{
        display: "flex",
        marginTop: "20px",
      }}
    >
      <Avatar sx={{ height: "30px", width: "30px" }} src={defaultPfp}></Avatar>
      <Grid container style={{ width: "100%", paddingLeft: "10px" }}>
        <Card
          sx={{
            width: "100%",
            display: "block",
            wordBreak: "break-word",
            padding: "10px 15px",
            borderRadius: "15px",
            opacity: comment.temporary ? "50%" : "100%",
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>
            {comment.userName}
          </Typography>
          {comment.text}
        </Card>
        <Typography sx={{ opacity: "50%", marginTop: "5px" }}>
          {comment.temporary
            ? "Posting..."
            : moment(comment.postedAt).fromNow()}
        </Typography>
      </Grid>
    </div>
  );
};

export default Comment;
