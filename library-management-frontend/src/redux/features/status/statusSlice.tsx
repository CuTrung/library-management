import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, removeDiacritics } from "../../../utils/myUtils";
import {
    Book,
    Status,
    FieldFilter,
    HTTPMethods,
    ListFilters,
    ResAxios,
    ResBook,
    TypeFilters,
    TypeState,
} from "../../../types/types";

// Define a type for the slice state

// Define the initial state using that type
const initialState: TypeState<Status | number> = {
    values: [],
    valuesSearchInput: [],
    totalPages: [1],
    currentPage: [1],
    listFiltersPrev: [],
};

const LIMIT_DEFAULT = 7;

export const getStatus = createAsyncThunk(
    "/status",
    // Declare the type your function argument here:
    async ({ page, listFilters }: ListFilters & { page: number }) => {
        const response = (await fetchData(
            HTTPMethods.GET,
            `/status?page=${page}&limit=${LIMIT_DEFAULT}`,
            { listFilters },
        )) as ResAxios;

        return { data: response.DT, page, listFilters };
    },
);

export const upsertBook = createAsyncThunk(
    "/status/upsert",
    // Declare the type your function argument here:
    async (status) => {
        const response = (await fetchData(HTTPMethods.POST, `/status`, {
            status,
        })) as ResAxios;

        return response.DT;
    },
);

const statusSlice = createSlice({
    name: "status",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        searchBook: (state, action: PayloadAction<any>) => {
            const keySearch = removeDiacritics(action.payload.keySearch)
                .trim()
                .toUpperCase();
            const field = action.payload.field as keyof Status;

            state.values = (state.valuesSearchInput as Status[]).filter(
                (item) =>
                    removeDiacritics(
                        item[field]?.toString().toUpperCase(),
                    ).includes(keySearch),
            );
        },
    },
    extraReducers(builder) {
        // Add reducers for additional action types here, and handle loading state as needed
        builder
            .addCase(getStatus.pending, (state) => {})
            .addCase(getStatus.fulfilled, (state, action) => {
                const { data, page, listFilters } = action.payload;
                state.valuesSearchInput = data.status;
                state.totalPages[0] = data.totalPages;
                state.values = data.status;
                state.currentPage[0] = page;
                state.listFiltersPrev = listFilters as any;
            })
            .addCase(getStatus.rejected, (state, action) => {});

        builder
            .addCase(upsertBook.pending, (state) => {})
            .addCase(upsertBook.fulfilled, (state, action) => {})
            .addCase(upsertBook.rejected, (state, action) => {});
    },
});

export const { searchBook } = statusSlice.actions;

export default statusSlice.reducer;
