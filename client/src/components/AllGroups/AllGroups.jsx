import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/actions/groups";
import GroupCard from "./GroupCard.jsx/GroupCard";

const AllGroups = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, []);

  return (
    <Box
      sx={{
        listStyle: "none",
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
        gridGap: "1rem",
        marginTop: "1rem",
      }}
    >
      {groups.map((group, index) => (
        <GroupCard key={index} group={group} />
      ))}
    </Box>
  );
};

export default AllGroups;
