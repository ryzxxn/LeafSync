import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Copyright from '../component/copyright';
import axios from 'axios';

export default function Connect() {
  const [status, setStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  let host, user, database;
  let password = '';

  function captureHost(event) {
    host = event.target.value;
  }

  function captureUser(event) {
    user = event.target.value;
  }

  function capturePassword(event) {
    password = event.target.value;
  }

  function captureDatabase(event) {
    database = event.target.value;
  }

  function connect() {
    // Check if Host and User fields are not empty
    if (!host || !user) {
      setErrorMessage('Host and User fields are required.');
      return;
    }

    let ConnectionData = {
      host,
      user,
      password,
      database
    };

    axios.post('http://localhost:5000/connect', ConnectionData)
      .then(response => {
        if (response.data === true) {
          sessionStorage.setItem('host', host);
          sessionStorage.setItem('user', user);
          sessionStorage.setItem('password', password);
          setStatus(true);
        } else {
          console.log('failed');
        }
      })
      .catch(error => {
        console.error('Error connecting:', error);
        setErrorMessage('Error connecting to the server.');
      });
  }

  return (
    <>
      <div className='connection_parent_container'>
          <h2 className='hero_text'>LeafSync</h2>
          <p className='hero_desc'>Connect to your Database</p>
        <div className='connection_input_container'>
          <div>
            <p className='input_title'>Host</p>
            <input className='input_field' onChange={captureHost} type='text'/>
          </div>

          <div>
            <p className='input_title'>User</p>
            <input className='input_field' onChange={captureUser} type='text'/>
          </div>

          <div>
            <p className='input_title'>Password</p>
            <input className='input_field' onChange={capturePassword} type='password'/>
          </div>

          <div>
            <p className='input_title'>Database</p>
            <input className='input_field' onChange={captureDatabase} type='text'/>
          </div>

          {errorMessage && (
            <div className='error-message'>{errorMessage}</div>
          )}

          {status === true && (
            <div className='error-message'>Connected</div>
          )}

          <div>
            {status === false && (
              <div className='proceed-container'>
              <button className='href' onClick={connect}>Connect</button>
              </div>
            )}
          </div>

          {status === true && (
            <div className='proceed-container'>
            <Link className='href' to="../dashboard">Proceed</Link>
            </div>
          )}
        </div>
        <Copyright/>
      </div>
    </>
  );
}
