import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../../../utils/myUtils";
import {
    DataBook,
    HTTPMethods,
    ResAxios,
    ResBook,
    TypeState,
} from "../../../types/types";

// Define the initial state using that type
const initialState: TypeState<DataBook & { timeDelete?: number }> = {
    values: JSON.parse(window.sessionStorage.getItem("cartBorrowed")!) ?? [],
};

export const addOrRemoveBook = createAsyncThunk(
    "/book",
    // Declare the type your function argument here:
    async (
        dataBook: DataBook & {
            removeId?: number | "ALL";
        },
    ) => {
        const newBorrowed =
            dataBook.removeId === "ALL"
                ? -dataBook.numberOfBooksBorrowed
                : dataBook.removeId
                ? -1
                : 1;

        const data = (await fetchData(HTTPMethods.PATCH, "/books", {
            id: dataBook.id,
            borrowed: dataBook.borrowed + newBorrowed,
        })) as ResAxios;

        if (data.EC === 0) {
            return {
                ...dataBook,
                borrowed: data.DT[0].borrowed,
            };
        }

        return null;
    },
);

const cartSlice = createSlice({
    name: "cart",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        filteredCart: (state, action: PayloadAction<any>) => {
            const cartIdsRemove = action.payload;

            for (const item of cartIdsRemove) {
                state.values = state.values.filter(
                    (book) => book.id !== item.id,
                );
            }

            window.sessionStorage.setItem(
                "cartBorrowed",
                JSON.stringify(state.values),
            );
        },
    },
    extraReducers(builder) {
        // Add reducers for additional action types here, and handle loading state as needed
        builder
            .addCase(addOrRemoveBook.pending, (state) => {})
            .addCase(addOrRemoveBook.fulfilled, (state, action) => {
                const newBook = action.payload;

                if (!newBook) return;

                const indexBookExist = state.values.findIndex(
                    (book) => book.id === newBook.id,
                );

                if (newBook.quantityReality - newBook.borrowed < 0) return;

                if (indexBookExist > -1) {
                    if (
                        (newBook.removeId &&
                            state.values[indexBookExist]
                                .numberOfBooksBorrowed === 1) ||
                        newBook.removeId === "ALL"
                    ) {
                        state.values = state.values.filter(
                            (item) =>
                                item.id !== state.values[indexBookExist].id,
                        );

                        return;
                    }
                    state.values[indexBookExist].numberOfBooksBorrowed +=
                        newBook.removeId ? -1 : 1;

                    state.values[indexBookExist].borrowed += newBook.removeId
                        ? -1
                        : 1;
                } else {
                    state.values.push({
                        ...newBook,
                        numberOfBooksBorrowed: 1,
                        timeDelete: new Date().getTime(),
                    });
                }

                window.sessionStorage.setItem(
                    "cartBorrowed",
                    JSON.stringify(state.values),
                );
            })
            .addCase(addOrRemoveBook.rejected, (state, action) => {});
    },
});

export const { filteredCart } = cartSlice.actions;

export default cartSlice.reducer;
