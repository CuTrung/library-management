import db from "../../models";
import apiUtils from '../../utils/apiUtils';
import passwordUtils from "../../utils/passwordUtils";
import { Op } from "sequelize";
import dotenv from 'dotenv';
import { logData } from "../../utils/myUtils";
dotenv.config();

const getAllCategories = async () => {
    try {
        let data = await db.Category.findAll({
            attributes: [
                'id', 'name', 'isBorrowed'
            ],
            raw: true,
            nest: true
        })


        return apiUtils.resFormat(0, "Get all categories successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getCategoriesByBookId = async (bookId) => {
    try {
        let data = await db.Book_Category_Major.findAll({
            where: {
                bookId
            },
            attributes: [],
            include: [
                {
                    model: db.Category,
                    attributes: ['id', 'name', 'isBorrowed'],
                }
            ],
            raw: true,
            nest: true
        })

        data = data.map((item) => item.Category);


        return apiUtils.resFormat(0, "Get categories by bookId successful !", data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getCategoriesWithPagination = async (page, limit, time) => {
    try {
        let offset = (page - 1) * limit;
        let { count, rows } = await db.Category.findAndCountAll({
            attributes: [
                'id', 'name', 'isBorrowed'
            ],
            order: [['id', 'DESC']],
            limit: limit,
            offset: offset,
            raw: true,
            nest: true
        })

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            categories: rows
        }

        if (time)
            await apiUtils.delay(time);

        return apiUtils.resFormat(0, "Get categories with pagination successful !", data);

    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const upsertCategory = async (category) => {
    try {
        if (!category.id)
            await db.Category.create({
                ...category
            })
        else
            await db.Category.update({
                ...category,
            }, {
                where: { id: category.id }
            })

        return apiUtils.resFormat(0, `${category.id ? 'Update a' : 'Create a new'} category successful !`);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}

const deleteACategory = async (id) => {
    try {

        await db.Book_Category_Major.destroy({
            where: {
                categoryId: id
            }
        })


        await db.Category.destroy({
            where: {
                ...id
            }
        })

        return apiUtils.resFormat(0, "Delete a category successful !");
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }
}

const getCategoriesBy = async (condition) => {
    try {
        let data = await db.Category.findAll({
            where: { ...condition },
            attributes: [
                'id', 'name'
            ],
            raw: true,
            nest: true
        })

        return apiUtils.resFormat(0, `Find category by ${Object.keys(condition)} successful !`, data);
    } catch (error) {
        console.log(error);
        return apiUtils.resFormat();
    }

}


export default {
    getAllCategories, upsertCategory, deleteACategory,
    getCategoriesWithPagination, getCategoriesByBookId,
    getCategoriesBy
}