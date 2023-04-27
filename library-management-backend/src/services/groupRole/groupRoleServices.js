import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";
import studentServices from "../student/studentServices";
import _ from "lodash";


const getAllRoles = async () => {
    try {
        let data = await db.Role.findAll({
            attributes: [
                'id', 'url'
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, "Get all roles successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getAllGroupRoles = async () => {
    try {
        let dataGroups = await db.Group.findAll({
            attributes: [
                'id', 'name'
            ],
            include: [
                {
                    model: db.Role,
                    through: { attributes: [] },
                    attributes: ['id', 'url']
                }
            ],
            order: [['id', 'DESC']],
            raw: true,
            nest: true
        })

        // Merge key which object similar
        let data = [];
        dataGroups.forEach(group => {
            group = { ...group, Roles: [group.Roles] }

            let match = data.find(r => r.id === group.id);
            if (match) {
                match.Roles = match.Roles.concat(group.Roles);
            } else {
                data.push(group);
            }
        });

        data = await Promise.all(data.map(async (groupRole) => {
            const dataStudent = await studentServices.getStudentsBy({ groupId: groupRole.id });

            return {
                ...groupRole,
                Users: dataStudent.DT.map(item => ({
                    id: item.id,
                    fullName: item.fullName
                }))
            }
        }))


        return apiUtils.resFormat(0, "Get all roles successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getGroupRolesWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Group.findAndCountAll({
            attributes: [
                'id', 'name'
            ],
            include: [
                {
                    model: db.Role,
                    through: { attributes: [] },
                    attributes: ['id', 'url']
                },
            ],
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']],
            raw: true,
            nest: true
        })

        // Merge key which object similar
        let result = [];
        rows.forEach(group => {
            group = { ...group, Roles: [group.Roles] }

            let match = result.find(r => r.id === group.id);
            if (match) {
                match.Roles = match.Roles.concat(group.Roles);
                count--;
            } else {
                result.push(group);
            }
        });

        result = await Promise.all(result.map(async (groupRole) => {
            const dataStudent = await studentServices.getStudentsBy({ groupId: groupRole.id });

            return {
                ...groupRole,
                Users: dataStudent.DT.map(item => ({
                    id: item.id,
                    fullName: item.fullName
                }))
            }
        }))

        rows = result;

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            groupRoles: rows
        }

        if (time)
            await apiUtils.delay(time);

        return apiUtils.resFormat(0, "Get roles with pagination successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getGroupsBy = async (condition) => {
    try {
        let data = await db.Group.findAll({
            where: { ...condition },
            attributes: [
                'id', 'name'
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, `Find group by ${Object.keys(condition)} successful !`, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getRolesBy = async (condition) => {
    try {
        let data = await db.Role.findAll({
            where: { ...condition },
            attributes: [
                'id', 'url'
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, `Find role by ${Object.keys(condition)} successful !`, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const upsertGroupRole = async (groupRole) => {
    try {

        const { listGroupRole } = groupRole;
        if (listGroupRole) return await createGroup_Role(listGroupRole);

        // Insert into Group_Role
        if (Array.isArray(groupRole)) {
            let messageError = '';
            let groupRoleIds = [];
            for await (const item of groupRole) {
                let dataGroup = await getGroupsBy(
                    { name: item['Tên nhóm'].toUpperCase() }
                );
                if (!_.isEmpty(dataGroup.DT)) {
                    messageError = `'Tên nhóm' - row ${item.rowNum + 1} is existed`;
                    break;
                }

                let dataRole = await getRolesBy(
                    { url: item['Đường dẫn'] }
                );
                if (!_.isEmpty(dataRole.DT)) {
                    messageError = `'Đường dẫn' - row ${item.rowNum + 1} is existed`;
                    break;
                }

                let groupCreated = await db.Group.create({
                    name: item['Tên nhóm'],
                })

                let roleCreated = await db.Role.create({
                    url: item['Đường dẫn'],
                })

                let groupCreatedId = groupCreated.get({ plain: true }).id
                let roleCreatedId = roleCreated.get({ plain: true }).id
                await db.Group_Role.create({
                    groupId: groupCreatedId,
                    roleId: roleCreatedId,
                })

                groupRoleIds.push({
                    groupId: groupCreatedId,
                    roleId: roleCreatedId
                });
            }

            if (messageError) {
                await db.Group_Role.destroy({
                    where: {
                        [Op.in]: groupRoleIds
                    }
                })

                await db.Group.destroy({
                    where: {
                        id: groupRoleIds.map(item => item.groupId)
                    }
                })

                await db.Role.destroy({
                    where: {
                        id: groupRoleIds.map(item => item.roleId)
                    }
                })

                return apiUtils.resFormat(1, `Create multiples group role failed ! Something wrongs at col ${messageError}`);
            }

            return apiUtils.resFormat(0, `Create multiples group role successful !`);
        }

        let groupOrRole = groupRole.name ? 'Group' : 'Role';
        if (!groupRole.id)
            await db[groupOrRole].create({
                ...groupRole
            })
        else
            await db[groupOrRole].update({
                ...groupRole,
            }, {
                where: { id: groupRole.id }
            })

        return apiUtils.resFormat(0, `${groupRole.id ? 'Update a' : 'Create a new'} groupRole successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

const deleteAGroupRole = async (groupRole) => {
    try {
        const isGroup = groupRole.isGroup ? 'Group' : 'Role';

        await db.Group_Role.destroy({
            where: {
                [`${isGroup.toLowerCase()}Id`]: groupRole.id
            }
        })

        await db[isGroup].destroy({
            where: {
                id: groupRole.id
            }
        })

        return apiUtils.resFormat(0, `Delete a ${isGroup} successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getRoleByGroupId = async (groupId) => {
    try {
        let groupWithRoles = await db.Group.findAll({
            where: { id: groupId },
            include: [
                {
                    model: db.Role,
                    attributes: ['id', 'url'],
                    through: { attributes: [] },
                }
            ],
            attributes: ['name'],
            raw: true,
            nest: true,
        })

        let urls = groupWithRoles.map((item) => {
            return item.Roles.url;
        })

        let data = {
            role: groupWithRoles[0].name,
            urls
        }


        return apiUtils.resFormat(0, "Get roles by groupId successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}



const createGroup_Role = async (listGroupRole) => {
    try {
        // Xóa toàn bộ role cũ
        const roleData = await getRolesBy({
            url: { [Op.like]: `%${listGroupRole[0].url.split("/")[1]}%` }
        });
        const roleIds = roleData.DT.map(item => item.id);

        if (roleIds.length > 0) {
            await db.Group_Role.destroy({
                where: { roleId: roleIds }
            })
        }

        for await (const groupRole of listGroupRole) {
            const dataRole = await getRolesBy({ url: groupRole.url });
            let roleCreated;
            if (dataRole.DT.length === 0) {
                roleCreated = await db.Role.create({
                    url: groupRole.url
                })
            }

            await db.Group_Role.create({
                groupId: groupRole.groupId,
                roleId: roleCreated ? roleCreated.get({ plain: true }).id : dataRole.DT[0].id
            })

        }

        return apiUtils.resFormat(0, "Create Group_Role successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateGroupStudent = async (groupStudent) => {
    try {
        const { userIds, groupId } = groupStudent;

        // const dataStudent = await studentServices.getStudentsBy({ groupId });
        // if (dataStudent.DT.length > 0) {
        //     for await (const student of dataStudent.DT) {
        //         await studentServices.upsertStudent({ id: student.id, groupId: null });
        //     }
        // }

        for await (const studentId of userIds) {
            await studentServices.upsertStudent({ id: studentId, groupId });
        }

        return apiUtils.resFormat(0, `Update group student successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getRoleByGroupId, getAllGroupRoles, upsertGroupRole, deleteAGroupRole,
    getGroupRolesWithPagination, getAllRoles, updateGroupStudent
}