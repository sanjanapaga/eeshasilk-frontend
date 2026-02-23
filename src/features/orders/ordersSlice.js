import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (userId, { rejectWithValue }) => {
        try {
            const endpoint = userId ? `orders?user_id=${userId}` : 'orders';
            const response = await api.get(endpoint);
            return response.data.orders || response.data; // Backend returns { orders: [] } or []
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addOrder = createAsyncThunk(
    'orders/addOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await api.post('orders', orderData);
            return response.data.order || response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            await api.put(`orders/${id}`, { status });
            return { id, status };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`orders/${id}`);
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

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.items = Array.isArray(action.payload) ? action.payload : (action.payload.orders || []);
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addOrder.fulfilled, (state, action) => {
                // If the response from addOrder is a single order object
                if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
                    state.items.unshift(action.payload);
                }
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const order = state.items.find(o => o.id === id);
                if (order) {
                    order.status = status;
                }
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.items = state.items.filter(o => o.id !== action.payload);
            });
    },
});

export const { setLoading, setError } = ordersSlice.actions;

export const selectAllOrders = (state) => state.orders.items;
export const selectOrderById = (id) => (state) =>
    state.orders.items.find(order => order.id === id);

export default ordersSlice.reducer;
