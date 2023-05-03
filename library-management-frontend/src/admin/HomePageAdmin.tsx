import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

export default function HomePageAdmin() {
    return (
        <>
            <div className="w-100 row px-3 m-0">
                <div className="col-lg-2 col-12 border-end border-secondary">
                    <Sidebar />
                </div>
                <div className="col-lg-10 col-12">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
