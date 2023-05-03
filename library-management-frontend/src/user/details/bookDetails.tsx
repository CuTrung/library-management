import { useParams, useLocation } from "react-router-dom";
import { useSessionStorage } from "../../hooks/useStorage";
import * as React from "react";
import Typography from "@mui/material/Typography";
import BookIcon from "@mui/icons-material/Book";
import Person3Icon from "@mui/icons-material/Person3";
import Button from "@mui/material/Button";
import AddCardIcon from "@mui/icons-material/AddCard";
import RedeemIcon from "@mui/icons-material/Redeem";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";

import Rating from "@mui/material/Rating";
import TopList from "./topList";
import { Category, ResBook } from "../../types/types";
import { addOrRemoveBook } from "../../redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import PlaceIcon from "@mui/icons-material/Place";
import { toast } from "react-toastify";

// BUGS: Để số đầu tiên ở link đường dẫn khi reload lại bị lỗi
export default function BookDetails() {
    const defaultImage = useAppSelector(
        (state) => state.book.imageDefault,
    )[0] as string;
    const { name } = useParams();
    const { state } = useLocation();
    const [rating, setRating] = React.useState<number | null>(2.5);
    const [value, setValue] = React.useState(0);
    const [bookDetails, setBookDetails, removeBookDetails] = useSessionStorage(
        "bookDetails",
        {},
    );
    const quantityMaxCanBorrowed = React.useMemo(
        () => bookDetails.quantityReality - bookDetails.borrowed,
        [bookDetails],
    );
    const isBorrowed = React.useMemo(
        () =>
            bookDetails.Categories?.some(
                (category: Category) => category.isBorrowed === 0,
            ),
        [bookDetails],
    );
    const dispatch = useAppDispatch();
    const bookState = useAppSelector((state) => state.book.values) as ResBook[];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const listImage = [
        `${bookDetails.image ?? defaultImage}`,
        "/default.jpg",
        "/default.jpg",
        "/default.jpg",
    ];
    const [image, setImage] = React.useState(bookDetails.image ?? defaultImage);

    const handleClickImg = (img: string) => {
        setImage(img);
    };

    async function handleAdd() {
        await dispatch(addOrRemoveBook(bookDetails)).then((res) =>
            setBookDetails(res.payload),
        );
        toast.success("Add book successful");
    }

    React.useEffect(() => {
        setBookDetails(state.bookDetails);
    }, [state.bookDetails]);

    return (
        <>
            <div className="row mx-4">
                <div className="col-3 text-center border-end border-dark">
                    <img
                        style={{ maxHeight: "31.25em", minHeight: "31.25em" }}
                        className="w-100 h-75"
                        src={image}
                        alt=""
                    />

                    <div className="d-flex flex-wrap w-100 my-3 justify-content-evenly">
                        {listImage.map((img) => {
                            return (
                                <img
                                    style={{
                                        cursor: "pointer",
                                        maxHeight: "5em",
                                        minHeight: "5em",
                                    }}
                                    onClick={() => handleClickImg(img)}
                                    className="w-25 border border-danger rounded"
                                    src={img}
                                    alt="none"
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="col-6 py-3">
                    <h4 className="m-0 mb-3">
                        <PlaceIcon
                            className={"me-2"}
                            color={"error"}
                            fontSize="large"
                        />
                        Shelf {"3"} - Row {"5"} - Area {"2"}
                    </h4>

                    <Typography
                        className=""
                        gutterBottom
                        variant="h5"
                        component="div"
                    >
                        <Person3Icon color={"success"} fontSize="large" />{" "}
                        {bookDetails.author}
                        <Button
                            className="float-end"
                            variant="outlined"
                            color="secondary"
                        >
                            PDF
                        </Button>
                    </Typography>
                    <Typography gutterBottom variant="h4" component="div">
                        <BookIcon
                            color={"primary"}
                            className="mb-1"
                            fontSize="large"
                        />{" "}
                        {bookDetails.name}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Rating
                            size="large"
                            name="text-feedback"
                            value={rating}
                            readOnly
                            precision={0.5}
                            emptyIcon={
                                <StarIcon
                                    style={{ opacity: 0.55 }}
                                    fontSize="inherit"
                                />
                            }
                        />
                        <Box sx={{ ml: 2, opacity: 0.7 }}>
                            (1024 đánh giá) <span className="mx-2">|</span> Đã
                            mượn 2500+
                        </Box>
                    </Box>
                    <Typography
                        paragraph
                        className="mt-4 mb-3 lh-lg"
                        gutterBottom
                    >
                        {bookDetails.description}
                    </Typography>
                    <Typography
                        className="text-truncate"
                        gutterBottom
                        variant="h4"
                        component="div"
                    >
                        <RedeemIcon
                            color={"warning"}
                            className="mb-1"
                            fontSize="large"
                        />{" "}
                        <Button
                            className="rounded-circle"
                            variant="outlined"
                            color={
                                quantityMaxCanBorrowed !== 0
                                    ? "success"
                                    : "error"
                            }
                        >
                            {quantityMaxCanBorrowed !== 0
                                ? quantityMaxCanBorrowed
                                : "Hết"}
                        </Button>
                    </Typography>
                    <Button
                        onClick={handleAdd}
                        className={`w-50 float-end ${
                            isBorrowed ? "bg-danger text-white" : ""
                        }`}
                        color="info"
                        variant="contained"
                        endIcon={<AddCardIcon />}
                        disabled={quantityMaxCanBorrowed === 0 || isBorrowed}
                    >
                        {isBorrowed ? "Read only at library" : "Add to cart"}
                    </Button>
                </div>
                <div className="col-3 border rounded">
                    <TopList />
                </div>
            </div>
        </>
    );
}
