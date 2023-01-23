import axios from "../configs/axios";


const fetchData = async (method, url, payload) => {
    let data = null;
    method = method.toLowerCase();
    try {
        if (method === 'delete')
            data = await axios[method](url, { data: { ...payload } });
        else
            data = await axios[method](url, payload);
    } catch (error) {
        console.log(error)
    }

    return data;
}

const currencyVND = (value) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 3 }).format(value);
}

const removeDiacritics = (value, lowerOrUpper = 'LOWER') => {
    if (!lowerOrUpper)
        return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");

    value =
        lowerOrUpper === 'LOWER' ? value.toLowerCase() : value.toUpperCase();
    return value.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

const convertStringToASCII = (value) => {
    return removeDiacritics(value.toLowerCase()).charCodeAt(0);
}

const sortList = (listSort, key, type = 'ASC') => {
    if (typeof listSort[0][key] !== 'string' && typeof listSort[0][key] !== 'number') return listSort;

    if (typeof listSort[0][key] === 'string') {
        return listSort.sort((a, b) => type === 'ASC' ?
            convertStringToASCII(a[key]) - convertStringToASCII(b[key])
            :
            convertStringToASCII(b[key]) - convertStringToASCII(a[key])
        )
    }

    return listSort.sort((a, b) => type === 'ASC' ? a[key] - b[key] : b[key] - a[key])
}

const convertTimeStringToSecond = (timeString) => {
    let time = timeString.split(":");
    return +time[0] * 3600 + +time[1] * 60 + +time[2];
}

const getSecondsCurrent = () => {
    return new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds();
}

const $ = (classOrId) => {
    return document.querySelector(classOrId);
}

const $$ = (classOrId) => {
    return document.querySelectorAll(classOrId);
}

export {
    fetchData, currencyVND, removeDiacritics, sortList, $, $$,
    convertTimeStringToSecond, getSecondsCurrent
}