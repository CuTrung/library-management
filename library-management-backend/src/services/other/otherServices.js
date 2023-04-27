import apiUtils from "../../utils/apiUtils";

const getAllTableNames = async () => {
    try {
        const data = ['BOOKS', 'CATEGORIES', 'DEPARTMENTS', 'HISTORIES', 'MAJORS', 'STATUS', 'STUDENTS'];

        return apiUtils.resFormat(0, "Get all status successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

export default {
    getAllTableNames
}