import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import Header from "./components/header";
import InitRoutes from "./components/initRoutes";
import { useAppDispatch } from "./redux/hooks";
import { useEffect } from "react";
import { getImgDefault } from "./redux/features/book/bookSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getImgDefault());
    }, []);

    return (
        <>
            <Header />
            <InitRoutes />

            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
}

export default App;
