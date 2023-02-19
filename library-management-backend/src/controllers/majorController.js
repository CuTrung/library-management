import majorServices from "../services/major/majorServices";
import apiUtils from "../utils/apiUtils";


const getMajors = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;
            let data = await majorServices.getMajorsWithPagination(page, limit, +req.query?.delay);
            if (data.EC === 0 || data.EC === 1) {
                return apiUtils.resStatusJson(res, 200, data);
            }
        } else {
            let departmentId = req.query.departmentId;
            let data = await (departmentId ? majorServices.getMajorsBy({ departmentId }) : majorServices.getAllMajors());
            if (data.EC === 0 || data.EC === 1) {
                return apiUtils.resStatusJson(res, 200, data);
            }
        }

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }
}

const createManyMajors = async (req, res) => {
    try {
        let data = await majorServices.createManyMajors(req.body)
        if (data.EC === 0 || data.EC === 1) {
            return apiUtils.resStatusJson(res, 200, data);
        }

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return res.status(500).json(apiUtils.resFormat());
    }
}

const deleteAMajor = async (req, res) => {
    try {
        let data = await majorServices.deleteAMajor(req.body);
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
    getMajors, deleteAMajor, createManyMajors
}