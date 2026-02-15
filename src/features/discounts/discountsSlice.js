import { createSlice } from '@reduxjs/toolkit';

// Mock discount codes
const validCoupons = {
    'FIRST10': { type: 'percentage', value: 10, minOrder: 0 },
    'WELCOME20': { type: 'fixed', value: 500, minOrder: 2000 },
    'FESTIVE25': { type: 'percentage', value: 25, minOrder: 1000 },
    'FREESHIP': { type: 'shipping', value: 0, minOrder: 0 },
};

const initialState = {
    appliedCode: null,
    discount: 0,
    discountType: null,
    error: null,
};

const discountsSlice = createSlice({
    name: 'discounts',
    initialState,
    reducers: {
        applyDiscount: (state, action) => {
            const { code, orderTotal } = action.payload;
            const coupon = validCoupons[code.toUpperCase()];

            if (!coupon) {
                state.error = 'Invalid coupon code';
                state.appliedCode = null;
                state.discount = 0;
                return;
            }

            if (orderTotal < coupon.minOrder) {
                state.error = `Minimum order of ₹${coupon.minOrder} required`;
                state.appliedCode = null;
                state.discount = 0;
                return;
            }

            state.appliedCode = code.toUpperCase();
            state.discountType = coupon.type;
            state.error = null;

            if (coupon.type === 'percentage') {
                state.discount = Math.floor((orderTotal * coupon.value) / 100);
            } else if (coupon.type === 'fixed') {
                state.discount = coupon.value;
            } else if (coupon.type === 'shipping') {
                state.discount = 0; // Handled separately
            }
        },
        removeDiscount: (state) => {
            state.appliedCode = null;
            state.discount = 0;
            state.discountType = null;
            state.error = null;
        },
    },
});

export const { applyDiscount, removeDiscount } = discountsSlice.actions;

export const selectDiscount = (state) => state.discounts;

export default discountsSlice.reducer;
