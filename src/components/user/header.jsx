import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { $, fetchData } from '../../utils/myUtils';
import CartBooksDetails from './library/details/cartBooksDetails';
import { ACTION, GlobalContext } from '../../context/globalContext';
import { useContext } from 'react';

const Header = (props) => {

    const { stateGlobal, dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();

    function handleLogout() {
        window.sessionStorage.removeItem("user");
        dispatch({ type: ACTION.GET_USER, payload: null });

        navigate('/login')
    }



    return (
        <>
            {!window.location.pathname.includes('/admin') ?
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">Library ITC</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavLink className='nav-link' to='/'>Home</NavLink>
                                <NavLink className='nav-link' to='/about'>About</NavLink>
                                {/* <NavLink className='nav-link' to='/admin'>Admin</NavLink> */}
                            </Nav>

                            {stateGlobal.user ?
                                <>
                                    <CartBooksDetails />

                                    <Nav className='ms-3'>
                                        <NavDropdown title={`Welcome ${stateGlobal.user}`} id="basic-nav-dropdown">
                                            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                                            <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                                        </NavDropdown>
                                    </Nav>
                                </>
                                :
                                <NavLink className='nav-link' to="/login">Login</NavLink>
                            }

                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                :
                <>
                    <Navbar bg="light" expand="lg">
                        <Container>
                            <Nav></Nav>
                            <Nav className='w-25'>
                                <NavDropdown className=' border border-3' title={`Welcome ${stateGlobal.user}`} id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Container>
                    </Navbar>


                </>
            }
        </>
    );

}

export default Header;

