import { useState } from 'react'
import axios from 'axios';
import './css/Login.css'
import gradIcon from "./images/student-grad.png";
import {useNavigate} from 'react-router-dom'




export default function Login() {
  const navigator = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  // async function authorizeUser() {
  //   try{
  //     var credentials = JSON.stringify({
  //       "username": username,
  //       "password": password
  //     });
  //     var myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");
  
  //     var requestOptions = {
  //       method: 'POST',
  //       headers: myHeaders,
  //       body: credentials,
  //       redirect: 'follow',
  //       credentials: 'include' //Make sure to have this line for every Request. Or else the cookie won't be included in the requests
  //     };
  //     const response = await fetch("http://localhost:443/auth/login", requestOptions);
  //     if (response.ok) {
  //       navigator('home');
  //     }
  //     else {
  //       alert('Invalid Credentials');
  //     }
  //   }
  //   catch (err) {
  //     alert(err.message);
  //   }
  // }


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
          {/* <button className="login-button" onClick={authorizeUser}> */}
          <button className="login-button" onClick={"hello"}>  
            LOGIN
          </button>
        </div>
      </div>
    

  )
}