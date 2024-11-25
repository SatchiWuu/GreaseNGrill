import React, { createContext, useContext, useReducer } from 'react';
import { Box, Button, Typography } from '@mui/material';

// Create two contexts: one for state and one for dispatch
const CartStateContext = createContext();
const CartDispatchContext = createContext();

// Reducer to manage cart actions
const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case 'ADD':
            return [
                ...state,
                {
                    id: action.id,
                    name: action.name,
                    qty: action.qty,
                    size: action.size,
                    price: action.price,
                    img: action.img,
                    options: action.options, // Add options here
                },
            ];
        case 'REMOVE':
            return state.filter(item => item.id !== action.id);
        case 'UPDATE':
            return state.map(item =>
                item.id === action.id
                    ? {
                        ...item,
                        qty: action.qty,
                        size: action.size,
                        amount: action.qty * (
                            item.options && item.options[action.size] // Ensure action.size exists in options
                                ? parseInt(item.options[action.size], 10) // Use price from options if found
                                : parseInt(item.price, 10) // Fallback to the regular item price if size not found
                        )
                    }
                    : item
            );
        case "DROP":
            return []; // Clear the cart
        default:
            return state;
    }
};

// CartProvider component to provide context to the app
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, []);
    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    );
}

// Custom hooks to access cart state and dispatch functions
export const useCart = () =>
    useContext(CartStateContext);

export const useDispatchCart = () =>
    useContext(CartDispatchContext);

// A component to display the cart (example usage of the cart context with MUI design)
export const Cart = () => {
    const cartItems = useCart();
    const dispatch = useDispatchCart();

    return (
        <Box sx={{ width: 300, padding: 2 }}>
            <Typography variant="h6" gutterBottom>My Cart</Typography>
            {cartItems.length === 0 ? (
                <Typography variant="body2" color="textSecondary">Your cart is empty</Typography>
            ) : (
                cartItems.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <img src={item.img} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 16 }} />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1">{item.name}</Typography>
                            <Typography variant="body2" color="textSecondary">Size: {item.size}</Typography>
                            <Typography variant="body2" color="textSecondary">Qty: {item.qty}</Typography>
                            <Typography variant="body2">Price: ₱{item.price}</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                        >
                            Remove
                        </Button>
                    </Box>
                ))
            )}
            {cartItems.length > 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch({ type: 'DROP' })}
                    fullWidth
                >
                    Clear Cart
                </Button>
            )}
        </Box>
    );
};
