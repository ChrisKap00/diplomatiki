import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import defaultPfp from "../../assets/defaultPfp.jpg";
import {
  Groups,
  Inbox,
  Logout,
  Notifications,
  Person,
  PersonAdd,
  Settings,
} from "@mui/icons-material";

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
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const NavBar = () => {
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // ---
  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate(0);
  };

  const profileMenuId = "primary-search-account-menu";
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
    handleMobileMenuClose();
  };
  const renderMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      id="account-menu"
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}
      onClick={handleProfileMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        sx={{
          position: "sticky",
          height: "64px",
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            minWidth: "100%",
            position: "absolute",
          }}
        >
          <Search
          //   onSubmit={handleSearch}
          //   onChange={(e) => setSearch(e.target.value)}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Link to="/groups" style={{ textDecoration: "none", color: "white" }}>
            <IconButton
              size="large"
              edge="end"
              // aria-controls={menuId}
              aria-haspopup="true"
              // onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                marginLeft: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "20px",
                height: "30px",
                width: "30px",
              }}
            >
              <Groups sx={{ fontSize: "30px" }} />
            </IconButton>
          </Link>
          <IconButton
            size="large"
            edge="end"
            // aria-controls={menuId}
            aria-haspopup="true"
            // onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              marginLeft: "25px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "20px",
              height: "30px",
              width: "30px",
            }}
          >
            <Inbox sx={{ fontSize: "100%" }} />
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            // aria-controls={menuId}
            aria-haspopup="true"
            // onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              marginLeft: "25px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "20px",
              height: "30px",
              width: "30px",
            }}
          >
            <Notifications sx={{ fontSize: "100%" }} />
          </IconButton>
          {/* <Box sx={{ flexGrow: 0.05 }}></Box> */}
          <IconButton
            size="large"
            edge="end"
            aria-controls={profileMenuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              marginLeft: "40px",
              marginRight: "1px",
              padding: 0,
              height: "30px",
              width: "30px",
            }}
          >
            <Avatar
              src={user.pfp ? user.pfp : defaultPfp}
              // sx={{ height: "30px", width: "30px" }}
              sx={{ height: "35px", width: "35px", aspectRatio: 1 }}
            />
          </IconButton>
          <Typography marginLeft={1}>
            {`${user?.result?.firstName} ${user?.result?.lastName}`}
          </Typography>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </>
  );
};

export default NavBar;
