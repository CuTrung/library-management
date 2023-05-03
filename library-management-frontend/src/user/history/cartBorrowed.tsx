import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Category, DataBook, HTTPMethods, ResAxios } from "../../types/types";
import BookIcon from "@mui/icons-material/Book";
import Person3Icon from "@mui/icons-material/Person3";
import Typography from "@mui/material/Typography";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { fetchData, qs, qsa, removeDiacritics } from "../../utils/myUtils";
import {
    addOrRemoveBook,
    filteredCart,
} from "../../redux/features/cart/cartSlice";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import MyCheckbox from "../../components/myCheckbox";
import { toast } from "react-toastify";

export default function CartBorrowed() {
    const cartState = useAppSelector((state) => state.cart.values);
    const defaultImage = useAppSelector(
        (state) => state.book.imageDefault,
    )[0] as string;
    const navigate = useNavigate();
    // const numberOfBooksBorrowed = React.useRef(1);
    const dispatch = useAppDispatch();

    const handleChangeQuantity = async (book: DataBook, type = "INCREASE") => {
        if (type === "DECREASE ALL") {
            toast.success("Remove cart successful");
            return await dispatch(
                addOrRemoveBook({
                    ...book,
                    removeId: "ALL",
                }),
            );
        }

        if (type === "INCREASE") {
            toast.success("Increase cart successful");
            return await dispatch(addOrRemoveBook(book));
        }

        dispatch(
            addOrRemoveBook({
                ...book,
                removeId: book.id,
            }),
        );
        toast.success("Decrease cart successful");
    };

    const handleBorrow = async () => {
        const cartCheckbox = qsa(
            "[type='checkbox']",
            qs("#cartBorrowedCheckbox") as HTMLElement,
        );

        const dataBorrowed = [];
        for (const item of cartCheckbox) {
            if ((item as HTMLInputElement).checked) {
                const bookBorrowed = cartState.find(
                    (book: DataBook) =>
                        book.id === +item.getAttribute("data-id")!,
                ) as DataBook;

                dataBorrowed.push({
                    bookIdBorrowed: bookBorrowed.id,
                    quantityBookBorrowed: bookBorrowed?.numberOfBooksBorrowed,
                });
            }
        }

        if (dataBorrowed.length <= 0) {
            return toast.error("Please check book borrowed");
        }

        const data = (await fetchData(HTTPMethods.POST, "/histories", {
            dataBorrowed,
        })) as ResAxios;

        if (data.EC === 0) {
            const bookCardIdsRemove = dataBorrowed.map((item) => ({
                id: item.bookIdBorrowed,
            }));
            dispatch(filteredCart(bookCardIdsRemove));
            (qs("#formCartBorrowed") as HTMLFormElement).reset();
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    };

    const handleCategory = (categoryId: number) => {
        navigate("/", { state: { categoryId } });
    };

    return (
        <div className="h-100 ms-3">
            <h3 className="text-center">Cart borrowed</h3>
            <div id="cartBorrowedCheckbox">
                <form id="formCartBorrowed" action="">
                    <List sx={{ width: "100%" }}>
                        {cartState.length > 0 &&
                            cartState.map((book: DataBook) => {
                                return (
                                    <ListItem
                                        key={book.id}
                                        sx={{ mb: 1, width: "100%" }}
                                        className={"border border-2 rounded "}
                                    >
                                        <ListItemAvatar
                                            sx={{ width: "6.25em", mr: 5 }}
                                            className={"d-flex"}
                                        >
                                            <MyCheckbox
                                                classCss="m-0"
                                                listData={[book]}
                                                fieldLabel=""
                                            />

                                            <Avatar
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                                alt="Remy Sharp"
                                                src={book.image ?? defaultImage}
                                                variant="square"
                                            />
                                        </ListItemAvatar>

                                        <ListItemText
                                            sx={{
                                                minWidth: "21.875em",
                                                maxWidth: "18.75em",
                                                pr: 2,
                                            }}
                                            primary={
                                                <>
                                                    <Typography
                                                        className="mb-2 text-truncate"
                                                        gutterBottom
                                                        component="div"
                                                    >
                                                        <BookIcon
                                                            color={"primary"}
                                                            fontSize="small"
                                                        />{" "}
                                                        {book.name}
                                                    </Typography>
                                                </>
                                            }
                                            secondary={
                                                <>
                                                    <Typography
                                                        className="text-truncate"
                                                        gutterBottom
                                                        component="div"
                                                    >
                                                        <Person3Icon
                                                            color={"success"}
                                                            className="me-2"
                                                            fontSize="small"
                                                        />
                                                        {book.author}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <ListItemText
                                            sx={{ minWidth: "12.5em" }}
                                            primary={
                                                <>
                                                    <Typography
                                                        className={"mb-2"}
                                                        gutterBottom
                                                        component="div"
                                                    >
                                                        Category
                                                    </Typography>
                                                </>
                                            }
                                            secondary={
                                                <>
                                                    <Typography
                                                        gutterBottom
                                                        component="div"
                                                    >
                                                        {book.Categories.map(
                                                            (
                                                                category,
                                                                index,
                                                            ) => {
                                                                return (
                                                                    <a
                                                                        style={{
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() =>
                                                                            handleCategory(
                                                                                category.id,
                                                                            )
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={
                                                                            "text-decoration-none"
                                                                        }
                                                                    >
                                                                        {`${
                                                                            category.name
                                                                        } ${
                                                                            index ===
                                                                            book
                                                                                .Categories
                                                                                .length -
                                                                                1
                                                                                ? ""
                                                                                : "-"
                                                                        } `}
                                                                    </a>
                                                                );
                                                            },
                                                        )}
                                                    </Typography>
                                                </>
                                            }
                                        />

                                        <ButtonGroup
                                            variant="outlined"
                                            aria-label="outlined button group"
                                        >
                                            <Button
                                                disabled={
                                                    book.quantityReality -
                                                        book.borrowed ===
                                                    0
                                                }
                                                onClick={() =>
                                                    handleChangeQuantity(book)
                                                }
                                            >
                                                +
                                            </Button>
                                            <Button>
                                                {book.numberOfBooksBorrowed}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleChangeQuantity(
                                                        book,
                                                        "DECREASE",
                                                    )
                                                }
                                            >
                                                -
                                            </Button>
                                        </ButtonGroup>

                                        <ListItemText>
                                            <IconButton
                                                className="float-end"
                                                aria-label="delete"
                                                size="large"
                                                onClick={() =>
                                                    handleChangeQuantity(
                                                        book,
                                                        "DECREASE ALL",
                                                    )
                                                }
                                            >
                                                <DeleteIcon
                                                    color="error"
                                                    fontSize="inherit"
                                                />
                                            </IconButton>
                                        </ListItemText>
                                    </ListItem>
                                );
                            })}

                        {cartState.length > 0 ? (
                            <Button
                                className={"float-end"}
                                variant="contained"
                                color={"secondary"}
                                onClick={handleBorrow}
                            >
                                borrow
                            </Button>
                        ) : (
                            <></>
                        )}
                    </List>
                </form>
            </div>

            {cartState?.length === 0 ? (
                <Typography
                    className="d-flex gap-2 p-3 justify-content-center"
                    component={"div"}
                >
                    <p className="m-0 pt-1 opacity-75 text-center">
                        Cart is empty now
                        <SentimentVeryDissatisfiedIcon
                            className={"ms-1"}
                            fontSize="large"
                            color={"warning"}
                        />
                    </p>
                    <NavLink to={"/"}>
                        <Button color={"secondary"} variant="outlined">
                            Borrowing now
                        </Button>
                    </NavLink>
                </Typography>
            ) : (
                <></>
            )}
        </div>
    );
}
