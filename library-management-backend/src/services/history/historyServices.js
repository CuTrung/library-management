import db from "../../models";
import apiUtils from '../../utils/apiUtils';
import passwordUtils from "../../utils/passwordUtils";
import jwtUtils from "../../utils/jwtUtils";
import { Op } from "sequelize";
import dotenv from 'dotenv';
import { addDays, dateFormat, getCurrentDate, logData } from "../../utils/myUtils";
import categoryServices from "../category/categoryServices";
import _ from 'lodash';
import { decode } from "jsonwebtoken";
import bookServices from "../book/bookServices";
dotenv.config();

const getAllHistories = async (req) => {
    try {
        const { by } = req.query;

        let data = await db.History.findAll({
            where: by && req.user ? { [by]: req.user?.id } : {},
            attributes: [
                'id', 'quantityBorrowed', 'timeStart', 'timeEnd', 'createdAt', 'quantityBookLost', 'isReturned'
            ],
            include: [
                {
                    model: db.Book,
                    attributes: ['id', 'name', 'author', 'price', 'quantity', 'quantityReality', 'borrowed'],
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

const getHistoriesWithPagination = async (page, limit, time, params) => {
    try {
        const { timeStart } = params;

        let offset = (page - 1) * limit;
        let { count, rows } = await db.History.findAndCountAll({
            where: timeStart ? { timeStart: JSON.parse(timeStart) } : {},
            attributes: [
                'id', 'quantityBorrowed', 'timeStart', 'timeEnd', 'createdAt', 'quantityBookLost', 'isReturned'
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
        let dataHistories = await getHistoryBy({ studentId, timeEnd: null });

        const bookBorrowed = history.dataBorrowed.reduce((acc, cur) => {
            return acc + cur.quantityBookBorrowed;
        }, 0)

        if (bookBorrowed > process.env.MAX_BOOKS_CAN_BORROW
            ||
            dataHistories.DT.length >= process.env.MAX_BOOKS_CAN_BORROW
            ||
            dataHistories.DT.some((item) => +item.quantityBorrowed >= process.env.MAX_BOOKS_CAN_BORROW)
            ||
            (dataHistories.DT.length === 1 && +dataHistories.DT[0].quantityBorrowed === 1 && history.dataBorrowed.length === 1 && history.dataBorrowed[0].quantityBookBorrowed === 2)) {
            return apiUtils.resFormat(1, `Max books can borrowed !`);
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
                quantityBookLost: 0,
                isReturned: 0,
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
        const { id, bookId, studentId, newBorrowed, quantityBookLost, quantityBookGive, quantityBorrowedNew, timeStart, timeEnd } = history;

        if (quantityBookGive || quantityBookLost) {
            if (quantityBookGive) {
                await updateAHistory({
                    quantityBorrowed: quantityBookGive,
                    id,
                    timeEnd: getCurrentDate(),
                    isReturned: 1
                })
            }

            if (quantityBookLost) {
                await updateAHistory({
                    quantityBorrowed: quantityBookLost,
                    quantityBookLost,
                    id,
                    timeEnd: getCurrentDate(),
                    isReturned: 1
                })
                const dataBook = await bookServices.getBooksBy({ id: bookId });
                if (dataBook.EC === 0) {
                    await bookServices.upsertBook({
                        id: bookId,
                        quantityReality: dataBook.DT[0].quantityReality - quantityBookLost
                    })
                }
            }

            if (quantityBorrowedNew > 0) {
                await db.History.create({
                    studentId,
                    bookId,
                    quantityBorrowed: quantityBorrowedNew,
                    timeStart,
                    timeEnd,
                    quantityBookLost: 0,
                    isReturned: 0
                })
            }

            await bookServices.upsertBook({
                id: bookId,
                borrowed: newBorrowed
            });

            return apiUtils.resFormat(0, `Update history successful !`);
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

        await db.History.update({
            timeStart: getCurrentDate(),
            timeEnd: addDays(new Date(), +process.env.MAX_DAYS_TO_BORROW_BOOKS)
        }, {
            where: { id }
        })

        return apiUtils.resFormat(0, `Update history successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateAHistory = async ({ id, ...newData }) => {
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
    getHistoriesWithPagination, updateTimeApprove, updateAHistory, getHistoryBy
}