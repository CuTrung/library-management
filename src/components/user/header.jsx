import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from '../../utils/myUtils';
import CartBooksDetails from './library/details/cartBooksDetails';

const Header = (props) => {

    const { state, pathname } = useLocation();


    const [listCategories, setListCategories] = useState([]);
    const navigate = useNavigate();

    async function getCategories() {
        let data = await fetchData('GET', `api/categories`)
        if (data.EC === 0) {
            setListCategories(data.DT);
        }
    }

    async function handleCategory(category) {
        let data = await fetchData('GET', `api/books/${category.id}`);
        if (data.EC === 0) {
            navigate('/', { state: { listBooksByCategoryId: data.DT, categoryName: category.name } })
        }
    }

    useEffect(() => {
        getCategories();
    }, [])

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink className='nav-link' to='/'>Home</NavLink>
                            <NavLink className='nav-link' to='/about'>About</NavLink>
                            <NavLink className='nav-link' to='/admin'>Admin</NavLink>

                            <NavDropdown
                                id="nav-dropdown-dark-example"
                                title="Category"
                            >
                                {listCategories.length > 0 &&
                                    listCategories.map((category, index) => {
                                        return (
                                            <NavDropdown.Item key={`category-${index}`} onClick={() => handleCategory(category)}>
                                                {category.name}
                                            </NavDropdown.Item>
                                        )
                                    })}

                            </NavDropdown>
                        </Nav>
                        {/* <Nav>
                            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.1">Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav> */}

                        {/* <NavLink className='nav-link' to="/login">Login</NavLink> */}


                        <CartBooksDetails />

                    </Navbar.Collapse>
                </Container>
            </Navbar>



        </>
    );

}

export default Header;

