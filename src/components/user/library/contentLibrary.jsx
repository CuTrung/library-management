import { useContext, useEffect, useState } from "react";
import MyPagination from "../../both/myPagination";
import CardBook from "./cardBook";
import { ACTION, GlobalContext } from "../../../context/globalContext";
import SearchBar from '../../both/searchBar';
import Form from 'react-bootstrap/Form';
import { AiFillFilter } from "react-icons/ai";
import { $$, fetchData } from "../../../utils/myUtils";


const ContentLibrary = (props) => {
    const { listBooks, setListBooks, totalPages, setCurrentPage, listBooksRef } = props;

    const [listCategories, setListCategories] = useState([]);

    const { stateGlobal, dispatch } = useContext(GlobalContext);

    async function getCategories() {
        let data = await fetchData('GET', `api/categories`);
        if (data.EC === 0) {
            setListCategories(data.DT);
        }
    }


    async function handleFilter(isClearFilter) {

        let categoriesFilter = $$('[type="checkbox"]');
        let categoryIds = [];
        let categoryNames = '';

        for (const item of categoriesFilter) {
            if (item.checked) {
                if (isClearFilter) {
                    item.checked = false;
                } else {
                    categoryIds.push(item.getAttribute('data-id'))
                    categoryNames += `${item.getAttribute('data-name')} - `;
                }
            }
        }

        if (isClearFilter) {
            return stateGlobal.fnGetBooksHomeLibrary?.();
        }

        categoryNames = categoryNames.slice(0, categoryNames.lastIndexOf("-") - 1);

        dispatch({
            type: ACTION.SET_CATEGORY_IDS_CONTENT_LIBRARY,
            payload: {
                categoryIds,
                categoryNames
            }
        })

        stateGlobal.fnGetBooksHomeLibrary?.(categoryIds);
    }

    useEffect(() => {
        getCategories();
    }, [])



    return (
        <>
            <div className="row">
                <div className="col-2 border border-3">
                    <h3 className="mt-3 text-uppercase">Filter
                        <button className="btn btn-success float-end"
                            onClick={() => handleFilter()}
                        ><AiFillFilter /></button>
                    </h3>

                    <button onClick={() => handleFilter(true)} className="border-0 bg-white text-primary float-end mb-3 mt-2">Clear filter</button>

                    <div className="mt-3">
                        <h5 className="text-decoration-underline">Category</h5>
                        {listCategories.length > 0 && listCategories.map((category, index) => {
                            return (
                                <Form.Check
                                    data-id={category.id}
                                    data-name={category.name}
                                    key={`category-${index}`}
                                    className="ms-2 mb-2"
                                    type={'checkbox'}
                                    label={category.name}
                                />
                            )
                        })}
                    </div>
                </div>
                <div className="col-10 border border-3 row">
                    <div className="w-100 my-3">
                        <h4 className="text-info float-start w-50 text-wrap">{stateGlobal.dataCategory ? `Sách theo thể loại > ${stateGlobal.dataCategory.categoryNames}` : 'Sách mới cập nhật >'}</h4>

                        {listBooksRef.length > 0 &&
                            <SearchBar
                                listRefDefault={listBooksRef}
                                listSearch={listBooks}
                                setListSearch={setListBooks}
                                pathDeepObj={'name'}
                                classNameCss={'float-end w-50'}
                                placeholder={"Searching..."}
                            />
                        }

                    </div>


                    {/* 12 Items là vừa đẹp */}
                    {listBooks.length > 0 &&
                        listBooks.map((book, index) => {
                            return (
                                <CardBook key={`book-${index}`}
                                    rounded={true}
                                    book={book}
                                    disabled={book.quantity - book.borrowed === 0}
                                />
                            )
                        })
                    }

                    <MyPagination
                        classCss={'contentLibraryPagination'}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />

                </div>




            </div>
        </>
    )


}

export default ContentLibrary;