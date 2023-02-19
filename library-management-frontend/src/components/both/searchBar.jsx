import { useMemo, useRef } from "react";
import { removeDiacritics } from "../../utils/myUtils";
import { useEffect } from "react";
import { useState } from "react";


const SearchBar = ({ listRefDefault, listSearch, setListSearch, pathDeepObj, classNameCss, placeholder }) => {
    // Example: let student = {name: 'a', parent: {momName: 'b'}}
    // Nếu muốn lấy value là a thì 'path' lúc này là: 'name',
    //            //         b          //          : 'parent.momName'
    // chỉ cần khai báo path dẫn tới value cần lấy đối với những deep object 
    const deep_value = (obj, pathObj) => pathObj.split('.').reduce((a, v) => a[v], obj);


    function handleSearch(e) {
        let listFilter = [];
        let searchValue = removeDiacritics(e.target.value).trim().toLowerCase();

        if (searchValue === '') {
            setListSearch(listRefDefault);
        } else {
            listFilter = listSearch.filter((item) => {
                return removeDiacritics(deep_value(item, pathDeepObj))?.toLowerCase()?.indexOf(searchValue) > -1
            })
            setListSearch(listFilter);
        }
    }

    return (
        <input type="search" className={`form-control w-25 ${classNameCss}`} placeholder={placeholder}
            onChange={(e) => handleSearch(e)}
        />
    )

}

export default SearchBar;