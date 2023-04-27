import otherServices from "../services/other/otherServices";
import apiUtils from "../utils/apiUtils";

const getAllTableNames = async (req, res) => {
    try {
        const data = await otherServices.getAllTableNames();
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

export default {
    getAllTableNames
}