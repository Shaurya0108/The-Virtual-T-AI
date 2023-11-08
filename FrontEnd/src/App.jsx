import './App.css'
import {Routes, Route} from 'react-router-dom';
import Login from './Login';
import Home from './Home'

export default function App() {
  return (
    
      <Routes>
        <Route path="/home" element={<Home/>} />
      </Routes>
  );
}