import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('cart');
            return res.data.items;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const addToCartApi = createAsyncThunk(
    'cart/add',
    async (product, { dispatch, rejectWithValue }) => {
        try {
            await api.post('cart', { product_id: product.id, quantity: 1 });
            dispatch(fetchCart());
            return product;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const updateQuantityApi = createAsyncThunk(
    'cart/updateQuantity',
    async ({ id, quantity, cartId }, { dispatch, rejectWithValue }) => {
        try {
            await api.put(`cart/${cartId}`, { quantity });
            dispatch(fetchCart());
            return { id, quantity };
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const removeFromCartApi = createAsyncThunk(
    'cart/remove',
    async (cartId, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`cart/${cartId}`);
            dispatch(fetchCart());
            return cartId;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const clearCartApi = createAsyncThunk(
    'cart/clear',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await api.delete('cart/clear');
            dispatch(fetchCart());
            return null;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const initialState = {
    items: [],
    totalAmount: 0,
    deliveryFee: 0,
    grandTotal: 0,
    itemCount: 0,
    loading: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        calculateTotals: (state) => {
            let total = 0;
            let count = 0;

            state.items.forEach((item) => {
                const price = item.discount > 0
                    ? Math.round(item.price * (1 - item.discount / 100))
                    : item.price;
                total += price * item.quantity;
                count += parseInt(item.quantity);
            });

            const deliveryFee = total > 2000 ? 0 : (total > 0 ? 99 : 0);

            state.totalAmount = total;
            state.deliveryFee = deliveryFee;
            state.grandTotal = total + deliveryFee;
            state.itemCount = count;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                cartSlice.caseReducers.calculateTotals(state);
            })
            .addCase(fetchCart.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const { calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
