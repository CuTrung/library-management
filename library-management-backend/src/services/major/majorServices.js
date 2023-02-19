import db from "../../models";
import apiUtils from "../../utils/apiUtils";
import { Op } from "sequelize";
import departmentServices from "../department/departmentServices";
import { upperCaseFirstChar } from "../../utils/myUtils";
import _ from "lodash";

const getAllMajors = async () => {
    try {
        let data = await db.Major.findAll({
            where: { isClosed: 0 },
            attributes: ['id', 'name', 'description'],
            include: [
                {
                    model: db.Department,
                    attributes: ['description']
                }
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, "Get all Major successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getMajorsBy = async (condition) => {
    try {
        let data = await db.Major.findAll({
            where: {
                [Op.and]: [
                    { isClosed: 0 },
                    { ...condition },
                ],
            },
            attributes: ['id', 'name', 'description'],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, `Get Major by ${Object.keys(condition)} successful !`, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getMajorsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Major.findAndCountAll({
            // where: { isClosed: 0 },
            attributes: ['id', 'name', 'description', 'isClosed'],
            include: [
                {
                    model: db.Department,
                    attributes: ['id', 'description'],
                }
            ],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            majors: rows
        }

        if (time)
            await apiUtils.delay(time);

        if (rows.length > 0)
            return apiUtils.resFormat(0, "Get majors with pagination successful !", data);

        return apiUtils.resFormat(1, "Get majors with pagination failed !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createManyMajors = async (listMajors) => {
    try {
        let messageError = '';
        let dataListMajors = [];
        for await (const major of listMajors) {
            let dataDepartment = await departmentServices.getDepartmentBy('description', upperCaseFirstChar(major['Khoa']));
            if (_.isEmpty(dataDepartment.DT)) {
                messageError = `'Khoa' - row ${major.rowNum + 1}`;
                break;
            }

            dataListMajors.push({
                name: major['Tên'],
                description: major['Mô tả'],
                departmentId: dataDepartment.DT.id,
                isClosed: 0
            })
        }

        if (messageError)
            return apiUtils.resFormat(1, `Create multiples majors failed ! Something wrongs at col ${messageError}`);

        let majors = await db.Major.bulkCreate(dataListMajors);
        return apiUtils.resFormat(0, `Create ${majors.length} majors successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const deleteAMajor = async (major) => {
    try {
        if (major.isClosed) {
            await db.Major.update({ isClosed: +major.isClosed }, {
                where: {
                    id: major.id
                }
            })

            return apiUtils.resFormat(0, `${+major.isClosed === 0 ? 'Open' : 'Close'} a major successful !`);
        }

        // Delete khỏi database
        await db.Major.destroy({
            where: {
                id: major.id
            }
        })



        return apiUtils.resFormat(0, "Delete a major successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getAllMajors,
    getMajorsWithPagination,
    deleteAMajor, createManyMajors, getMajorsBy
}