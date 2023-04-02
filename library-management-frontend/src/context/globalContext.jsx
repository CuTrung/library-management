import { useContext, useRef } from "react";
import { useReducer, useCallback } from "react";
import { createContext } from 'react';
import { fetchData } from "../utils/myUtils";
import { useMemo, useEffect, useState } from "react";

const ACTION = {
    GET_USER: 'GET_USER',
    ADD_FN_PUSH_TO_CART: 'ADD_FN_PUSH_TO_CART',
    SET_DATA_BOOK_BORROWED: 'SET_DATA_BOOK_BORROWED',
    SET_DATA_LIST_HISTORIES: 'SET_DATA_LIST_HISTORIES',
    SET_DATA_BOOKS_HOME_LIBRARY: 'SET_DATA_BOOKS_HOME_LIBRARY',
    SET_CATEGORY_IDS_CONTENT_LIBRARY: 'SET_CATEGORY_IDS_CONTENT_LIBRARY',
    SET_SAMPLE_BOOKS: 'SET_SAMPLE_BOOKS',
    SET_DATA_APPROVE: 'SET_DATA_APPROVE',
    SET_DATA_TOP_LIST_BOOKS: 'SET_DATA_TOP_LIST_BOOKS',
    SET_DATA_FILTER_CONTENT_LIBRARY: 'SET_DATA_FILTER_CONTENT_LIBRARY'
}


function reducer(state, action) {
    switch (action.type) {
        case ACTION.GET_USER:
            return { ...state, user: action.payload };
        case ACTION.ADD_FN_PUSH_TO_CART:
            return { ...state, pushToCart: action.payload };
        case ACTION.SET_DATA_BOOK_BORROWED:
            return { ...state, dataBookBorrowed: action.payload };
        case ACTION.SET_DATA_LIST_HISTORIES:
            return { ...state, dataListHistories: action.payload };
        case ACTION.SET_DATA_BOOKS_HOME_LIBRARY:
            return { ...state, dataBooksHomeLibrary: action.payload };
        case ACTION.SET_DATA_FILTER_CONTENT_LIBRARY:
            return { ...state, dataFilter: action.payload };
        case ACTION.SET_SAMPLE_BOOKS:
            return { ...state, listBooksSample: action.payload };
        case ACTION.SET_DATA_APPROVE:
            return { ...state, dataApprove: action.payload };
        case ACTION.SET_DATA_TOP_LIST_BOOKS:
            return { ...state, dataTopList: action.payload };
        default:
            throw new Error();
    }
}

const GlobalContext = createContext();

const GlobalContextProvider = ({ initValue, children }) => {
    const [state, dispatch] = useReducer(reducer, initValue);

    return (
        <GlobalContext.Provider value={{ stateGlobal: state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;

export { GlobalContext, ACTION };