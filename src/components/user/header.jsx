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
import _ from 'lodash';
import { toast } from 'react-toastify';

const Header = (props) => {

    const { stateGlobal, dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();

    async function handleLogout() {
        let data = await fetchData('POST', 'api/logout');
        if (data.EC === 0) {
            window.sessionStorage.removeItem("user");
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }

        dispatch({ type: ACTION.GET_USER, payload: {} });
        navigate('/login');
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

                            {!_.isEmpty(stateGlobal.user) ?
                                <>
                                    <CartBooksDetails />

                                    <Nav className='ms-3 fw-bold'>
                                        <NavDropdown title={`Welcome ${stateGlobal.user.fullName}`} id="basic-nav-dropdown">
                                            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                                            <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                                        </NavDropdown>
                                    </Nav>
                                </>
                                :
                                <>
                                    <Nav>
                                        <NavLink className='nav-link' to="/login">Login</NavLink>
                                        <NavLink className='nav-link btn btn-outline-info' to="/register">Register</NavLink>
                                    </Nav>
                                </>
                            }

                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                :
                <>
                    {!_.isEmpty(stateGlobal.user) &&
                        <Navbar bg="light" expand="lg">
                            <Container>
                                <Nav></Nav>
                                <Nav className='w-25'>
                                    <NavDropdown className='border border-3 fw-bold'
                                        title={`Welcome ${stateGlobal.user.fullName}`} id="basic-nav-dropdown">
                                        <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => handleLogout()}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </Container>
                        </Navbar>
                    }
                </>
            }
        </>
    );

}

export default Header;

