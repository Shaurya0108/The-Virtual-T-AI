import { useState } from 'react'
import axios from 'axios';
import './css/Login.css'
import gradIcon from "./images/student-grad.png";
import {useNavigate} from 'react-router-dom'




export default function Login({ setTenSessionIds }) {
  const navigator = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  async function generateSessionId() {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
          credentials: 'include'
      };
      const response = await fetch(import.meta.env.VITE_SERVER_ENDPOINT + "/chatBot/newSessionId", requestOptions)
      const data = await response.json();
      return data.res;
  } catch (error) {
      return "Sorry, there was an issue getting the response.";
  }
  }

  async function authorizeUser() {
    try {
      const credentials = JSON.stringify({
        username,
        password
      });
      const myHeaders = {
        "Content-Type": "application/json"
      };
    
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: credentials,
        redirect: 'follow',
        credentials: 'include'
      };
  
      const response = await fetch(import.meta.env.VITE_SERVER_ENDPOINT + "/auth/login", requestOptions);
  
      if (response.ok) {
        const newSessionId = await generateSessionId(); // Generates a unique session ID
        window.sessionStorage.setItem("currentSessionId", newSessionId);

        const data = await response.json();
        console.log(data.sessions);
        setTenSessionIds([newSessionId, ...data.sessions]);
        navigator('/home');
      } else {
        alert('Invalid Credentials');
      }
    } catch (err) {
      alert(err.message);
    }
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
          {/* <button className="login-button" onClick={authorizeUser}> */}
          <button className="login-button" onClick={authorizeUser}>
            LOGIN
          </button>

        </div>
      </div>
  )
}
