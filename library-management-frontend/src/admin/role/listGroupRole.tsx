import { GroupRole } from "../../types/types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import { formatToTableAndMethodUser } from "../../utils/myUtils";

export default function ListGroupRole({
    listGroupRole,
    handleEdit,
    handleDelete,
}: {
    listGroupRole: GroupRole[];
    handleEdit: Function;
    handleDelete: Function;
}) {
    return (
        <>
            <h3 className="text-center mb-3">List group role</h3>
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>Group Name</th>
                        <th>User</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody>
                    {listGroupRole.length > 0 &&
                        listGroupRole.map((groupRole, index) => {
                            return (
                                <tr key={`groupRole-${index}`}>
                                    <td>
                                        {groupRole.name}
                                        <span className="float-end d-flex">
                                            <IconButton
                                                onClick={() =>
                                                    handleEdit(
                                                        "GROUP",
                                                        groupRole,
                                                    )
                                                }
                                            >
                                                <EditIcon color="warning" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleDelete(
                                                        "GROUP",
                                                        groupRole.id,
                                                    )
                                                }
                                            >
                                                <DeleteForeverIcon color="error" />
                                            </IconButton>
                                        </span>
                                    </td>
                                    <td>
                                        {groupRole.Users.length > 0 &&
                                            groupRole.Users.map(
                                                (user, indexUser) => {
                                                    return (
                                                        user.fullName && (
                                                            <p
                                                                key={`user-${indexUser}`}
                                                                className=""
                                                                style={{
                                                                    minWidth:
                                                                        "2.25em",
                                                                }}
                                                            >
                                                                {user.fullName}
                                                            </p>
                                                        )
                                                    );
                                                },
                                            )}
                                    </td>
                                    <td>
                                        {groupRole.Roles.length > 0 &&
                                            groupRole.Roles.map(
                                                (role, indexRole) => {
                                                    return (
                                                        role.url && (
                                                            <p
                                                                key={`role-${indexRole}`}
                                                                className=""
                                                                style={{
                                                                    minWidth:
                                                                        "2.25em",
                                                                }}
                                                            >
                                                                {
                                                                    formatToTableAndMethodUser(
                                                                        role.url,
                                                                    )
                                                                        .tableMethod
                                                                }
                                                                <span className=" float-end d-flex">
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                "ROLE",
                                                                                role,
                                                                            )
                                                                        }
                                                                    >
                                                                        <EditIcon color="warning" />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                "ROLE",
                                                                                role.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <DeleteForeverIcon color="error" />
                                                                    </IconButton>
                                                                </span>
                                                            </p>
                                                        )
                                                    );
                                                },
                                            )}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </>
    );
}
