import Table from 'react-bootstrap/Table';
import { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import MyPagination from "../../both/myPagination";
import { fetchData, removeDiacritics } from '../../../utils/myUtils';
import _ from "lodash";




const ListBooks = (props, ref) => {
    const [listBooks, setListBooks] = useState([]);
    const [limitItem, setLimitItem] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const listBooksRef = useRef(null);

    async function getBooks() {
        let data = await fetchData('GET', `api/books?limit=${limitItem}&page=${currentPage}`)
        if (data.EC === 0) {
            listBooksRef.current = data.DT.books;
            setListBooks(data.DT.books);
            setTotalPages(data.DT.totalPages);
        }
    }

    // Chưa hoàn thành
    function handleSearch(e) {
        let listBooksClone = _.cloneDeep(listBooks);
        let searchValue = removeDiacritics(e.target.value);

        // Khi chuyển sang có dấu thì đang có bug (console.log để xem)
        if (searchValue === '') {
            setListBooks(listBooksRef.current);
        }
        else {
            if (searchValue.length === 1) {
                listBooksClone = listBooksClone.filter((book) => {
                    return book.name.toLowerCase().includes(e.target.value.toLowerCase())
                })
            } else {

            }
            setListBooks(listBooksClone);
        }
    }

    useImperativeHandle(ref, () => ({
        fetchListBooks() {
            getBooks();
        }
    }));


    useEffect(() => {
        getBooks();
    }, [currentPage])

    return (
        <>
            <h3 className='float-start my-3'>List books</h3>
            <input type="search" className='form-control w-25 float-end my-3' placeholder='searching...'
                onChange={(e) => handleSearch(e)}
            />
            <Table className='my-3' bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Categories</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listBooks.length > 0 && listBooks.map((book, index) => {
                        return (
                            <tr key={`book-${index}`}>
                                <td>{book.name}</td>
                                <td>{book.price}</td>
                                <td>{book.quantity}</td>
                                <td>
                                    {book.Categories.length > 0 &&
                                        book.Categories.map((category, index) => {
                                            return (
                                                <p key={`category-${index + 1}`} className='mb-0 mb-2'>
                                                    {book.Categories.length > 1 ?
                                                        <><strong>{index + 1}. </strong>{category.name}</>
                                                        :
                                                        `${category.name ?? ''}`
                                                    }
                                                </p>
                                            )
                                        })
                                    }
                                </td>
                                <td>{book.Status.name}</td>
                                <td className='d-flex gap-1'>
                                    <button onClick={() => props.setBookUpdate(book)} className='btn btn-warning'>Edit</button>
                                    <button onClick={() => props.deleteBook(book.id)} className='btn btn-danger'>Delete</button>
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

export default forwardRef(ListBooks);