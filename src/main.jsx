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
import HomePage from './components/user/homePage';
import Admin from './components/admin/admin';
import About from './components/user/about';
import IndexBooks from './components/admin/books/indexBooks';
import IndexStudents from './components/admin/students/indexStudents';
import IndexCategories from './components/admin/categories/indexCategories';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<About />} />

        <Route path="/admin" element={<Admin />}>
          <Route path="books" element={<IndexBooks />}>

          </Route>
          <Route path="categories" element={<IndexCategories />}>

          </Route>
        </Route>




      </Route>
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>,
)
