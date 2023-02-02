import { useContext, useEffect } from 'react';
import Sidebar from './sidebar';
import { Outlet, useNavigate } from "react-router-dom";
import { GlobalContext } from '../../context/globalContext';
const Admin = (props) => {

    const { stateGlobal, dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!stateGlobal.user || !window.sessionStorage.getItem("user")) return navigate('/login');
    }, [])

    return (
        <div className="row">
            <div className="col-3 my-3">
                <Sidebar />
            </div>
            <div className="col-9">
                <Outlet />
            </div>
        </div>

    )
}

export default Admin;