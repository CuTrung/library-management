import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroupGroupRoles from './listGroupRoles';
import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { $$, fetchData, removeIsInvalidClass } from '../../../utils/myUtils';
import _ from "lodash";
import validationUtils from '../../../utils/validationUtils';
import useToggle from '../../../hooks/useToggle';
import { MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';
import '../../../assets/scss/admin/groupRoles/CUDGroupRole.scss';




const CUDGroupRole = (props) => {

    const listGroupRolesRef = useRef();

    const urlOrName = useRef("");
    const group = useRef("");

    const [groupRoleUpdate, setGroupRoleUpdate] = useState({});
    const [isGroup, toggleGroup] = useToggle(false);

    const [listRoles, setListRoles] = useState([]);

    const [groupRoles, setGroupRoles] = useState([]);

    const [isDisabled, setIsDisabled] = useState(false);

    const upsertGroupOrRoleForm = useMemo(() => {
        let propsForm = {
            header: `Add new ${isGroup ? 'role' : 'group'}`,
            buttonContent: 'Submit',
            buttonColor: 'primary',
            supportButtonContent: 'Clear',
            supportButtonColor: 'warning',
        }
        if (!_.isEmpty(groupRoleUpdate)) {
            propsForm.header = `Update ${groupRoleUpdate.type === 'ROLE' ? 'role' : 'group'}`;
            propsForm.buttonContent = 'Save';
            propsForm.buttonColor = 'success';
            propsForm.supportButtonContent = 'Cancel';
            propsForm.supportButtonColor = 'danger';
        }
        return propsForm;
    }, [groupRoleUpdate, isGroup])

    async function getRoles() {
        let data = await fetchData('GET', `api/groupRoles/roles`)

        if (data.EC === 0) {
            setListRoles(data.DT);
        }
    }


    function handleClearCheckboxInvalid() {
        for (const item of $$("[type='checkbox']")) {
            if (item.classList.contains('is-invalid')) {
                item.classList.remove('is-invalid');
            }
        }
    }

    function handleClearForm() {
        document.getElementById('upsertGroupOrRoleForm').reset();
        document.getElementById('upsertGroupRoleForm').reset();
        setGroupRoleUpdate({});
    }

    async function handleDelete(type, id, groupRoleId) {
        let data = await fetchData('DELETE', 'api/groupRoles', {
            id,
            isGroup: type === 'ROLE MAIN' ? undefined : (type === 'ROLE' ? false : true),
            groupRoleId
        })

        if (data.EC === 0) {
            listGroupRolesRef.current?.fetchListGroupRoles();
            await getRoles();
            toast.success(data.EM);
        }
    }

    function handleSelectGroup(groupId) {
        let listRolesExists = groupRoles.find((item) => +item.id === +groupId).Roles.map((item) => item.id);

        for (const item of $$('[type="checkbox"]')) {
            item.checked = false;
            if (listRolesExists.includes(+item.getAttribute('data-id'))) {
                item.checked = true
            }
        }

    }

    function handleChangeAddNew() {
        toggleGroup()
        urlOrName.current.value = ''
    }


    async function upsertGroupRole(type, e) {
        e?.preventDefault();

        // validate
        let isValid = type === 'GROUP' ? validationUtils.validate('upsertGroupRoleForm') : validationUtils.validate('upsertGroupOrRoleForm');
        if (!isValid) return;

        setIsDisabled(true);
        let data;
        if (type === 'ROLE') {
            data = await fetchData('POST', 'api/groupRoles', {
                [isGroup ? 'name' : 'url']: urlOrName.current.value,
                id: groupRoleUpdate.id,
                isGroup
            })
        }

        if (type === 'GROUP') {
            let dataGroupRoles = [];
            for (const item of $$('[type="checkbox"]')) {
                if (item.checked) {
                    dataGroupRoles.push({ groupId: group.current.value, roleId: item.getAttribute('data-id') })
                }
            }

            data = await fetchData('POST', 'api/groupRoles', {
                listGroupRoles: dataGroupRoles,
                groupId: group.current.value
            })
        }

        if (data.EC === 0) {
            listGroupRolesRef?.current?.fetchListGroupRoles();
            await getRoles();
            handleClearForm();
            toast.success(data.EM);
        } else {
            toast.success(data.EM);
        }
        setIsDisabled(false);
    }



    useEffect(() => {
        if (!_.isEmpty(groupRoleUpdate)) {
            if (groupRoleUpdate.type === 'ROLE') {
                urlOrName.current.value = groupRoleUpdate.url;
                toggleGroup(false);
            } else {
                urlOrName.current.value = groupRoleUpdate.name;
                toggleGroup(true);
            }
        }
    }, [groupRoleUpdate])

    useEffect(() => {
        getRoles()
    }, [])


    return (
        <>
            <div className="row">
                <div className="col-4">
                    <form id='upsertGroupOrRoleForm' onSubmit={(e) => upsertGroupRole('ROLE', e)}>
                        <h3 className='my-3'>
                            {upsertGroupOrRoleForm.header}
                            {_.isEmpty(groupRoleUpdate) &&
                                <button type='button' onClick={() => handleChangeAddNew()} className='btn btn-outline-info btn-sm float-end'>Add new {isGroup ? 'group' : 'role'}</button>
                            }

                        </h3>
                        <FloatingLabel
                            controlId="floatingInput"
                            label={isGroup ? "Name" : "Url"}
                            className="mb-3"
                        >
                            <Form.Control
                                ref={urlOrName} name='urlOrName' type="text" placeholder="name@example.com"
                                onChange={(e) => removeIsInvalidClass(e)} />
                        </FloatingLabel>

                        <Button className={`btn-${upsertGroupOrRoleForm.buttonColor} me-3`} type='submit'
                            disabled={isDisabled}
                        >{upsertGroupOrRoleForm.buttonContent}</Button>

                        <Button onClick={handleClearForm} className={`btn-${upsertGroupOrRoleForm.supportButtonColor}`} type='button'>{upsertGroupOrRoleForm.supportButtonContent}</Button>
                    </form>

                    <hr />

                    <form id='upsertGroupRoleForm' onSubmit={(e) => upsertGroupRole('GROUP', e)}>

                        <h3 className='my-3'>Set role for group</h3>

                        <Form.Select ref={group} onChange={(e) => handleSelectGroup(e.target.value)} className='mb-3' aria-label="Default select example">
                            <option hidden value=''>Choose Group</option>
                            {groupRoles.length > 0 && groupRoles.map((item, index) => {
                                return (
                                    <option key={`groupRole-${index} `} value={item.id}>{item.name}</option>
                                )
                            })}
                        </Form.Select>

                        <span className='d-flex gap-3 flex-wrap'>
                            {listRoles.length > 0 && listRoles.map((role, index) => {
                                return (
                                    <span key={`role-${index} `} className='d-flex'>
                                        <Form.Check
                                            onChange={() => handleClearCheckboxInvalid()}
                                            className='role'
                                            name='role'
                                            data-id={role.id}
                                            type={'checkbox'}
                                            label={`${role.url}`}
                                        />
                                        <MdDeleteForever className='editRoleIcon' size={24} color='red'
                                            onClick={() => handleDelete('ROLE MAIN', role.id)}
                                        />
                                    </span>

                                )
                            })}
                        </span>

                        <Button
                            disabled={isDisabled}
                            className={`btn-primary me-3 mt-3`} type='submit'>Submit</Button>

                        <Button onClick={handleClearForm} className={`btn-warning mt-3`} type='button'>Clear</Button>

                    </form>
                </div>


                <div className="col-8">
                    <ListGroupGroupRoles
                        ref={listGroupRolesRef}
                        setGroupRoleUpdate={setGroupRoleUpdate}
                        handleDelete={handleDelete}
                        setGroupRoles={setGroupRoles}
                    />
                </div>
            </div>

        </>
    )
}

export default CUDGroupRole;