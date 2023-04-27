import db from "../../models";
import apiUtils from '../../utils/apiUtils';
import passwordUtils from "../../utils/passwordUtils";
import { Op } from "sequelize";
import dotenv from 'dotenv';
import { logData } from "../../utils/myUtils";
dotenv.config();

const getAllStudents = async (condition) => {
    try {
        let dataStudents = await db.Student.findAll({
            where: { ...condition },
            attributes: [
                'id', 'fullName', 'email',
                'password', 'classRoom', 'isDeleted'
            ],
            include: [
                {
                    model: db.Book,
                    attributes: ['id', 'name', 'price'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: db.Status,
                            attributes: ['id', 'name'],
                        },
                    ]
                }
            ],
            raw: true,
            nest: true
        })


        // Merge key which object similar
        let data = [];
        dataStudents.forEach(student => {
            student = { ...student, Books: [student.Books] }

            let match = data.find(r => r.id === student.id);
            if (match) {
                match.Books = match.Books.concat(student.Books);
            } else {
                data.push(student);
            }
        });

        return apiUtils.resFormat(0, "Get all students successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStudentByEmail = async (email) => {
    try {
        let data = await db.Student.findOne({
            where: {
                [Op.and]: [
                    { isDeleted: 0 },
                    { email },
                ]
            },
            attributes: ['id', 'fullName', 'email', 'password', 'groupId'],
            raw: true,
            nest: true
        })

        if (data)
            return apiUtils.resFormat(0, "Get student by email successful !", data);

        return apiUtils.resFormat(1, "Not found student by email !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStudentsWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Student.findAndCountAll({
            attributes: [
                'id', 'fullName', 'email',
                'password', 'classRoom', 'isDeleted'
            ],
            include: [
                {
                    model: db.Book,
                    attributes: ['id', 'name', 'price'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: db.Status,
                            attributes: ['id', 'name'],
                        },
                    ]
                },
            ],

            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let result = [];
        rows.forEach(student => {
            student = { ...student, Books: [student.Books] }

            let match = result.find(r => r.id === student.id);
            if (match) {
                match.Books = match.Books.concat(student.Books);
                count--;
            } else {
                result.push(student);
            }
        });

        rows = result;

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            students: rows
        }

        if (time)
            await apiUtils.delay(time);

        return apiUtils.resFormat(0, "Get students with pagination successful !", data);

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const upsertStudent = async (student) => {
    try {
        if (!student.id) {
            const hashPassword = passwordUtils.hashPassword(student.password);
            await db.Student.create({
                ...student,
                password: hashPassword,
                isDeleted: 0,
                groupId: '2'
            })
        } else {
            await db.Student.update({
                ...student,
            }, {
                where: { id: student.id }
            })
        }

        return apiUtils.resFormat(0, `${student.id ? 'Update a' : 'Create a new'} student successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

const deleteAStudent = async (id) => {
    try {
        await db.Student.destroy({
            where: {
                ...id
            }
        })

        return apiUtils.resFormat(0, "Delete a student successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getStudentsBy = async (condition) => {
    try {
        let data = await db.Student.findAll({
            where: { ...condition },
            attributes: [
                'id', 'fullName', 'email', 'classRoom', 'groupId', 'isDeleted'
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, `Find student by ${Object.keys(condition)} successful !`, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

export default {
    getAllStudents, upsertStudent, deleteAStudent,
    getStudentsWithPagination, getStudentByEmail, getStudentsBy

}