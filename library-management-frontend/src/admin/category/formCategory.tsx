import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button, { ButtonPropsColorOverrides } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import BackspaceIcon from "@mui/icons-material/Backspace";
import {
    Category,
    HTTPMethods,
    Major,
    ResAxios,
    Status,
} from "../../types/types";
import {
    exportExcel,
    fetchData,
    importExcel,
    qs,
    qsa,
    toBase64,
} from "../../utils/myUtils";
import MyCheckbox from "../../components/myCheckbox";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useToggle from "../../hooks/useToggle";
import { getCategories } from "../../redux/features/category/categorySlice";
import { getStatus } from "../../redux/features/status/statusSlice";
import { toast } from "react-toastify";

export default function FormCategory({
    categoryOrStatusUpdate,
    setCategoryOrStatusUpdate,
    isStatus,
    toggleStatus,
}: {
    categoryOrStatusUpdate: Category | Status | undefined;
    setCategoryOrStatusUpdate: Function;
    isStatus: boolean;
    toggleStatus: any;
}) {
    const [name, setName] = React.useState("");
    const [belongsToTable, setBelongsToTable] = React.useState("");
    const [fileUpload, setFileUpload] = React.useState<File>();
    const categoryOrStatusState = useAppSelector(
        (state) => state[isStatus ? "status" : "category"].values,
    ) as Category[] | Status[];

    const dispatch = useAppDispatch();

    const objForm = React.useMemo(
        () => ({
            titleHeader: categoryOrStatusUpdate ? "Update" : "Add",
            buttonContent: categoryOrStatusUpdate ? "Save" : "Submit",
            buttonColor: categoryOrStatusUpdate ? "success" : "primary",
            auxiliaryButtonContent: categoryOrStatusUpdate ? "Cancel" : "Clear",
            auxiliaryButtonColor: categoryOrStatusUpdate ? "error" : "warning",
        }),
        [categoryOrStatusUpdate],
    );

    const categoryRef = React.useRef<HTMLFieldSetElement>(null);
    const majorRef = React.useRef<HTMLFieldSetElement>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Upload Excel
        let listCategoriesImport = [];
        let payload = {};
        if (fileUpload) {
            listCategoriesImport = await importExcel(fileUpload as File);
            listCategoriesImport = listCategoriesImport.map((item) => ({
                ...item,
                rowNum: item.__rowNum__,
            }));
        } else {
            payload = {
                name: isStatus ? name.toUpperCase() : name,
                id: categoryOrStatusUpdate && categoryOrStatusUpdate.id,
                [isStatus ? "belongsToTable" : "isBorrowed"]: isStatus
                    ? belongsToTable.toUpperCase()
                    : checkedCategoryUpdate(),
            };
        }

        const data = (await fetchData(
            HTTPMethods.POST,
            `/${isStatus ? "status" : "categories"}`,
            listCategoriesImport.length > 0 ? listCategoriesImport : payload,
        )) as ResAxios;

        if (data.EC === 0) {
            fileUpload ? setFileUpload(undefined) : resetForm();
            categoryOrStatusUpdate
                ? setCategoryOrStatusUpdate(undefined)
                : setName("");
            dispatch(
                isStatus ? getStatus({ page: 1 }) : getCategories({ page: 1 }),
            );
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    }

    function handleDownloadExcel() {
        // Lấy 3 categories để làm sample
        let listCategoryOrStatusSample = categoryOrStatusState
            .slice(0, 3)
            .map((item) => {
                return {
                    name: item.name,
                    [isStatus ? "belongsToTable" : "isBorrowed"]: isStatus
                        ? "belongsToTable" in item && item.belongsToTable
                        : "isBorrowed" in item && item.isBorrowed,
                };
            });

        // listHeadings phải theo thứ tự key như listData
        const isSuccess = exportExcel({
            listData: listCategoryOrStatusSample,
            listHeadings: [
                "Tên",
                isStatus ? "Thuộc về bảng" : "Được mượn (= 1 nếu cho phép)",
            ],
            nameFile: isStatus ? "StatusSample" : "CategoriesSample",
        });
        if (isSuccess) return toast.success("Export excel successful!");

        toast.error("Export excel failed!");
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        setFileUpload(e.target.files[0]);
        toast.success("Upload CSV successful !");
    }

    const resetForm = () => {
        setName("");
        setBelongsToTable("");
        (qs("#formUpsert") as HTMLFormElement).reset();
    };

    const handleClear = () => {
        setCategoryOrStatusUpdate(undefined);
        resetForm();
    };

    const checkedCategoryUpdate = (
        categoryOrStatusUpdate?: Category | Status,
    ) => {
        const categoryCheckboxes = qsa(
            "[type='checkbox']",
            qs("#categoryCheckboxes") as HTMLElement,
        ) as HTMLInputElement[];

        if (categoryOrStatusUpdate !== undefined) {
            categoryCheckboxes[0].checked =
                "isBorrowed" in categoryOrStatusUpdate &&
                categoryOrStatusUpdate.isBorrowed === 0
                    ? true
                    : false;
        }
        return categoryCheckboxes[0].checked ? 0 : 1;
    };

    const setDataFormUpdate = () => {
        if (categoryOrStatusUpdate === undefined) return;
        !isStatus && checkedCategoryUpdate(categoryOrStatusUpdate);
        setName(categoryOrStatusUpdate.name);
    };

    React.useEffect(() => {
        setDataFormUpdate();
    }, [categoryOrStatusUpdate]);

    React.useEffect(() => {
        dispatch(
            isStatus ? getStatus({ page: 1 }) : getCategories({ page: 1 }),
        );
    }, []);

    return (
        <>
            <div className="d-flex justify-content-between mb-2 w-100">
                <h4 className="w-100">
                    {objForm.titleHeader} {isStatus ? "status" : "category"}:
                    <Button
                        color={(isStatus as boolean) ? "success" : "info"}
                        type="button"
                        variant="outlined"
                        onClick={toggleStatus as any}
                        size={"small"}
                        className={"float-end pt-1"}
                    >
                        {isStatus ? "category" : "status"}
                    </Button>
                </h4>
            </div>

            <Box
                id="formUpsert"
                component="form"
                // sx={{
                //     "& > :not(style)": { m: 1, width: "25ch" },
                // }}
                // noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <div className="d-flex flex-column gap-3 mb-3">
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        color="secondary"
                        onClick={() => handleDownloadExcel()}
                    >
                        Download sample
                    </Button>

                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        color={fileUpload?.name ? "success" : "primary"}
                    >
                        <input
                            hidden
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            type="file"
                            onChange={handleFileUpload}
                        />
                        {fileUpload?.name ?? "Upload file CSV"}
                    </Button>
                </div>

                {/* Name*/}
                <div className="w-100 mb-2">
                    <TextField
                        // inputRef={name}
                        required={fileUpload ? false : true}
                        className="mb-3 w-100"
                        id="outlined-basic"
                        label="Name"
                        multiline
                        maxRows={2}
                        variant="outlined"
                        value={name}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setName(event.target.value);
                        }}
                    />
                    {!isStatus ? (
                        <MyCheckbox
                            listData={[{ name: `Can't borrow` }]}
                            fieldLabel="name"
                            classCss="d-flex flex-row gap-3 flex-wrap"
                            id="categoryCheckboxes"
                        />
                    ) : (
                        <>
                            <TextField
                                // inputRef={name}
                                required
                                className="mb-3 w-100"
                                id="outlined-basic"
                                label="Belongs To Table"
                                multiline
                                maxRows={2}
                                variant="outlined"
                                value={belongsToTable}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setBelongsToTable(event.target.value);
                                }}
                            />
                        </>
                    )}
                </div>

                {/* Button */}
                <Button
                    color={objForm.buttonColor as "primary" | "success"}
                    className="me-3"
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                >
                    {objForm.buttonContent}
                </Button>

                <Button
                    color={objForm.auxiliaryButtonColor as "warning" | "error"}
                    type="button"
                    variant="contained"
                    endIcon={<BackspaceIcon />}
                    onClick={handleClear}
                >
                    {objForm.auxiliaryButtonContent}
                </Button>
            </Box>
        </>
    );
}
