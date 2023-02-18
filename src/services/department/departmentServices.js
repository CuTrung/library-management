import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";

const getAllDepartments = async () => {
    try {
        let data = await db.Department.findAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'name', 'description', 'isClosed'],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, "Get all departments successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getDepartmentsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Department.findAndCountAll({
            attributes: ['id', 'name', 'description', 'isClosed'],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            departments: rows
        }

        if (time)
            await apiUtils.delay(time);

        return apiUtils.resFormat(0, "Get departments with pagination successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteADepartment = async (department) => {
    try {
        if (department.isClosed) {
            await db.Department.update({ isClosed: +department.isClosed }, {
                where: {
                    id: department.id
                }
            })

            return apiUtils.resFormat(0, `${+department.isClosed === 0 ? 'Open' : 'Close'} a department successful !`);
        }

        // Delete khỏi database
        await db.Major.destroy({
            where: {
                departmentId: department.id
            }
        })

        await db.Department.destroy({
            where: {
                id: department.id
            }
        })



        return apiUtils.resFormat(0, "Delete a department successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createManyDepartments = async (listDepartments) => {
    try {
        listDepartments = listDepartments.map(department => {
            return {
                name: department['Tên'],
                description: department['Mô tả'],
                isClosed: 0
            }
        })
        let departments = await db.Department.bulkCreate(listDepartments);
        return apiUtils.resFormat(0, `Create ${departments.length} departments successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getDepartmentBy = async (column, value) => {
    try {
        let data = await db.Department.findOne({
            where: { [column]: value },
            attributes: [
                'id', 'description'
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, `Find department by ${column} successful !`, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

export default {
    getAllDepartments, getDepartmentsWithPagination,
    deleteADepartment, createManyDepartments, getDepartmentBy
}