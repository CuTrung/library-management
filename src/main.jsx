import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
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
import Page404 from './components/both/page404';
import IndexGroupRoles from './components/admin/groupRoles/indexGroupRoles';
import Register from './components/both/register';
import IndexDepartments from './components/admin/departments/indexDepartments';



ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
  <BrowserRouter basename={import.meta.env.VITE_BASENAME}>
    <Routes>
      <Route path="/" element={<App />} >
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />

        <Route path='/' element={<IndexLibrary />} >
          <Route index element={<HomeLibrary />} />
          <Route path="/details/:categoryName" element={<IndexDetails />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route path="books" element={<IndexBooks />} />
          <Route path="categories" element={<IndexCategories />} />
          <Route path="departments" element={<IndexDepartments />} />
          <Route path="groupRoles" element={<IndexGroupRoles />} />
        </Route>
      </Route>

      <Route path='*' element={<Page404 />} />

    </Routes>
  </BrowserRouter>
  //</React.StrictMode>,
)
