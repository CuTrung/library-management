import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import BackspaceIcon from "@mui/icons-material/Backspace";
import {
    Category,
    HTTPMethods,
    Major,
    ResAxios,
    ResBook,
    Status,
} from "../../types/types";
import {
    exportExcel,
    fetchData,
    importExcel,
    qs,
    qsa,
    toBase64,
} from "../../utils/myUtils";
import MyCheckbox from "../../components/myCheckbox";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getBooks } from "../../redux/features/book/bookSlice";
import { toast } from "react-toastify";

export default function FormBook({
    bookUpdate,
    setBookUpdate,
}: {
    bookUpdate: ResBook | undefined;
    setBookUpdate: Function;
}) {
    const [name, setName] = React.useState("");
    const [author, setAuthor] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState<number>(0);
    const [quantity, setQuantity] = React.useState<number>(1);
    const [status, setStatus] = React.useState("");
    const [listStatus, setListStatus] = React.useState<Status[]>([]);
    const [listCategory, setListCategory] = React.useState<Category[]>([]);
    const [listMajor, setListMajor] = React.useState<Major[]>([]);
    const [image, setImage] = React.useState<File>();
    const [fileUpload, setFileUpload] = React.useState<File>();
    const bookState = useAppSelector((state) => state.book.values) as ResBook[];
    const dispatch = useAppDispatch();

    const objForm = React.useMemo(
        () => ({
            titleHeader: bookUpdate ? "Update" : "Add new",
            buttonContent: bookUpdate ? "Save" : "Submit",
            buttonColor: bookUpdate ? "success" : "primary",
            auxiliaryButtonContent: bookUpdate ? "Cancel" : "Clear",
            auxiliaryButtonColor: bookUpdate ? "error" : "warning",
        }),
        [bookUpdate],
    );

    const categoryRef = React.useRef<HTMLFieldSetElement>(null);
    const majorRef = React.useRef<HTMLFieldSetElement>(null);

    const getAllCategories = async () => {
        const data = (await fetchData(
            HTTPMethods.GET,
            "/categories",
        )) as ResAxios;
        if (data.EC === 0) {
            setListCategory(data.DT);
        }
    };

    const getAllMajors = async () => {
        const data = (await fetchData(HTTPMethods.GET, "/majors")) as ResAxios;
        if (data.EC === 0) {
            setListMajor(data.DT);
        }
    };

    const getAllStatus = async () => {
        const data = (await fetchData(HTTPMethods.GET, "/status")) as ResAxios;
        if (data.EC === 0) {
            setListStatus(() => {
                // Set value default status
                setStatus(
                    data.DT.find(
                        (item: Status) => item.name === "NEW",
                    )?.id.toString(),
                );

                return data.DT.filter(
                    (item: Status) => item.belongsToTable === "BOOK",
                );
            });
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Upload Excel
        let listBooksImport = [];
        let category_majorIds = [],
            imgBase64 = null,
            payload = {};
        if (fileUpload) {
            listBooksImport = await importExcel(fileUpload as File);
            listBooksImport = listBooksImport.map((item) => ({
                ...item,
                rowNum: item.__rowNum__,
            }));
        } else {
            category_majorIds = checkedBookUpdate();
            imgBase64 = image ? await toBase64(image) : null;
            payload = {
                name,
                author,
                description,
                price,
                quantity,
                quantityReality: bookUpdate
                    ? bookUpdate.quantityReality +
                      Math.abs(bookUpdate.quantity - quantity) *
                          (bookUpdate.quantity - quantity > 0 ? -1 : 1)
                    : quantity,
                statusId: status,
                category_majorIds,
                id: bookUpdate && bookUpdate.id,
                image: imgBase64,
            };
        }

        const data = (await fetchData(
            HTTPMethods.POST,
            "/books",
            listBooksImport.length > 0 ? listBooksImport : payload,
        )) as ResAxios;

        if (data.EC === 0) {
            fileUpload ? setFileUpload(undefined) : resetForm();
            dispatch(getBooks({ page: 1 }));
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    }

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        setImage(e.target.files[0]);
    }

    function handleDownloadExcel() {
        // Lấy 3 books để làm sample
        let listBookSample = bookState.slice(0, 3).map((item) => {
            return {
                name: item.name,
                author: item.author,
                description: item.description,
                price: item.price,
                quantity: item.quantity,
                quantityReality: item.quantityReality,
                status: item.Status.name,
                category: item.Categories[0].name,
                major: item.Majors[0].description,
            };
        });

        // listHeadings phải theo thứ tự key như listData
        const isSuccess = exportExcel({
            listData: listBookSample,
            listHeadings: [
                "Tên",
                "Tác giả",
                "Mô tả",
                "Giá",
                "Số lượng",
                "Số lượng thực tế",
                "Tình trạng",
                "Thể loại",
                "Chuyên ngành",
            ],
            nameFile: "BooksSample",
        });
        if (isSuccess) return toast.success("Export excel successful!");

        toast.error("Export excel failed!");
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        setFileUpload(e.target.files[0]);
        toast.success("Upload CSV successful !");
    }

    const resetForm = () => {
        setName("");
        setAuthor("");
        setPrice(0);
        setQuantity(1);
        setStatus("");
        setDescription("");
        setImage(undefined);
        bookUpdate && setBookUpdate(undefined);
        (qs("#formUpsert") as HTMLFormElement).reset();
    };

    const handleClear = () => {
        setBookUpdate(undefined);
        resetForm();
    };

    const checkedBookUpdate = (bookUpdate?: ResBook) => {
        const categoryCheckboxes = qsa(
            "[type='checkbox']",
            qs("#categoryCheckboxes") as HTMLElement,
        ) as HTMLInputElement[];

        const majorCheckboxes = qsa(
            "[type='checkbox']",
            qs("#majorCheckboxes") as HTMLElement,
        ) as HTMLInputElement[];

        let majorIdsUpdate: number[] = [],
            categoryIdsUpdate: number[] = [];

        if (bookUpdate) {
            majorIdsUpdate = bookUpdate.Majors.map((item) => item.id);
            categoryIdsUpdate = bookUpdate.Categories.map((item) => item.id);
        }

        const categoryIds = [],
            majorIds = [];
        for (const item of categoryCheckboxes) {
            if (bookUpdate === undefined && item.checked) {
                categoryIds.push(item.getAttribute("data-id"));
            } else {
                item.checked = false;
                if (
                    categoryIdsUpdate.includes(+item.getAttribute("data-id")!)
                ) {
                    item.checked = true;
                }
            }
        }

        for (const item of majorCheckboxes) {
            if (bookUpdate === undefined && item.checked) {
                majorIds.push(item.getAttribute("data-id"));
            } else {
                item.checked = false;
                if (majorIdsUpdate.includes(+item.getAttribute("data-id")!)) {
                    item.checked = true;
                }
            }
        }

        let category_majorIds: {}[] = [];
        if (bookUpdate) {
            if (categoryIds.length > 0 || majorIds.length > 0) {
                if (categoryIds.length > 0 && majorIds.length === 0)
                    category_majorIds = categoryIds.map((item) => ({
                        categoryId: item,
                    }));
                else if (majorIds.length > 0 && categoryIds.length === 0)
                    category_majorIds = majorIds.map((item) => ({
                        majorId: item,
                    }));
                else {
                    for (const categoryId of categoryIds) {
                        for (const majorId of majorIds) {
                            category_majorIds.push({
                                categoryId,
                                majorId,
                            });
                        }
                    }
                }
            }
        }

        return category_majorIds;
    };

    const setDataFormUpdate = () => {
        if (bookUpdate === undefined) return;
        checkedBookUpdate(bookUpdate);
        setName(bookUpdate.name);
        setAuthor(bookUpdate?.author);
        setPrice(bookUpdate.price);
        setQuantity(bookUpdate?.quantity);
        setStatus(bookUpdate.Status.id.toString());
        setDescription(bookUpdate.description);
        setImage(bookUpdate.image as any);
    };

    React.useEffect(() => {
        setDataFormUpdate();
    }, [bookUpdate]);

    React.useEffect(() => {
        getAllStatus();
        getAllCategories();
        getAllMajors();
        dispatch(getBooks({ page: 1 }));
    }, []);

    return (
        <>
            <div className="d-flex justify-content-between mb-4">
                <h3 className="w-75 m-0">
                    {objForm.titleHeader} book:{" "}
                    <span className="text-info fst-italic">
                        {bookUpdate && `${bookUpdate.name}`}
                    </span>
                </h3>
                <div className="w-50 d-flex">
                    <Button
                        className="me-3"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        color="secondary"
                        onClick={() => handleDownloadExcel()}
                    >
                        Download sample
                    </Button>

                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        color={fileUpload?.name ? "success" : "primary"}
                    >
                        <input
                            hidden
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            type="file"
                            onChange={handleFileUpload}
                        />
                        {fileUpload?.name ?? "Upload file CSV"}
                    </Button>
                </div>
            </div>

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
                {/* Name, Author, ... */}
                <div className="d-flex gap-3 w-100 mb-4">
                    <TextField
                        // inputRef={name}
                        required={fileUpload ? false : true}
                        className="w-25"
                        id="outlined-basic"
                        label="Name"
                        multiline
                        maxRows={2}
                        variant="outlined"
                        value={name}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setName(event.target.value);
                        }}
                    />

                    <TextField
                        // inputRef={name}
                        required={fileUpload ? false : true}
                        className="w-25"
                        id="outlined-basic"
                        label="Author"
                        multiline
                        maxRows={2}
                        variant="outlined"
                        value={author}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setAuthor(event.target.value);
                        }}
                    />

                    <TextField
                        // inputRef={name}
                        sx={{ width: "9.375em" }}
                        type="number"
                        inputProps={{ min: 0 }}
                        id="outlined-basic"
                        label="Price (vnd)"
                        variant="outlined"
                        value={price}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setPrice(+event.target.value!);
                        }}
                    />

                    <TextField
                        // inputRef={name}
                        inputProps={{ min: 0 }}
                        sx={{ width: "6.25em" }}
                        type="number"
                        id="outlined-basic"
                        label="Quantity"
                        variant="outlined"
                        value={quantity}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setQuantity(+event.target.value);
                        }}
                        InputProps={{ inputProps: { min: 1 } }}
                    />

                    <TextField
                        // inputRef={name}
                        sx={{ width: "12.5em" }}
                        select
                        id="outlined-basic"
                        label="Status"
                        variant="outlined"
                        value={status}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setStatus(event.target.value);
                        }}
                    >
                        {listStatus.map((status) => (
                            <MenuItem key={status.id} value={status.id}>
                                {status.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                {/* Description, Preview Image */}
                <div className="d-flex mb-3 gap-4 mb-4">
                    <div className="d-flex w-50">
                        <TextField
                            value={description}
                            fullWidth
                            id="outlined-multiline-static"
                            label="Description"
                            multiline
                            rows={6}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setDescription(event.target.value);
                            }}
                        />
                    </div>

                    {/* Preview Image */}
                    <div
                        className="rounded position-relative text-center border border-3 py-2 mb-3 w-50"
                        style={{ minHeight: "10.6em" }}
                    >
                        <IconButton
                            color="secondary"
                            aria-label="upload picture"
                            component="label"
                            className="float-start ms-2"
                        >
                            <input
                                onChange={handleImage}
                                hidden
                                accept="image/*"
                                type="file"
                            />
                            <PhotoCamera fontSize="large" />
                        </IconButton>

                        {image ? (
                            <img
                                src={
                                    bookUpdate?.image
                                        ? (image as any)
                                        : URL.createObjectURL(image as any)
                                }
                                alt=""
                            />
                        ) : (
                            <p className="position-absolute top-50 start-50 translate-middle opacity-75">
                                Preview image
                            </p>
                        )}
                    </div>
                </div>

                <div className="d-flex gap-3 text-center mb-4">
                    <FormControl
                        component="fieldset"
                        variant="standard"
                        ref={categoryRef}
                        className="border border-2 px-1 py-2 rounded"
                    >
                        <FormLabel component="legend">
                            <span className="border border-2 p-1 border-info rounded">
                                Category
                            </span>
                        </FormLabel>

                        <MyCheckbox
                            listData={listCategory}
                            fieldLabel="name"
                            classCss="d-flex flex-row gap-3 flex-wrap mt-3"
                            id="categoryCheckboxes"
                        />
                    </FormControl>

                    <FormControl
                        component="fieldset"
                        variant="standard"
                        ref={majorRef}
                        className="border border-2 px-1 py-2 rounded"
                    >
                        <FormLabel component="legend">
                            <span className="border border-2 p-1 border-info rounded">
                                Major
                            </span>
                        </FormLabel>

                        <MyCheckbox
                            listData={listMajor}
                            fieldLabel="description"
                            classCss="d-flex flex-row gap-3 flex-wrap mt-3"
                            id="majorCheckboxes"
                        />
                    </FormControl>
                </div>

                {/* Button */}
                <Button
                    color={objForm.buttonColor as "primary" | "success"}
                    className="me-3"
                    type="submit"
                    variant="contained"
                    endIcon={<SendIcon />}
                >
                    {objForm.buttonContent}
                </Button>

                <Button
                    color={objForm.auxiliaryButtonColor as "warning" | "error"}
                    type="button"
                    variant="contained"
                    endIcon={<BackspaceIcon />}
                    onClick={handleClear}
                >
                    {objForm.auxiliaryButtonContent}
                </Button>
            </Box>
        </>
    );
}
