import { useState, useEffect, useRef } from "react";
import { convertTimeStringToSecond, fetchData, getSecondsCurrent } from "../../../../utils/myUtils";
import SearchBar from "../../../both/searchBar";
import Table from 'react-bootstrap/Table';
import MyPagination from "../../../both/myPagination";



const IndexApprove = (props) => {

    const [listStudents, setListStudents] = useState([]);
    const [limitItem, setLimitItem] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const listStudentsRef = useRef(null);
    const [minutesClearBook, setMinutesClearBook] = useState(1);


    async function getStudents() {
        let data = await fetchData('GET', `api/histories?limit=${limitItem}&page=${currentPage}`)
        if (data.EC === 0 || data.EC === 1) {
            listStudentsRef.current = data.DT.histories;
            setListStudents(data.DT.histories);
            setTotalPages(data.DT.totalPages);
        }

    }

    async function handleApprove(historyId) {
        let data = await fetchData('POST', 'api/histories', { id: historyId });
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

    // Chưa hoàn thiện 
    async function handleClearBook(e) {
        e?.preventDefault();
        let refreshInterval;
        return new Promise((resolve, reject) => {
            refreshInterval = setInterval(async () => {
                if (location.pathname !== '/admin/books')
                    clearInterval(refreshInterval);
                else
                    resolve(
                        await deleteHistories()
                    )
            }, minutesClearBook * 60000)
        }).then(async (res) => {
            if (res.DT > 0)
                await getStudents();


        })
    }


    useEffect(() => {
        getStudents();
    }, [currentPage])

    useEffect(() => {
        handleClearBook();
    }, [])


    return (
        <>
            <div className='float-start mb-3'>
                <h3>List approve students</h3>
                <form className="d-flex my-2 gap-2 mt-3" onSubmit={(e) => handleClearBook(e)}>
                    <input onChange={(e) => setMinutesClearBook(e.target.value)} value={minutesClearBook} type="number" className="form-control w-25" />
                    <button type="submit" className="btn btn-success">Ok</button>
                    <p className="opacity-75 fst-italic m-0 mt-1 w-100">(Auto clear book after not approve <strong className="text-danger">{minutesClearBook} minutes</strong>)</p>
                </form>
            </div>

            <button onClick={() => getStudents()} className="btn btn-warning float-end ms-3">Refresh</button>

            {listStudentsRef?.current?.length > 0 &&
                <SearchBar
                    listSearch={listStudentsRef.current}
                    setListSearch={setListStudents}
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
                        <th>Quantity Borrowed</th>
                        <th>Book Borrowed</th>
                        <th>Is Borrowed</th>
                        <th>Actions
                            <button className="btn btn-danger btn-sm float-end" data-toggle="tooltip" data-placement="bottom" title="Approve all 'Đươc mượn về'"
                                onClick={() => handleApprove()}
                            >Approve all</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listStudents.length > 0 &&
                        listStudents.map((item, index) => {
                            return (
                                <tr key={`history-${index}`}>
                                    <td>{item.Student.fullName}</td>
                                    <td>{item.Book.quantityBorrowed}</td>
                                    <td>{item.Book.name}</td>
                                    <td>{item.Book.categories.some(item => item.isBorrowed === 0) ? `Chỉ đọc tại chỗ` : 'Được mượn về'}</td>

                                    <td>
                                        <button className="btn btn-info"
                                            onClick={() => handleApprove(item.id)}
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