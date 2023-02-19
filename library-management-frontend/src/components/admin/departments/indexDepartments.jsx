import { useRef, useState } from "react";
import { FcUpload, FcDownload } from "react-icons/fc";
import { $, $$, exportExcel, fetchData, importExcel, upperCaseFirstChar } from "../../../utils/myUtils";
import Table from 'react-bootstrap/Table';
import useToggle from "../../../hooks/useToggle";
import '../../../assets/scss/admin/departments/indexDepartments.scss';
import { useEffect } from "react";
import { toast } from "react-toastify";
import { MdDelete } from 'react-icons/md';

const IndexDepartments = (props) => {
    const [fileName, setFileName] = useState(null);
    const [show, toggleShow] = useToggle(false);
    const [isUpload, setIsUpload] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [rerender, setRerender] = useState(false);
    const [listTypesTable, setListTypesTable] = useState([]);
    const [typeTable, setTypeTable] = useState('');


    const listTypes = [
        {
            name: 'DEPARTMENT',
            color: 'primary'
        },
        {
            name: 'MAJOR',
            color: 'warning'
        },
    ];



    async function handleDownloadExcel(typeName) {

        // Chưa xử lí phần này

        let data = await fetchData('GET', `api/${typeName.toLowerCase()}s`);
        if (data.EC !== 0) toast.error(data.EM);

        let listSample = data.DT.slice(0, 3).map((item) => {
            return {
                name: item.name,
                description: item.description,
                department: item.Department?.description
            }
        });

        // listHeadings phải theo thứ tự key như listData
        const isSuccess = exportExcel({
            listData: listSample,
            listHeadings: [
                'Tên', 'Mô tả', `${typeName === 'MAJOR' ? 'Khoa' : ''}`
            ],
            nameFile: `${upperCaseFirstChar(typeName)}Sample`
        });
        if (isSuccess)
            return toast.success("Export excel successful!")

        toast.error("Export excel failed!")
    }

    async function handleUpload() {

        setIsDisabled(true);
        for await (const item of $$('.fileUpload')) {
            let file = item.files[0];

            if (!file?.name) continue;

            if (file.name && file.name.split(".")[1] !== 'xlsx') {
                setIsDisabled(false);
                return toast.error("The file must be have extension 'xlsx' !");
            }

            let listImport = await importExcel(file);
            listImport = listImport.map((item) => ({ ...item, rowNum: item.__rowNum__ }));

            let typeName = item.id.split("-")[1];
            let data = await fetchData('POST', `api/${typeName.toLowerCase()}s`, listImport);


            if (data.EC === 0) {
                $(`#formUpload-${typeName}`).reset();
                handleView(typeName);
                toast.success(data.EM);
            } else {
                toast.error(data.EM);
            }
        }
        setIsDisabled(false);

        // handleClearForm();
    }

    async function handleView(typeName = 'DEPARTMENT') {
        setTypeTable(typeName);
        let data = await fetchData('GET', `api/${typeName.toLowerCase()}s`)
        if (data.EC === 0) {
            setListTypesTable(data.DT);
        } else {
            toast.error(data.EM);
        }
    }

    async function handleDelete(id) {
        let data = await fetchData('DELETE', `api/${typeTable.toLowerCase()}s`, { id })
        if (data.EC === 0) {
            handleView(typeTable);
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    }

    useEffect(() => {
        handleView();
    }, [])



    return (
        <>
            <div className="row border border-2 mt-3">
                <div className="titles col-5 pt-3">
                    {listTypes.map((item, index) => {
                        return (
                            <div key={`typeItem-${index}`} className="d-flex gap-2 mb-3">
                                <h4 className={`text-${item.color}`}>{upperCaseFirstChar(item.name)}</h4>


                                <button
                                    type='button'
                                    onClick={() => handleDownloadExcel(item.name)}
                                    className={`btn btn-outline-secondary btn-sm border border-2 border-primary p-1 w-100`}
                                >Sample <FcDownload size={24} />
                                </button>

                                <form id={`formUpload-${item.name}`} action="">
                                    <input id={`fileUpload-${item.name}`} type="file" className="fileUpload" hidden
                                        onChange={() => setRerender(!rerender)}
                                    />
                                </form>

                                <label
                                    htmlFor={`fileUpload-${item.name}`}
                                    className={`btn btn-outline-secondary btn-sm border border-2 border-success p-1 w-100`}
                                >{$(`#fileUpload-${item.name}`)?.files[0]?.name ?? 'Upload'} <FcUpload size={24} />
                                </label>

                                <button className="btn btn-secondary btn-sm"
                                    onClick={() => handleView(item.name)}
                                >View</button>
                            </div>
                        )
                    })}

                    <button className="btn btn-primary btn-sm float-end mb-3 me-5 px-3"
                        onClick={() => handleUpload()}
                        disabled={isDisabled}
                    >Send Upload</button>
                </div>

                <div className="col-7">
                    <h5 className="text-center my-3">List {typeTable.toLowerCase()}s</h5>
                    <Table bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                {typeTable === 'MAJOR' &&
                                    <th>Department</th>
                                }
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listTypesTable.length > 0 && listTypesTable.map((item, index) => {
                                return (
                                    <tr key={`typeTable-${index}`}>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        {typeTable === 'MAJOR' &&
                                            <td>{item.Department?.description ?? ''}</td>
                                        }
                                        <td>
                                            <MdDelete className="icon" color='red' size={24}
                                                onClick={() => handleDelete(item.id)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default IndexDepartments;