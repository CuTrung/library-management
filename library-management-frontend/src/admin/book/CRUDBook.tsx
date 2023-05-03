import FormBook from "./formBook";
import ListItem from "../../components/listItem";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { exportExcel, fetchData, getCurrentDate } from "../../utils/myUtils";
import { HTTPMethods, ResAxios, ResBook } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getBooks } from "../../redux/features/book/bookSlice";
import MyPagination from "../../components/pagination";
import DownloadIcon from "@mui/icons-material/Download";
import { toast } from "react-toastify";

export default function CRUDBook() {
    const { values, totalPages, currentPage } = useAppSelector(
        (state) => state.book,
    );

    const [bookUpdate, setBookUpdate] = useState<ResBook>();

    const dispatch = useAppDispatch();
    const listBook = (values as ResBook[]).map((book) => ({
        id: book.id,
        name: book.name,
        quantity: book.quantity,
        quantityReality: book.quantityReality,
        borrowed: book.borrowed,
        status: book.Status.name,
        price: book.price,
        // Index mảng là vị trí lần lượt các column
        customWidthColumns: [100, 250, 80, null, null, 85],
    }));

    const actionsColumn = {
        field: "actions",
        headerName: "Actions",
        width: 160,
        renderCell(params: any) {
            const book = (values as ResBook[]).find(
                (item) => item.id === params.row.id,
            ) as ResBook;

            const handleEdit = () => {
                setBookUpdate(book);
            };
            const handleDelete = async () => {
                const data = (await fetchData(HTTPMethods.DELETE, "/books", {
                    id: book.id,
                })) as ResAxios;

                if (data.EC === 0) {
                    getListBook(currentPage[0] as number);
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

    const getListBook = async (page: number) => {
        await dispatch(getBooks({ page }));
    };

    const getAllBooks = async () => {
        const data = (await fetchData(HTTPMethods.GET, "/books")) as ResAxios;
        if (data.EC === 0) {
            return data.DT;
        }
        return [];
    };

    const getAllDepartments = async () => {
        const data = (await fetchData(
            HTTPMethods.GET,
            "/departments",
        )) as ResAxios;
        if (data.EC === 0) {
            return data.DT;
        }
        return [];
    };

    useEffect(() => {
        getListBook(currentPage[0] as number);
    }, []);

    async function handleDownloadExcel() {
        const dataBooks = await getAllBooks();
        const dataDepartments = await getAllDepartments();

        let listBook = (dataBooks as ResBook[]).map((item) => {
            return {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                quantityReality: item.quantityReality,
                quantityLost: item.quantity - item.quantityReality,
                borrowed: item.borrowed,
                majors: item.Majors.map((item) => item.description).join(", "),
                departments: [
                    ...new Set(
                        item.Majors.map((item) => {
                            for (const department of dataDepartments) {
                                if (item.departmentId === department.id)
                                    return department.description;
                            }
                        }),
                    ),
                ].join(","),
                status: item.Status.name,
                // Fake ngày tạo
                dateCreated: getCurrentDate(),
            };
        });

        // listHeadings phải theo thứ tự key như listData
        const isSuccess = exportExcel({
            listData: listBook,
            listHeadings: [
                "Tên sách",
                "Giá sách",
                "Số lượng ban đầu",
                "Số lượng thực tế",
                "Số lượng đã mất",
                "Số lượng đã mượn",
                "Chuyên ngành",
                "Khoa",
                "Tình trạng",
                "Ngày tạo",
            ],
            nameFile: `List_Book_${getCurrentDate()}`,
        });
        if (isSuccess) return toast.success("Export excel successful!");

        toast.error("Export excel failed!");
    }

    return (
        <>
            <FormBook setBookUpdate={setBookUpdate} bookUpdate={bookUpdate} />
            <hr className="mt-4" />

            <Button
                className="me-3 float-end"
                variant="outlined"
                startIcon={<DownloadIcon />}
                color="secondary"
                onClick={() => handleDownloadExcel()}
            >
                Download List Book
            </Button>

            <ListItem
                dataList={listBook}
                customColumns={[actionsColumn]}
                header="List book"
                style={{ height: "23.125em", width: "100%" }}
            />
            <MyPagination
                currentPage={currentPage[0] as number}
                totalPages={totalPages[0] as number}
                cb={getListBook}
                classCss="mb-3 mt-5 pt-3"
            />
        </>
    );
}
