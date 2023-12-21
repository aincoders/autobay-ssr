import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    url: null,
};

const urlSlice = createSlice({
    name: 'url',
    initialState,
    reducers: {
        setCategorySlug(state, action) {
            state.url = action.payload;
        },
    },
});

export const { setCategorySlug } = urlSlice.actions;

export default urlSlice.reducer;
