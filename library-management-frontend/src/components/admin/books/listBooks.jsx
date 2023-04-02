import Table from 'react-bootstrap/Table';
import { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import MyPagination from "../../both/myPagination";
import { exportExcel, fetchData, removeDiacritics } from '../../../utils/myUtils';
import _ from "lodash";
import '../../../assets/scss/admin/books/listBooks.scss';
import Sorting from '../../both/sorting';
import SearchBar from '../../both/searchBar';
import LoadingIcon from '../../both/loadingIcon';
import { useContext } from 'react';
import { ACTION, GlobalContext } from '../../../context/globalContext';
import { FcDownload } from "react-icons/fc";
import { toast } from 'react-toastify';


const ListBooks = (props, ref) => {
    const [listBooks, setListBooks] = useState([]);
    const [limitItem, setLimitItem] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const listBooksRef = useRef(null);
    const { stateGlobal, dispatch } = useContext(GlobalContext);

    async function getBooks() {
        let data = await fetchData('GET', `api/books?limit=${limitItem}&page=${currentPage}`)
        if (data.EC === 0) {
            listBooksRef.current = data.DT.books;
            setListBooks(data.DT.books);
            setTotalPages(data.DT.totalPages);
            dispatch({ type: ACTION.SET_SAMPLE_BOOKS, payload: data.DT.books });
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


    // Export file excel
    function handleExport() {
        if (listBooks.length === 0)
            return toast.error("List histories is empty! Can't export !");


        let listBooksExport = listBooks
            .map((item) => {
                return {
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    quantityReality: item.quantityReality,
                    Categories: item.Categories.map(category => category.name).join(', '),
                    Status: item.Status.name,
                }
            });

        const isSuccess = exportExcel({
            listData: listBooksExport,
            listHeadings: [
                'Tên sách', 'Giá', 'Số lượng ban đầu', 'Số lượng thực tế', 'Thể loại', 'Tình trạng'
            ],
            nameFile: 'List Books'
        });
        if (isSuccess)
            return toast.success("Export excel successful!")

        toast.error("Export excel failed!")
    }


    return (
        <>
            <h3 className='float-start my-3'>List books</h3>



            <div className='d-flex float-end mt-2'>
                {listBooksRef?.current?.length > 0 &&
                    <SearchBar
                        listRefDefault={listBooksRef.current}
                        listSearch={listBooks}
                        setListSearch={setListBooks}
                        pathDeepObj={'name'}
                        classNameCss={'w-75 me-3'}
                        placeholder={'Searching ...'}
                    />
                }

                <button onClick={() => getBooks()} className="btn btn-warning">Refresh</button>
            </div>

            <button className="btn btn-outline-success float-end ms-3 py-1 mt-2 me-3"
                onClick={() => handleExport()}
            >Export excel <FcDownload size={30} /></button>


            {listBooks.length > 0 ?
                <>
                    <Table className='listBooks my-3' bordered hover>
                        <thead>
                            <tr>
                                <th>Name
                                    <Sorting
                                        listSort={listBooks}
                                        setListSort={setListBooks}
                                        column={'name'}
                                    />
                                </th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Quantity Reality</th>
                                <th>Categories</th>
                                {/* <th>Majors</th> */}
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
                                        <td>{book.quantityReality}</td>
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
                                        {/* <td>
                                            {book.Majors.length > 0 &&
                                                book.Majors.map((major, index) => {
                                                    return (
                                                        <p key={`major-${index + 1}`} className='mb-0 mb-2'>
                                                            {book.Majors.length > 1 ?
                                                                <><strong>{index + 1}. </strong>{major.description}</>
                                                                :
                                                                `${major.description ?? ''}`
                                                            }
                                                        </p>
                                                    )
                                                })
                                            }
                                        </td> */}
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
                :
                <LoadingIcon />
            }
        </>
    );
}

export default forwardRef(ListBooks);