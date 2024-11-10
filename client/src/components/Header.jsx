import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout, username }) => {
  return (
    <AppBar  position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Employee Management
        </Typography>
        {isLoggedIn ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/employees">
                Employee List
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {username}
              </Typography>
              <Button color="inherit" onClick={onLogout}>
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;