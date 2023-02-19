import apiUtils from "../../utils/apiUtils";
import studentServices from "../student/studentServices";
import groupRoleServices from "../groupRole/groupRoleServices";
import passwordUtils from "../../utils/passwordUtils";
import jwtUtils from "../../utils/jwtUtils";
import { sendEmail } from "../../utils/myUtils";

const login = async (user) => {
    try {

        let isExistStudent = await studentServices.getStudentByEmail(user.email);
        if (isExistStudent.DT) {
            let student = isExistStudent.DT;

            let isCorrectPassword = passwordUtils.checkHashPassword(user.password, student.password.split(process.env.SECRET_KEY)[0])
            if (isCorrectPassword) {
                let dataRoles = await groupRoleServices.getRoleByGroupId(student.groupId);

                // token
                let token = jwtUtils.createToken({
                    ...dataRoles.DT,
                    id: student.id,
                    email: student.email
                }, process.env.TOKEN_EXPIRES_IN);

                let data = {
                    fullName: student.fullName,
                    email: student.email,
                    access_token: token
                }

                return apiUtils.resFormat(0, "Login successful !", data);
            }
        }


        return apiUtils.resFormat(1, "Login failed ! Try again");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const register = async (user) => {
    try {
        let isExistStudent = await studentServices.getStudentByEmail(user.email);

        if (isExistStudent.EC === 0) {
            return apiUtils.resFormat(1, "Account existed ! Try again");
        }

        let data = await studentServices.upsertStudent(user);

        if (data.EC === 0) {
            return apiUtils.resFormat(0, "Register successful !", data);
        }

        return apiUtils.resFormat(0, "Register failed ! Try again");

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const logout = async (req, res) => {
    try {
        if (req.cookies?.jwt) {
            res.clearCookie("jwt");
        }

        return apiUtils.resFormat(0, "Logout success!");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const forget = async (user) => {
    try {

        let isExistStudent = await studentServices.getStudentByEmail(user.email);

        if (isExistStudent.DT) {
            let student = isExistStudent.DT;

            const passwordRandom = require('crypto').randomUUID();
            let html = `<h1>New password => <strong style="border: 1px solid green; width: fit-content; padding: 5px;">${passwordRandom}</strong></h1>`;

            let dataStudentUpdate = await studentServices.upsertStudent({ id: student.id, password: passwordUtils.hashPassword(passwordRandom) })

            if (dataStudentUpdate.EC === 0) {
                sendEmail(`${student.email}`, 'Confirm Password', 'Reset your password', html);

                return apiUtils.resFormat(0, "Reset password successful! Check your email now !");
            }

            return apiUtils.resFormat(1, "Reset password failed! Try again !");
        }

        return apiUtils.resFormat(1, "Account not existed!");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    login, register, logout, forget
}