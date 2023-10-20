import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./components/Navbar";
import DisplayWindow from './components/DisplayWindow';
import TextBox from './components/TextBox';
import SessionBar from './components/SessionBar';
import gradIcon from "./images/student-grad.png";


export default function Login() {
  const [count, setCount] = useState(0)

  return (
    <body>
      <Navbar />
      <div className="Login">
        <button className="student-login">
          STUDENT LOGIN
        </button>
      </div>
      <img src={gradIcon} className="grad-icon" alt=""></img>
      <div className="login-input-container">
        <input className="login-input" type="text" placeholder="Username"/>
        <input className="login-input" type="password" placeholder="Password"/>
        <button className="login-button">
          LOGIN
        </button>
      </div>
      
    </body>

  )
}