import { useCallback } from "react";
import { useState, useEffect } from "react";

export function useSessionStorage(key: string, defaultValue: any = "") {
    return useStorage(key, defaultValue, window.sessionStorage);
}

export function useLocalStorage(key: string, defaultValue: any) {
    return useStorage(key, defaultValue, window.localStorage);
}

const useStorage = (key: string, defaultValue: any, storageObj: Storage) => {
    const [value, setValue] = useState(() => {
        let isExistsValue = storageObj.getItem(key);
        if (isExistsValue != null) return JSON.parse(isExistsValue);

        return typeof defaultValue === "function"
            ? defaultValue()
            : defaultValue;
    });

    useEffect(() => {
        if (value === undefined) return storageObj.removeItem(key);
        storageObj.setItem(key, JSON.stringify(value));
    }, [key, value, storageObj]);

    const remove = useCallback(() => {
        setValue(undefined);
    }, []);

    return [value, setValue, remove];
};
