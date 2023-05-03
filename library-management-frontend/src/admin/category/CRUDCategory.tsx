import FormCategory from "./formCategory";
import ListItem from "../../components/listItem";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { fetchData } from "../../utils/myUtils";
import { Category, HTTPMethods, ResAxios, Status } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getCategories } from "../../redux/features/category/categorySlice";
import MyPagination from "../../components/pagination";
import useToggle from "../../hooks/useToggle";
import { getStatus } from "../../redux/features/status/statusSlice";
import { toast } from "react-toastify";

export default function CRUDCategory() {
    const [isStatus, toggleStatus] = useToggle(false);
    const { values, totalPages, currentPage } = useAppSelector(
        (state) => state[isStatus ? "status" : "category"],
    );

    const [categoryOrStatusUpdate, setCategoryOrStatusUpdate] = useState<
        Category | Status
    >();

    const dispatch = useAppDispatch();
    const listCategoryOrStatus = (values as Category[] | Status[]).map(
        (categoryOrStatus) => ({
            id: categoryOrStatus.id,
            name: categoryOrStatus.name,
            [isStatus ? "belongsToTable" : "isBorrowed"]: isStatus
                ? "belongsToTable" in categoryOrStatus &&
                  categoryOrStatus.belongsToTable
                : "isBorrowed" in categoryOrStatus &&
                  categoryOrStatus.isBorrowed === 0
                ? "Can't borrow"
                : "Borrow",
            // Index mảng là vị trí lần lượt các column
            customWidthColumns: [100, 250, 150],
        }),
    );

    const actionsColumn = {
        field: "actions",
        headerName: "Actions",
        width: 160,
        renderCell(params: any) {
            const categoryOrStatus = (values as any).find(
                (item: Category | Status) => item.id === params.row.id,
            ) as Category | Status;
            const handleEdit = () => {
                setCategoryOrStatusUpdate(categoryOrStatus);
            };
            const handleDelete = async () => {
                const data = (await fetchData(
                    HTTPMethods.DELETE,
                    `/${isStatus ? "status" : "categories"}`,
                    {
                        id: categoryOrStatus.id,
                    },
                )) as ResAxios;

                if (data.EC === 0) {
                    getListCategoryOrStatus(currentPage[0] as number);
                    toast.success(data.EM);
                } else {
                    toast.error(data.EM);
                }
            };
            return (
                <>
                    <Button onClick={handleEdit}>
                        <ModeEditIcon color={"warning"} fontSize="large" />
                    </Button>

                    <Button onClick={handleDelete}>
                        <DeleteForeverIcon color={"error"} fontSize="large" />
                    </Button>
                </>
            );
        },
    };

    const getListCategoryOrStatus = async (page: number) => {
        await dispatch(
            isStatus ? getStatus({ page }) : getCategories({ page }),
        );
    };

    useEffect(() => {
        getListCategoryOrStatus(currentPage[0] as number);
    }, [isStatus]);

    return (
        <>
            <div className={"d-flex"}>
                <div className="w-25">
                    <FormCategory
                        setCategoryOrStatusUpdate={setCategoryOrStatusUpdate}
                        categoryOrStatusUpdate={categoryOrStatusUpdate}
                        toggleStatus={toggleStatus}
                        isStatus={isStatus as boolean}
                    />
                </div>

                <div className="w-75 ps-5">
                    <ListItem
                        dataList={listCategoryOrStatus}
                        customColumns={[actionsColumn]}
                        header={`List ${isStatus ? "Status" : "Category"}`}
                        style={{ height: "31.25em", width: "100%" }}
                    />
                    <MyPagination
                        currentPage={currentPage[0] as number}
                        totalPages={totalPages[0] as number}
                        cb={getListCategoryOrStatus}
                        classCss="mb-5"
                    />
                </div>
            </div>
        </>
    );
}
