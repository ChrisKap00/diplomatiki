import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const Group = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.groups);
  const [group, setGroup] = useState(
    groups.filter((e) => e._id === location.pathname.split("/")[2])[0]
  );

  useEffect(() => {
    const groupId = location.pathname.split("/")[2];
    // dispatch(fetchGroupDetails(groupId));
  }, []);

  return (
    <Box>
      <Box
        sx={{
          padding: "2rem 1rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "600" }}>
          {group?.code}
          {" · "}
          {group?.name}
        </Typography>
      </Box>
      <Stack direction="row" justifyContent="space-between">
        <Box flex={2.5}>posts</Box>
        <Box flex={1}>members</Box>
      </Stack>
    </Box>
  );
};

export default Group;
