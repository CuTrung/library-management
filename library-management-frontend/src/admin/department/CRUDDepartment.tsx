import { useRef, useState, useEffect } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import {
    exportExcel,
    fetchData,
    importExcel,
    qs,
    qsa,
    upperCaseFirstChar,
} from "../../utils/myUtils";
import useToggle from "../../hooks/useToggle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { HTTPMethods, ResAxios } from "../../types/types";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";

export default function CRUDDepartment() {
    const [fileName, setFileName] = useState(null);
    const [show, toggleShow] = useToggle(false);
    const [isUpload, setIsUpload] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [rerender, setRerender] = useState(false);
    const [listTypesTable, setListTypesTable] = useState([]);
    const [typeTable, setTypeTable] = useState("");

    const listTypes = [
        {
            name: "DEPARTMENT",
            color: "primary",
        },
        {
            name: "MAJOR",
            color: "warning",
        },
    ];

    async function handleDownloadExcel(typeName: string) {
        // Chưa xử lí phần này

        const data = (await fetchData(
            HTTPMethods.GET,
            `/${typeName.toLowerCase()}s`,
        )) as ResAxios;

        let listSample = data.DT.slice(0, 3).map((item: any) => {
            return {
                name: item.name,
                description: item.description,
                department: item.Department?.description,
            };
        });

        // listHeadings phải theo thứ tự key như listData
        const isSuccess = exportExcel({
            listData: listSample,
            listHeadings: [
                "Tên",
                "Mô tả",
                `${typeName === "MAJOR" ? "Khoa" : ""}`,
            ],
            nameFile: `${upperCaseFirstChar(typeName)}Sample`,
        });

        if (isSuccess) return toast.success("Export excel successful!");

        toast.error("Export excel failed!");
    }

    async function handleUpload() {
        setIsDisabled(true);
        for await (const item of qsa(".fileUpload") as HTMLInputElement[]) {
            let file = item.files && item.files[0];

            if (!file?.name) continue;

            if (file.name && file.name.split(".")[1] !== "xlsx") {
                setIsDisabled(false);
                return;
            }

            let listImport = await importExcel(file);
            listImport = listImport.map((item) => ({
                ...item,
                rowNum: item.__rowNum__,
            }));

            let typeName = item.id.split("-")[1];
            const data = (await fetchData(
                HTTPMethods.POST,
                `/${typeName.toLowerCase()}s`,
                listImport,
            )) as ResAxios;

            if (data.EC === 0) {
                (qs(`#formUpload-${typeName}`) as HTMLFormElement).reset();
                handleView(typeName);
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        }
        setIsDisabled(false);

        // handleClearForm();
    }

    async function handleView(typeName = "DEPARTMENT") {
        setTypeTable(typeName);
        const data = (await fetchData(
            HTTPMethods.GET,
            `/${typeName.toLowerCase()}s`,
        )) as ResAxios;

        if (data.EC === 0) {
            setListTypesTable(data.DT);
        }
    }

    async function handleDelete(id: number) {
        const data = (await fetchData(
            HTTPMethods.DELETE,
            `/${typeTable.toLowerCase()}s`,
            {
                id,
            },
        )) as ResAxios;
        if (data.EC === 0) {
            handleView(typeTable);
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    }

    useEffect(() => {
        handleView();
    }, []);

    return (
        <>
            <div className="row border border-2 border-rounded mt-3 ms-3 h-100">
                <div className="col-5 pt-3">
                    {listTypes.map((item, index) => {
                        return (
                            <div
                                key={`typeItem-${index}`}
                                className="d-flex gap-2 mb-3"
                            >
                                <h4
                                    style={{ minWidth: "5.125em" }}
                                    className={`text-${item.color}`}
                                >
                                    {upperCaseFirstChar(item.name)}
                                </h4>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDownloadExcel(item.name)
                                    }
                                    className={`btn btn-outline-secondary btn-sm border border-2 border-primary p-1 w-100`}
                                >
                                    Sample <DownloadIcon color="primary" />
                                </button>

                                <form id={`formUpload-${item.name}`} action="">
                                    <input
                                        id={`fileUpload-${item.name}`}
                                        type="file"
                                        className="fileUpload"
                                        hidden
                                        onChange={() => setRerender(!rerender)}
                                    />
                                </form>

                                <label
                                    htmlFor={`fileUpload-${item.name}`}
                                    className={`btn btn-outline-secondary btn-sm border border-2 border-success w-100 d-flex justify-content-between`}
                                    title={
                                        (qs(`#fileUpload-${item.name}`) as any)
                                            ?.files[0]?.name ?? ""
                                    }
                                >
                                    <span
                                        className="d-inline-block text-truncate"
                                        style={{ maxWidth: "4.5em" }}
                                    >
                                        {(qs(`#fileUpload-${item.name}`) as any)
                                            ?.files[0]?.name ?? "Upload"}{" "}
                                    </span>
                                    <UploadIcon
                                        className="float-end"
                                        color="success"
                                    />
                                </label>

                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleView(item.name)}
                                >
                                    View
                                </button>
                            </div>
                        );
                    })}

                    <button
                        className="btn btn-primary btn-sm float-end mb-3 me-5 px-3"
                        onClick={() => handleUpload()}
                        disabled={isDisabled}
                    >
                        Send Upload
                    </button>
                </div>

                <div className="col-7">
                    <h3 className="text-center my-3">
                        List {typeTable.toLowerCase()}s
                    </h3>
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                {typeTable === "MAJOR" && <th>Department</th>}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listTypesTable.length > 0 &&
                                listTypesTable.map((item: any, index) => {
                                    return (
                                        <tr key={`typeTable-${index}`}>
                                            <td>{item.name}</td>
                                            <td>{item.description}</td>
                                            {typeTable === "MAJOR" && (
                                                <td>
                                                    {item.Department
                                                        ?.description ?? ""}
                                                </td>
                                            )}
                                            <td>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    <DeleteForeverIcon color="error" />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
