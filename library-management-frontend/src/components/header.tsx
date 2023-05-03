import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { NavLink, useLocation } from "react-router-dom";
import {
    CartBook,
    DataBook,
    HTTPMethods,
    Pages,
    ResAxios,
    TypePage,
    User,
} from "../types/types";
import useToggle from "../hooks/useToggle";

import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import BookIcon from "@mui/icons-material/Book";
import InterestsIcon from "@mui/icons-material/Interests";
import { useNavigate } from "react-router-dom";
import { fetchData, removeDiacritics } from "../utils/myUtils";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useSessionStorage } from "../hooks/useStorage";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

const pages: Pages[] = [
    {
        type: TypePage.NORMAL,
        name: "Home",
        path: "/",
    },
    {
        type: TypePage.NORMAL,
        name: "History",
        path: "/history",
    },
    {
        type: TypePage.NORMAL,
        name: "Admin",
        path: "/admin/books",
    },
    {
        type: TypePage.AUTH,
        name: "Login",
        path: "/auth/login",
    },
    {
        type: TypePage.AUTH,
        name: "Register",
        path: "/auth/register",
    },
    {
        type: TypePage.SETTINGS,
        name: "Profile",
        path: "/profile",
    },
    {
        type: TypePage.SETTINGS,
        name: "Logout",
        path: "",
    },
];

export default function Header() {
    const defaultImage = useAppSelector(
        (state) => state.book.imageDefault,
    )[0] as string;
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null,
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null,
    );

    const { state } = useLocation();

    const [user, setUser] = React.useState("");

    const [userSession, setUserSession, removeUserSession] =
        useSessionStorage("user");
    const [access_token, setAccess_token, removeAccess_token] =
        useSessionStorage("access_token");

    const dispatch = useAppDispatch();

    const cartState = useAppSelector((state) => state.cart.values);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = async (name: string) => {
        setAnchorElUser(null);

        if (name === "Logout") {
            let data = (await fetchData(
                HTTPMethods.POST,
                "/logout",
            )) as ResAxios;
            if (data.EC === 0) {
                removeUserSession();
                removeAccess_token();
                navigate("/auth/login", { state: { user: null } });
            }
        }
    };

    // Cart
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (book: DataBook) => {
        navigate(`/book/${removeDiacritics(book.name)}`, {
            state: { bookDetails: book },
        });
        setAnchorEl(null);
    };

    React.useEffect(() => {
        setUser(state?.user?.fullName ?? userSession);
        if (userSession || access_token) return;
        setUserSession(state?.user?.fullName);
        setAccess_token(state?.user?.access_token);
    }, [state?.user]);

    return (
        <AppBar position="sticky" sx={{ mb: 2 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Responsive */}
                    {/* Open Menu */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages
                                .filter((item) => {
                                    if (user) {
                                        return (
                                            item &&
                                            item.type === TypePage.NORMAL
                                        );
                                    } else {
                                        return item.type !== TypePage.SETTINGS;
                                    }
                                })
                                .map((page) => {
                                    return (
                                        <MenuItem
                                            key={page.name}
                                            onClick={handleCloseNavMenu}
                                        >
                                            <Typography textAlign="center">
                                                <NavLink
                                                    className={
                                                        "text-decoration-none"
                                                    }
                                                    to={page.path}
                                                >
                                                    {page.name}
                                                </NavLink>
                                            </Typography>
                                        </MenuItem>
                                    );
                                })}
                        </Menu>
                    </Box>

                    {/* Logo */}
                    <LocalLibraryIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        <NavLink
                            className={"text-decoration-none text-white"}
                            to={"/"}
                        >
                            LOGO
                        </NavLink>
                    </Typography>
                    {/* End Responsive */}

                    <LocalLibraryIcon
                        sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        <NavLink
                            className={"text-decoration-none text-white"}
                            to={"/"}
                        >
                            LOGO
                        </NavLink>
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {pages.map(
                            (page, index) =>
                                page.type === TypePage.NORMAL && (
                                    <NavLink
                                        key={index}
                                        className={"text-decoration-none"}
                                        to={page.path}
                                    >
                                        <Button
                                            key={page.name}
                                            onClick={handleCloseNavMenu}
                                            sx={{
                                                my: 2,
                                                color: "white",
                                                display: "block",
                                            }}
                                        >
                                            {page.name}
                                        </Button>
                                    </NavLink>
                                ),
                        )}
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 0,
                        }}
                        className={"d-flex"}
                    >
                        {/* Cart */}
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            sx={{ mr: 1 }}
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClick}
                        >
                            <Badge
                                badgeContent={cartState.length}
                                color="error"
                            >
                                <ShoppingBagIcon />
                            </Badge>
                        </IconButton>

                        <Menu
                            className={"me-3 w-100"}
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={() => setAnchorEl(null)}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}
                            anchorReference="anchorPosition"
                            anchorPosition={{
                                top: 45,
                                left: user ? 1180 : 1085,
                            }}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                        >
                            {/* Loop cart here */}
                            {cartState.map((book: DataBook) => {
                                return (
                                    <MenuItem
                                        key={book.id}
                                        onClick={() => handleClose(book)}
                                        className={"border py-2"}
                                    >
                                        <ListItemIcon className="me-3">
                                            {/* <ContentCut fontSize="small" /> */}
                                            <Avatar
                                                className=""
                                                alt="Remy Sharp"
                                                src={book.image ?? defaultImage}
                                                sx={{
                                                    width: "3.75em",
                                                    height: "3.75em",
                                                }}
                                                variant="square"
                                            />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Typography
                                                className="d-flex gap-2"
                                                component="div"
                                            >
                                                <BookIcon
                                                    color={"primary"}
                                                    className="mb-1"
                                                    fontSize="small"
                                                />
                                                <Typography
                                                    sx={{
                                                        maxWidth: "9.375em",
                                                        minWidth: "9.375em",
                                                    }}
                                                    className="d-block text-truncate me-5"
                                                    component="span"
                                                >
                                                    {book.name}
                                                </Typography>

                                                <Typography
                                                    className="p-0 px-1 badge rounded-pill bg-info"
                                                    component="span"
                                                >
                                                    {`${book.numberOfBooksBorrowed} cuốn`}
                                                </Typography>
                                            </Typography>
                                        </ListItemText>
                                    </MenuItem>
                                );
                            })}

                            {cartState.length > 0 ? (
                                <MenuItem onClick={() => setAnchorEl(null)}>
                                    <Typography
                                        component={"div"}
                                        className="w-100 d-flex gap-5 justify-content-center"
                                    >
                                        <IconButton
                                            color="primary"
                                            aria-label="add to shopping cart"
                                            className={
                                                "border border-2 border-warning"
                                            }
                                        >
                                            <NavLink to={"/"}>
                                                <AddShoppingCartIcon
                                                    fontSize="large"
                                                    color={"success"}
                                                />
                                            </NavLink>
                                        </IconButton>

                                        <IconButton
                                            color="primary"
                                            aria-label="add to shopping cart"
                                            className={
                                                "border border-2 border-danger"
                                            }
                                        >
                                            <NavLink to={"/history"}>
                                                <ShoppingCartCheckoutIcon
                                                    fontSize="large"
                                                    color={"secondary"}
                                                />
                                            </NavLink>
                                        </IconButton>
                                    </Typography>
                                </MenuItem>
                            ) : (
                                <IconButton
                                    color="primary"
                                    aria-label="add to shopping cart"
                                    className={
                                        "border border-3 border-warning mx-2"
                                    }
                                    onClick={() => setAnchorEl(null)}
                                >
                                    <NavLink to={"/"}>
                                        <AddShoppingCartIcon
                                            fontSize="large"
                                            color={"success"}
                                        />
                                    </NavLink>
                                </IconButton>
                            )}
                        </Menu>

                        {/* Notification */}
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            sx={{ mr: 2 }}
                        >
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        {/* Avartar */}
                        {user ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar
                                            alt="Remy Sharp"
                                            src="/default.jpg"
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {pages.map(
                                        (page) =>
                                            page.type === TypePage.SETTINGS && (
                                                <MenuItem
                                                    key={page.name}
                                                    onClick={() =>
                                                        handleCloseUserMenu(
                                                            page.name,
                                                        )
                                                    }
                                                >
                                                    <Typography textAlign="center">
                                                        <NavLink
                                                            className={
                                                                "text-decoration-none"
                                                            }
                                                            to={page.path}
                                                        >
                                                            {page.name}
                                                        </NavLink>
                                                    </Typography>
                                                </MenuItem>
                                            ),
                                    )}
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        flexGrow: 1,
                                        display: { xs: "none", md: "flex" },
                                    }}
                                >
                                    {pages.map(
                                        (page, index) =>
                                            page.type === TypePage.AUTH && (
                                                <NavLink
                                                    key={index}
                                                    className={
                                                        "text-decoration-none"
                                                    }
                                                    to={page.path}
                                                >
                                                    <Button
                                                        key={page.name}
                                                        onClick={
                                                            handleCloseNavMenu
                                                        }
                                                        sx={{
                                                            my: 2,
                                                            color: "white",
                                                            display: "block",
                                                        }}
                                                    >
                                                        {page.name}
                                                    </Button>
                                                </NavLink>
                                            ),
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
