import jwtUtils from "../../utils/jwtUtils";
import apiUtils from "../../utils/apiUtils";
import { TokenExpiredError } from "jsonwebtoken";

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

const nonSecurePaths = ['/login', '/logout', '/forget', '/books', '/categories', '/departments', '/majors', '/register'];
const checkUserJWT = (req, res, next) => {
    const newPathAPI = apiUtils.convertPathAPI(req.path, '', 2);
    if (newPathAPI === '/login' || newPathAPI === '/register' || newPathAPI === '/logout' || newPathAPI === '/forget' || nonSecurePaths.includes(newPathAPI) && req.method === 'GET')
        return next();

    const tokenFromHeader = extractToken(req);
    if (req.cookies && req.cookies.jwt || tokenFromHeader) {
        let token = req.cookies.jwt ? req.cookies.jwt : tokenFromHeader;
        let decoded = jwtUtils.verifyToken(token);
        if (decoded && !(decoded instanceof TokenExpiredError)) {
            req.user = decoded;
            next();
        } else {

            if (decoded instanceof TokenExpiredError) {
                if (req.cookies?.jwt) {
                    res.clearCookie("jwt");
                }
                return apiUtils.resStatusJson(res, 401, apiUtils.resFormat(-999, "Token expired"))
            }

            return apiUtils.resStatusJson(res, 401, apiUtils.resFormat(-1, "Authenticated failed"))
        }
    } else {
        return apiUtils.resStatusJson(res, 401, apiUtils.resFormat(-1, "Authenticated failed"))
    }
}

const checkUserPermission = (req, res, next) => {
    const newPathAPI = apiUtils.convertPathAPI(req.path, '', 2);
    if (newPathAPI === '/login' || newPathAPI === '/register' || newPathAPI === '/logout' || newPathAPI === '/forget' || nonSecurePaths.includes(newPathAPI) && req.method === 'GET')
        return next();

    if (req.user) {
        let urlsAccess = req.user.urls;
        let urlCurrent = apiUtils.convertPathAPI(req.path, req.method);
        if (urlsAccess.some(url => url === urlCurrent) || req.user.email === process.env.EMAIL_ADMIN) {
            next();
        } else {
            return apiUtils.resStatusJson(res, 403, apiUtils.resFormat(-1, "You don't have permission to access this resources"))
        }
    } else {
        return apiUtils.resStatusJson(res, 403, apiUtils.resFormat(-1, "You don't have permission to access this resources"))
    }
}

export default {
    checkUserJWT, checkUserPermission
}