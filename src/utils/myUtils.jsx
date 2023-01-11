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

const removeDiacritics = (value) => {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export {
    fetchData, currencyVND, removeDiacritics
}