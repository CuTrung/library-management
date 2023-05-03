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
    Role,
    HTTPMethods,
    Major,
    ResAxios,
    Group,
    GroupRole,
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
import { getGroupRoles } from "../../redux/features/groupRole/groupRoleSlice";
import SetRoleForGroup from "./setRoleForGroup";
import SetGroupForUser from "./setGroupForUser";
import { toast } from "react-toastify";

export default function FormRole({
    roleOrGroupUpdate,
    setRoleOrGroupUpdate,
    isGroup,
    setIsGroup,
}: {
    roleOrGroupUpdate: Role | Group | undefined;
    setRoleOrGroupUpdate: Function;
    isGroup: boolean;
    setIsGroup: Function;
}) {
    const [nameOrUrl, setNameOrUrl] = React.useState<string>();
    const [fileUpload, setFileUpload] = React.useState<File>();
    const roleOrGroupState = useAppSelector((state) => state.groupRole.values);
    const dispatch = useAppDispatch();

    const objForm = React.useMemo(
        () => ({
            titleHeader: roleOrGroupUpdate ? "Update" : "Add",
            buttonContent: roleOrGroupUpdate ? "Save" : "Submit",
            buttonColor: roleOrGroupUpdate ? "success" : "primary",
            auxiliaryButtonContent: roleOrGroupUpdate ? "Cancel" : "Clear",
            auxiliaryButtonColor: roleOrGroupUpdate ? "error" : "warning",
        }),
        [roleOrGroupUpdate],
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Upload Excel
        let listRolesImport = [];
        let payload = {};
        if (fileUpload) {
            listRolesImport = await importExcel(fileUpload as File);
            listRolesImport = listRolesImport.map((item) => ({
                ...item,
                rowNum: item.__rowNum__,
            }));
        } else {
            payload = {
                id: roleOrGroupUpdate && roleOrGroupUpdate.id,
                [isGroup ? "name" : "url"]: isGroup
                    ? nameOrUrl!.toUpperCase()
                    : nameOrUrl,
            };
        }

        // Check có phải URL không
        if (!isGroup) {
            if (
                !nameOrUrl?.includes("/") ||
                !["create", "read", "update", "delete"].includes(
                    nameOrUrl?.slice(nameOrUrl?.lastIndexOf("/") + 1),
                )
            )
                return toast.error("URL not true like format");
        }

        return;

        const data = (await fetchData(
            HTTPMethods.POST,
            `/group-roles`,
            listRolesImport.length > 0 ? listRolesImport : payload,
        )) as ResAxios;

        if (data.EC === 0) {
            fileUpload ? setFileUpload(undefined) : resetForm();
            roleOrGroupUpdate
                ? setRoleOrGroupUpdate(undefined)
                : setNameOrUrl("");
            dispatch(getGroupRoles({ page: 1 }));
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    }

    function handleDownloadExcel() {
        // Lấy 3 roles để làm sample
        let listGroupRoleSample = (roleOrGroupState as GroupRole[])
            .slice(0, 3)
            .map((item) => {
                return {
                    name: item.name,
                    url: item.Roles[0].url,
                };
            });

        // listHeadings phải theo thứ tự key như listData
        const isSuccess = exportExcel({
            listData: listGroupRoleSample,
            listHeadings: ["Tên nhóm", "Đường dẫn"],
            nameFile: "GroupRoleSample",
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
        setNameOrUrl("");
        (qs("#formUpsert") as HTMLFormElement).reset();
    };

    const handleClear = () => {
        setRoleOrGroupUpdate(undefined);
        resetForm();
    };

    const setDataFormUpdate = () => {
        if (roleOrGroupUpdate === undefined) return;

        setNameOrUrl((roleOrGroupUpdate as any)[isGroup ? "name" : "url"]);
    };

    const handleChange = () => {
        setRoleOrGroupUpdate(undefined);
        setNameOrUrl("");
        setIsGroup(!isGroup);
    };

    React.useEffect(() => {
        setDataFormUpdate();
    }, [roleOrGroupUpdate]);

    React.useEffect(() => {
        dispatch(getGroupRoles({ page: 1 }));
    }, []);

    return (
        <>
            <div className="row mb-3 border-bottom pb-3">
                <div className="col-lg-4 border-end">
                    <div className="d-flex justify-content-between mb-2 w-100">
                        <h3 className="w-100">
                            {objForm.titleHeader} {isGroup ? "group" : "role"}:
                            <Button
                                color={
                                    (isGroup as boolean) ? "success" : "info"
                                }
                                type="button"
                                variant="outlined"
                                onClick={handleChange}
                                size={"small"}
                                className={"float-end pt-1"}
                            >
                                {isGroup ? "role" : "group"}
                            </Button>
                        </h3>
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
                        <div className="d-flex gap-4 mb-3">
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                color="secondary"
                                onClick={() => handleDownloadExcel()}
                            >
                                Download
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
                                label={isGroup ? "Name" : "Url"}
                                multiline
                                maxRows={2}
                                variant="outlined"
                                defaultValue={"/user/create"}
                                value={nameOrUrl}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                    setNameOrUrl(event.target.value);
                                }}
                            />
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
                            color={
                                objForm.auxiliaryButtonColor as
                                    | "warning"
                                    | "error"
                            }
                            type="button"
                            variant="contained"
                            endIcon={<BackspaceIcon />}
                            onClick={handleClear}
                        >
                            {objForm.auxiliaryButtonContent}
                        </Button>
                    </Box>
                </div>
                <div className="col-lg-4 border-end">
                    <SetRoleForGroup />
                </div>
                <div className="col-lg-4">
                    <SetGroupForUser />
                </div>
            </div>
        </>
    );
}
