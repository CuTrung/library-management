import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListBooks from './listBooks';
import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchData } from '../../../utils/myUtils';
import _ from "lodash";
import validationUtils from '../../../utils/validationUtils';
import '../../../assets/scss/admin/books/CUDBook.scss';
import { FcUpload } from "react-icons/fc";




const CUDBook = (props) => {
    const [listStatus, setListStatus] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [fileName, setFileName] = useState(null);
    const listBooksRef = useRef();

    const name = useRef("");
    const price = useRef("");
    const quantity = useRef("");
    const status = useRef("");

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
    }, [bookUpdate])


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

    function handleClearForm() {
        document.getElementById('upsertForm').reset();
        setFileName(null);
        setBookUpdate({});
    }


    async function upsertBook(e) {
        e.preventDefault();

        // Upload file with excel (Coming soon ...)
        let file = document.getElementById('fileUpload').files[0];



        // validate
        // let isValid = validationUtils.validate('upsertForm');
        // if (!isValid) return;

        // Create with form
        let categoryIds = [];
        for (const item of document.querySelectorAll('[name="category"]')) {
            if (item.checked) {
                categoryIds.push(item.value)
            }
        }

        let data = await fetchData('POST', 'api/books', {
            name: name.current.value,
            price: price.current.value,
            quantity: quantity.current.value,
            statusId: status.current.value,
            id: bookUpdate.id,
            categoryIds: categoryIds
        })

        if (data.EC === 0) {
            listBooksRef.current.fetchListBooks();
            handleClearForm();
        }

    }

    async function deleteBook(id) {
        let data = await fetchData('DELETE', 'api/books', { id })

        if (data.EC === 0) {
            listBooksRef.current.fetchListBooks();
        }
    }

    function handleOnChange(event) {
        if (event.target.classList.contains('is-invalid')) {
            event.target.classList.remove('is-invalid')
        }
    }

    function checkedCategoriesUpdate() {
        for (const item of document.querySelectorAll('[name="category"]')) {
            if (item.checked) {
                item.checked = false;
            }
        }

        for (const item of document.querySelectorAll('[name="category"]')) {
            for (const category of bookUpdate.Categories) {
                if (+item.value === +category.id) {
                    item.checked = true;
                }
            }
        }
    }

    useEffect(() => {
        getCategories();
        getStatus();
    }, [])

    useEffect(() => {
        if (!_.isEmpty(bookUpdate)) {
            name.current.value = bookUpdate.name;
            price.current.value = bookUpdate.price;
            quantity.current.value = bookUpdate.quantity;
            status.current.value = bookUpdate.Status.id;
            checkedCategoriesUpdate();
        }
    }, [bookUpdate])

    return (
        <>
            <form id='upsertForm' className="position-relative" onSubmit={(e) => upsertBook(e)}>

                <h3 className='mb-4'>{upsertForm.header}</h3>


                <input onChange={(e) => setFileName(e.target.files[0].name)} id='fileUpload' type="file" multiple hidden />
                <button
                    onClick={() => document.getElementById('fileUpload').click()}
                    className={`btn btn-outline-secondary position-absolute top-0 end-0 border border-2 border-${fileName ? 'success' : 'dark'} me-5 p-1`}
                >{fileName ?? 'Upload excel'} <FcUpload size={'34px'} />
                </button>



                <span className='d-flex gap-2'>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Name"
                        className="mb-3 w-50"
                    >
                        <Form.Control
                            disabled={fileName ?? false}
                            ref={name} name='name' type="text" placeholder="name@example.com"
                            onChange={(e) => handleOnChange(e)} />
                    </FloatingLabel>

                    <div className='border border-2 rounded px-2 mb-3 w-50 pt-3'>
                        <div className='d-flex gap-3 flex-wrap mx-4'>
                            <p>Category </p>
                            {listCategories.length > 0 && listCategories.map((category, index) => {
                                return (
                                    <Form.Check
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
                </span>


                <span className='d-flex gap-2 justify-content-around'>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Price (vnd)"
                        className="mb-3 w-25"
                    >
                        <Form.Control disabled={fileName ?? false} ref={price} name='price' type="text" placeholder="name@example.com"
                            onChange={(e) => handleOnChange(e)} />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Quantity"
                        className="mb-3 w-25"
                    >
                        <Form.Control disabled={fileName ?? false} ref={quantity} name='quantity' type="text" placeholder="name@example.com"
                            onChange={(e) => handleOnChange(e)} />
                    </FloatingLabel>

                    <Form.Select disabled={fileName ?? false} ref={status} name='status' className='my-3 w-25 py-3 mt-0'
                        onChange={(e) => handleOnChange(e)}>
                        <option value="" hidden>Choose status</option>
                        {listStatus.length > 0 && listStatus.map((status, index) => {
                            return <option key={`status-${index}`} value={status.id}>{status.name}</option>
                        })}
                    </Form.Select>
                </span>

                <Button className={`btn-${upsertForm.buttonColor} me-3`} type='submit'>{upsertForm.buttonContent}</Button>
                <Button onClick={handleClearForm} className={`btn-${upsertForm.supportButtonColor} me-3`} type='button'>{upsertForm.supportButtonContent}</Button>
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