import { useEffect, useState } from "react";
import CarouselLibrary from "./carouselLibrary";
import ContentLibrary from "./contentLibrary";
import { fetchData } from "../../../utils/myUtils";
import { useLocation } from "react-router-dom";

const HomeLibrary = (props) => {
    const [listBooks, setListBooks] = useState([]);
    const [limitItem, setLimitItem] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const { state, pathname } = useLocation();


    async function getBooks() {
        let data = await fetchData("GET", `api/books?limit=${limitItem}&page=${currentPage}`);
        if (data.EC === 0) {
            setListBooks(data.DT.books);
            setTotalPages(data.DT.totalPages);
        }
    }

    useEffect(() => {
        getBooks();
    }, [currentPage]);


    return (
        <>
            {listBooks.length > 0 &&
                <>
                    <CarouselLibrary listBooks={listBooks} />
                    <ContentLibrary
                        categoryName={state?.categoryName}
                        listBooks={state?.listBooksByCategoryId ?? listBooks} />
                </>
            }
        </>
    );
};

export default HomeLibrary;
