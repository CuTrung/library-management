import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getHistories } from "../../redux/features/history/historySlice";
import ListItem from "../../components/listItem";
import MyPagination from "../../components/pagination";
import Button from "@mui/material/Button";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { HTTPMethods, ResAxios, ResHistory } from "../../types/types";
import { fetchData } from "../../utils/myUtils";

export default function ApproveBook() {
    const { values, currentPage, totalPages } = useAppSelector(
        (state) => state.history,
    );
    const listHistories = (values as ResHistory[]).map((history) => ({
        id: history.id,
        fullName: history.Student.fullName,
        quantityReality: history.Book.quantityReality,
        quantityBorrowed: history.quantityBorrowed,
        bookBorrowed: history.Book.name,
        customWidthColumns: [100, 200, 120, null, null, 85],
    }));
    const dispatch = useAppDispatch();

    const getListHistory = async (page: number) => {
        await dispatch(
            getHistories({ page, condition: { timeStart: "null" } }),
        );
    };

    console.log(">>> Check data", values);

    React.useEffect(() => {
        getListHistory(currentPage[0] as number);
    }, []);

    const actionsColumn = {
        field: "actions",
        headerName: "Actions",
        width: 160,
        renderCell(params: any) {
            const handleApprove = async () => {
                const { row: history } = params;
                console.log(">>> Check data", history);
                const data = (await fetchData(
                    HTTPMethods.POST,
                    "/histories/uptime",
                    { id: history.id },
                )) as ResAxios;
                if (data.EC === 0) {
                    getListHistory(currentPage[0] as number);
                }
            };

            return (
                <>
                    <Button
                        onClick={handleApprove}
                        variant="contained"
                        endIcon={<AssignmentTurnedInIcon />}
                        color={"success"}
                    >
                        Approve
                    </Button>
                </>
            );
        },
    };

    return (
        <>
            <ListItem
                dataList={listHistories}
                customColumns={[actionsColumn]}
                header="List approve"
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
