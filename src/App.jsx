import { useState } from 'react';
import './App.css';
import { Outlet } from "react-router-dom";
import Header from './components/user/header';
import GlobalContextProvider from './hooks/globalContext';




function App() {

  return (

    <GlobalContextProvider initValue={{ user: null }}>
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