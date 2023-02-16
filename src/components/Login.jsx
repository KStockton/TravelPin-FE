import React, { useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './login.css';
import { Room, Cancel } from '@mui/icons-material';

export default function Login({ setShowLogin, loginTravelAppStorage, onSetCurrentUser }) {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const nameRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    }

    setSuccess(true);

    try {
     const res = await axios.post('/users/login', newUser);
      loginTravelAppStorage.setItem("users", res.data.username);
      
      onSetCurrentUser(res.data.username);
      setShowLogin(false)
      setSuccess(true)
      setError(false)
    } catch(err) {
      console.log(err)
      setError(true)
      setSuccess(false)
    }
  }
  return (
    <div className='loginContainer'>
      <div className="logo"> 
        <Room/> <h2>Travel and Review</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef}/>
        <input type="password" placeholder="password" ref={passwordRef}/>
        <button className='loginBtn'>Login</button>
        {success && (
        <div className='success'>You are logged in!</div>
        )}
        {error && (
        <div className='failure'>Error logging in</div>
        )}
      </form>
      <Cancel className='loginCancel' onClick={() => setShowLogin(false)}/>
    </div>
  );
}

Login.propTypes = {
  setShowLogin: PropTypes.func,
  loginTravelAppStorage: PropTypes.object,
  onSetCurrentUser: PropTypes.func,
}
