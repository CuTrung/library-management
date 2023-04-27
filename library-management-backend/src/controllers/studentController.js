import { Op } from "sequelize";
import studentServices from "../services/student/studentServices";
import apiUtils from '../utils/apiUtils';

const getStudents = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;
            let data = await studentServices.getStudentsWithPagination(page, limit, +req.query?.delay);
            if (data.EC === 0 || data.EC === 1)
                return apiUtils.resStatusJson(res, 200, data);

            return apiUtils.resStatusJson(res, 500, data);
        } else {
            let data = await studentServices.getAllStudents({
                email: {
                    [Op.notLike]: process.env.EMAIL_ADMIN
                }
            });
            if (data.EC === 0 || data.EC === 1)
                return apiUtils.resStatusJson(res, 200, data);

            return apiUtils.resStatusJson(res, 500, data);
        }
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }


}

const upsertStudent = async (req, res) => {
    try {
        let data = await studentServices.upsertStudent(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const deleteAStudent = async (req, res) => {
    try {
        let data = await studentServices.deleteAStudent(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}


export default {
    getStudents, upsertStudent, deleteAStudent
}