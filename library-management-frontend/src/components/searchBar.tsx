import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { ResBook, TypeSearch } from "../types/types";

export default function SearchBar({ ...props }: TypeSearch<any>) {
    const dispatch = useAppDispatch();

    // BUGS: Khi enter để chọn thì value có giá trị null
    const handleSearch = (e: React.SyntheticEvent) => {
        const keySearch =
            (e.target as HTMLInputElement).value ||
            (e.target as HTMLElement).innerText;
        dispatch(props.funcDispatch({ keySearch, field: props.searchBy }));
    };

    return (
        // <TextField
        //     sx={{ m: 1, mt: 2, width: 300 }}
        //     onChange={handleSearch}
        //     id="outlined-basic"
        //     label="Outlined"
        //     variant="outlined"
        // />

        <Stack className={props.classCss} spacing={2} sx={{ m: 1, mt: 2 }}>
            <Autocomplete
                onInput={handleSearch}
                onChange={handleSearch}
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={props.listStateSearch.map(
                    (option: any) => option[props.searchBy],
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search input"
                        InputProps={{
                            ...params.InputProps,
                            type: "search",
                        }}
                    />
                )}
            />
        </Stack>
    );
}
