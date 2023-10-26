import { useState } from 'react'
import axios from 'axios';
import './css/Login.css'
import gradIcon from "./images/student-grad.png";
import {useNavigate} from 'react-router-dom'




export default function Login() {
  const navigator = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  async function authorizeUser() {

    var credentials = JSON.stringify({
      "username": username,
      "password": password
    });
    alert("reminder to implement user login")
    var response = await getUser(credentials)
    response = "place auth token" // comment out after implementation
    sessionStorage.setItem("authToken", response)
    alert("item in storage is "+sessionStorage.getItem("authToken"))
    navigator('home');
  }


  async function getUser(credentials) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: credentials,
      redirect: 'follow'
    };

    
    const response = await fetch("localhost:443/auth/login", requestOptions)
      .then(response => response.text())
      .then(result => result)
      .catch(error => console.log('error', error))
    

    return response;
  }


  return (
    
      <div className="Login">
        <button className="student-login">
          STUDENT LOGIN
        </button>
        <div className="login-input-container">
          <img src={gradIcon} className="grad-icon" alt=""></img>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)} />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)} />
          <button className="login-button" onClick={authorizeUser}>
            LOGIN
          </button>
        </div>
      </div>
    

  )
}