import React, { useState } from "react";
import { useDispatchCart, useCart } from "./ContextReducer";
import { Card, CardContent, Typography, Button, Select, MenuItem, Box } from "@mui/material";
import toast from "react-hot-toast";

export default function CardComponent(props) {
  const dispatch = useDispatchCart();
  const data = useCart();
  const options = props.options || {}; // Fallback to empty object if no options
  const priceOption = Object.keys(options); // Extract options from the props
  const [qty, setQty] = useState(1); // Initial quantity
  const [size, setSize] = useState(priceOption.length > 0 ? priceOption[0] : ""); // Initial size

  // Function to handle adding items to the cart
  const handleAddToCart = async () => {
    toast.success("Added to Cart!")
    if (!size) {
      console.error("Size not selected. Cannot add to cart.");
      return;
    }

    const finalPrice = qty * parseInt(options[size], 10);

    console.log("Adding to cart:", {
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: finalPrice,
      qty,
      size,
      options: priceOption, // Available size options
    });

    await dispatch({
      type: "ADD",
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: finalPrice,
      qty,
      size,
      options: priceOption, // Available size options
      optionsPrice: options, // Map of sizes to prices
    });

    console.log("Cart after adding item:", data);
  };

  const finalPrice = qty * parseInt(options[size] || 0, 10); // Compute the final price

  console.log("Options available:", priceOption); // Debugging the available options

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
      <Card sx={{ width: 240, maxHeight: 450 }}>
        {/* Food item image - Increased size */}
        <img
          src={props.foodItem.img}
          alt={props.foodItem.name}
          style={{
            height: "180px", // Increased image size
            objectFit: "cover",
            width: "100%", // Ensure it covers the full width
          }}
        />
        <CardContent>
          {/* Food item details */}
          <Typography variant="h6" noWrap>{props.foodItem.name}</Typography>
          <Typography variant="body2" color="textSecondary" noWrap>{props.foodItem.description}</Typography>

          {/* Quantity and size selectors */}
          <Box display="flex" justifyContent="center" mb={3}>
            <Select
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              sx={{
                m: 1,
                backgroundColor: 'error.main',
                borderRadius: 1,
                minWidth: 60,
                color: 'white',
                height: 35, // Adjusted height for a better fit
              }}
            >
              {Array.from(Array(6), (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={size}
              onChange={(e) => setSize(e.target.value)} // Directly update size on change
              sx={{
                m: 1,
                backgroundColor: 'error.main',
                borderRadius: 1,
                minWidth: 120,
                color: 'white',
                height: 35, // Adjusted height for a better fit
              }}
            >
              {priceOption.length > 0 ? (
                priceOption.map((data) => (
                  <MenuItem key={data} value={data}>
                    {data} {/* Display size */}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No options available</MenuItem>
              )}
            </Select>
          </Box>

          {/* Display final price */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Typography variant="h6">₱{finalPrice.toFixed(2)}</Typography>
          </Box>

          {/* Add to cart button - Smaller button */}
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="error"
              onClick={handleAddToCart}
              sx={{
                width: '80%', // Reduced width of the button
                height: 35, // Adjusted button height
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
