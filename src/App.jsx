import { useState } from 'react';
import './App.css';
import { Outlet, useLocation } from "react-router-dom";
import Header from './components/user/header';
import GlobalContextProvider, { GlobalContext } from './context/globalContext';
import { useContext } from 'react';
import { useEffect } from 'react';




function App() {

  return (
    <GlobalContextProvider initValue={{ user: window.sessionStorage.getItem("user") ?? null }}>
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
    </GlobalContextProvider>


  )
}

export default App