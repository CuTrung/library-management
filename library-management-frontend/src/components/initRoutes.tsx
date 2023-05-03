import { Routes, Route } from "react-router-dom";
import HomePage from "../user/homePage";
import HomePageAdmin from "../admin/HomePageAdmin";
import CRUDBook from "../admin/book/CRUDBook";
import ApproveBook from "../admin/book/approveBook";
import Auth from "./auth";
import BookDetails from "../user/details/bookDetails";
import History from "../user/history/history";
import HistoryBookBorrowed from "../admin/book/historyBookBorrowed";
import CRUDCategory from "../admin/category/CRUDCategory";
import CRUDDepartment from "../admin/department/CRUDDepartment";
import CRUDRole from "../admin/role/CRUDRole";

export default function InitRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/:page" element={<Auth />} />
            <Route path="/book/:name" element={<BookDetails />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<HomePageAdmin />}>
                <Route path="books" element={<CRUDBook />} />
                <Route path="approve" element={<ApproveBook />} />
                <Route path="history" element={<HistoryBookBorrowed />} />
                <Route path="category" element={<CRUDCategory />} />
                <Route path="department" element={<CRUDDepartment />} />
                <Route path="role" element={<CRUDRole />} />
            </Route>
        </Routes>
    );
}
