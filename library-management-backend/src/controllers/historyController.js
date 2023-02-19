import historyServices from "../services/history/historyServices";
import apiUtils from '../utils/apiUtils';

const getHistories = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;
            let data = await historyServices.getHistoriesWithPagination(page, limit, +req.query?.delay);
            if (data.EC === 0 || data.EC === 1)
                return apiUtils.resStatusJson(res, 200, data);

            return apiUtils.resStatusJson(res, 500, data);
        } else {
            let data = await historyServices.getAllHistories();
            if (data.EC === 0 || data.EC === 1)
                return apiUtils.resStatusJson(res, 200, data);

            return apiUtils.resStatusJson(res, 500, data);
        }
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const upsertHistory = async (req, res) => {
    try {
        // Vì đã gán user khi checkJWT nên có thể sử dụng
        req.body.studentId = req.user?.id;
        let data = await historyServices.upsertHistory(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const deleteMultiplesHistory = async (req, res) => {
    try {
        let data = await historyServices.deleteMultiplesHistory(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const updateTimeApprove = async (req, res) => {
    try {
        let data = await historyServices.updateTimeApprove(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}


export default {
    getHistories, upsertHistory, deleteMultiplesHistory,
    updateTimeApprove
}