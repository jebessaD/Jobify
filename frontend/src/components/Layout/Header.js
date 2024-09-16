import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; 
import { logout } from "../../actions/authActions";

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 96 960 960"
    width="24"
  >
    <path d="M120 936v-60h720v60H120Zm0-180v-60h720v60H120Zm0-180v-60h720v60H120Z" />
  </svg>
);

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Dropdown Menu */}
        <IconButton
          style={{
            marginRight: 20,
            paddingBottom: 5,
          }}
          edge="end"
          color="inherit"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Link
              to="/dashboard"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Dashboard
            </Link>
          </MenuItem>
          {user?.role === "super-admin" ? (
            <MenuItem onClick={handleMenuClose}>
              <Link
                to="/admin-management"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Admin Management
              </Link>
            </MenuItem>
          ) : (
            <>
              {" "}
              <MenuItem onClick={handleMenuClose}>
                <Link
                  to="/job-management"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Job Management
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link
                  to="/company-management"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Company Management
                </Link>
              </MenuItem>
            </>
          )}

          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Jobify
          </Link>
          {user && ` - Welcome, ${user.name}`}
        </Typography>

        {user ? (
          <Box style={{ display: "flex", alignItems: "center" }}>
            {/* User Info */}
            <Typography variant="body1" style={{ marginRight: 20 }}>
              {user.email}
            </Typography>
            <Typography variant="body1" style={{ marginRight: 20 }}>
              {user.role}
            </Typography>
          </Box>
        ) : (
          <Link
            to="/login"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <Button color="inherit">Login</Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
