import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, removeDiacritics } from "../../../utils/myUtils";
import {
    Book,
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
const initialState: TypeState<ResBook | number | string> = {
    values: [],
    valuesSearchInput: [],
    totalPages: [1],
    currentPage: [1],
    listFiltersPrev: [],
    imageDefault: [],
};

const LIMIT_DEFAULT = 8;

export const getBooks = createAsyncThunk(
    "/books",
    // Declare the type your function argument here:
    async ({ page, listFilters }: ListFilters & { page: number }) => {
        const response = (await fetchData(
            HTTPMethods.GET,
            `/books?page=${page}&limit=${LIMIT_DEFAULT}`,
            { listFilters },
        )) as ResAxios;

        return { data: response.DT, page, listFilters };
    },
);

export const upsertBook = createAsyncThunk(
    "/books/upsert",
    // Declare the type your function argument here:
    async (book) => {
        const response = (await fetchData(HTTPMethods.POST, `/books`, {
            book,
        })) as ResAxios;

        return response.DT;
    },
);

const bookSlice = createSlice({
    name: "book",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        searchBook: (state, action: PayloadAction<any>) => {
            const keySearch = removeDiacritics(action.payload.keySearch)
                .trim()
                .toUpperCase();
            const field = action.payload.field as keyof ResBook;

            state.values = (state.valuesSearchInput as ResBook[]).filter(
                (item) =>
                    removeDiacritics(
                        item[field]?.toString().toUpperCase(),
                    ).includes(keySearch),
            );
        },
        getImgDefault: (state) => {
            const defaultImgUrl = new URL(
                "../../../../public/default.jpg",
                import.meta.url,
            ).href;
            state.imageDefault[0] = defaultImgUrl;
        },
    },
    extraReducers(builder) {
        // Add reducers for additional action types here, and handle loading state as needed
        builder
            .addCase(getBooks.pending, (state) => {})
            .addCase(getBooks.fulfilled, (state, action) => {
                const { data, page, listFilters } = action.payload;
                state.valuesSearchInput = data.books;
                state.totalPages[0] = data.totalPages;
                state.values = data.books;
                state.currentPage[0] = page;
                state.listFiltersPrev = listFilters as any;
            })
            .addCase(getBooks.rejected, (state, action) => {});

        builder
            .addCase(upsertBook.pending, (state) => {})
            .addCase(upsertBook.fulfilled, (state, action) => {})
            .addCase(upsertBook.rejected, (state, action) => {});
    },
});

export const { searchBook, getImgDefault } = bookSlice.actions;

export default bookSlice.reducer;
