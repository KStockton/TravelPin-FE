import React, { useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Room, Cancel } from '@mui/icons-material';
import './register.css';

export default function Register({ setShowRegister, onSetCurrentUser, loginTravelAppStorage }) {
  const [ success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    }

    setSuccess(true);

    try {
      await axios.post('/users/register', newUser);
      loginTravelAppStorage.setItem("users", nameRef.current.value);
      onSetCurrentUser(nameRef.current.value)
      setSuccess(true)
      setError(false)

    } catch(err) {
      console.log(err)
      setError(true)
      setSuccess(false)
    }
  }
  return (
    <div className='registerContainer'>
      <div className="logo"> 
        <Room/> <h2>Travel and Review</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef}/>
        <input type="email" placeholder="email" ref={emailRef}/>
        <input type="password" placeholder="password" ref={passwordRef}/>
        <button className='registerBtn'>Register</button>
        {success && (
          <div className='success'>You are registered!</div>
          )}
        {error && (
        <div className='failure'>Opps Sorry</div>
        )}
      </form>
      <Cancel className='registerCancel' onClick={() => setShowRegister(false)}/>
    </div>
  );
}

Register.propTypes = {
  setShowRegister: PropTypes.func,
  onSetCurrentUser: PropTypes.func,
  loginTravelAppStorage: PropTypes.object
}
