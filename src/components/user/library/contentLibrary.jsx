import { useContext, useEffect, useState } from "react";
import MyPagination from "../../both/myPagination";
import CardBook from "./cardBook";
import { ACTION, GlobalContext } from "../../../context/globalContext";
import SearchBar from '../../both/searchBar';
import Form from 'react-bootstrap/Form';
import { AiFillFilter } from "react-icons/ai";
import { $$, fetchData } from "../../../utils/myUtils";
import '../../../assets/scss/user/library/contentLibrary.scss';
import LoadingIcon from "../../both/loadingIcon";


const ContentLibrary = (props) => {
    const { listBooks, setListBooks, totalPages, setCurrentPage, listBooksRef, handleSelect, listMajorsByDepartment } = props;

    const [listCategories, setListCategories] = useState([]);
    const [listDepartments, setListDepartments] = useState([]);

    const { stateGlobal, dispatch } = useContext(GlobalContext);

    async function getCategories() {
        let data = await fetchData('GET', `api/categories`);
        if (data.EC === 0) {
            setListCategories(data.DT);
        }
    }

    async function handleFilter(isClearFilter) {
        let checkboxesFilter = $$('[type="checkbox"]');
        const filterItems = [];

        for (const item of checkboxesFilter) {
            if (item.checked) {
                if (isClearFilter) {
                    item.checked = false;
                } else {
                    filterItems.push({
                        type: item.getAttribute('data-type'),
                        [`${item.getAttribute('data-type').toLowerCase()}Ids`]: item.getAttribute('data-id'),
                        name: item.getAttribute('data-name')
                    })
                }
            }
        }

        if (isClearFilter) {
            dispatch({
                type: ACTION.SET_DATA_FILTER_CONTENT_LIBRARY,
                payload: []
            })
            return stateGlobal.dataBooksHomeLibrary?.fnGetBooksHomeLibrary?.();
        }

        let listFilters = [];
        filterItems.forEach(item => {
            item = {
                ...item,
                [`${item.type.toLowerCase()}Ids`]: [item[`${item.type.toLowerCase()}Ids`]],
                name: [item.name],
            }

            let match = listFilters.find(r => r.type === item.type);
            if (match) {
                match[`${item.type.toLowerCase()}Ids`] = match[`${item.type.toLowerCase()}Ids`].concat(item[`${item.type.toLowerCase()}Ids`]);
                match.name = match.name.concat(item.name);
            } else {
                listFilters.push({ ...item, type: item.type });
            }
        });

        dispatch({
            type: ACTION.SET_DATA_FILTER_CONTENT_LIBRARY,
            payload: listFilters
        })

        stateGlobal.dataBooksHomeLibrary?.fnGetBooksHomeLibrary?.(listFilters);
    }

    async function getListDepartments() {
        let data = await fetchData('GET', 'api/departments');

        if (data.EC === 0) {
            setListDepartments(data.DT);
        }

    }

    useEffect(() => {
        getListDepartments();
        getCategories();
    }, [])



    return (
        <>
            <div className="row">
                <div className="col-md-2 col-sm-12 border border-3">
                    <h3 className="mt-3 text-uppercase">Filter
                        <button className="btn btn-success float-end"
                            onClick={() => handleFilter()}
                        ><AiFillFilter /></button>
                    </h3>

                    <button onClick={() => handleFilter(true)} className="border-0 bg-white text-primary float-end mb-3 mt-2">Clear filter</button>

                    <Form.Select className='mb-3' aria-label="Default select example"
                        onChange={(e) => handleSelect('DEPARTMENT', e.target.value)}
                    >
                        <option hidden value=''>Department</option>
                        {listDepartments.length > 0 && listDepartments.map((department, index) => {
                            return (
                                <option className="wrap-text w-25" key={`department-${index}`} value={department.id}>
                                    {department.description}
                                </option>
                            )
                        })}
                    </Form.Select>


                    <div className="mt-3">
                        <h5 className="text-decoration-underline">Major</h5>
                        {listMajorsByDepartment.length > 0 && listMajorsByDepartment.map((major, index) => {
                            return (
                                <Form.Check
                                    data-type={'MAJOR'}
                                    data-id={major.id}
                                    data-name={major.description}
                                    key={`major-${index}`}
                                    className="ms-2 mb-2"
                                    type={'checkbox'}
                                    label={major.description}
                                />
                            )
                        })}
                    </div>

                    <div className="mt-3">
                        <h5 className="text-decoration-underline">Category</h5>
                        {listCategories.length > 0 && listCategories.map((category, index) => {
                            return (
                                <Form.Check
                                    data-type={'CATEGORY'}
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


                <div className="col-md-10 col-sm-12 border border-3">
                    <div className="row">
                        <div className="w-100 my-3">
                            <h4 className="text-info float-start w-50 text-wrap">{stateGlobal.dataFilter?.length === 1 || stateGlobal.dataFilter?.length === 2 ? `Kết quả lọc >` : `Sách mới cập nhật >`}</h4>

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
                        <div className="listContentLibrary d-flex flex-wrap">
                            {listBooks.length > 0 ?
                                listBooks.map((book, index) => {
                                    return (
                                        <CardBook key={`book-${index}`}
                                            rounded={true}
                                            book={book}
                                            disabled={+book.quantityReality - +book.borrowed === 0}
                                        />
                                    )
                                })
                                :
                                <LoadingIcon
                                    classCss={'position-absolute top-100 start-50 translate-middle-y ms-5'}
                                />
                            }
                        </div>
                    </div>


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