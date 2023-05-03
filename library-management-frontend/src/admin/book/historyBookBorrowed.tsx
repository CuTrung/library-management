import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getHistories } from "../../redux/features/history/historySlice";
import ListItem from "../../components/listItem";
import MyPagination from "../../components/pagination";
import Button from "@mui/material/Button";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { HTTPMethods, ResAxios, ResHistory } from "../../types/types";
import { exportExcel, fetchData, qs } from "../../utils/myUtils";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import { toast } from "react-toastify";

export default function HistoryBookBorrowed() {
    const { values, currentPage, totalPages } = useAppSelector(
        (state) => state.history,
    );
    const listHistories = (values as ResHistory[])
        .filter((item) => item.timeStart)
        .map((history) => ({
            id: history.id,
            fullName: history.Student.fullName,
            bookBorrowed: history.Book.name,
            quantityBorrowed: history.quantityBorrowed,
            quantityLost: history.quantityBookLost,
            timeStart: history.timeStart,
            timeEnd: history.timeEnd,
            customWidthColumns: [60, 100, 180, 130, 130, 100, 100],
        }));
    const dispatch = useAppDispatch();

    const [isBookRenewal, setIsBookRenewal] = React.useState(false);

    const getListHistory = async (page: number) => {
        await dispatch(getHistories({ page }));
    };

    function handleDownloadExcel() {
        // Lấy 3 books để làm sample
        let listHistoriesSample = (values as ResHistory[])
            .filter((item) => item.timeStart)
            .slice(0, 3)
            .map((history) => {
                return {
                    name: history.Student.fullName,
                    bookBorrowed: history.Book.name,
                    quantityBorrowed: history.quantityBorrowed,
                    quantityBookLost: history.quantityBookLost,
                    timeStart: history.timeStart,
                    timeEnd: history.timeEnd,
                    isReturned:
                        history.isReturned === 0 ? "Chưa trả" : "Đã trả",
                };
            });

        // listHeadings phải theo thứ tự key như listData
        const isSuccess = exportExcel({
            listData: listHistoriesSample,
            listHeadings: [
                "Tên sinh viên",
                "Tên sách",
                "Số lượng mượn",
                "Số lượng mất",
                "Ngày bắt đầu mượn",
                "Ngày kết thúc mượn",
                "Trạng thái",
            ],
            nameFile: "List history",
        });
        if (isSuccess) return toast.success("Export excel successful!");

        toast.error("Export excel failed!");
    }

    React.useEffect(() => {
        getListHistory(currentPage[0] as number);
    }, []);

    const actionsColumn = {
        field: "actions",
        headerName: "Actions",
        width: 270,
        renderCell(params: any) {
            const history = (values as ResHistory[]).find(
                (item) => item.id === params.row.id,
            ) as ResHistory;

            async function handleGiveLost(
                e: React.FormEvent<HTMLFormElement>,
                type: string,
            ) {
                e.preventDefault();
                const valueInput = +(
                    qs("input", e.target as Document) as HTMLInputElement
                ).value;

                const isLost = type === "LOST" ? true : false;

                const payload = {
                    id: history.id,
                    bookId: history.Book.id,
                    studentId: history.Student.id,
                    timeStart: history.timeStart,
                    timeEnd: history.timeEnd,
                    [isLost ? "quantityBookLost" : "quantityBookGive"]:
                        valueInput,
                    newBorrowed: history.Book.borrowed - valueInput,
                    quantityBorrowedNew: history.quantityBorrowed - valueInput,
                };

                const data = (await fetchData(
                    HTTPMethods.POST,
                    "/histories/uptime",
                    payload,
                )) as ResAxios;

                if (data.EC === 0) {
                    getListHistory(currentPage[0] as number);
                }

                (e.target as HTMLFormElement).reset();
            }

            const handleSetTime = async (
                e: React.FormEvent<HTMLFormElement>,
            ) => {
                e.preventDefault();
                const newDate = (
                    qs("input", e.target as Document) as HTMLInputElement
                ).value;
                const data = (await fetchData(HTTPMethods.PATCH, "/histories", {
                    id: history.id,
                    timeEnd: newDate.split("-").reverse().join("/"),
                })) as ResAxios;

                if (data.EC === 0) {
                    getListHistory(currentPage[0] as number);
                }
                (e.target as HTMLFormElement).reset();
            };

            return (
                <>
                    {isBookRenewal ? (
                        <form
                            className=" d-flex gap-2 border border-dark p-1"
                            onSubmit={(e) => handleSetTime(e)}
                        >
                            <input
                                type="date"
                                // style={{ width: "4em" }}
                                className="form-control w-75"
                            />

                            <button className="btn btn-info">Gia hạn</button>
                        </form>
                    ) : (
                        <>
                            {history.isReturned === 0 && (
                                <>
                                    <form
                                        className=" d-flex gap-2 border border-dark p-1"
                                        onSubmit={(e) =>
                                            handleGiveLost(e, "GIVE")
                                        }
                                    >
                                        <input
                                            type="number"
                                            style={{ width: "4em" }}
                                            min={1}
                                            max={history.quantityBorrowed}
                                        />

                                        <button className="btn btn-success">
                                            Give
                                        </button>
                                    </form>

                                    <form
                                        className="d-flex gap-2 border border-dark p-1"
                                        onSubmit={(e) =>
                                            handleGiveLost(e, "LOST")
                                        }
                                    >
                                        <input
                                            type="number"
                                            style={{ width: "4em" }}
                                            min={1}
                                            max={history.quantityBorrowed}
                                        />

                                        <button className="btn btn-danger">
                                            Lost
                                        </button>
                                    </form>
                                </>
                            )}
                        </>
                    )}
                </>
            );
        },
    };

    console.log(">>> Check data", values);

    return (
        <>
            <Button
                onClick={() => setIsBookRenewal(!isBookRenewal)}
                className="float-end"
                variant="outlined"
                color={isBookRenewal ? "error" : "secondary"}
            >
                {isBookRenewal ? "Trả / Mất" : "Gia hạn ngày trả"}
            </Button>
            <Button
                className="float-end me-3"
                variant="outlined"
                startIcon={<DownloadIcon />}
                color="success"
                onClick={() => handleDownloadExcel()}
            >
                Download History
            </Button>
            <ListItem
                dataList={listHistories}
                customColumns={[actionsColumn]}
                header="List history"
                style={{ height: "31.25em", width: "100%" }}
            />
            <MyPagination
                currentPage={currentPage[0] as number}
                totalPages={totalPages[0] as number}
                cb={getListHistory}
                classCss="mb-5"
            />
        </>
    );
}
