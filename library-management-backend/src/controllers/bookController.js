import bookServices from "../services/book/bookServices";
import historyServices from "../services/history/historyServices";
import apiUtils from '../utils/apiUtils';
import { conditionForSequelize } from "../utils/myUtils";

const getBooks = async (req, res) => {
    try {
        if (req.query && req.query.page) {
            let page = +req.query.page;
            let limit = +req.query.limit;

            let data = await bookServices.getBooksWithPagination(page, limit, +req.query?.delay, req.query);
            if (data.EC === 0 || data.EC === 1)
                return apiUtils.resStatusJson(res, 200, data);

            return apiUtils.resStatusJson(res, 500, data);
        } else {
            let data = await bookServices.getAllBooks(req.query);
            if (data.EC === 0 || data.EC === 1)
                return apiUtils.resStatusJson(res, 200, data);

            return apiUtils.resStatusJson(res, 500, data);
        }


    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const upsertBook = async (req, res) => {
    try {
        let data = await bookServices.upsertBook(req.body);
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
        let data = await bookServices.deleteABook(req.body);
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
        let data = await bookServices.updateABook(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

export default {
    getBooks, upsertBook, deleteABook, updateABook,
}