import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import UserCard from "./UserCard/UserCard";
import { fetchUsers } from "../../store/actions/profile";

const Search = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [query, setQuery] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (!location.search) return;
    setQuery(location.search.substring(3));
  }, [location]);

  useEffect(() => {
    if (!query || query.length < 3) return;
    dispatch(fetchUsers(query, setUsers));
  }, [query]);

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
      {users !== null &&
        users.map((user, index) => <UserCard key={index} user={user} />)}
    </Box>
  );
};

export default Search;
