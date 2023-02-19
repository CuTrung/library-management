import { useState } from 'react';
import './App.css';
import { Outlet, useLocation } from "react-router-dom";
import Header from './components/user/header';
import GlobalContextProvider, { GlobalContext } from './context/globalContext';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useSessionStorage } from './hooks/useStorage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMemo } from 'react';

function App() {

  const defaultImgUrl = useMemo(() => new URL('./assets/img/default.jpg', import.meta.url).href, []);

  return (
    <>
      <GlobalContextProvider initValue={{ user: JSON.parse(window.sessionStorage.getItem("user") ?? '{}'), defaultImgUrl }}>

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

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </GlobalContextProvider>


    </>

  )
}

export default App