import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MyCheckbox from "../../components/myCheckbox";
import SendIcon from "@mui/icons-material/Send";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Button from "@mui/material/Button";
import {
    fetchData,
    formatToTableAndMethodUser,
    qs,
    qsa,
} from "../../utils/myUtils";
import {
    Group,
    HTTPMethods,
    UserMethod,
    ResAxios,
    GroupRole,
} from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
    getAllGroups,
    getGroupRoles,
} from "../../redux/features/groupRole/groupRoleSlice";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";

export default function SetRoleForGroup() {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            },
        },
    };
    const groupState = useAppSelector(
        (state) => state.groupRole.valuesGroup,
    ) as GroupRole[];
    const userMethod = React.useMemo(
        () => Object.values(UserMethod).map((item) => ({ name: item })),
        [],
    );

    const [listTableNames, setListTableNames] = React.useState([]);
    const [tableNames, setTableNames] = React.useState("");
    const [group, setGroup] = React.useState("");

    const dispatch = useAppDispatch();

    const handleChange = (type: string, value: string) => {
        if (type === "GROUP") {
            setGroup(value);
        }

        if (type === "TABLE") {
            setTableNames(value);
            // Fetch lại group-role để chắc chắn rằng role luôn là mới nhất
            dispatch(getAllGroups());
            const userMethodCheckboxes = qsa(
                "[type='checkbox']",
                qs("#userMethodCheckboxes")! as HTMLElement,
            ) as HTMLInputElement[];

            const userMethodsCurrent = groupState
                .find((item) => item.id === +group)
                ?.Roles.filter(
                    (item) => item.url.split("/")[1].toUpperCase() === value,
                )
                .map((item) =>
                    item.url.split("/")[2].toUpperCase(),
                ) as string[];

            for (const item of userMethodCheckboxes) {
                item.checked = false;
                if (
                    userMethodsCurrent?.includes(
                        item.nextElementSibling?.innerHTML!,
                    )
                ) {
                    item.checked = true;
                }
            }
        }
    };

    const getAllTableNames = async () => {
        const data = (await fetchData(HTTPMethods.GET, "/tables")) as ResAxios;
        if (data.EC === 0) {
            setListTableNames(data.DT);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userMethodCheckboxes = qsa(
            "[type='checkbox']",
            qs("#userMethodCheckboxes")! as HTMLElement,
        ) as HTMLInputElement[];

        const listGroupRole = [];
        for (const item of userMethodCheckboxes) {
            if (item.checked) {
                listGroupRole.push({
                    groupId: group,
                    url: `/${tableNames.toLowerCase()}/${item.nextElementSibling?.innerHTML.toLowerCase()}`,
                });
            }
        }

        const data = (await fetchData(HTTPMethods.POST, "/group-roles", {
            listGroupRole,
        })) as ResAxios;

        if (data.EC === 0) {
            handleClear();
            dispatch(getAllGroups());
            dispatch(getGroupRoles({ page: 1 }));
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    };

    const handleClear = () => {
        setGroup("");
        setTableNames("");
    };

    React.useEffect(() => {
        getAllTableNames();
        dispatch(getAllGroups());
    }, []);

    return (
        <>
            <h3 className="mb-3">Set role for group</h3>
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
                <div className="d-flex gap-2 mb-3">
                    <FormControl
                        className={`w-${group ? "50" : "100"}`}
                        required
                    >
                        <InputLabel id="demo-simple-select-label">
                            Group
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={group}
                            label="Group"
                            onChange={(event: SelectChangeEvent) =>
                                handleChange("GROUP", event.target.value)
                            }
                            MenuProps={MenuProps}
                        >
                            {groupState.map((item) => {
                                return (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl
                        className={`w-50 ${group ? "" : "d-none"}`}
                        required
                    >
                        <InputLabel id="demo-simple-select-label">
                            Table
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={tableNames}
                            label="Tables"
                            onChange={(event: SelectChangeEvent) =>
                                handleChange("TABLE", event.target.value)
                            }
                            MenuProps={MenuProps}
                        >
                            {listTableNames.map((item) => {
                                return (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </div>

                <MyCheckbox
                    listData={userMethod}
                    classCss={`d-flex flex-row flex-wrap gap-2 mb-3 ${
                        tableNames ? "" : "d-none"
                    }`}
                    id="userMethodCheckboxes"
                    fieldLabel="name"
                />

                {/* Button */}
                <Button
                    color="primary"
                    className="me-3"
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                >
                    Submit
                </Button>

                <Button
                    color={"warning"}
                    type="button"
                    variant="contained"
                    endIcon={<BackspaceIcon />}
                    onClick={handleClear}
                >
                    Clear
                </Button>
            </Box>
        </>
    );
}
