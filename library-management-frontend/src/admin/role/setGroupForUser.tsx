import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MyCheckbox from "../../components/myCheckbox";
import SendIcon from "@mui/icons-material/Send";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { GroupRole, HTTPMethods, ResAxios, Student } from "../../types/types";
import { fetchData, qs, qsa } from "../../utils/myUtils";
import {
    getAllGroups,
    getGroupRoles,
} from "../../redux/features/groupRole/groupRoleSlice";
import { toast } from "react-toastify";

export default function SetGroupForUser() {
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
    const [group, setGroup] = React.useState("");
    const [listStudent, setListStudent] = React.useState<Student[]>([]);

    const dispatch = useAppDispatch();

    const getAllStudents = async () => {
        const data = (await fetchData(
            HTTPMethods.GET,
            "/students",
        )) as ResAxios;
        if (data.EC === 0) {
            setListStudent(data.DT);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setGroup(event.target.value);
        dispatch(getAllGroups());
        const userCheckboxes = qsa(
            "[type='checkbox']",
            qs("#userCheckboxes")! as HTMLElement,
        ) as HTMLInputElement[];

        const usersCurrent = groupState
            .find((item) => item.id === +event.target.value)
            ?.Users.map((item) => item.id);

        for (const item of userCheckboxes) {
            item.checked = false;
            if (usersCurrent?.includes(+item.getAttribute("data-id")!)) {
                item.checked = true;
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userMethodCheckboxes = qsa(
            "[type='checkbox']",
            qs("#userCheckboxes")! as HTMLElement,
        ) as HTMLInputElement[];

        const userIds = [];
        for (const item of userMethodCheckboxes) {
            if (item.checked) {
                userIds.push(+item.getAttribute("data-id")!);
            }
        }

        const data = (await fetchData(HTTPMethods.POST, "/group-roles/users", {
            userIds,
            groupId: group,
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
        const userMethodCheckboxes = qsa(
            "[type='checkbox']",
            qs("#userCheckboxes")! as HTMLElement,
        ) as HTMLInputElement[];

        for (const item of userMethodCheckboxes) {
            item.checked = false;
        }
    };

    React.useEffect(() => {
        getAllStudents();
    }, []);

    return (
        <>
            <h3 className="mb-3">Set group for user</h3>
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
                <FormControl className={`w-100 mb-3`} required>
                    <InputLabel id="demo-simple-select-label">Group</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={group}
                        label="Group"
                        onChange={handleChange}
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

                <MyCheckbox
                    listData={listStudent}
                    fieldLabel="email"
                    classCss={`d-flex flex-row flex-wrap gap-2 mb-3 ${
                        group ? "" : "d-none"
                    }`}
                    id="userCheckboxes"
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
