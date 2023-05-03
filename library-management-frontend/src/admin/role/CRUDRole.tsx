import FormRole from "./formRole";
import ListItem from "../../components/listItem";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { fetchData } from "../../utils/myUtils";
import {
    Role,
    HTTPMethods,
    ResAxios,
    Group,
    GroupRole,
} from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import MyPagination from "../../components/pagination";
import useToggle from "../../hooks/useToggle";
import { getGroupRoles } from "../../redux/features/groupRole/groupRoleSlice";
import ListGroupRole from "./listGroupRole";
import { toast } from "react-toastify";

export default function CRUDRole() {
    const [isGroup, setIsGroup] = useState(false);
    const { values, totalPages, currentPage } = useAppSelector(
        (state) => state.groupRole,
    );

    const [roleOrGroupUpdate, setRoleOrGroupUpdate] = useState<Role | Group>();

    const dispatch = useAppDispatch();

    const getListRoleOrGroup = async (page: number) => {
        await dispatch(getGroupRoles({ page }));
    };

    const handleDelete = async (type: string, id: number) => {
        const data = (await fetchData(HTTPMethods.DELETE, `/group-roles`, {
            id,
            isGroup: type === "GROUP" ? true : false,
        })) as ResAxios;

        if (data.EC === 0) {
            getListRoleOrGroup(currentPage[0] as number);
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    };

    const handleEdit = async (type: string, dataEdit: Group | Role) => {
        setIsGroup(type === "GROUP" ? true : false);
        setRoleOrGroupUpdate(dataEdit);
    };

    return (
        <>
            <FormRole
                setRoleOrGroupUpdate={setRoleOrGroupUpdate}
                roleOrGroupUpdate={roleOrGroupUpdate}
                isGroup={isGroup as boolean}
                setIsGroup={setIsGroup}
            />

            <ListGroupRole
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                listGroupRole={values as GroupRole[]}
            />

            <MyPagination
                currentPage={currentPage[0] as number}
                totalPages={totalPages[0] as number}
                cb={getListRoleOrGroup}
                classCss="mb-3"
            />
        </>
    );
}
