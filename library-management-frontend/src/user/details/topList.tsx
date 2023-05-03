import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DraftsIcon from "@mui/icons-material/Drafts";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getHistories } from "../../redux/features/history/historySlice";
import { ResHistory } from "../../types/types";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function TopList() {
    const defaultImage = useAppSelector(
        (state) => state.book.imageDefault,
    )[0] as string;
    const [value, setValue] = React.useState(0);
    const [rating, setRating] = React.useState<number | null>(2);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { values } = useAppSelector((state) => state.history);
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(getHistories({ page: 1 }));
    }, []);

    console.log(">>> CHeck", values);

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Day" {...a11yProps(0)} />
                        <Tab label="Week" {...a11yProps(1)} />
                        <Tab label="Month" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <List>
                        {(values as ResHistory[])?.map((item) => {
                            return (
                                <ListItem disablePadding>
                                    <ListItemButton>
                                        <Avatar
                                            variant="square"
                                            alt="Remy Sharp"
                                            src={
                                                item.Book.image ?? defaultImage
                                            }
                                            sx={{ width: "5em" }}
                                            className="h-100"
                                        />
                                        <div className="d-flex flex-column ms-2 gap-3 w-75">
                                            <span className="text-truncate me-3 fw-semibold">
                                                <span
                                                    className={`badge text-bg-danger float-end w-25`}
                                                >
                                                    Hot
                                                </span>
                                                {item.Book.name}
                                            </span>

                                            <Rating
                                                size="small"
                                                name="read-only"
                                                value={rating}
                                                readOnly
                                            />
                                        </div>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Item Three
                </TabPanel>
            </Box>
        </>
    );
}
