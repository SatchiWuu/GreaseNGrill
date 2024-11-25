import React, { useEffect, useState } from "react";
import { useCart, useDispatchCart } from "../components/ContextReducer";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import toast from 'react-hot-toast';

export default function Cart() {
  const data = useCart(); // Retrieve cart items from context
  const dispatch = useDispatchCart(); // Dispatch function for cart actions
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
    console.log(data); // Sync local data with context when context changes
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Typography variant="h4" align="center" sx={{ mt: 5, color: "black" }}>
        The Cart is Empty!
      </Typography>
    );
  }

  const handleQuantityChange = (id, qty, size) => {
    const updatedData = [...localData];
    const index = updatedData.findIndex((food) => food.id === id && food.size === size);
    if (index !== -1) {
      updatedData[index].qty = parseInt(qty, 10); // Only update quantity, not the amount yet
      setLocalData(updatedData);
    }
  };

  const handleOptionChange = (id, oldSize, newSize) => {
    const updatedData = [...localData];
    const index = updatedData.findIndex((food) => food.id === id && food.size === oldSize);
    if (index !== -1) {
      updatedData[index].size = newSize;

      // Adjust price based on the selected option (size)
      let priceAdjustment = 0;
      if (newSize === "Double Patty") {
        priceAdjustment = 20; // Adjust price for Double Patty
      } else if (newSize === "Triple Patty") {
        priceAdjustment = 40; // Adjust price for Triple Patty
      }

      // Update the price and amount for the food item
      updatedData[index].price += priceAdjustment;
      updatedData[index].amount = updatedData[index].qty * updatedData[index].price; // Recalculate the amount

      setLocalData(updatedData); // Update local state
      dispatch({ type: "UPDATE", id, size: newSize, qty: updatedData[index].qty }); // Update cart in context
    }
  };

  const handleRemoveItem = (id, size) => {
    const updatedData = localData.filter((food) => !(food.id === id && food.size === size));
    setLocalData(updatedData);
    dispatch({ type: "REMOVE", id, size });
  };

  const handleUpdateItem = (id, size, qty) => {
    const updatedData = [...localData];
    const index = updatedData.findIndex((food) => food.id === id && food.size === size);
    if (index !== -1) {
      // Update amount only when "Update" is clicked
      updatedData[index].amount = updatedData[index].qty * updatedData[index].price;
      setLocalData(updatedData);
      dispatch({ type: "UPDATE", id, size: updatedData[index].size, qty: updatedData[index].qty });
    }
  };

  const handleCheckOut = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail || !data || data.length === 0) return;

    try {
      const response = await fetch("http://localhost:5000/api/orderData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_data: data, email: userEmail, order_date: new Date().toDateString() }),
      });

      if (!response.ok) throw new Error(`Failed with status ${response.status}`);
      console.log("Order successful:", await response.json());
      dispatch({ type: "DROP" });
      toast.success("Order Successful!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      console.error("Checkout error:", err.message);
    }
  };

  const totalPrice = localData.reduce((total, food) => total + food.amount, 0);

  return (
    <Box sx={{ p: 3, color: "black" }}>
      <Typography variant="h4" gutterBottom>
        🛒 Cart
      </Typography>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "black", textAlign: "center" }}>#</TableCell>
              <TableCell sx={{ color: "black", textAlign: "center" }}>Name</TableCell>
              <TableCell sx={{ color: "black", textAlign: "center" }}>Quantity</TableCell>
              <TableCell sx={{ color: "black", textAlign: "center" }}>Option</TableCell>
              <TableCell sx={{ color: "black", textAlign: "center" }}>Amount</TableCell>
              <TableCell sx={{ color: "black", textAlign: "center" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localData.map((food, index) => (
              <TableRow key={`${food.id}-${food.size}`}>
                <TableCell sx={{ textAlign: "center" }}>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>{food.name}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <TextField
                    type="number"
                    value={food.qty}
                    min="1"
                    onChange={(e) => handleQuantityChange(food.id, e.target.value, food.size)}
                    size="small"
                    sx={{ width: "60px", color: "black" }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Select
                    value={food.size}
                    onChange={(e) => handleOptionChange(food.id, food.size, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="Single Patty">Single Patty</MenuItem>
                    <MenuItem value="Double Patty">Double Patty</MenuItem>
                    <MenuItem value="Triple Patty">Triple Patty</MenuItem>
                  </Select>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>₱{food.amount}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveItem(food.id, food.size)}
                  >
                    🗑️ Remove
                  </Button>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleUpdateItem(food.id, food.size, food.qty)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Total Price: ₱{totalPrice.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2, display: "block", margin: "0 auto" }}
          onClick={handleCheckOut}
        >
          Check Out
        </Button>
      </Box>
    </Box>
  );
}
