import './register.css';
import React, { useState, useRef } from 'react';
import { Room, Cancel } from '@mui/icons-material';
import axios from 'axios';

export default function Register({setShowRegister}) {
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
     const res = await axios.post('/users/register', newUser);
      setSuccess(true)
      console.log(res)
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
        <Room/> Travel Pin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef}/>
        <input type="email" placeholder="email" ref={emailRef}/>
        <input type="password" placeholder="password" ref={passwordRef}/>
        <button className='registerBtn'>Register</button>
        {success && (
          <span className='success'> Logged in!</span>
          )}
        {error && (
        <span className='failure'> Opps Sorry</span>
        )}
      </form>
      <Cancel className='registerCancel' onClick={() => setShowRegister(false)}/>
    </div>
  );
}
