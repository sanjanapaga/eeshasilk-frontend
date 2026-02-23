import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchReviews = createAsyncThunk(
    'reviews/fetchReviews',
    async (productId, { rejectWithValue }) => {
        try {
            const endpoint = productId ? `reviews?product_id=${productId}` : 'reviews';
            const response = await api.get(endpoint);
            return response.data.reviews;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addReview = createAsyncThunk(
    'reviews/addReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const response = await api.post('reviews', {
                product_id: reviewData.productId,
                rating: reviewData.rating,
                user_name: reviewData.userName,
                comment: reviewData.comment,
                user_id: reviewData.userId,
            });
            return response.data.review;
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

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export const selectAllReviews = (state) => state.reviews.items;

export const selectProductReviews = (productId) => (state) =>
    state.reviews.items.filter(review => review.productId === productId);

export const selectProductRating = (productId) => (state) => {
    const productReviews = state.reviews.items.filter(r => r.productId === productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / productReviews.length).toFixed(1);
};

export default reviewsSlice.reducer;
