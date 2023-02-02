import { useEffect, useState } from "react";
import CarouselLibrary from "./carouselLibrary";
import ContentLibrary from "./contentLibrary";
import { fetchData } from "../../../utils/myUtils";
import { useContext } from "react";
import { ACTION, GlobalContext } from "../../../context/globalContext";
import { useRef } from "react";


const HomeLibrary = (props) => {
    const [listBooks, setListBooks] = useState([]);
    // 12 items là vừa đẹp
    const [limitItem, setLimitItem] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const listBooksRef = useRef([]);
    const listBooksCarouselRef = useRef([]);


    const { stateGlobal, dispatch } = useContext(GlobalContext);


    async function getBooks(categoryIds) {

        let data;
        if (categoryIds) {
            data = await fetchData('GET', `api/books/categoryIds?limit=${limitItem}&page=${currentPage}`, { categoryIds });
        } else {
            data = await fetchData("GET", `api/books?limit=${limitItem}&page=${currentPage}`);
        }

        if (data.EC === 0) {
            listBooksRef.current = data.DT.books;
            if (!categoryIds) {
                listBooksCarouselRef.current = data.DT.books;
            }
            setListBooks(data.DT.books);
            setTotalPages(data.DT.totalPages);
            dispatch({ type: ACTION.GET_BOOKS_HOME_LIBRARY, payload: getBooks })

        }
    }



    useEffect(() => {
        getBooks(stateGlobal.dataCategory?.categoryIds);
    }, [currentPage]);


    return (
        <>
            <CarouselLibrary
                listBooks={listBooksCarouselRef.current} />

            <ContentLibrary
                listBooks={listBooks}
                setListBooks={setListBooks}
                listBooksRef={listBooksRef.current}

                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </>
    );
};

export default HomeLibrary;
