import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { authLogin } from '../store/authSlice';

const MyAppBar = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(authLogin(false));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Desolint Task
        </Typography>
        {isLoggedIn && (
            <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
