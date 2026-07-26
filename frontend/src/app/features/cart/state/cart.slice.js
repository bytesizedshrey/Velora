import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        cart: null,
        loading: false,
        error: null,
    },
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload
            state.items = action.payload?.items || []
        },
        setItems: (state, action) => {
            state.items = action.payload
        },
        addItem: (state, action) => {
            if (action.payload?.items) {
                state.cart = action.payload
                state.items = action.payload.items
            } else if (action.payload) {
                state.items.push(action.payload)
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setCart, setItems, addItem, setLoading, setError } = cartSlice.actions
export default cartSlice.reducer