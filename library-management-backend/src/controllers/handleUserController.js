import handleUserServices from "../services/both/handleUserServices";
import apiUtils from "../utils/apiUtils";


const login = async (req, res) => {
    try {
        let data = await handleUserServices.login(req.body);
        // set cookie
        res.cookie("jwt", data.DT.access_token, { httpOnly: true });

        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const register = async (req, res) => {
    try {
        let data = await handleUserServices.register(req.body);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const logout = async (req, res) => {
    try {
        let data = await handleUserServices.logout(req, res);
        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}

const forget = async (req, res) => {
    try {
        let data = await handleUserServices.forget(req.body);


        if (data.EC === 0 || data.EC === 1)
            return apiUtils.resStatusJson(res, 200, data);

        return apiUtils.resStatusJson(res, 500, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resStatusJson(res, 500, apiUtils.resFormat());
    }
}


export default {
    login, register, logout, forget
}