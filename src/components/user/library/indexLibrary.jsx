
import { Outlet } from "react-router-dom";

const IndexLibrary = (props) => {
    return (
        <div className="container">
            <Outlet />
        </div>
    )
}

export default IndexLibrary;