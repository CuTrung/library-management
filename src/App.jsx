import { useState } from 'react';
import './App.css';
import { Outlet } from "react-router-dom";
import Header from './components/user/header';

function App() {

  return (
    <div className="App">
      <div className='header'>
        <Header />
      </div>
      <div className='content'>
        <Outlet />
      </div>
      <div className='footer'>

      </div>
    </div>
  )
}

export default App
