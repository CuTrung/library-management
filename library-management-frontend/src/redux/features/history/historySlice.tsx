import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, removeDiacritics } from "../../../utils/myUtils";
import {
    Book,
    FieldFilter,
    HTTPMethods,
    ListFilters,
    ResAxios,
    ResHistory,
    TypeFilters,
    TypeState,
} from "../../../types/types";

// Define a type for the slice state

// Define the initial state using that type
const initialState: TypeState<ResHistory | number> = {
    values: [],
    valuesSearchInput: [],
    totalPages: [1],
    currentPage: [1],
    listFiltersPrev: [],
};

const LIMIT_DEFAULT = 2;

export const getHistories = createAsyncThunk(
    "/histories",
    // Declare the type your function argument here:
    async ({
        page,
        listFilters,
        condition,
    }: ListFilters & { page: number; condition?: {} }) => {
        const response = (await fetchData(
            HTTPMethods.GET,
            `/histories?page=${page}&limit=${LIMIT_DEFAULT}`,
            { listFilters, ...condition },
        )) as ResAxios;

        return { data: response.DT, page, listFilters };
    },
);

export const upsertBook = createAsyncThunk(
    "/histories/upsert",
    // Declare the type your function argument here:
    async (book) => {
        const response = (await fetchData(HTTPMethods.POST, `/histories`, {
            book,
        })) as ResAxios;

        return response.DT;
    },
);

const historySlice = createSlice({
    name: "history",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        searchHistory: (state, action: PayloadAction<any>) => {
            const keySearch = removeDiacritics(action.payload.keySearch)
                .trim()
                .toUpperCase();
            const field = action.payload.field as keyof ResHistory;

            state.values = (state.valuesSearchInput as ResHistory[]).filter(
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
            .addCase(getHistories.pending, (state) => {})
            .addCase(getHistories.fulfilled, (state, action) => {
                const { data, page, listFilters } = action.payload;
                state.valuesSearchInput = data.histories;
                state.totalPages[0] = data.totalPages;
                state.values = data.histories;
                state.currentPage[0] = page;
                state.listFiltersPrev = listFilters as any;
            })
            .addCase(getHistories.rejected, (state, action) => {});

        builder
            .addCase(upsertBook.pending, (state) => {})
            .addCase(upsertBook.fulfilled, (state, action) => {})
            .addCase(upsertBook.rejected, (state, action) => {});
    },
});

export const { searchHistory } = historySlice.actions;

export default historySlice.reducer;
