import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../../both/searchBar";
import Table from 'react-bootstrap/Table';

import { FcDownload } from "react-icons/fc";
import { useContext } from "react";
import { GlobalContext } from "../../../../context/globalContext";
import { toast } from "react-toastify";
import { exportExcel } from "../../../../utils/myUtils";


const IndexHistories = (props) => {
    const [listHistories, setListHistories] = useState([]);
    const MAX_DAYS_TO_BORROW_BOOKS = import.meta.env.VITE_MAX_DAYS_TO_BORROW_BOOKS;

    const { stateGlobal, dispatch } = useContext(GlobalContext);

    const days = (date1, date2) => {
        let difference = date1.getTime() - date2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    }

    function isOutOfDate(timeStart) {
        let date = timeStart.split("/");
        let day = days(new Date(), new Date(`${date[1]}/${date[0]}/${date[2]}`));

        if (day >= MAX_DAYS_TO_BORROW_BOOKS) return true;

        return false;
    }


    // Export file excel
    function handleExport() {
        if (listHistories.length === 0)
            return toast.error("List histories is empty! Can't export !");

        let listHistoriesExport = listHistories.map((item) => {
            return {
                fullName: item.Student.fullName,
                name: item.Book.name,
                quantityBorrowed: item.Book.quantityBorrowed,
                price: item.Book.price,
                timeStart: item.timeStart,
                timeEnd: item.timeEnd,
            }
        });


        const isSuccess = exportExcel({
            listData: listHistoriesExport,
            listHeadings: [
                'Họ tên', 'Tên sách mượn', 'Số lượng mượn', 'Giá', 'Ngày mượn', 'Ngày trả'
            ],
            nameFile: 'List Student borrowed'
        });
        if (isSuccess)
            return toast.success("Export excel successful!")

        toast.error("Export excel failed!")
    }

    useEffect(() => {
        setListHistories(stateGlobal.dataListHistories ?? []);
    }, [stateGlobal.dataListHistories])


    return (
        <>
            <div className='float-start mb-3'>
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
                        <th>Price</th>
                        <th>Time Start</th>
                        <th>Time End</th>
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
                                    <td>{item.Book.price}</td>
                                    <td>{item.timeStart}</td>
                                    <td>{item.timeEnd}</td>
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