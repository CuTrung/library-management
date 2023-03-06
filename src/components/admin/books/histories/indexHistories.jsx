import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../../both/searchBar";
import Table from 'react-bootstrap/Table';

import { FcDownload } from "react-icons/fc";
import { useContext } from "react";
import { GlobalContext } from "../../../../context/globalContext";
import { toast } from "react-toastify";
import { exportExcel, fetchData, getFormattedDate } from "../../../../utils/myUtils";
import '../../../../assets/scss/admin/books/histories/indexHistories.scss';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const IndexHistories = (props) => {
    const [listHistories, setListHistories] = useState([]);
    const MAX_DAYS_TO_BORROW_BOOKS = import.meta.env.VITE_MAX_DAYS_TO_BORROW_BOOKS;

    const quantityLost = useRef();
    const quantityGive = useRef();

    const { stateGlobal, dispatch } = useContext(GlobalContext);

    function isOutOfDate(timeStart) {
        const days = (date1, date2) => {
            let difference = date1.getTime() - date2.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }
        let date = timeStart.split("/");
        let day = days(new Date(), new Date(`${date[1]}/${date[0]}/${date[2]}`));

        if (day >= MAX_DAYS_TO_BORROW_BOOKS) return true;

        return false;
    }


    // Export file excel
    function handleExport() {
        if (listHistories.length === 0)
            return toast.error("List histories is empty! Can't export !");


        let listHistoriesExport = listHistories
            .filter(item => item.timeStart)
            .map((item) => {
                if (item.timeStart)
                    return {
                        fullName: item.Student.fullName,
                        name: item.Book.name,
                        quantityBorrowed: item.Book.quantityBorrowed,
                        quantityBookLost: item.quantityBookLost,
                        price: item.Book.price,
                        timeStart: item.timeStart,
                        timeEnd: item.timeEnd,
                    }
            });

        const isSuccess = exportExcel({
            listData: listHistoriesExport,
            listHeadings: [
                'Họ tên', 'Tên sách mượn', 'Số lượng mượn', 'Số lượng sách làm mất', 'Giá', 'Ngày mượn', 'Ngày trả'
            ],
            nameFile: 'List Student borrowed'
        });
        if (isSuccess)
            return toast.success("Export excel successful!")

        toast.error("Export excel failed!")
    }

    function timeEndMax(timeStart) {
        timeStart = timeStart.split("/").reverse().join("/");
        return getFormattedDate(new Date(new Date(timeStart).getTime() + ((MAX_DAYS_TO_BORROW_BOOKS) * 24 * 60 * 60 * 1000)));
    }

    async function handleGiveLost(e, type, history) {
        e.preventDefault();
        const book = history.Book;
        let valueInput = e.target.querySelector('input').valueAsNumber;


        if (isNaN(valueInput) || valueInput <= 0 || valueInput > +book.quantityBorrowed) {
            return toast.error(`Your quantity ${type.toLowerCase()} must be between 1 and ${book.quantityBorrowed} !`);
        }

        if (type === 'LOST') {
            let data = await fetchData('POST', 'api/books/lost', {
                bookId: book.id,
                quantityReality: +book.quantityReality - +quantityLost.current,
                historyId: history.id,
                quantityBookLost: quantityLost.current
            });
            if (data.EC === 0) {
                stateGlobal.dataApprove?.handleApprove(history);
                stateGlobal.dataApprove?.fetchListHistories();
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        }

        if (type === 'GIVE') {
            stateGlobal.dataApprove?.handleApprove({
                ...history,
                quantityGive: valueInput,
                quantityBorrowedUpdate: +history.Book.quantityBorrowed - valueInput,
            });
        }


        // Xem xét các hàm handleClearForm có dùng reset đc ko, nếu đc thì thay thế toàn bộ
        e.target.reset();
    }



    useEffect(() => {
        setListHistories(stateGlobal.dataListHistories ?? []);
    }, [stateGlobal.dataListHistories])



    return (
        <>
            <div className='float-start mb-3 d-flex'>
                <h3>Histories students</h3>
            </div>

            <button className="btn btn-outline-success float-end ms-3"
                onClick={() => handleExport()}
            >Export excel <FcDownload size={30} /></button>

            {stateGlobal.dataListHistories?.length > 0 &&
                <SearchBar
                    listRefDefault={stateGlobal.dataListHistories}
                    listSearch={listHistories}
                    setListSearch={setListHistories}
                    pathDeepObj={'Student.fullName'}
                    classNameCss={'w-25 float-end'}
                    placeholder={'Searching ...'}
                />
            }


            <Table className='my-3' bordered hover>
                <thead>
                    <tr>
                        <th>
                            Full Name
                        </th>
                        <th>Book Borrowed</th>
                        <th>Quantity Borrowed</th>
                        <th>Quantity Book Lost</th>
                        <th>Price</th>
                        <th>Time Start</th>
                        <th>Time End</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {listHistories.length > 0 &&
                        listHistories.map((item, index) => {
                            return (
                                // Có trường hợp timeEnd === null và timeStart cũng === null, nên phải ẩn nó đi (d-none) vì chưa kịp xóa tự động
                                item.timeStart !== null &&
                                <tr key={`history-${index}`} className={`${isOutOfDate(item.timeStart) && !item.timeEnd ? 'table-danger' : ''}`}>
                                    <td>{item.Student.fullName}</td>
                                    <td>{item.Book.name}</td>
                                    <td>{item.Book.quantityBorrowed}</td>
                                    <td>{item.quantityBookLost}</td>
                                    <td>{item.Book.price}</td>
                                    <td>{item.timeStart}</td>
                                    <td>{item.timeEnd ?? timeEndMax(item.timeStart)} </td>
                                    <td className={`${!item.timeEnd ? 'd-flex gap-2' : ''}`}>
                                        {!item.timeEnd &&
                                            <>
                                                <form action="" className=" d-flex gap-2 border border-dark p-1"
                                                    onSubmit={(e) => handleGiveLost(e, 'GIVE', item)}
                                                >
                                                    <input type="number" ref={quantityGive} className="give"
                                                        onChange={(e) => quantityGive.current = e.target.value}
                                                    />

                                                    <button className="btn btn-success">Give</button>
                                                </form>

                                                <form action="" className=" d-flex gap-2 border border-dark p-1"
                                                    onSubmit={(e) => handleGiveLost(e, 'LOST', item)}
                                                >
                                                    <input type="number" ref={quantityLost} className="lost"
                                                        onChange={(e) => quantityLost.current = e.target.value}
                                                    />

                                                    <button className="btn btn-danger">Lost</button>
                                                </form>

                                            </>
                                        }

                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </Table>
        </>
    )
}

export default IndexHistories;