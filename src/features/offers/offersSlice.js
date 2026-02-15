import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchOffers = createAsyncThunk(
    'offers/fetchOffers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('offers');
            return response.data.offers;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addOffer = createAsyncThunk(
    'offers/addOffer',
    async (offerData, { rejectWithValue }) => {
        try {
            const response = await api.post('offers', offerData);
            return response.data.offer;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteOffer = createAsyncThunk(
    'offers/deleteOffer',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`offers/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const offersSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOffers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOffers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOffers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addOffer.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(deleteOffer.fulfilled, (state, action) => {
                state.items = state.items.filter(o => o.id !== action.payload);
            });
    },
});

export const selectAllOffers = (state) => state.offers.items;

export default offersSlice.reducer;
