import { AxiosResponse } from "axios";
import { GridColDef } from "@mui/x-data-grid";

export type ObjGridColDef = {
    [index: string | number]: string | number | null | undefined | Function;
};

export enum HTTPMethods {
    GET = "get",
    PUT = "put",
    PATCH = "patch",
    POST = "post",
    DELETE = "delete",
}

export type Category = {
    id: number;
    name: string;
    isBorrowed: number;
};

export type Department = {
    id: number;
    name: string;
    description: string;
    isClosed: number;
};

export type Major = {
    id: number;
    name: string;
    description: string;
    isClosed: number;
    departmentId: string;
};

export type Status = {
    id: number;
    name: string;
    belongsToTable: string;
};

export type Book = {
    id: number;
    name: string;
    description: string;
    price: number;
    author: string;
    borrowed: number;
    quantity: number;
    quantityReality: number;
    image?: string;
    statusId?: number;
};

export type Student = {
    id: number;
    fullName: string;
    email: string;
    isDeleted: number;
};

export type History = {
    id: number;
    quantityBookLost: number;
    quantityBorrowed: number;
    timeEnd: string;
    timeStart: string;
    isReturned: number;
};

export type ResHistory = History & {
    Student: Student;
    Book: Book;
};

export type ResBook = Book & {
    Categories: Category[];
    Majors: Major[];
    Status: Status;
};

export type ResAxios = {
    DT: any;
    EC: number;
    EM: string;
};

export enum TypePage {
    NORMAL,
    AUTH,
    SETTINGS,
}

export type Pages = {
    name: string;
    path: string;
    type: TypePage;
};

export interface TypeState<T> {
    [key: string | number]: T[];
}

export type DataBook = ResBook & {
    numberOfBooksBorrowed: number;
};
export type CartBook = {
    dataBook: DataBook;
    func?: {
        [key: number | string]: any;
    };
};

export type User = {
    fullName: string;
    email?: string;
    access_token?: string;
};

export type TypePaginate = {
    [key: string]: any[] | number | Function | undefined | string;
    totalPages: number;
    currentPage: number;
    cb?: Function;
    classCss?: string;
};

export type TypeSearch<T> = {
    listStateSearch: T[];
    searchBy: string | number;
    funcDispatch: Function;
    classCss?: string;
};

export enum FieldFilter {
    CATEGORY = "Categories",
    DEPARTMENT = "department",
    MAJOR = "major",
}

export type TypeMyCheckbox<T = any> = {
    listData: T[];
    dataAttribute?: string | number;
    fieldLabel?: string;
    classCss?: string;
    id?: string;
};

export type TypeFilters = {
    categoryIds?: string[];
    departmentIds?: string[];
    majorIds?: string[];
};

export type ListFilters = {
    listFilters?: TypeFilters[];
};

export type DataList = {
    dataList: Array<ObjGridColDef | any>;
    header?: string;
    customColumns?: Array<ObjGridColDef> | GridColDef[];
    funcDispatch?: Function;
    style?: {};
};

export type TypeExport = {
    listData: any[];
    listHeadings: string[];
    nameFile: string;
};

export type Role = {
    id: number;
    url: string;
};

export type Group = {
    id: number;
    name: string;
};

export type GroupRole = {
    id: number;
    name: string;
    Roles: Role[];
    Users: Student[];
};

export enum UserMethod {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
}
