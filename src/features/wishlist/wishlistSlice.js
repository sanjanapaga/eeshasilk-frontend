import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('wishlist');
            return res.data.items; // Backend returns items with product details
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const addToWishlistApi = createAsyncThunk(
    'wishlist/add',
    async (productId, { dispatch, rejectWithValue }) => {
        try {
            await api.post('wishlist', { product_id: productId });
            dispatch(fetchWishlist());
            return productId;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const removeFromWishlistApi = createAsyncThunk(
    'wishlist/remove',
    async (wishlistId, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`wishlist/${wishlistId}`);
            dispatch(fetchWishlist());
            return wishlistId;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const initialState = {
    items: [],
    loading: false,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const { clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const isInWishlist = (productId) => (state) =>
    state.wishlist.items.some(item => parseInt(item.product_id) === parseInt(productId));

export default wishlistSlice.reducer;
