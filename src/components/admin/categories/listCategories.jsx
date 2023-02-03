import Table from 'react-bootstrap/Table';
import { useEffect, useState, forwardRef, useRef, useImperativeHandle, useContext } from 'react';
import MyPagination from "../../both/myPagination";
import { fetchData, removeDiacritics } from '../../../utils/myUtils';
import _ from "lodash";
import SearchBar from '../../both/searchBar';
import LoadingIcon from '../../both/loadingIcon';
import '../../../assets/scss/admin/categories/listCategories.scss';



const ListCategories = (props, ref) => {
    const [listCategories, setListCategories] = useState([]);
    const [limitItem, setLimitItem] = useState(7);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const listCategoriesRef = useRef(null);

    async function getCategories() {
        let data = await fetchData('GET', `api/categories?limit=${limitItem}&page=${currentPage}`)

        if (data.EC === 0) {
            listCategoriesRef.current = data.DT.categories;
            setListCategories(data.DT.categories);
            setTotalPages(data.DT.totalPages);
        }
    }

    useImperativeHandle(ref, () => ({
        fetchListCategories() {
            getCategories();
        }
    }));


    useEffect(() => {
        getCategories();
    }, [currentPage])

    return (
        <>
            <h3 className='my-3 float-start'>List categories</h3>

            {listCategoriesRef?.current?.length > 0 &&
                <SearchBar
                    listRefDefault={listCategoriesRef.current}
                    listSearch={listCategories}
                    setListSearch={setListCategories}
                    pathDeepObj={'name'}
                    classNameCss={'my-3 float-end w-50 me-3'}
                    placeholder={'Searching ...'}
                />
            }



            {listCategories.length > 0 ?
                <>
                    <Table className='listCategories my-3 w-100' bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>IsBorrowed</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listCategories.length > 0 && listCategories.map((category, index) => {
                                return (
                                    <tr key={`category-${index}`}>
                                        <td>{category.name}</td>
                                        <td>{category.isBorrowed === 1 ? 'can borrowed' : `can't borrowed`}</td>
                                        <td className='d-flex gap-1'>
                                            <button onClick={() => props.setCategoryUpdate(category)} className='btn btn-warning'>Edit</button>
                                            <button onClick={() => props.deleteCategory(category.id)} className='btn btn-danger'>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    <MyPagination
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </>
                :
                <LoadingIcon />
            }

        </>
    );
}

export default forwardRef(ListCategories);