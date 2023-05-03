import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Badge from "@mui/material/Badge";
import Rating from "@mui/material/Rating";
import {
    CartBook,
    Category,
    HTTPMethods,
    ResAxios,
    ResBook,
} from "../../types/types";
import BookIcon from "@mui/icons-material/Book";
import Person3Icon from "@mui/icons-material/Person3";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchData, removeDiacritics } from "../../utils/myUtils";
import { useSessionStorage } from "../../hooks/useStorage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addOrRemoveBook } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";

export default function CardBook({ dataBook, func }: CartBook) {
    const defaultImage = useAppSelector(
        (state) => state.book.imageDefault,
    )[0] as string;

    const isBorrowed = React.useMemo(
        () =>
            dataBook.Categories.some(
                (category: Category) => category.isBorrowed === 0,
            ),
        [dataBook],
    );

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const [starQuantity, setStarQuantity] = React.useState<number | null>(
        getRandomInt(1, 5),
    );
    const dispatch = useAppDispatch();
    const cartState = useAppSelector((state) => state.cart.values);
    const listFiltersPrev = useAppSelector(
        (state) => state.book.listFiltersPrev,
    );

    const quantityMaxCanBorrowed = React.useMemo(
        () => dataBook.quantityReality - dataBook.borrowed,
        [dataBook],
    );
    const navigate = useNavigate();

    const handleClickDetails = () => {
        navigate(`/book/${removeDiacritics(dataBook.name)}`, {
            state: {
                bookDetails: {
                    ...dataBook,
                },
            },
        });
    };

    async function handleAdd() {
        await dispatch(addOrRemoveBook(dataBook));
        await func?.fetchListBook(func?.currentPage, listFiltersPrev);
        toast.success("Add book successful");
    }

    return (
        <Card
            className="position-relative border border-1 w-100"
            sx={{ maxWidth: "13.75em" }}
        >
            <Badge
                sx={{
                    "& .MuiBadge-badge": {
                        fontSize: "1.125em",
                        height: "1.875em",
                        minWidth: "1.875em",
                        borderRadius: "50%",
                    },
                }}
                className="float-end mt-4 me-4 position-absolute top-0 end-0"
                color={quantityMaxCanBorrowed !== 0 ? "secondary" : "error"}
                badgeContent={
                    quantityMaxCanBorrowed !== 0
                        ? quantityMaxCanBorrowed
                        : "Hết"
                }
                max={999}
            ></Badge>

            <CardMedia
                component="img"
                alt="green iguana"
                // height="140"
                sx={{
                    // minHeight: "10.625em",
                    minHeight: "14em",
                    minWidth: "11.875em",
                    maxHeight: "14em",
                    // objectFit: "contain",
                    objectFit: "fill",
                }}
                image={dataBook.image ?? defaultImage}
                // className="img-fluid"
            />

            <CardContent sx={{ paddingBottom: 0 }}>
                <Typography
                    className="text-truncate"
                    gutterBottom
                    variant="h5"
                    component="div"
                >
                    <BookIcon
                        color={"primary"}
                        className="mb-1"
                        fontSize="small"
                    />{" "}
                    {dataBook.name}
                </Typography>
                <Typography
                    className="text-truncate"
                    gutterBottom
                    component="div"
                >
                    <Person3Icon color={"success"} fontSize="small" />{" "}
                    {dataBook.author}
                </Typography>
                <Typography
                    paragraph
                    variant="body2"
                    color="text.secondary"
                    className="fst-italic text"
                >
                    {dataBook.description}
                </Typography>

                <Rating name="read-only" value={starQuantity} readOnly />
            </CardContent>
            <CardActions>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    size="small"
                    className={`me-2 ${
                        isBorrowed ? "bg-danger text-white" : ""
                    }`}
                    disabled={quantityMaxCanBorrowed === 0 || isBorrowed}
                >
                    {isBorrowed ? "Đọc tại chỗ" : "Add"}
                </Button>

                <Button
                    onClick={handleClickDetails}
                    color="inherit"
                    variant="contained"
                    size="small"
                >
                    Details
                </Button>
            </CardActions>
        </Card>
    );
}
