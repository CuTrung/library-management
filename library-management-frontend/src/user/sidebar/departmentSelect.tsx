import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { fetchData, qs, qsa } from "../../utils/myUtils";
import { Category, Department, HTTPMethods, ResAxios } from "../../types/types";
import MyCheckbox from "../../components/myCheckbox";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getBooks } from "../../redux/features/book/bookSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DepartmentSelect(props: any) {
    const [listDepartment, setListDepartment] = React.useState<Department[]>(
        [],
    );
    const [department, setDepartment] = React.useState("");
    const [listMajor, setListMajor] = React.useState<Category[]>([]);
    const stateBook = useAppSelector((state) => state.book);
    const dispatch = useAppDispatch();
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleChange = async (event: SelectChangeEvent) => {
        const departmentId = event.target.value;

        setDepartment(departmentId);
        const data = (await fetchData(
            HTTPMethods.GET,
            departmentId ? `/majors?departmentId=${departmentId}` : `/majors`,
        )) as ResAxios;

        if (data.EC === 0) {
            setListMajor(data.DT);
        }
    };

    const getAllDepartments = async () => {
        const data = (await fetchData(
            HTTPMethods.GET,
            "/departments",
        )) as ResAxios;
        if (data.EC === 0) {
            setListDepartment(data.DT);
        }
    };

    const getAllMajors = async () => {
        const data = (await fetchData(HTTPMethods.GET, "/majors")) as ResAxios;
        if (data.EC === 0) {
            setListMajor(data.DT);
        }
    };

    const handleFilter = async () => {
        const categoryCheckboxes = qsa(
            "[type='checkbox']",
            qs("#categoryGroupCheckbox") as HTMLElement,
        );

        const majorCheckboxes = qsa(
            "[type='checkbox']",
            qs("#majorGroupCheckbox") as HTMLElement,
        );

        let categoryIds: string[] = [],
            majorIds: string[] = [];

        for (const item of categoryCheckboxes) {
            if ((item as HTMLInputElement).checked) {
                categoryIds.push(item.getAttribute("data-id")!);
            }
        }

        for (const item of majorCheckboxes) {
            if ((item as HTMLInputElement).checked) {
                majorIds.push(item.getAttribute("data-id")!);
            }
        }

        dispatch(
            getBooks({
                page: stateBook.currentPage[0] as number,
                listFilters: [
                    {
                        categoryIds,
                    },
                    {
                        majorIds,
                    },
                ],
            }),
        );

        toast.success("Filter successful !");
    };

    const handleRemoveFilter = () => {
        dispatch(getBooks({ page: stateBook.currentPage[0] as number }));
        setDepartment("");
        getAllMajors();
        props.handleRemove();
    };

    React.useEffect(() => {
        getAllDepartments();
        getAllMajors();
    }, []);

    const checkedCategoryFromCartBorrowed = async () => {
        const categoryCheckboxes = qsa(
            "[type='checkbox']",
            qs("#categoryGroupCheckbox") as HTMLElement,
        );
        for (const item of categoryCheckboxes) {
            if (+item.getAttribute("data-id")! === +state?.categoryId) {
                (item as HTMLInputElement).checked = true;
            }
        }
        await handleFilter();
    };

    // BUGS: state?.categoryId chỉ thay đổi lần đầu, khi chọn lại cùng 1 category sẽ không run lại
    React.useEffect(() => {
        checkedCategoryFromCartBorrowed();
    }, [state?.categoryId]);

    return (
        <>
            <Box className={"mb-3"}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Department
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={department}
                        label="Department"
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {listDepartment.map((department) => {
                            return (
                                <MenuItem
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.description}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Box>

            <MyCheckbox
                listData={listMajor}
                fieldLabel="description"
                id={"majorGroupCheckbox"}
            />

            <div className={"d-flex gap-3 justify-content-between mt-4"}>
                <Button
                    color="error"
                    variant="outlined"
                    endIcon={<FilterAltOffIcon color="error" />}
                    onClick={() => handleRemoveFilter()}
                >
                    Remove
                </Button>
                <Button
                    color="success"
                    variant="outlined"
                    startIcon={<FilterAltIcon color="success" />}
                    onClick={() => handleFilter()}
                >
                    filter
                </Button>
            </div>
        </>
    );
}
