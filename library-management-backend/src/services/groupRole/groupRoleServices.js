import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";


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
                }
            ],
            limit: limit,
            offset: offset,
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

const upsertGroupRole = async (groupRole) => {
    try {

        // Insert into Group_Role
        if (groupRole.isGroup === undefined) {
            await db.Group_Role.destroy({
                where: {
                    groupId: groupRole.groupId
                }
            })

            await db.Group_Role.bulkCreate(groupRole.listGroupRoles);

            return apiUtils.resFormat(0, `Create Group_Role successful !`);
        }

        let groupOrRole = groupRole.isGroup ? 'Group' : 'Role';
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
        if (groupRole.isGroup === undefined) {
            await db.Role.destroy({
                where: {
                    id: groupRole.id
                }
            })
        }

        let groupOrRole = groupRole.isGroup ? 'groupId' : 'roleId';

        await db.Group_Role.destroy({
            where: {
                [Op.and]: [
                    { [groupOrRole]: groupRole.id },
                    { groupId: groupRole.groupRoleId ?? '' },
                ]
            }
        })

        if (groupRole.isGroup) {
            await db.Group.destroy({
                where: {
                    id: groupRole.id
                }
            })
        }

        return apiUtils.resFormat(0, `Delete a ${groupOrRole} successful !`);
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
                    attributes: ['url'],
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




export default {
    getRoleByGroupId, getAllGroupRoles, upsertGroupRole, deleteAGroupRole,
    getGroupRolesWithPagination, getAllRoles
}