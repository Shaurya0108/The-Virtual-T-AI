import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import Navbar from "./components/Navbar";
import DisplayWindow from './components/DisplayWindow';
import TextBox from './components/TextBox';
import SessionBar from './components/SessionBar';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';


export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <home>
      
    <body>
      <div class="chat-container">
        <div className="navbar">
          <Navbar />
        </div>
        <div class="session-bar">
          <SessionBar/>
        </div>
        <div class="chat-display">
          <DisplayWindow />
        </div>
        <div class="user-input">
          <TextBox />
        </div>
      </div>
    </body>
    </home>
    

  )
}