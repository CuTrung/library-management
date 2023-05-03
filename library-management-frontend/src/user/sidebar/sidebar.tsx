import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import DepartmentSelect from "./departmentSelect";
import SearchBar from "../../components/searchBar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { searchBook } from "../../redux/features/book/bookSlice";
import { Category, HTTPMethods, ResAxios, ResBook } from "../../types/types";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { fetchData, qs } from "../../utils/myUtils";
import Typography from "@mui/material/Typography";
import MyCheckbox from "../../components/myCheckbox";

export default function Sidebar() {
    const [open, setOpen] = React.useState(true);
    const dispatch = useAppDispatch();
    const [newSearchString, setNewSearchString] = React.useState("");

    const handleClick = () => {
        setOpen(!open);
    };

    const bookState = useAppSelector(
        (state) => state.book.valuesSearchInput,
    ) as ResBook[];

    const listFieldSearch = ["name", "author"];
    const [fieldSearch, setFieldSearch] = React.useState("name");

    const handleChange = (event: SelectChangeEvent) => {
        setFieldSearch(event.target.value as string);
    };

    // BUGS: chưa set search value về "" được
    const handleRemove = () => {
        dispatch(searchBook({ keySearch: "", field: fieldSearch }));
        (qs("#formReset") as HTMLFormElement).reset();
    };

    const [listCategory, setListCategory] = React.useState<Category[]>([]);
    const getAllCategory = async () => {
        const data = (await fetchData(
            HTTPMethods.GET,
            "/categories",
        )) as ResAxios;

        if (data.EC === 0) {
            setListCategory(data.DT);
        }
    };

    React.useEffect(() => {
        getAllCategory();
    }, []);

    return (
        <>
            <form id="formReset" action="">
                <div className="d-flex mb-3">
                    {/* Select search by */}
                    <FormControl sx={{ mt: 2, width: "7.5em" }}>
                        <InputLabel id="demo-simple-select-label">
                            By
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={fieldSearch}
                            label="Age"
                            onChange={handleChange}
                        >
                            {listFieldSearch.map((field, index) => {
                                return (
                                    <MenuItem key={index} value={field}>
                                        {field}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>

                    <SearchBar
                        listStateSearch={bookState}
                        funcDispatch={searchBook}
                        searchBy={fieldSearch}
                        classCss={"w-75"}
                    />
                </div>

                <MyCheckbox
                    id="categoryGroupCheckbox"
                    listData={listCategory}
                    fieldLabel="name"
                    classCss="mb-3"
                />

                <DepartmentSelect handleRemove={handleRemove} />
            </form>
        </>
    );
}
