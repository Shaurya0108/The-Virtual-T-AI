import './App.css';
import { useState } from 'react'
import {Routes, Route} from 'react-router-dom';
import Login from './Login';
import Home from './Home'


export default function App() {

  const [sessionIds, setPrevSessionIds] = useState([]);

  const setTenSessionIds = (newSessionIds) => {
    setPrevSessionIds(newSessionIds);
  };
  
  return (
    
      <Routes>
        <Route path="/home" element={<Home sessionIds={sessionIds}/>} />
        <Route path="/" element={<Login setTenSessionIds={setTenSessionIds}/>} />
      </Routes>
  );
}