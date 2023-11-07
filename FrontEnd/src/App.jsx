import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Home from './Home'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    
      <Routes>
        <Route path="/home" element={<Home/>} />
       </Routes>
    
  );
}



    // <>
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>