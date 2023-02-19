import db from "../../models";
import apiUtils from '../../utils/apiUtils';
import passwordUtils from "../../utils/passwordUtils";
import jwtUtils from "../../utils/jwtUtils";
import { Op } from "sequelize";
import dotenv from 'dotenv';
import { dateFormat, getCurrentDate, logData } from "../../utils/myUtils";
import categoryServices from "../category/categoryServices";
import _ from 'lodash';
import { decode } from "jsonwebtoken";
import bookServices from "../book/bookServices";
dotenv.config();

const getAllHistories = async () => {
    try {
        let data = await db.History.findAll({
            attributes: [
                'id', 'quantityBorrowed', 'timeStart', 'timeEnd', 'createdAt', 'quantityBookLost'
            ],
            include: [
                {
                    model: db.Book,
                    attributes: ['id', 'name', 'price', 'quantity', 'quantityReality', 'borrowed'],
                },
                {
                    model: db.Student,
                    attributes: ['id', 'fullName', 'email', 'classRoom', 'isDeleted'],
                },
            ],
            raw: true,
            nest: true
        })

        data = await Promise.all(data.map(async (item) => {
            let dataCategories = await categoryServices.getCategoriesByBookId(item.Book.id);

            return {
                ...item,
                Book: {
                    ...item.Book,
                    quantityBorrowed: item.quantityBorrowed,
                    timeBorrowed: dateFormat(item.createdAt),
                    categories: [...dataCategories.DT]
                }
            }
        }))

        return apiUtils.resFormat(0, "Get all histories successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getHistoryByStudentId = async (studentId) => {
    try {
        let data = await db.History.findAll({
            where: {
                [Op.and]: [
                    { studentId },
                    { timeEnd: null },
                ]
            },
            attributes: ['id', 'quantityBorrowed'],
            raw: true,
            nest: true
        })


        return apiUtils.resFormat(0, "Get history by studentId successful !", data);

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getHistoriesWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.History.findAndCountAll({
            attributes: [
                'id', 'quantityBorrowed', 'timeStart', 'timeEnd', 'createdAt', 'quantityBookLost'
            ],
            include: [
                {
                    model: db.Book,
                    attributes: ['id', 'name', 'price', 'quantity', 'quantityReality', 'borrowed'],
                },
                {
                    model: db.Student,
                    attributes: ['id', 'fullName', 'email', 'classRoom', 'isDeleted'],
                },
            ],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })


        rows = await Promise.all(rows.map(async (item) => {
            let dataCategories = await categoryServices.getCategoriesByBookId(item.Book.id);

            return {
                ...item,
                Book: {
                    ...item.Book,
                    quantityBorrowed: item.quantityBorrowed,
                    timeBorrowed: dateFormat(item.createdAt),
                    categories: [...dataCategories.DT]
                }
            }
        }))

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            histories: rows
        }

        if (time)
            await apiUtils.delay(time);

        return apiUtils.resFormat(0, "Get histories with pagination successful !", data);

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const upsertHistory = async (history) => {
    try {
        // Check maximum book can borrowed
        let studentId = history.studentId;
        let dataHistories = await getHistoryByStudentId(studentId);
        if (dataHistories.DT.length >= process.env.MAX_BOOKS_CAN_BORROW
            ||
            dataHistories.DT.some((item) => +item.quantityBorrowed >= process.env.MAX_BOOKS_CAN_BORROW)
            ||
            (dataHistories.DT.length === 1 && +dataHistories.DT[0].quantityBorrowed === 1 && history.dataBorrowed.length === 1 && history.dataBorrowed[0].quantityBookBorrowed === 2)) {
            return apiUtils.resFormat(1, `Create history failed !`);
        }


        let listHistory = [];
        for (const book of history.dataBorrowed) {
            let dataBook = await bookServices.getBooksBy({ id: book.bookIdBorrowed });
            if (dataBook.EC !== 0)
                return apiUtils.resFormat(1, `Create history failed !`);

            await bookServices.updateABook({
                borrowed: +dataBook.DT[0].borrowed + +book.quantityBookBorrowed
            }, book.bookIdBorrowed);

            listHistory.push({
                studentId,
                bookId: book.bookIdBorrowed,
                quantityBorrowed: book.quantityBookBorrowed,
                quantityBookLost: '0'
            })
        }


        await db.History.bulkCreate(listHistory);

        return apiUtils.resFormat(0, `Create history successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

const deleteMultiplesHistory = async ({ listHistories }) => {
    try {
        const listHistoriesIds = listHistories.map((item) => item.id);
        const data = await db.History.destroy({
            where: {
                [Op.and]: [
                    { id: listHistoriesIds },
                    { timeStart: null }
                ]
            },
        })

        // Khi delete success cần update lại borrowed in table Book
        if (data > 0) {
            for await (const history of listHistories) {
                let dataBook = await bookServices.getBooksBy({ id: history.bookId })
                if (dataBook.EC === 0) {
                    await bookServices.updateABook({ borrowed: +dataBook.DT[0].borrowed - +history.quantityBorrowed }, history.bookId)
                }
            }
        }

        return apiUtils.resFormat(0, "Delete a history successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateTimeApprove = async (history) => {
    try {
        const { id, bookId, newBorrowed, timeStart, quantityGive, quantityBorrowedUpdate, studentId } = history;

        // Mượn 2 cuốn similar nhưng muốn give back trước 1 cuốn
        if (quantityBorrowedUpdate > 0) {
            // Ko update timeEnd, chỉ update quantityBorrowed
            await updateAHistory({
                quantityBorrowed: quantityBorrowedUpdate
            }, id)

            await db.History.create({
                studentId,
                bookId,
                quantityBorrowed: quantityGive,
                timeStart,
                quantityBookLost: '0'
            })
        }

        if (!id) {
            const ids = history.map((item) => item.id);
            await db.History.update({
                timeStart: getCurrentDate(),
            }, { where: { id: ids } });

            for await (const item of history) {
                await bookServices.updateABook({
                    borrowed: newBorrowed
                }, item.bookId);
            }

            return apiUtils.resFormat(0, `Update all timeStart history successful !`);
        }

        // Nếu có timeStart rồi thì update timeEnd, còn ko thì update timeStart
        await db.History.update({
            [timeStart ? 'timeEnd' : 'timeStart']: getCurrentDate(),
        }, {
            where: { id }
        })

        await bookServices.updateABook({
            borrowed: newBorrowed
        }, bookId);


        return apiUtils.resFormat(0, `Update ${timeStart ? 'timeEnd' : 'timeStart'} history successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateAHistory = async (newData, id) => {
    try {
        await db.History.update({
            ...newData
        }, {
            where: { id }
        })

        return apiUtils.resFormat(0, "Update a history successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getHistoryBy = async (condition) => {
    try {
        let data = await db.History.findAll({
            where: { ...condition },
            attributes: [
                'id', 'bookId', 'quantityBorrowed'
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, `Find book by ${Object.keys(condition)} successful !`, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}


export default {
    getAllHistories, upsertHistory, deleteMultiplesHistory,
    getHistoriesWithPagination, getHistoryByStudentId,
    updateTimeApprove, updateAHistory, getHistoryBy
}