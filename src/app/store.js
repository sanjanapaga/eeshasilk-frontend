import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import discountsReducer from '../features/discounts/discountsSlice';
import offersReducer from '../features/offers/offersSlice';
import categoriesReducer from '../features/categories/categoriesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        cart: cartReducer,
        orders: ordersReducer,
        wishlist: wishlistReducer,
        reviews: reviewsReducer,
        discounts: discountsReducer,
        offers: offersReducer,
        categories: categoriesReducer,
    },
});
