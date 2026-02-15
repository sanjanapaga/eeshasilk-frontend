import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api'; // axios instance

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (params = { category: 'all', search: '' }, { rejectWithValue }) => {
        try {
            const { category = 'all', search = '' } = typeof params === 'string' ? { category: params } : params;

            let queryParams = [];
            if (category && category !== 'all') queryParams.push(`category=${category}`);
            if (search) queryParams.push(`search=${search}`);

            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
            const url = `products${queryString}`;

            console.log('🔍 Fetching products:', { category, search, url });
            const res = await api.get(url);
            return Array.isArray(res.data) ? res.data : res.data.products || [];
        } catch (err) {
            console.error('❌ Fetch products error:', err);
            return rejectWithValue(err.response?.data);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`products/${id}`);
            return res.data.product;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/add',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post('products', formData);
            return res.data.product;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            // Use POST with method spoofing for PHP file upload compatibility
            if (formData instanceof FormData) {
                formData.append('_method', 'PUT');
            }
            const res = await api.post(`products/${id}`, formData);
            return res.data.product;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`products/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        list: [],
        selectedCategory: 'all',
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(addProduct.rejected, (state) => {
                state.loading = false;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.list.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.list = state.list.filter(p => p.id !== action.payload);
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                const index = state.list.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                } else {
                    state.list.push(action.payload);
                }
            });
    },
});

export const { setSelectedCategory } = productSlice.actions;

export const selectAllProducts = (state) => state.products.list;
export const selectFilteredProducts = (state) => state.products.list;
export const selectSelectedCategory = (state) => state.products.selectedCategory;

export default productSlice.reducer;
