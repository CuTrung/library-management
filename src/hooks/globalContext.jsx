import { useContext, useRef } from "react";
import { useReducer, useCallback } from "react";
import { createContext } from 'react';
import { fetchData } from "../utils/myUtils";
import { useMemo, useEffect, useState } from "react";


const ACTION = {
    GET_USER: 'GET_USER',
    GET_CATEGORIES: 'GET_CATEGORIES'
}


function reducer(state, action) {
    switch (action.type) {
        case ACTION.GET_USER:
            return { user: action.payload };
        case ACTION.GET_CATEGORIES:
            return { categories: action.payload };
        default:
            throw new Error();
    }
}



const GlobalContext = createContext();

const GlobalContextProvider = ({ initValue, children }) => {
    const [state, dispatch] = useReducer(reducer, initValue);

    async function getCategories() {
        let data = await fetchData('GET', `api/categories`);
        if (data.EC === 0) {
            dispatch({ type: ACTION.GET_CATEGORIES, payload: data.DT })
        }
    }

    useEffect(() => {
        getCategories();
    }, [])

    return (
        <GlobalContext.Provider value={{ stateGlobal: state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;

export { GlobalContext, ACTION };