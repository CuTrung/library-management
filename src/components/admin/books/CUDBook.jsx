import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListBooks from './listBooks';
import { useState, useEffect, useRef, useMemo } from 'react';
import { $$, exportExcel, fetchData, importExcel, removeIsInvalidClass, toBase64 } from '../../../utils/myUtils';
import _ from "lodash";
import validationUtils from '../../../utils/validationUtils';
import '../../../assets/scss/admin/books/CUDBook.scss';
import { FcUpload, FcDownload } from "react-icons/fc";
import { BsCardImage } from "react-icons/bs";
import { useContext } from 'react';
import { GlobalContext } from '../../../context/globalContext';
import { toast } from 'react-toastify';





const CUDBook = (props) => {
    const [listStatus, setListStatus] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [fileName, setFileName] = useState(null);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const listBooksRef = useRef();
    const [isDisabled, setIsDisabled] = useState(false);
    const [listMajors, setListMajors] = useState([]);



    const name = useRef("");
    const price = useRef("");
    const quantity = useRef("");
    const status = useRef("");

    const { stateGlobal, dispatch } = useContext(GlobalContext);

    const [bookUpdate, setBookUpdate] = useState({});
    const upsertForm = useMemo(() => {
        let propsForm = {
            header: 'Add new a book',
            buttonContent: 'Submit',
            buttonColor: 'primary',
            supportButtonContent: 'Clear',
            supportButtonColor: 'warning',
        }
        if (!_.isEmpty(bookUpdate)) {
            propsForm.header = 'Update book';
            propsForm.buttonContent = 'Save';
            propsForm.buttonColor = 'success';
            propsForm.supportButtonContent = 'Cancel';
            propsForm.supportButtonColor = 'danger';
        }
        return propsForm;
    }, [bookUpdate]);

    function handleClearCheckboxInvalid() {
        for (const item of $$("[type='checkbox']")) {
            if (item.classList.contains('is-invalid')) {
                item.classList.remove('is-invalid');
            }
        }
    }

    async function getStatus() {
        try {
            let data = await fetchData('GET', 'api/status')
            if (data.EC === 0) {
                setListStatus(data.DT);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getCategories() {
        try {
            let data = await fetchData('GET', 'api/categories')
            if (data.EC === 0) {
                setListCategories(data.DT);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getMajors() {
        try {
            let data = await fetchData('GET', 'api/majors')
            if (data.EC === 0) {
                setListMajors(data.DT);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleClearForm() {
        document.getElementById('upsertForm').reset();
        clearChecked();
        setFileName(null);
        setBookUpdate({});
        setPreviewImage(null);
        setImage(null);
    }

    async function upsertBook(e) {
        e.preventDefault();

        if (fileName && fileName.split(".")[1] !== 'xlsx')
            return toast.error("The file must be have extension 'xlsx' !");

        // validate
        let isValid = fileName ? true : validationUtils.validate('upsertForm');
        if (!isValid) return toast.error("Please input all field !");

        // Upload file with excel 
        let listBooksImport;
        let category_majorIds = [], imgBase64;
        if (fileName) {
            let file = document.getElementById('fileUpload').files[0];
            listBooksImport = await importExcel(file);
            listBooksImport = listBooksImport.map((item) => ({ ...item, rowNum: item.__rowNum__ }))
        } else {
            // Create with form
            for (const item of $$('[name="category"]')) {
                for (const itemMajor of $$('[name="major"]')) {
                    if (item.checked) {
                        if (itemMajor.checked) {
                            category_majorIds.push({
                                categoryId: item.value,
                                majorId: itemMajor.value
                            })
                        }
                    }
                }
            }

            imgBase64 = image ? await toBase64(image) : null;
        }

        // Cả category và major phải đc checked mới push đc vào category_majorIds 
        if (category_majorIds.length === 0) return toast.error("Please input all field !");

        setIsDisabled(true);
        let data = await fetchData('POST', 'api/books', !fileName ? {
            name: name.current.value,
            price: price.current.value,
            quantity: quantity.current.value,
            quantityReality: bookUpdate.quantityReality ? (+bookUpdate.quantityReality + (+quantity.current.value - +bookUpdate.quantity)) : quantity.current.value,
            statusId: status.current.value,
            category_majorIds,
            image: imgBase64,
            id: bookUpdate.id,
        } : listBooksImport)

        if (data.EC === 0) {
            listBooksRef.current.fetchListBooks();
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
        setIsDisabled(false);
        handleClearForm();
    }

    async function deleteBook(id) {
        let data = await fetchData('DELETE', 'api/books', { id })
        if (data.EC === 0) {
            listBooksRef.current.fetchListBooks();
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    }

    function handleDownloadExcel() {
        // Lấy 3 books để làm sample
        let listBooksSample = stateGlobal.listBooksSample.slice(0, 3).map((item) => {
            return {
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                quantityReality: item.quantityReality,
                status: item.Status.name,
                category: item.Categories[0].name,
                major: item.Majors[0].description,
            }
        });

        // listHeadings phải theo thứ tự key như listData
        const isSuccess = exportExcel({
            listData: listBooksSample,
            listHeadings: [
                'Tên', 'Giá', 'Số lượng', 'Số lượng thực tế', 'Tình trạng', 'Thể loại', 'Chuyên ngành',
            ],
            nameFile: 'BooksSample'
        });
        if (isSuccess)
            return toast.success("Export excel successful!")

        toast.error("Export excel failed!")
    }

    function checkedUpdate() {
        for (const item of $$('[type="checkbox"]')) {
            if (item.checked) {
                item.checked = false;
            }
        }

        for (const item of $$('[type="checkbox"]')) {
            if (item.name === 'category') {
                for (const category of bookUpdate.Categories) {
                    if (+item.value === +category.id) {
                        item.checked = true;
                    }
                }
            }

            if (item.name === 'major') {
                for (const major of bookUpdate.Majors) {
                    if (+item.value === +major.id) {
                        item.checked = true;
                    }
                }
            }

        }
    }

    function clearChecked() {
        for (const item of $$('[type="checkbox"]')) {
            item.classList.remove('is-invalid');
        }
    }

    function handleImage(e) {
        let file = e.target.files[0];

        if (file && file.type.split("/")[0] === "image") {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    useEffect(() => {
        getCategories();
        getMajors();
        getStatus();
    }, [])

    useEffect(() => {
        if (!_.isEmpty(bookUpdate)) {
            name.current.value = bookUpdate.name;
            price.current.value = bookUpdate.price;
            quantity.current.value = bookUpdate.quantity;
            status.current.value = bookUpdate.Status.id;
            setPreviewImage(bookUpdate.image);
            checkedUpdate();
        }
    }, [bookUpdate])


    return (
        <>
            <form id='upsertForm' className="position-relative" onSubmit={(e) => upsertBook(e)}>
                <h3 className='mb-4'>{upsertForm.header}</h3>

                <div className='position-absolute top-0 end-0'>
                    <button
                        type='button'
                        onClick={() => handleDownloadExcel()}
                        className={`btn btn-outline-secondary  border border-2 border-primary me-3 p-1`}
                    >{'Sample excel'} <FcDownload size={'34px'} />
                    </button>

                    <input onChange={(e) => setFileName(e.target.files[0].name)} id='fileUpload' type="file" hidden />
                    <label
                        htmlFor='fileUpload'
                        className={`btn btn-outline-secondary  border border-2 border-${fileName ? 'success' : 'dark'} me-5 p-1`}
                    >{fileName ?? 'Upload excel'} <FcUpload size={'34px'} />
                    </label>
                </div>

                <span className='d-flex gap-2'>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Name"
                        className="mb-3 w-50"
                    >
                        <Form.Control
                            disabled={fileName ?? false}
                            ref={name} name='name' type="text" placeholder="name@example.com"
                            onChange={(e) => removeIsInvalidClass(e)} />
                    </FloatingLabel>
                    <span className='d-flex w-50 gap-2'>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Price (vnd)"
                            className="mb-3 w-50"
                        >
                            <Form.Control disabled={fileName ?? false} ref={price} name='price' type="number" placeholder="name@example.com"
                                onChange={(e) => removeIsInvalidClass(e)} />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="floatingInput"
                            label="Quantity"
                            className="mb-3 w-25"
                        >
                            <Form.Control disabled={fileName ?? false} ref={quantity} name='quantity' type="number" placeholder="name@example.com"
                                onChange={(e) => removeIsInvalidClass(e)} />
                        </FloatingLabel>

                        <Form.Select disabled={fileName ?? false} ref={status} name='status' className='my-3 w-25 py-3 mt-0'
                            onChange={(e) => removeIsInvalidClass(e)}>
                            <option value="" hidden>Status</option>
                            {listStatus.length > 0 && listStatus.map((status, index) => {
                                return <option key={`status-${index}`} value={status.id}>{status.name}</option>
                            })}
                        </Form.Select>
                    </span>
                </span>

                <span className='d-flex gap-2'>
                    <div className='border border-2 rounded px-2 mb-3 pt-3 w-25'>
                        <div className='d-flex gap-3 flex-wrap mx-4'>
                            <p className='w-100 text-center m-0'>
                                <span className='border border-2 border-info rounded p-1'>Category</span>
                            </p>
                            {listCategories.length > 0 && listCategories.map((category, index) => {
                                return (
                                    <Form.Check
                                        onChange={() => handleClearCheckboxInvalid()}
                                        disabled={fileName ?? false}
                                        name='category'
                                        key={`category-${index}`}
                                        value={category.id}
                                        type={'checkbox'}
                                        label={category.name}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className='border border-2 rounded px-2 mb-3 pt-3 w-75'>
                        <div className='d-flex gap-3 flex-wrap mx-4'>
                            <p className='w-100 text-center m-0'>
                                <span className='border border-2 border-success rounded p-1'>Major</span>
                            </p>
                            {listMajors.length > 0 && listMajors.map((major, index) => {
                                return (
                                    <Form.Check
                                        onChange={() => handleClearCheckboxInvalid()}
                                        disabled={fileName ?? false}
                                        name='major'
                                        key={`major-${index}`}
                                        value={major.id}
                                        type={'checkbox'}
                                        label={major.description}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </span>


                <div>
                    <input onChange={(e) => handleImage(e)} id='imgUpload' type="file" hidden />
                    <label
                        className='btn btn-outline-success mb-3'
                        htmlFor='imgUpload'
                    ><BsCardImage size={24} className='me-2' />Upload image</label>

                    <div className='preview rounded position-relative text-center py-2'>
                        {previewImage ?
                            <img src={previewImage} alt="" />
                            :
                            <p className='position-absolute top-50 start-50 translate-middle opacity-75'>Preview image</p>
                        }

                    </div>
                </div>

                <div className='d-flex gap-3 mt-3'>
                    <Button className={`btn-${upsertForm.buttonColor}`} type='submit'
                        disabled={isDisabled}
                    >{upsertForm.buttonContent}</Button>
                    <Button onClick={handleClearForm} className={`btn-${upsertForm.supportButtonColor}`} type='button'>{upsertForm.supportButtonContent}</Button>
                </div>
            </form>

            <ListBooks
                ref={listBooksRef}
                setBookUpdate={setBookUpdate}
                deleteBook={deleteBook}
            />
        </>
    )
}

export default CUDBook;