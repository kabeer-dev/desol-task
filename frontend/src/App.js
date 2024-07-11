import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddCar from './pages/Home';
import SignIn from './pages/auth/SignIn';
import myAxios from './axios';
import { useSelector, useDispatch } from 'react-redux';
import { authLogin } from './store/authSlice';
import Home from './pages/Home';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() =>{
    const getUser = async() => {
      const token = localStorage.getItem('token');
      if(token){
        const response = await myAxios.get('/account/me',{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Setting Authorization header with Bearer token
          },
        }).catch((error) => {
          console.log('Error', error)
        })

        if(response && response.status === 200){
          dispatch(authLogin(true))
        }
      }
    }
    getUser()
    
  },[])
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />}/>
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
