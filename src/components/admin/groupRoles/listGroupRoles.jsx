import Table from 'react-bootstrap/Table';
import { useEffect, useState, forwardRef, useRef, useImperativeHandle, useContext } from 'react';
import MyPagination from "../../both/myPagination";
import { fetchData, removeDiacritics } from '../../../utils/myUtils';
import _ from "lodash";
import SearchBar from '../../both/searchBar';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteForever } from 'react-icons/md';
// import '../../../assets/scss/admin/groupRoles/listGroupRoles.scss';
import LoadingIcon from '../../both/loadingIcon';



const ListGroupRoles = (props, ref) => {
    const [listGroupRoles, setListGroupRoles] = useState([]);
    const [limitItem, setLimitItem] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);

    const listGroupRolesRef = useRef(null);

    async function getGroupRoles() {
        let data = await fetchData('GET', `api/groupRoles?limit=${limitItem}&page=${currentPage}`)

        if (data.EC === 0) {
            props.setGroupRoles(data.DT.groupRoles);
            listGroupRolesRef.current = data.DT.groupRoles;
            setListGroupRoles(data.DT.groupRoles);
            setTotalPages(data.DT.totalPages);
        }
    }


    useImperativeHandle(ref, () => ({
        fetchListGroupRoles() {
            getGroupRoles();
        },
    }));


    useEffect(() => {
        getGroupRoles();
    }, [currentPage])


    return (
        <>
            <h3 className='float-start my-3'>List groupRoles</h3>

            {listGroupRolesRef.current?.length > 0 &&
                <SearchBar
                    listRefDefault={listGroupRolesRef.current}
                    listSearch={listGroupRoles}
                    setListSearch={setListGroupRoles}
                    pathDeepObj={'name'}
                    classNameCss={'float-end my-3'}
                    placeholder={'Searching ...'}
                />
            }

            {listGroupRoles.length > 0 ?
                <>
                    <Table className='listGroupRoles my-3' bordered hover>
                        <thead>
                            <tr>
                                <th>Group Name</th>
                                <th>GroupRoles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listGroupRoles.length > 0 && listGroupRoles.map((groupRole, index) => {
                                return (
                                    <tr key={`groupRole-${index}`}>
                                        <td>
                                            {groupRole.name}
                                            <span className='editRoleIcon float-end d-flex gap-2'>
                                                <CiEdit size={24}
                                                    onClick={() => props.setGroupRoleUpdate({ ...groupRole, type: 'GROUP' })}
                                                />
                                                <MdDeleteForever size={24} color='red'
                                                    onClick={() => props.handleDelete('GROUP', groupRole.id)}
                                                />
                                            </span>
                                        </td>
                                        <td>
                                            {groupRole.Roles.length > 0 && groupRole.Roles.map((role, indexRole) => {
                                                return (
                                                    role.url &&
                                                    <p key={`role-${indexRole}`}
                                                        className='' style={{ minWidth: '36px' }}
                                                    >{role.url}
                                                        <span className='editRoleIcon float-end d-flex gap-2'>
                                                            <CiEdit size={24}
                                                                onClick={() => props.setGroupRoleUpdate({ ...role, type: 'ROLE' })}
                                                            />
                                                            <MdDeleteForever size={24} color='red'
                                                                onClick={() => props.handleDelete('ROLE', role.id, groupRole.id)}
                                                            />
                                                        </span>
                                                    </p>
                                                )
                                            })}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    <MyPagination
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                    />
                </>
                :
                <LoadingIcon />
            }

        </>
    );
}

export default forwardRef(ListGroupRoles);