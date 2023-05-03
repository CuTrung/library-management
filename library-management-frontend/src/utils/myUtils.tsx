import { GridColDef } from "@mui/x-data-grid";
import {
    HTTPMethods,
    ObjGridColDef,
    ResAxios,
    TypeExport,
} from "../types/types";
import axios from "../configs/axios";
import { read, utils, writeFile, readFile, writeFileXLSX } from "xlsx";

// defaultWidth cộng 1 vì phải tính cả cột 'Actions'
const convertObjectToColumnsDataGrid = (
    arrObj: ObjGridColDef & { customWidthColumns?: [] },
    defaultWidth?: number,
): GridColDef[] => {
    // arrObj = [{ name: "trung", fullName: "Cu Trung" }];
    const { customWidthColumns, ...objWithoutWidth } = arrObj ?? {};
    defaultWidth = 1000 / (Object.keys(objWithoutWidth ?? {}).length + 1);

    const upperCaseFirstCharAndJoin = (str: string) => {
        const strItem = str.split(/(?=[A-Z])/);
        strItem[0] = strItem[0][0]
            .toUpperCase()
            .concat(strItem[0].slice(1, strItem[0].length));
        return strItem.join(" ");
    };
    let result: GridColDef[] = [];

    let index = 0;
    for (const key in objWithoutWidth) {
        result.push({
            field: key,
            headerName: upperCaseFirstCharAndJoin(key),
            width: customWidthColumns?.[index] ?? defaultWidth,
        });
        index++;
    }

    return result;
};

const fetchData = async (method: HTTPMethods, url: string, payload?: {}) => {
    let data = null;

    try {
        if (method === HTTPMethods.GET)
            data = await axios[method]<any, ResAxios>(url, {
                params: { ...payload },
            });
        else if (method === HTTPMethods.DELETE)
            data = await axios[method]<any, ResAxios>(url, {
                data: { ...payload },
            });
        else data = await axios[method]<any, ResAxios>(url, payload);
    } catch (error) {
        console.log(error);
    }

    return data;
};

const removeDiacritics = (value: string = "") => {
    return value
        ?.replaceAll(" ", "-")
        ?.normalize("NFD")
        ?.replace(/\p{Diacritic}/gu, "");
};

const mySessionStorage = (key: string, value: any = "", isDelete = false) => {
    if (!key) return;
    if (isDelete) return window.sessionStorage.removeItem(key);
    const isExistValue = JSON.parse(window.sessionStorage.getItem(key)!);

    if (isExistValue) return isExistValue;

    window.sessionStorage.setItem(key, JSON.stringify(value));
};

function qs(selector: string, parent = document) {
    return parent.querySelector(selector);
}

function qsa(selector: string, parent: HTMLElement | Document = document) {
    return [...parent.querySelectorAll(selector)];
}

const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const exportExcel = ({ listData, listHeadings, nameFile }: TypeExport) => {
    let isSuccess = false;
    try {
        const ws = utils.json_to_sheet(listData);
        const wb = utils.book_new();
        utils.sheet_add_aoa(ws, [listHeadings]);
        utils.book_append_sheet(wb, ws, "Data");
        writeFileXLSX(wb, `${nameFile}.xlsx`);
        isSuccess = true;
    } catch (error) {
        console.log(error);
    }
    return isSuccess;
};

const importExcel = async (file: File) => {
    return new Promise<any[]>((resolve) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
            const bufferArray = e.target?.result;
            const wb = read(bufferArray, { type: "buffer" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const fileName = file.name.split(".")[0];
            let data = utils.sheet_to_json(ws);
            resolve(data);
        };
    });
};

const upperCaseFirstChar = (str: string = "") => {
    return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};

const formatToTableAndMethodUser = (urls: string | string[]) => {
    let tableName = null;
    let methodUser = null;

    if (Array.isArray(urls)) {
    } else {
        const arrItem = urls.split("/");
        tableName = arrItem[1];
        methodUser = arrItem[2] ?? "";
    }

    return {
        tableName,
        methodUser,
        tableMethod: `${methodUser} ${tableName}`,
    };
};

const getCurrentDate = () => {
    return new Date()
        .toLocaleDateString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        .replace(/\./g, "/");
};

export {
    convertObjectToColumnsDataGrid,
    fetchData,
    removeDiacritics,
    mySessionStorage,
    qs,
    qsa,
    toBase64,
    exportExcel,
    importExcel,
    upperCaseFirstChar,
    formatToTableAndMethodUser,
    getCurrentDate,
};
