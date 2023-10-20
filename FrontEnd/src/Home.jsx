import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./components/Navbar";
import DisplayWindow from './components/DisplayWindow';
import TextBox from './components/TextBox';
import SessionBar from './components/SessionBar';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';


export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <body>
      <div className="App">
        <Navbar />
      </div>
      <div>
        <SessionBar/>
      </div>
      <div>
        <DisplayWindow />
        <TextBox />
      </div>
    </body>
    

  )
}