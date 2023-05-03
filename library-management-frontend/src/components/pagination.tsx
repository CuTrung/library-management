import * as React from "react";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { TypePaginate } from "../types/types";

export default function MyPagination({ ...props }: TypePaginate) {
    const [page, setPage] = React.useState(props.currentPage);
    const handleChange = async (
        event: React.ChangeEvent<unknown>,
        value: number,
    ) => {
        setPage(value);
        props.listFilters
            ? await props.cb?.({
                  page: value,
                  listFilters: props.listFilters,
              })
            : await props.cb?.(value);
    };

    return (
        <Stack
            className={`d-flex align-items-center ${props.classCss}`}
            spacing={2}
        >
            <Pagination
                count={props.totalPages}
                page={page}
                color="secondary"
                showFirstButton
                showLastButton
                onChange={handleChange}
            />
        </Stack>
    );
}
