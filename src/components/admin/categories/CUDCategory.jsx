import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListCategories from './listCategories';
import { useState, useEffect, useRef, useMemo } from 'react';
import { fetchData, removeIsInvalidClass, upperCaseFirstChar } from '../../../utils/myUtils';
import _ from "lodash";
import validationUtils from '../../../utils/validationUtils';
import { toast } from 'react-toastify';




const CUDCategory = (props) => {
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

    const [isDisabled, setIsDisabled] = useState(false);

    function handleClearForm() {
        document.getElementById('upsertForm').reset();
        setCategoryUpdate({});
    }


    async function upsertCategory(e) {
        setIsDisabled(true);
        e.preventDefault();

        // validate
        let isValid = validationUtils.validate('upsertForm');
        if (!isValid) return;

        let data = await fetchData('POST', 'api/categories', {
            name: upperCaseFirstChar(name.current.value),
            isBorrowed: isBorrowed.current.checked ? '0' : '1',
            id: categoryUpdate.id,
        })

        if (data.EC === 0) {
            listCategoriesRef.current.fetchListCategories();
            handleClearForm();
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
        setIsDisabled(false);
    }

    async function deleteCategory(id) {
        let data = await fetchData('DELETE', 'api/categories', { id })

        if (data.EC === 0) {
            listCategoriesRef.current.fetchListCategories();
        }
    }

    useEffect(() => {
        if (!_.isEmpty(categoryUpdate)) {
            name.current.value = categoryUpdate.name;
            isBorrowed.current.checked = categoryUpdate.isBorrowed === 1 ? false : true;
        }
    }, [categoryUpdate])

    return (
        <>
            <div className='row'>
                <form id='upsertForm' className="position-relative col-4" onSubmit={(e) => upsertCategory(e)}>

                    <h3 className='my-3'>{upsertForm.header}</h3>

                    <FloatingLabel
                        controlId="floatingInput"
                        label="Name"
                        className="mb-3"
                    >
                        <Form.Control
                            ref={name} name='name' type="text" placeholder="name@example.com"
                            onChange={(e) => removeIsInvalidClass(e)} />
                    </FloatingLabel>

                    <Form.Check
                        className='mb-3'
                        ref={isBorrowed}
                        name='isBorrowed'
                        type={'checkbox'}
                        label={`can't borrowed`}
                    />


                    <Button className={`btn-${upsertForm.buttonColor} me-3`} type='submit'
                        disabled={isDisabled}
                    >{upsertForm.buttonContent}</Button>
                    <Button onClick={handleClearForm} className={`btn-${upsertForm.supportButtonColor} me-3`} type='button'>{upsertForm.supportButtonContent}</Button>
                </form>

                <span className='col-8'>
                    <ListCategories
                        ref={listCategoriesRef}
                        setCategoryUpdate={setCategoryUpdate}
                        deleteCategory={deleteCategory}
                    />
                </span>

            </div>

        </>
    )
}

export default CUDCategory;