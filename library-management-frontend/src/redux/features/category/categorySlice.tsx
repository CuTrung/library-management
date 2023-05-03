import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, removeDiacritics } from "../../../utils/myUtils";
import {
    Book,
    Category,
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
const initialState: TypeState<Category | number> = {
    values: [],
    valuesSearchInput: [],
    totalPages: [1],
    currentPage: [1],
    listFiltersPrev: [],
};

const LIMIT_DEFAULT = 7;

export const getCategories = createAsyncThunk(
    "/categories",
    // Declare the type your function argument here:
    async ({ page, listFilters }: ListFilters & { page: number }) => {
        const response = (await fetchData(
            HTTPMethods.GET,
            `/categories?page=${page}&limit=${LIMIT_DEFAULT}`,
            { listFilters },
        )) as ResAxios;

        return { data: response.DT, page, listFilters };
    },
);

export const upsertBook = createAsyncThunk(
    "/categories/upsert",
    // Declare the type your function argument here:
    async (category) => {
        const response = (await fetchData(HTTPMethods.POST, `/categories`, {
            category,
        })) as ResAxios;

        return response.DT;
    },
);

const categorySlice = createSlice({
    name: "category",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        searchBook: (state, action: PayloadAction<any>) => {
            const keySearch = removeDiacritics(action.payload.keySearch)
                .trim()
                .toUpperCase();
            const field = action.payload.field as keyof Category;

            state.values = (state.valuesSearchInput as Category[]).filter(
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
            .addCase(getCategories.pending, (state) => {})
            .addCase(getCategories.fulfilled, (state, action) => {
                const { data, page, listFilters } = action.payload;
                state.valuesSearchInput = data.categories;
                state.totalPages[0] = data.totalPages;
                state.values = data.categories;
                state.currentPage[0] = page;
                state.listFiltersPrev = listFilters as any;
            })
            .addCase(getCategories.rejected, (state, action) => {});

        builder
            .addCase(upsertBook.pending, (state) => {})
            .addCase(upsertBook.fulfilled, (state, action) => {})
            .addCase(upsertBook.rejected, (state, action) => {});
    },
});

export const { searchBook } = categorySlice.actions;

export default categorySlice.reducer;
