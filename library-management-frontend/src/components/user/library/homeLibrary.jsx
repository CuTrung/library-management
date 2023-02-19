import { useEffect, useState } from "react";
import CarouselLibrary from "./carouselLibrary";
import ContentLibrary from "./contentLibrary";
import { $, $$, fetchData } from "../../../utils/myUtils";
import { useContext } from "react";
import { ACTION, GlobalContext } from "../../../context/globalContext";
import { useRef } from "react";
import _ from "lodash";


const HomeLibrary = (props) => {
    const [listBooks, setListBooks] = useState([]);
    // 12 items là vừa đẹp
    const [limitItem, setLimitItem] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const listBooksRef = useRef([]);
    const listBooksCarouselRef = useRef([]);
    const [listMajorsByDepartment, setListMajorsByDepartment] = useState([]);



    const { stateGlobal, dispatch } = useContext(GlobalContext);

    async function getBooks(listFilters) {
        let data;
        if (!_.isEmpty(listFilters)) {
            data = await fetchData('GET', `api/books/filter?limit=${limitItem}&page=${currentPage}`, { listFilters });

        } else {
            data = await fetchData("GET", `api/books?limit=${limitItem}&page=${currentPage}`);
        }

        if (data.EC === 0) {
            listBooksRef.current = data.DT.books;
            if (_.isEmpty(listFilters)) {
                listBooksCarouselRef.current = data.DT.books;
            }
            setListBooks(data.DT.books);
            setTotalPages(data.DT.totalPages);
            dispatch({ type: ACTION.GET_BOOKS_HOME_LIBRARY, payload: getBooks })
        }


    }

    async function handleSelect(type, value) {
        if (type === 'DEPARTMENT') {
            let data = await fetchData('GET', 'api/majors', { departmentId: value })

            if (data.EC === 0) {
                setListMajorsByDepartment(data.DT);
            }
        }
    }



    useEffect(() => {
        getBooks(stateGlobal.dataFilter);
    }, [currentPage]);

    return (
        <>
            <CarouselLibrary
                listBooks={listBooksCarouselRef.current} />

            <ContentLibrary
                listBooks={listBooks}
                setListBooks={setListBooks}
                listBooksRef={listBooksRef.current}
                handleSelect={handleSelect}

                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                listMajorsByDepartment={listMajorsByDepartment}
            />
        </>
    );
};

export default HomeLibrary;
