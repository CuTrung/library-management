import { useContext, useEffect } from 'react';
import Sidebar from './sidebar';
import { Outlet, useNavigate } from "react-router-dom";
import { GlobalContext } from '../../context/globalContext';
import _ from 'lodash'
const Admin = (props) => {

    const { stateGlobal, dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();
    const EMAIL_ADMIN = import.meta.env.VITE_EMAIL_ADMIN;

    useEffect(() => {
        if (_.isEmpty(stateGlobal.user))
            return navigate('/login');

        if (stateGlobal.user.email !== EMAIL_ADMIN)
            return navigate('/');

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