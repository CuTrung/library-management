import { useState, useEffect, useRef, useMemo, useContext } from "react";
import { convertTimeStringToSecond, fetchData, getSecondsCurrent } from "../../../../utils/myUtils";
import SearchBar from "../../../both/searchBar";
import Table from 'react-bootstrap/Table';
import MyPagination from "../../../both/myPagination";
import useToggle from "../../../../hooks/useToggle";
import { useNavigate } from "react-router-dom";
import { ACTION, GlobalContext } from "../../../../context/globalContext";


// BUGS: Đang call api DELETE liên tục, chỉ call api delete khi ở component approve
const IndexApprove = (props) => {
    const [listStudents, setListStudents] = useState([]);
    const [limitItem, setLimitItem] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const listStudentsRef = useRef(null);
    const [minutesClearBook, setMinutesClearBook] = useState(1);
    const [showListBorrowed, toggleShowListBorrowed] = useToggle(false);
    const navigate = useNavigate();

    const { stateGlobal, dispatch } = useContext(GlobalContext);

    const listApproveBorrowed = useMemo(() => {
        let propsList = {
            header: 'List approve',
            buttonChangeContent: 'List borrowed',
            buttonContent: 'Approve',
            buttonColor: 'info',
            supportButtonContent: 'Approve',
        }
        if (showListBorrowed) {
            propsList.header = 'List borrowed';
            propsList.buttonChangeContent = 'List approve';
            propsList.buttonContent = 'Return';
            propsList.buttonColor = 'success';
            propsList.supportButtonContent = 'Return';
        }
        return propsList;
    }, [showListBorrowed])


    async function getStudents() {

        let data = await fetchData('GET', `api/histories?limit=${limitItem}&page=${currentPage}`)
        if (data.EC === 0 || data.EC === 1) {
            listStudentsRef.current = data.DT.histories;

            dispatch({ type: ACTION.SET_DATA_LIST_HISTORIES, payload: data.DT.histories })

            setListStudents(data.DT.histories);
            setTotalPages(data.DT.totalPages);

        }

    }

    async function handleApprove(historyId) {
        let data = await fetchData('POST', 'api/histories/uptime', { id: historyId });
        if (data.EC === 0) {
            getStudents();
        }
    }

    async function deleteHistories() {
        let historyIdsDelete = [];

        listStudentsRef?.current?.forEach((item) => {
            let minuteItem = (getSecondsCurrent() - convertTimeStringToSecond(item.Book.timeBorrowed.time)) / 60;
            if (minuteItem > minutesClearBook) {
                historyIdsDelete.push(item.id);
            }
        })

        let data = await fetchData('DELETE', 'api/histories', { id: historyIdsDelete })

        return data;
    }


    async function handleClearBook(e) {
        e?.preventDefault();
        return new Promise((resolve, reject) => {
            setInterval(async () => {
                resolve(
                    await deleteHistories()
                )
            }, true ? 2000 : minutesClearBook * 60000)
        }).then(async (res) => {
            if (res.DT > 0)
                await getStudents();
        })
    }

    async function handleListBorrowed() {
        toggleShowListBorrowed();
    }

    useEffect(() => {
        getStudents();
    }, [currentPage])

    // useEffect(() => {
    //     handleClearBook();
    // }, [])

    return (
        <>
            <div className='float-start'>
                <h3>{listApproveBorrowed.header} students</h3>
                <form className="d-flex my-2 gap-2 mt-3" onSubmit={(e) => handleClearBook(e)}>
                    <input onChange={(e) => setMinutesClearBook(e.target.value)} value={minutesClearBook} type="number" className="form-control w-25" />
                    <button type="submit" className="btn btn-success">Set</button>
                    <p className="opacity-75 fst-italic m-0 mt-1 w-100">(Auto clear book after not approve <strong className="text-danger">{minutesClearBook} minutes</strong>)</p>
                </form>
            </div>


            {listStudentsRef?.current?.length > 0 &&
                <SearchBar
                    listRefDefault={listStudentsRef.current}
                    listSearch={listStudents}
                    setListSearch={setListStudents}
                    pathDeepObj={'Student.fullName'}
                    classNameCss={'w-25 float-end'}
                    placeholder={'Searching ...'}
                />
            }

            <div className="d-flex flex-row-reverse w-100 gap-3">
                <button onClick={() => getStudents()} className="btn btn-warning">Refresh</button>
                <button onClick={() => handleListBorrowed()} className={`btn btn-primary`}>{listApproveBorrowed.buttonChangeContent}</button>
            </div>

            <Table className='my-3' bordered hover>
                <thead>
                    <tr>
                        <th>
                            Full Name
                        </th>
                        <th>Quantity Borrowed</th>
                        <th>Book Borrowed</th>
                        <th>Is Borrowed</th>
                        <th>Actions
                            <button className="btn btn-danger btn-sm float-end" data-toggle="tooltip" data-placement="bottom" title="Approve all 'Đươc mượn về'"
                                onClick={() => handleApprove()}
                            >{listApproveBorrowed.supportButtonContent} all</button>
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
                                    <td>{item.Book.quantityBorrowed}</td>
                                    <td>{item.Book.name}</td>
                                    <td>{item.Book.categories.some(item => item.isBorrowed === 0) ? `Chỉ đọc tại chỗ` : 'Được mượn về'}</td>

                                    <td>
                                        <button className={`btn btn-${listApproveBorrowed.buttonColor}`}
                                            onClick={() => handleApprove(item.id)}
                                        >{listApproveBorrowed.buttonContent}</button>
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