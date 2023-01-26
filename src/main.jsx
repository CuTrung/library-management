import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from './components/admin/admin';
import About from './components/user/about';
import IndexBooks from './components/admin/books/indexBooks';
import IndexCategories from './components/admin/categories/indexCategories';
import Login from './components/both/login';
import IndexLibrary from './components/user/library/indexLibrary';
import IndexDetails from './components/user/library/details/indexDetails';
import HomeLibrary from './components/user/library/homeLibrary';


ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>

        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        <Route path='/' element={<IndexLibrary />} >
          <Route index element={<HomeLibrary />} />
          <Route path="/details/:categoryName" element={<IndexDetails />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route path="books" element={<IndexBooks />} />
          <Route path="categories" element={<IndexCategories />} />
        </Route>

      </Route>
    </Routes>
  </BrowserRouter>
  //</React.StrictMode>,
)
