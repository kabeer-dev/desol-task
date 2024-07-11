import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Input, Select, MenuItem, FormControl, Grid, Alert, Tooltip, Icon, CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MyAppBar from './MyAppBar';
import CloseIcon from '@mui/icons-material/Close';
import AWS from '../aws-config'
import myAxios from '../axios';

const CarForm = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState([])

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  const [formData, setFormData] = useState({
    price: '',
    phone: '',
    // city: '',
    noOfCopies: '',
    images: null,
    country: '', // Default country selection
  });
  const [loading, setLoading] = useState(false)
  const handleImageChange = (event) => {
    setErrors([]);
    const files = event.target.files;
    if (files) {
      const webpFiles = Array.from(files).filter(
        (file) => file.type === 'image/webp' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      );
      setImages(webpFiles);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleDeleteImage = (indexToDelete) => {
    setLoading(true);
    const filterImages = images.filter((_, index) => index !== indexToDelete);
    setImages(filterImages);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (images.length <= 0) {
      setErrors([{ images: 'No Image Selected' }]);
      setLoading(false);
      return;
    }
    //S3
    const s3 = new AWS.S3();
    const promises = images.map(async (file) => {
      const timestamp = Date.now(); // Get a unique timestamp
      const uniqueFileName = `${timestamp}_${file.name}`; // Append timestamp to the file name
      const params = {
        Bucket: 'codegame-test',
        Key: `uploads/${uniqueFileName}`,
        Body: file
      };

      try {
        const data = await s3.upload(params).promise();
        return data.Location;
      } catch (err) {
        console.error('Error uploading to S3', err);
        setLoading(false);
        throw err;
      }
    });

    try {
      const uploadResults = await Promise.all(promises);
      const data = {
        price: formData.price,
        phone: formData.phone,
        country: formData.country,
        noOfCopies: formData.noOfCopies,
        images: uploadResults
      };
      const token = localStorage.getItem('token');
      console.log('vvv', token)
      const response = await myAxios.post('/car/create-car', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Setting Authorization header with Bearer token
        },
      }).catch((error) => {
          if (error.response) {
              console.error('Error Response:', error.response);
              setLoading(false);
              if (error.response.status === 422) {
                  const newValidationErrors = error.response.data.validationErrors.map((validationError) => ({
                      [validationError.field]: validationError.message
                  }));

                  setErrors(newValidationErrors);
                  setLoading(false);
              }
          } else {
              console.error('Error:', error.message);
              setLoading(false);
          }
      });
      if (response.status === 200) {
          setLoading(false);
          setMessage(response.data.data.message)
          setMessageType('success');
          setFormData({
            price: '',
            phone: '',
            // city: '',
            noOfCopies: '',
            images: null,
            country: '', // Default country selection
          });
          setImages([])
          
      }
    } catch (err) {
      console.error('Error uploading multiple files', err);
      throw err; // Handle error as needed
    }

    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/sign-in');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <MyAppBar />
      {isLoggedIn && (
        <Container component="main" maxWidth="sm">
          {message && (
            <Alert severity={messageType} style={{ width: '100%', marginTop: '8px' }}>
              {message}
            </Alert>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
            }}
          >
            <Typography component="h1" variant="h5">
              Add New Item
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 16 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="price"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
              {errors && errors.map((err) => <Typography sx={{ color: 'red', mt: 0.5 }}>{err.price}</Typography>)}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors && errors.map((err) => <Typography sx={{ color: 'red', mt: 0.5 }}>{err.phone}</Typography>)}
              <Select
                variant="outlined"
                fullWidth
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                label="Country"
                id="country"
                margin="normal"
                required
              >
                <MenuItem value="Pakistan">Pakistan</MenuItem>
                <MenuItem value="India">India</MenuItem>
              </Select>
              {errors && errors.map((err) => <Typography sx={{ color: 'red', mt: 0.5 }}>{err.country}</Typography>)}
              {/* <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              /> */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="noOfCopies"
                label="Number of Copies"
                name="noOfCopies"
                value={formData.noOfCopies}
                onChange={handleChange}
              />
              {errors && errors.map((err) => <Typography sx={{ color: 'red', mt: 0.5 }}>{err.noOfCopies}</Typography>)}
              {/* <Input
                type="file"
                name="images"
                id="images"
                fullWidth
                onChange={handleChange}
                inputProps={{ accept: 'image/*' }}
              /> */}
              {images.length > 0 ? (
                <Grid container>
                  <Grid item xs={12}>
                    {images.length > 0 && (
                      <Grid container spacing={2}>
                        {images.map((file, index) => (
                          <Grid item sm={3} xs={6} key={index}>
                            <Box
                              sx={{
                                width: '100%',
                                height: '150px',
                                backgroundImage: `url(${URL.createObjectURL(file)})`, // Set background image
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              <Tooltip title="Remove" placement="top">
                                <Icon
                                  onClick={() => {
                                    handleDeleteImage(index);
                                  }}
                                  component={CloseIcon}
                                // sx={{
                                //   ...CloseBtn,
                                //   color: theme.palette.error
                                // }}
                                />
                              </Tooltip>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              ) : (
                ''
              )}
              {!images.length > 0 ? (
                <FormControl fullWidth>
                  <Grid sx={{ mb: '5px', display: 'flex', justifyContent: { sm: 'start', xs: 'center' } }}>
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png, image/webp"
                      disabled={loading}
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="files"
                      multiple
                    />
                    <label htmlFor="files">
                      <Button
                        variant="outlined"
                        component="span"
                        // startIcon={<CloudUploadIcon />}
                        disabled={loading}
                      // style={{
                      //     color: !loading ? theme.palette.success.main : 'gray',
                      //     border: '1px solid',
                      //     borderColor: !loading ? theme.palette.success.main : 'gray'
                      // }}
                      >
                        Upload Images
                      </Button>
                    </label>
                  </Grid>
                </FormControl>

              ) : (
                ''
              )}
              {errors && errors.map((err) => <Typography sx={{ color: 'red', mt: 0.5 }}>{err.images}</Typography>)}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </form>
          </Box>
        </Container>
      )}
    </>
  );
};

export default CarForm;
