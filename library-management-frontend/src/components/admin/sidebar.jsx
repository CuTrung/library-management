import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom";
import { Button } from 'react-bootstrap';

const Sidebar = (props) => {
    return (
        <>
            <Button className='btn-success w-100'>Logo</Button>
            <Nav className="flex-column text-center border border-1">
                <NavLink className='nav-link btn btn-light' to='books'>books</NavLink>
                <NavLink className='nav-link btn btn-light' to='categories'>categories</NavLink>
                <NavLink className='nav-link btn btn-light' to='departments'>departments</NavLink>
                <NavLink className='nav-link btn btn-light' to='groupRoles'>Group Roles</NavLink>
            </Nav>
        </>
    )
}

export default Sidebar;

