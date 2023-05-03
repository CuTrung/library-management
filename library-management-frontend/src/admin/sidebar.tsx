import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ChecklistIcon from "@mui/icons-material/Checklist";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CategoryIcon from "@mui/icons-material/Category";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <List
            sx={{
                width: "100%",
                maxWidth: "22.5em",
                bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <MenuBookIcon />
                </ListItemIcon>
                <ListItemText primary="Book" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <NavLink
                        className={"text-decoration-none text-secondary"}
                        to={"books"}
                    >
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="CRUD" />
                        </ListItemButton>
                    </NavLink>
                    <NavLink
                        className={"text-decoration-none text-secondary"}
                        to={"approve"}
                    >
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="Approve" />
                        </ListItemButton>
                    </NavLink>
                    <NavLink
                        className={"text-decoration-none text-secondary"}
                        to={"history"}
                    >
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary="History" />
                        </ListItemButton>
                    </NavLink>
                </List>
            </Collapse>
            <NavLink
                className={"text-decoration-none text-secondary"}
                to={"category"}
            >
                <ListItemButton>
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Category" />
                </ListItemButton>
            </NavLink>
            <NavLink
                className={"text-decoration-none text-secondary"}
                to={"department"}
            >
                <ListItemButton>
                    <ListItemIcon>
                        <AutoAwesomeMotionIcon />
                    </ListItemIcon>
                    <ListItemText primary="Department" />
                </ListItemButton>
            </NavLink>
            <NavLink
                className={"text-decoration-none text-secondary"}
                to={"role"}
            >
                <ListItemButton>
                    <ListItemIcon>
                        <AdminPanelSettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Role" />
                </ListItemButton>
            </NavLink>
        </List>
    );
}
