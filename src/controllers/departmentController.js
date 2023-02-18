import departmentServices from "../services/department/departmentServices";
import apiUtils from "../utils/apiUtils";


const getDepartments = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;
            let data = await departmentServices.getDepartmentsWithPagination(page, limit, +req.query?.delay);
            if (data.EC === 0 || data.EC === 1) {
                return apiUtils.resStatusJson(res, 200, data);
            }

            return apiUtils.resStatusJson(res, 500, data);
        } else {
            let data = await departmentServices.getAllDepartments();
            if (data.EC === 0 || data.EC === 1) {
                return apiUtils.resStatusJson(res, 200, data);
            }

            return apiUtils.resStatusJson(res, 500, data);
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }


}


const deleteADepartment = async (req, res) => {
    try {
        let data = await departmentServices.deleteADepartment(req.body);

        if (data.EC === 0 || data.EC === 1) {
            return apiUtils.resStatusJson(res, 200, data);
        }

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }
}

const createManyDepartments = async (req, res) => {
    try {
        let data = await departmentServices.createManyDepartments(req.body)
        if (data.EC === 0 || data.EC === 1) {
            return apiUtils.resStatusJson(res, 200, data);
        }

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }
}



export default {
    getDepartments, deleteADepartment,
    createManyDepartments
}