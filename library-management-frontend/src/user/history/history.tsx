import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { FixedSizeList, ListChildComponentProps } from "react-window";

import CartBorrowed from "./cartBorrowed";
import SearchBar from "../../components/searchBar";
import { fetchData, removeDiacritics } from "../../utils/myUtils";
import { HTTPMethods, ResAxios, ResHistory, Status } from "../../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { searchHistory } from "../../redux/features/history/historySlice";
import { useAppSelector } from "../../redux/hooks";

function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;
    const navigate = useNavigate();
    const defaultImage = useAppSelector(
        (state) => state.book.imageDefault,
    )[0] as string;

    const listHistory = props.data;

    const handleClickItem = () => {
        navigate(`/book/${removeDiacritics(listHistory[index].Book.name)}`, {
            state: { bookDetails: listHistory[index].Book },
        });
    };

    return (
        <>
            <ListItem
                sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#e0e0e0" },
                }}
                style={style}
                key={index}
                disablePadding
                onClick={handleClickItem}
            >
                <ListItemAvatar>
                    <Avatar
                        variant="square"
                        alt="Remy Sharp"
                        src={listHistory[index].Book.image ?? defaultImage}
                        sx={{ width: "3.125em", height: "3.125em" }}
                    />
                </ListItemAvatar>
                <Typography
                    sx={{ minWidth: "15.625em" }}
                    className="text-truncate me-3 fw-semibold"
                >
                    {listHistory[index].Book.name}
                    <span
                        className={`badge text-bg-${
                            listHistory[index].isReturned === 1
                                ? "success"
                                : "danger"
                        } float-end`}
                    >
                        {listHistory[index].isReturned === 1
                            ? "Đã trả"
                            : listHistory[index].timeStart
                            ? "Nợ"
                            : "Chờ"}
                    </span>

                    <p className="m-0 opacity-50">
                        {`${listHistory[index].timeStart ?? "?"} - ${
                            listHistory[index].timeEnd ?? "?"
                        }`}
                    </p>
                </Typography>
            </ListItem>
        </>
    );
}

export default function History() {
    const [age, setStatus] = React.useState("");
    const [listHistory, setListHistory] = React.useState([]);
    const [listStatus, setListStatus] = React.useState<Status[]>([]);
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value);
    };

    const getAllHistory = async () => {
        const data = (await fetchData(HTTPMethods.GET, `/histories`, {
            by: "studentId",
        })) as ResAxios;
        if (data.EC === 0) {
            setListHistory(data.DT);
        }
    };

    const getAllStatus = async () => {
        const data = (await fetchData(HTTPMethods.GET, `/status`)) as ResAxios;
        if (data.EC === 0) {
            setListStatus(
                data.DT.filter(
                    (item: Status) => item.belongsToTable === "HISTORY",
                ),
            );
        }
    };

    React.useEffect(() => {
        getAllHistory();
        getAllStatus();
    }, []);

    return (
        <div className="w-100 row">
            <div className="col-lg-9">
                <CartBorrowed />
            </div>
            <div className="col-lg-3 text-center">
                <h3>History</h3>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                        Status
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={age}
                        label="Status"
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {listStatus.map((item) => {
                            return (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <TextField
                    sx={{ mt: 1 }}
                    id="outlined-basic"
                    variant="outlined"
                    type="date"
                />

                <Box
                    sx={{
                        width: "100%",
                        height: "25em",
                        // maxWidth: 350,
                        mt: 2,
                    }}
                >
                    <FixedSizeList
                        height={400}
                        width={310}
                        itemSize={80}
                        itemCount={listHistory.length}
                        overscanCount={5}
                        itemData={listHistory}
                    >
                        {renderRow}
                    </FixedSizeList>
                </Box>
            </div>
        </div>
    );
}
