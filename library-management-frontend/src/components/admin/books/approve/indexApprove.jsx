import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { convertTimeStringToSecond, fetchData, getSecondsCurrent } from "../../../../utils/myUtils";
import SearchBar from "../../../both/searchBar";
import Table from 'react-bootstrap/Table';
import MyPagination from "../../../both/myPagination";
import useToggle from "../../../../hooks/useToggle";
import { useNavigate } from "react-router-dom";
import { ACTION, GlobalContext } from "../../../../context/globalContext";
import '../../../../assets/scss/admin/books/approve/indexApprove.scss';
import { toast } from "react-toastify";

// BUGS: Đang call api DELETE liên tục, chỉ call api delete khi ở component approve
const IndexApprove = (props) => {
    const [listStudents, setListStudents] = useState([]);
    const [limitItem, setLimitItem] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const listStudentsRef = useRef(null);
    const [minutesClearBook, setMinutesClearBook] = useState(1);
    const [showListBorrowed, toggleShowListBorrowed] = useToggle(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const { stateGlobal, dispatch } = useContext(GlobalContext);


    async function getStudents() {
        let data = await fetchData('GET', `api/histories?limit=${limitItem}&page=${currentPage}`)
        if (data.EC === 0 || data.EC === 1) {
            listStudentsRef.current = data.DT.histories;
            dispatch({ type: ACTION.SET_DATA_LIST_HISTORIES, payload: data.DT.histories })
            setListStudents(data.DT.histories);
            setTotalPages(data.DT.totalPages);
        }
    }

    async function handleApprove(history) {
        setIsDisabled(true);
        let dataHistorySend;
        if (Array.isArray(history)) {
            dataHistorySend = history.map((item) => {
                return {
                    id: item.id,
                    bookId: item.Book.id,
                    timeStart: item.timeStart,
                    newBorrowed: item.timeStart ? +item.Book.borrowed - +item.Book.quantityBorrowed : item.Book.borrowed
                }
            })
        } else {
            dataHistorySend = {
                id: history.id,
                bookId: history.Book.id,
                timeStart: history.timeStart,
                newBorrowed: history.timeStart ? (history.quantityBorrowedUpdate > 0 ? history.quantityGive : (+history.Book.borrowed - +history.Book.quantityBorrowed)) : history.Book.borrowed,

                // Data xử lí khi ko trả Book với quantity max
                studentId: history.Student.id,
                quantityGive: history.quantityGive,
                quantityBorrowedUpdate: history.quantityBorrowedUpdate,
            }
        }

        let data = await fetchData('POST', 'api/histories/uptime', dataHistorySend);
        if (data.EC === 0) {
            getStudents();
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
        setIsDisabled(false);
    }

    async function deleteHistories() {
        let listHistoriesDelete = [];

        if (!stateGlobal.dataListHistories) return;

        stateGlobal.dataListHistories?.forEach((item) => {
            let minuteItem = (getSecondsCurrent() - convertTimeStringToSecond(item.Book.timeBorrowed.time)) / 60;
            if (minuteItem > minutesClearBook && !item.timeStart) {
                listHistoriesDelete.push({
                    id: item.id,
                    bookId: item.Book.id,
                    quantityBorrowed: item.Book.quantityBorrowed
                });
            }
        })

        let data = await fetchData('DELETE', 'api/histories', { listHistories: listHistoriesDelete })

        if (data.EC === 0 && data.DT !== 0) {
            await getStudents();
        }

        return data;
    }


    async function handleClearBook(e) {
        let refreshInterval;
        e?.preventDefault();
        refreshInterval = setInterval(async () => {
            let data = await deleteHistories();
            if (data && data.DT === 0) {
                clearInterval(refreshInterval);
            }
        }, true ? 5000 : minutesClearBook * 60000)

    }

    // useEffect(() => {
    //     handleClearBook();
    // }, [stateGlobal.dataListHistories])


    useEffect(() => {
        getStudents();
    }, [currentPage])


    useEffect(() => {
        dispatch({ type: ACTION.SET_DATA_APPROVE, payload: { handleApprove, fetchListHistories: getStudents } })
    }, [])



    return (
        <>
            <div className='float-start'>
                <h3>List approve students</h3>
                <form className="d-flex my-2 gap-2 mt-3 mb-4" onSubmit={(e) => handleClearBook(e)}>
                    <input onChange={(e) => setMinutesClearBook(e.target.value)} value={minutesClearBook} type="number" className="form-control w-25" />
                    <button type="submit" className="btn btn-success">Set</button>
                    <p className="opacity-75 fst-italic m-0 mt-1 w-100">(Auto clear book not approve after <strong className="text-danger">{minutesClearBook} minutes</strong>)</p>
                </form>
            </div>

            <div className="d-flex float-end">
                {listStudentsRef?.current?.length > 0 &&
                    <SearchBar
                        listRefDefault={listStudentsRef.current}
                        listSearch={listStudents}
                        setListSearch={setListStudents}
                        pathDeepObj={'Student.fullName'}
                        classNameCss={'w-75 me-3'}
                        placeholder={'Searching ...'}
                    />
                }

                <button onClick={() => getStudents()} className="btn btn-warning">Refresh</button>
            </div>

            <Table className='listApprove my-3' bordered hover>
                <thead>
                    <tr>
                        <th>
                            Full Name
                        </th>
                        <th>Quantity Reality</th>
                        <th>Quantity Borrowed</th>
                        <th>Book Borrowed</th>
                        <th>Is Borrowed</th>
                        <th>Actions
                            <button className="btn btn-danger btn-sm float-end" data-toggle="tooltip" data-placement="bottom" title="Approve all 'Đươc mượn về'"
                                onClick={() => handleApprove(stateGlobal.dataListHistories)}
                                disabled={isDisabled}
                            >Approve all</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listStudents.length > 0 &&
                        listStudents.map((item, index) => {
                            return (
                                // Có trường hợp timeEnd === null và timeStart cũng === null, nên phải ẩn nó đi (d-none) vì chưa kịp xóa tự động
                                item[showListBorrowed ? 'timeEnd' : 'timeStart'] === null &&
                                <tr key={`history-${index}`} className={`${showListBorrowed && item.timeStart === null ? 'd-none' : ''}`}>
                                    <td>{item.Student.fullName}</td>
                                    <td>{item.Book.quantityReality}</td>
                                    <td>{item.Book.quantityBorrowed}</td>
                                    <td>{item.Book.name}</td>
                                    <td className={`${item.Book.categories.some(item => item.isBorrowed === 0) ? `fw-bold text-danger` : ''}`}>{item.Book.categories.some(item => item.isBorrowed === 0) ? `Chỉ đọc tại chỗ` : 'Được mượn về'}</td>

                                    <td>
                                        <button className={`btn btn-info`}
                                            onClick={() => handleApprove(item)}
                                            disabled={isDisabled}
                                        >Approve</button>
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </Table>

            <MyPagination
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </>
    )


}

export default IndexApprove;