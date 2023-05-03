import { useDispatch } from "react-redux";
import { HTTPMethods, ResAxios, ResBook, TypeFilters } from "../../types/types";
import { fetchData } from "../../utils/myUtils";
import CardBook from "./cardBook";
import { useState, useEffect, useCallback } from "react";
import { getBooks } from "../../redux/features/book/bookSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import * as React from "react";
import MyPagination from "../../components/pagination";
import { useLocation } from "react-router-dom";

export default function Content() {
    const { values, totalPages, listFiltersPrev } = useAppSelector(
        (state) => state.book,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useAppDispatch();

    const getListBook = async (
        page: number,
        listFilters = listFiltersPrev as TypeFilters[],
    ) => {
        setCurrentPage(page);

        await dispatch(
            getBooks({
                page,
                listFilters,
            }),
        );
    };

    useEffect(() => {
        getListBook(currentPage);
    }, []);

    return (
        <>
            <div className="py-3 d-flex gap-4 flex-wrap justify-content-center">
                {(values as ResBook[]).map((book) => {
                    return (
                        <CardBook
                            key={book.id}
                            dataBook={{ ...book, numberOfBooksBorrowed: 0 }}
                            func={{
                                fetchListBook: getListBook,
                                currentPage,
                            }}
                        />
                    );
                })}
            </div>
            {(values as ResBook[]).length > 0 ? (
                <MyPagination
                    cb={getListBook}
                    totalPages={totalPages[0] as number}
                    currentPage={currentPage}
                    classCss="my-3"
                />
            ) : (
                <></>
            )}
        </>
    );
}
