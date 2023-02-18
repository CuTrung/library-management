import statusServices from "../services/status/statusServices";
import apiUtils from '../utils/apiUtils';

const getStatus = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;
            let data = await statusServices.getStatusWithPagination(page, limit, +req.query?.delay);
            if (data.EC === 0 || data.EC === 1)
                return apiUtils.resStatusJson(res, 200, data);

            return apiUtils.resStatusJson(res, 500, data);
        } else {
            let data = await statusServices.getAllStatus();
            if (data.EC === 0 || data.EC === 1)
                return apiUtils.resStatusJson(res, 200, data);

            return apiUtils.resStatusJson(res, 500, data);
        }
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const createANewBook = async (req, res) => {
    try {
        let isExistEmail = await statusServices.getBookByEmail(req.body.email);
        if (isExistEmail.DT) {
            return apiUtils.resStatusJson(res, 200, apiUtils.resFormat(1, "Email is exist, can't create"));
        }
        let data = await statusServices.createANewBook(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const deleteABook = async (req, res) => {
    try {
        let data = await statusServices.deleteABook(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const updateABook = async (req, res) => {
    try {
        let isExistEmail = await statusServices.getBookByEmail(req.body.email);
        if (isExistEmail.DT) {
            return resStatusJson(res, 200, apiUtils.resFormat(1, "Email is exist, can't update"))
        }

        let data = await statusServices.updateABook(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}


export default {
    getStatus, createANewBook, deleteABook, updateABook
}