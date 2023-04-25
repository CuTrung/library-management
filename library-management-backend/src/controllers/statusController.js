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

const createANewStatus = async (req, res) => {
    try {
        let isExistEmail = await statusServices.getStatusByEmail(req.body.email);
        if (isExistEmail.DT) {
            return apiUtils.resStatusJson(res, 200, apiUtils.resFormat(1, "Email is exist, can't create"));
        }
        let data = await statusServices.createANewStatus(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const deleteAStatus = async (req, res) => {
    try {
        let data = await statusServices.deleteAStatus(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const upsertStatus = async (req, res) => {
    try {
        let data = await statusServices.upsertStatus(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const updateAStatus = async (req, res) => {
    try {
        let isExistStatus = await statusServices.getStatusBy({ name: req.body.name });
        if (isExistStatus.DT) {
            return resStatusJson(res, 200, apiUtils.resFormat(1, "Status is exist, can't update"))
        }

        let data = await statusServices.updateAStatus(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}


export default {
    getStatus, createANewStatus, deleteAStatus, updateAStatus, upsertStatus
}