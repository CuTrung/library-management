import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListCategories from './listCategories';
import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchData } from '../../../utils/myUtils';
import _ from "lodash";
import validationUtils from '../../../utils/validationUtils';
import '../../../assets/scss/admin/categories/CUDCategory.scss';




const CUDCategory = (props) => {
    const [listCategories, setListCategories] = useState([]);
    const listCategoriesRef = useRef();

    const name = useRef("");
    const isBorrowed = useRef("");

    const [categoryUpdate, setCategoryUpdate] = useState({});
    const upsertForm = useMemo(() => {
        let propsForm = {
            header: 'Add new a category',
            buttonContent: 'Submit',
            buttonColor: 'primary',
            supportButtonContent: 'Clear',
            supportButtonColor: 'warning',
        }
        if (!_.isEmpty(categoryUpdate)) {
            propsForm.header = 'Update category';
            propsForm.buttonContent = 'Save';
            propsForm.buttonColor = 'success';
            propsForm.supportButtonContent = 'Cancel';
            propsForm.supportButtonColor = 'danger';
        }
        return propsForm;
    }, [categoryUpdate])


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
        setCategoryUpdate({});
    }


    async function upsertCategory(e) {
        e.preventDefault();

        // validate
        // let isValid = validationUtils.validate('upsertForm');
        // if (!isValid) return;

        // Create with form
        let data = await fetchData('POST', 'api/categories', {
            name: name.current.value,
            isBorrowed: isBorrowed.current.checked ? '0' : '1',
            id: categoryUpdate.id,
        })

        if (data.EC === 0) {
            listCategoriesRef.current.fetchListCategories();
            handleClearForm();
        }

    }

    async function deleteCategory(id) {
        let data = await fetchData('DELETE', 'api/categories', { id })

        if (data.EC === 0) {
            listCategoriesRef.current.fetchListCategories();
        }
    }

    function handleOnChange(event) {
        if (event.target.classList.contains('is-invalid')) {
            event.target.classList.remove('is-invalid')
        }
    }

    useEffect(() => {
        getCategories();
    }, [])

    useEffect(() => {
        if (!_.isEmpty(categoryUpdate)) {
            name.current.value = categoryUpdate.name;
            isBorrowed.current.checked = categoryUpdate.isBorrowed === 1 ? false : true;
        }
    }, [categoryUpdate])

    return (
        <>
            <form id='upsertForm' className="position-relative" onSubmit={(e) => upsertCategory(e)}>

                <h3 className='my-3'>{upsertForm.header}</h3>

                <span className='d-flex gap-3'>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Name"
                        className="mb-3 w-75"
                    >
                        <Form.Control
                            ref={name} name='name' type="text" placeholder="name@example.com"
                            onChange={(e) => handleOnChange(e)} />
                    </FloatingLabel>

                    <Form.Check
                        className='pt-3'
                        ref={isBorrowed}
                        name='isBorrowed'
                        type={'checkbox'}
                        label={`can't borrowed`}
                    />
                </span>

                <Button className={`btn-${upsertForm.buttonColor} me-3`} type='submit'>{upsertForm.buttonContent}</Button>
                <Button onClick={handleClearForm} className={`btn-${upsertForm.supportButtonColor} me-3`} type='button'>{upsertForm.supportButtonContent}</Button>
            </form>

            <ListCategories
                ref={listCategoriesRef}
                setCategoryUpdate={setCategoryUpdate}
                deleteCategory={deleteCategory}
            />
        </>
    )
}

export default CUDCategory;