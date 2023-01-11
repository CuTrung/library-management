import Table from 'react-bootstrap/Table';
import { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import MyPagination from "../../both/myPagination";
import { fetchData, removeDiacritics } from '../../../utils/myUtils';
import _ from "lodash";




const ListCategories = (props, ref) => {
    const [listCategories, setListCategories] = useState([]);
    const [limitItem, setLimitItem] = useState(10);
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

    // Chưa hoàn thành
    function handleSearch(e) {
        let listCategoriesClone = _.cloneDeep(listCategories);
        let searchValue = removeDiacritics(e.target.value);

        // Khi chuyển sang có dấu thì đang có bug (console.log để xem)
        if (searchValue === '') {
            setListCategories(listCategoriesRef.current);
        }
        else {
            if (searchValue.length === 1) {
                listCategoriesClone = listCategoriesClone.filter((category) => {
                    return category.name.toLowerCase().includes(e.target.value.toLowerCase())
                })
            } else {

            }
            setListCategories(listCategoriesClone);
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
            <h3 className='float-start my-3'>List categories</h3>
            <input type="search" className='form-control w-25 float-end my-3' placeholder='searching...'
                onChange={(e) => handleSearch(e)}
            />
            <Table className='my-3' bordered hover>
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
    );
}

export default forwardRef(ListCategories);