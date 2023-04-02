import db from "../../models";
import apiUtils from '../../utils/apiUtils';
import passwordUtils from "../../utils/passwordUtils";
import { Op } from "sequelize";
import dotenv from 'dotenv';
import statusServices from "../status/statusServices";
import _, { isArray } from "lodash";
import categoryServices from "../category/categoryServices";
import { upperCaseFirstChar } from "../../utils/myUtils";
import majorServices from "../major/majorServices";
dotenv.config();

const getAllBooks = async () => {
    try {
        let dataBooks = await db.Book.findAll({
            attributes: [
                'id', 'name', 'price',
                'borrowed', 'quantity', 'quantityReality', 'image'
            ],
            include: [
                {
                    model: db.Status,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Category,
                    attributes: ['id', 'name', 'isBorrowed'],
                    through: { attributes: [] }
                },
                {
                    model: db.Major,
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                },
            ],
            raw: true,
            nest: true
        })



        // Merge key which object similar
        let data = [];
        dataBooks.forEach(book => {
            book = {
                ...book,
                Categories: [book.Categories],
                Majors: [book.Majors]
            }

            let match = data.find(r => r.id === book.id);
            if (match) {
                match.Categories = match.Categories.concat(book.Categories);
                match.Majors = match.Majors.concat(book.Majors);
            } else {
                data.push(book);
            }
        });

        // Remove object similar in Categories and Majors
        data = data.map((item) => {
            const uniqueCategories = [...new Map(item.Categories.map(itemUnique => [itemUnique.name, itemUnique])).values()];

            const uniqueMajors = [...new Map(item.Majors.map(itemUnique => [itemUnique.name, itemUnique])).values()];

            return {
                ...item,
                Categories: uniqueCategories,
                Majors: uniqueMajors
            }
        })

        return apiUtils.resFormat(0, "Get all books successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const filterAllBooksBy = async (dataQuery) => {
    try {
        const { listFilters } = dataQuery;
        let data;

        // Filter Category or Major
        if (listFilters.length === 1) {
            data = await db.Book_Category_Major.findAndCountAll({
                where: {
                    [`${listFilters[0].type.toLowerCase()}Id`]: listFilters[0][`${listFilters[0].type.toLowerCase()}Ids`]
                },
                attributes: [],
                include: [
                    {
                        model: db.Book,
                        attributes: ['id', 'name', 'price', 'borrowed', 'quantity', 'quantityReality', 'image']
                    }
                ],
                order: [['id', 'DESC']],
                raw: true,
                nest: true
            })
        } else {
            let major_categoryIds = [];
            for (const majorId of listFilters[0].majorIds) {
                for (const categoryId of listFilters[1].categoryIds) {
                    major_categoryIds.push({
                        majorId,
                        categoryId
                    })
                }
            }

            data = await db.Book_Category_Major.findAndCountAll({
                where: {
                    [Op.or]: major_categoryIds
                },
                attributes: [],
                include: [
                    {
                        model: db.Book,
                        attributes: ['id', 'name', 'price', 'borrowed', 'quantity', 'quantityReality', 'image']
                    }
                ],
                order: [['id', 'DESC']],
                raw: true,
                nest: true
            })
        }

        // Merge object wanted
        data = data.map((item) => ({ ...item.Book }))

        // Merge object similar
        data = [...new Map(data.map(item => [item.name, item])).values()];


        return apiUtils.resFormat(0, "Get book by categoryId successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const filterBooksByWithPagination = async (dataQuery, page, limit, time) => {
    try {
        const { listFilters } = dataQuery;
        // Filter only category or major when listFilters.length === 1
        const opCondition = listFilters.length === 1 ? 'and' : 'or';
        let dataCondition = {
            [`${listFilters[0].type.toLowerCase()}Id`]: listFilters[0][`${listFilters[0].type.toLowerCase()}Ids`]
        };

        if (!opCondition) {
            let major_categoryIds = [];
            for (const majorId of listFilters[0]?.majorIds) {
                for (const categoryId of listFilters[1]?.categoryIds) {
                    major_categoryIds.push({
                        majorId,
                        categoryId
                    })
                }
            }
            dataCondition = major_categoryIds;
        }

        let offset = (page - 1) * limit;
        let { count, rows } = await db.Book_Category_Major.findAndCountAll({
            where: {
                [Op[opCondition]]: dataCondition
            },
            attributes: [],
            include: [
                {
                    model: db.Book,
                    attributes: ['id', 'name', 'price', 'borrowed', 'quantity', 'quantityReality', 'image'],
                    include: [
                        {
                            model: db.Status,
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: db.Category,
                    attributes: ['id', 'name', 'isBorrowed'],
                },
            ],
            order: [['id', 'DESC']],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        // Merge object wanted
        rows = rows.map((item) => ({ ...item.Book, Categories: item.Category }));

        let result = [];
        rows.forEach(book => {
            book = {
                ...book,
                Categories: [book.Categories],
            }

            let match = result.find(r => r.id === book.id);
            if (match) {
                match.Categories = match.Categories.concat(book.Categories);
            } else {
                result.push(book);
            }
        });

        rows = result

        // Merge object similar
        rows = [...new Map(rows.map(item => [item.name, item])).values()];

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            books: rows
        }

        if (time)
            await apiUtils.delay(time);

        return apiUtils.resFormat(0, "Get books with pagination successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getBooksWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Book.findAndCountAll({
            attributes: [
                'id', 'name', 'price',
                'borrowed', 'quantity', 'quantityReality', 'image'
            ],
            include: [
                {
                    model: db.Status,
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Category,
                    attributes: ['id', 'name', 'isBorrowed'],
                    through: { attributes: [] },
                },
                {
                    model: db.Major,
                    attributes: ['id', 'name', 'description'],
                    through: { attributes: [] }
                },
            ],
            order: [['id', 'DESC']],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })


        let result = [];
        rows.forEach(book => {
            book = {
                ...book,
                Categories: [book.Categories],
                Majors: [book.Majors]
            }

            let match = result.find(r => r.id === book.id);
            if (match) {
                match.Categories = match.Categories.concat(book.Categories);
                match.Majors = match.Majors.concat(book.Majors);
            } else {
                result.push(book);
            }
        });



        result = result.map((item) => {
            const uniqueCategories = [...new Map(item.Categories.map(itemUnique => [itemUnique.name, itemUnique])).values()];

            const uniqueMajors = [...new Map(item.Majors.map(itemUnique => [itemUnique.name, itemUnique])).values()];

            return {
                ...item,
                Categories: uniqueCategories,
                Majors: uniqueMajors
            }
        })

        rows = result;

        // Vì merge nhiều reference nên cần lấy lại chính xác count;
        count = await db.Book.count();

        let totalPages = Math.ceil(count / limit);

        let data = {
            totalRows: count,
            totalPages: totalPages,
            books: rows
        }

        if (time)
            await apiUtils.delay(time);

        return apiUtils.resFormat(0, "Get books with pagination successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const upsertBook = async (dataBook) => {
    try {
        // Insert with excel
        if (Array.isArray(dataBook)) {
            let messageError = '';
            let bookIds = [];
            for await (const item of dataBook) {
                let dataStatus = await statusServices.getStatusBy(
                    { name: upperCaseFirstChar(item['Tình trạng']) }
                );
                if (_.isEmpty(dataStatus.DT)) {
                    messageError = `'Tình trạng' - row ${item.rowNum + 1}`;
                    break;
                }


                let dataCategory = await categoryServices.getCategoriesBy(
                    { name: upperCaseFirstChar(item['Thể loại']) }
                );
                if (_.isEmpty(dataCategory.DT)) {
                    messageError = `'Thể loại' - row ${item.rowNum + 1}`;
                    break;
                }


                let dataMajor = await majorServices.getMajorsBy(
                    { description: upperCaseFirstChar(item['Chuyên ngành']) }
                );
                if (_.isEmpty(dataMajor.DT)) {
                    messageError = `'Chuyên ngành' - row ${item.rowNum + 1}`;
                    break;
                }


                let bookCreated = await db.Book.create({
                    name: item['Tên'],
                    price: item['Giá'],
                    quantity: item['Số lượng'],
                    quantityReality: item['Số lượng'],
                    statusId: dataStatus.DT[0].id,
                    borrowed: '0'
                })


                let bookCreatedId = bookCreated.get({ plain: true }).id
                await db.Book_Category_Major.create({
                    bookId: bookCreatedId,
                    categoryId: dataCategory.DT[0].id,
                    majorId: dataMajor.DT[0].id
                })

                bookIds.push(bookCreatedId);
            }

            if (messageError) {
                await db.Book.destroy({
                    where: {
                        id: bookIds
                    }
                })

                await db.Book_Category_Major.destroy({
                    where: {
                        bookId: bookIds
                    }
                })

                return apiUtils.resFormat(1, `Create multiples book failed ! Something wrongs at col ${messageError}`);
            }

            return apiUtils.resFormat(0, `Create multiples book successful !`);
        }


        let category_majorIds = dataBook.category_majorIds;
        delete dataBook["category_majorIds"];
        let data;
        if (!dataBook.id)
            data = await db.Book.create({
                ...dataBook
            })
        else
            data = await db.Book.update({
                ...dataBook,
            }, {
                where: { id: dataBook.id }
            })

        let bookId = dataBook.id ? dataBook.id : data.get({ plain: true }).id;

        let listBook_Category_Major = category_majorIds.map((category_majorId) => ({ bookId, ...category_majorId }));

        if (dataBook.id) {
            await db.Book_Category_Major.destroy({
                where: {
                    bookId
                }
            })
        }

        await db.Book_Category_Major.bulkCreate(listBook_Category_Major);

        return apiUtils.resFormat(0, `${dataBook.id ? 'Update a' : 'Create a new'} book successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

const deleteABook = async (dataId) => {
    try {
        await db.Book.destroy({
            where: {
                ...dataId
            }
        })

        await db.Book_Category_Major.destroy({
            where: {
                bookId: dataId.id
            }
        })

        return apiUtils.resFormat(0, "Delete a book successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const updateABook = async (newData, id) => {
    try {
        await db.Book.update({
            ...newData
        }, {
            where: { id }
        })

        return apiUtils.resFormat(0, "Update a book successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getBooksBy = async (condition) => {
    try {
        let data = await db.Book.findAll({
            where: { ...condition },
            attributes: [
                'id', 'name', 'price', 'borrowed', 'quantity', 'quantityReality'
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
    getAllBooks, upsertBook, deleteABook,
    getBooksWithPagination, filterAllBooksBy, filterBooksByWithPagination, updateABook, getBooksBy

}