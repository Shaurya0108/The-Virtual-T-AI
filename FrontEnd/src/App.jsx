import './App.css'
import {Routes, Route} from 'react-router-dom';
import Login from './Login';
import Home from './Home'
import Settings from './Settings'
import Menu from './Menu'


export default function App() {
  return (
    
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/menu" element={<Menu/>}/>
      </Routes>
  );
}