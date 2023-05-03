import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData, removeDiacritics } from "../../../utils/myUtils";
import {
    Book,
    Group,
    FieldFilter,
    HTTPMethods,
    ListFilters,
    ResAxios,
    ResBook,
    TypeFilters,
    TypeState,
    GroupRole,
} from "../../../types/types";

// Define a type for the slice state

// Define the initial state using that type
const initialState: TypeState<GroupRole | number> = {
    values: [],
    valuesGroup: [],
    valuesSearchInput: [],
    totalPages: [1],
    currentPage: [1],
    listFiltersPrev: [],
};

const LIMIT_DEFAULT = 2;

export const getGroupRoles = createAsyncThunk(
    "/group-roles",
    // Declare the type your function argument here:
    async ({ page, listFilters }: ListFilters & { page: number }) => {
        const response = (await fetchData(
            HTTPMethods.GET,
            `/group-roles?page=${page}&limit=${LIMIT_DEFAULT}`,
            { listFilters },
        )) as ResAxios;

        return { data: response.DT, page, listFilters };
    },
);

export const getAllGroups = createAsyncThunk(
    "/groups",
    // Declare the type your function argument here:
    async () => {
        const response = (await fetchData(
            HTTPMethods.GET,
            `/group-roles`,
        )) as ResAxios;

        return response.DT;
    },
);

export const upsertBook = createAsyncThunk(
    "/groups/upsert",
    // Declare the type your function argument here:
    async (groups) => {
        const response = (await fetchData(HTTPMethods.POST, `/groups`, {
            groups,
        })) as ResAxios;

        return response.DT;
    },
);

const groupRoleSlice = createSlice({
    name: "groups",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        searchBook: (state, action: PayloadAction<any>) => {
            const keySearch = removeDiacritics(action.payload.keySearch)
                .trim()
                .toUpperCase();
            const field = action.payload.field as keyof GroupRole;

            state.values = (state.valuesSearchInput as GroupRole[]).filter(
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
            .addCase(getGroupRoles.pending, (state) => {})
            .addCase(getGroupRoles.fulfilled, (state, action) => {
                const { data, page, listFilters } = action.payload;
                state.valuesSearchInput = data.groupRoles;
                state.totalPages[0] = data.totalPages;
                state.currentPage[0] = page;
                state.values = data.groupRoles;
                state.listFiltersPrev = listFilters as any;
            })
            .addCase(getGroupRoles.rejected, (state, action) => {});

        builder
            .addCase(getAllGroups.pending, (state) => {})
            .addCase(getAllGroups.fulfilled, (state, action) => {
                state.valuesGroup = action.payload;
            })
            .addCase(getAllGroups.rejected, (state, action) => {});
    },
});

export const { searchBook } = groupRoleSlice.actions;

export default groupRoleSlice.reducer;
