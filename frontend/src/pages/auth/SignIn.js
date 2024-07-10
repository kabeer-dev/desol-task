import React from 'react';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

const SignIn = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  const formStyle = {
    width: '100%', // Fix IE 11 issue.
    marginTop: '8px',
  };

  const submitStyle = {
    margin: '24px 0 16px',
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box style={containerStyle}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form style={formStyle} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={submitStyle}
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignIn;
