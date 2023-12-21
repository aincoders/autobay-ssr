import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import { CART_API } from 'src/utils/constant';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
    isLoading: false,
    error: null,
    products: [],
    product: null,
    checkout: {
        preferWorkshop: '',
        billingAddress: '',
        cart: [],
        promocode: '',
        promoWalletType: '',
        totalItems: 0,
        bookingDate: '',
        bookingTime: '',
        tabbyCheckoutID: '',
        pickupDrop: false,
    },
};

const slice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // GET PRODUCTS
        getCartOnline(state, action) {
            state.isLoading = false;
            state.checkout.cart = action.payload;
        },
        // CHECKOUT
        getCart(state, action) {
            const cart = action.payload;
            const subtotal = sum(cart.map((product) => Number(product.price)));
            state.checkout.cart = cart;
            state.checkout.discount = state.checkout.discount || 0;
            state.checkout.shipping = state.checkout.shipping || 0;
            state.checkout.billing = state.checkout.billing || null;
            state.checkout.subtotal = subtotal;
            state.checkout.total = subtotal - state.checkout.discount;
            state.checkout.totalItems = cart.length;
        },

        addToCart(state, action) {
            const newProduct = action.payload;
            const isEmptyCart = !state.checkout.cart.length;
            if (isEmptyCart) {
                state.checkout.cart = [...state.checkout.cart, newProduct];
            } else {
                state.checkout.cart = state.checkout.cart.map((product) => {
                    const isExisted = product.service_group_id === newProduct.service_group_id;
                    console.log(isExisted);
                    if (isExisted) {
                        return { ...product };
                    }
                    return product;
                });
            }
            state.checkout.cart = uniqBy([...state.checkout.cart, newProduct], 'service_group_id');
            state.checkout.totalItems = sum(state.checkout.cart.map((product) => product.quantity));
        },

        deleteCart(state, action) {
            const updateCart = state.checkout.cart.filter(
                (product) => product.service_group_id !== action.payload
            );
            state.checkout.cart = updateCart;
        },

        deletePremiumCart(state, action) {
            const updateCart = state.checkout.cart.filter(
                (product) => product.premium_id !== action.payload
            );
            state.checkout.cart = updateCart;
        },

        setPreferWorkshop(state, action) {
            state.checkout.preferWorkshop = action.payload;
        },

        applyAddress(state, action) {
            state.checkout.billingAddress = action.payload;
        },

        resetCart(state) {
            state.checkout.cart = [];
            state.checkout.preferWorkshop = '';
            state.checkout.billingAddress = '';
            state.checkout.promocode = '';
            state.checkout.promoWalletType = '';
            state.checkout.bookingDate = '';
            state.checkout.bookingTime = '';
            state.checkout.totalItems = 0;
            state.checkout.tabbyCheckoutID = '';
            state.checkout.pickupDrop = false;
        },

        applyPromocode(state, action) {
            const { promocode, promoWalletType } = action.payload;
            state.checkout.promocode = promocode;
            state.checkout.promoWalletType = promoWalletType;
        },

        applyBookingDateTime(state, action) {
            const { bookingDate, bookingTime } = action.payload;
            state.checkout.bookingDate = bookingDate;
            state.checkout.bookingTime = bookingTime;
        },

        applyTabbyCheckoutID(state, action) {
            state.checkout.tabbyCheckoutID = action.payload;
        },
        applyPickupDrop(state, action) {
            state.checkout.pickupDrop = action.payload;
        }
    },
});

// Reducer
export default slice.reducer;

// Actions
export const {
    setPreferWorkshop,
    applyPromocode,
    applyAddress,
    applyBookingDateTime,
    applyTabbyCheckoutID,
    getCart,
    addToCart,
    resetCart,
    deletePremiumCart,
    deleteCart,
    applyDiscount,
    getCartOnline,
    applyPickupDrop,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCartItemOnline(params) {
    return async (dispatch) => {
        try {
            const response = await axios.get(CART_API.list, { params });
            const data = [...response.data.result.list, ...response.data.result.premium_list];
            const cartList = data.map((item) =>
                item.service_group_id
                    ? {
                          service_group_id: item.service_group_id,
                          name: item.service_group_name,
                          price: item.service_group_total,
                          spare_part_id: item.spare_part_id,
                      }
                    : {
                          premium_id: item.premium_id,
                          name: item.premium_title,
                          price: item.price_total_after_discount,
                      }
            );
            dispatch(slice.actions.getCartOnline(cartList));
        } catch (error) {
            console.log(error);
        }
    };
}
