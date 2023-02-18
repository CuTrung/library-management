import db from "../../models";
import apiUtils from '../../utils/apiUtils';
import passwordUtils from "../../utils/passwordUtils";
import { Op } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const getAllStatus = async () => {
    try {
        let data = await db.Status.findAll({
            attributes: [
                'id', 'name'
            ],
            raw: true,
            nest: true
        })


        return apiUtils.resFormat(0, "Get all status successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStatusWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Status.findAndCountAll({
            attributes: [
                'id', 'name', 'description', 'price',
                'borrowed', 'quantity',
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
            status: rows
        }

        if (time)
            await apiUtils.delay(time);

        return apiUtils.resFormat(0, "Get status with pagination successful !", data);

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const createANewStatus = async (status) => {
    try {
        const hashPassword = passwordUtils.hashPassword(status.password);
        await db.Status.create({
            fullName: status.fullName,
            email: status.email,
            password: hashPassword,
            majorId: status.majorId,
            schoolYearId: status.schoolYearId,
            isDeleted: 0,
            groupId: '3'
        })

        return apiUtils.resFormat(0, "Create a new status successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

const deleteAStatus = async (status) => {
    try {
        if (status.isDeleted) {
            await db.Status.update({ isDeleted: +status.isDeleted }, {
                where: {
                    email: status.email
                }
            })

            return apiUtils.resFormat(0, `${+status.isDeleted === 0 ? 'Active' : 'Inactive'} a status successful !`);
        }

        // Delete khỏi database
        await db.Status.destroy({
            where: {
                email: status.email
            }
        })

        return apiUtils.resFormat(0, "Delete a status successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateAStatus = async (statusUpdate) => {
    try {
        const hashPassword = passwordUtils.hashPassword(statusUpdate.password);
        await db.Status.update({
            fullName: statusUpdate.fullName,
            email: statusUpdate.email,
            password: hashPassword,
            majorId: statusUpdate.majorId,
            schoolYearId: statusUpdate.schoolYearId,
        }, {
            where: {
                email: statusUpdate.emailUpdate
            }
        })

        return apiUtils.resFormat(0, "Update a status successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStatusBy = async (condition) => {
    try {
        let data = await db.Status.findAll({
            where: { ...condition },
            attributes: [
                'id', 'name'
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, `Find status by ${Object.keys(condition)} successful !`, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}






export default {
    getAllStatus, createANewStatus, deleteAStatus, updateAStatus,
    getStatusWithPagination, getStatusBy

}