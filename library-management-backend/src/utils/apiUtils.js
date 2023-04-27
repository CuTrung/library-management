const resFormat = (errorCode = -1, errorMessage, data = '') => {
    return {
        EC: errorCode,
        EM: errorMessage ?? 'Something wrongs on server...',
        DT: data
    }
}

const resStatusJson = (res, numberCode, data) => {
    return res.status(numberCode).json({
        EC: data.EC,
        EM: data.EM,
        DT: data.DT
    });
}

const delay = async (time = 500) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })

}

const convertPathAPI = (pathAPI, method, removeAllAfterSlashIndex) => {
    const newPath = removeAllAfterSlashIndex ? pathAPI.split('/').splice(2).splice(0, removeAllAfterSlashIndex - 1) : pathAPI.split('/').splice(2).splice(0);

    switch (method) {
        case 'GET':
            method = 'read';
            break;
        case 'POST':
            method = 'create';
            break;
        case 'PATCH':
            method = 'update';
            break;
        case 'DELETE':
            method = 'delete';
            break;
        default:
            break;
    }

    if (method)
        return `/${newPath.join("/")}/${method}`;
    return `/${newPath.join("")}`;
}


export default {
    resFormat, delay, convertPathAPI, resStatusJson
}