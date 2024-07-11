import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Box, Typography, Alert, CircularProgress  } from '@mui/material';
import myAxios from '../../axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authLogin } from '../../store/authSlice';
import MyAppBar from '../../components/MyAppBar';

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if(isLoggedIn){
      navigate('/')
    }
  })
  const handleSubmit = async (e) => {
    setLoading(true)
    setErrors([])
    e.preventDefault();
    const response = await myAxios.post('/auth/login', formData).catch((error) => {
      if (error.response) {
        console.error('Error Response:', error.response);
        if(error.response.status !== 422){
          setMessage(error.response.data.message);
          setMessageType('error');
        }
        setLoading(false);
        if (error.response.status === 422) {
          const newValidationErrors = error.response.data.validationErrors.map((validationError) => ({
            [validationError.field]: validationError.message
          }));

          setErrors(newValidationErrors);
          setLoading(false);
        }
        // if(error.response.status === 404){
        //   setTimeout(() => {
        //     setMessage(error.response.data.message);
        //     setMessageType('error');
        //   }, 5000);
        // }
      } else {
        console.error('Error:', error.message);
        setLoading(false);
      }
    });
    if(response && response.status === 200){
      const token = response.data.data.accessToken
      localStorage.setItem('token', token);
      dispatch(authLogin(true))
      setLoading(false)
      navigate('/')
    }
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

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
    <>
      <MyAppBar />
      <Container component="main" maxWidth="xs">
        <Box style={containerStyle}>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          {message && (
            <Alert severity={messageType} style={{ width: '100%', marginTop: '8px' }}>
              {message}
            </Alert>
          )}
          <form style={formStyle} noValidate onSubmit={handleSubmit}>
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
              value={formData.email}
              onChange={handleChange}
            />
            {errors && errors.map((err) => <Typography sx={{ color: 'red', mt: 0.5 }}>{err.email}</Typography>)}
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
              value={formData.password}
              onChange={handleChange}
            />
            {errors && errors.map((err) => <Typography sx={{ color: 'red', mt: 0.5 }}>{err.password}</Typography>)}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default SignIn;
