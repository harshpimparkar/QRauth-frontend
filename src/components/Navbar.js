// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar
} from '@mui/material';

function Navbar({ user, onLogout }) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Beach Cleanup
        </Typography>
        
        <Button color="inherit" component={Link} to="/">
          Events
        </Button>
        
        <Button color="inherit" component={Link} to="/profile">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
              {user.name.charAt(0)}
            </Avatar>
            Profile
          </Box>
        </Button>
        
        <Button color="inherit" onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;