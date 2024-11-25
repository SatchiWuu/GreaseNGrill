import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const fetchMyOrder = async () => {
        const userEmail = localStorage.getItem('userEmail');
        console.log("User Email: ", userEmail);

        if (userEmail) {
            try {
                const res = await fetch("http://localhost:5000/api/myOrderData", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: userEmail }),
                });
                console.log(res)

                if (!res.ok) {
                    throw new Error('Failed to fetch order data');
                }

                const response = await res.json();
                console.log('API Response:', response); // Log the API response

                // Safely access order_data
                if (response.orderData && Array.isArray(response.orderData.order_data)) {
                    setOrderData(response.orderData.order_data); // Set order_data if valid
                } else {
                    setOrderData([]); // Set empty array if no order_data or invalid
                    console.log('No order data found');
                }
            } catch (err) {
                setError(err.message); // Set error message if fetch fails
            } finally {
                setLoading(false); // Set loading to false after the fetch attempt
            }
        } else {
            console.log('User email not found in localStorage');
            setLoading(false); // Ensure loading is false if no email is found
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []); // Re-fetch only once when the component mounts

    if (loading) {
        return <div>Loading...</div>; // Show loading text while fetching
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error if fetch fails
    }

    return (
        <>
            <div>
                <Navbar />
            </div>
            <Box sx={{ padding: 3 }}>
                {orderData && orderData.length > 0 ? (
                    orderData.map((order, index) => (
                        <Box key={index}>
                            {order && Array.isArray(order) && order.length > 0 ? (
                                order
                                    .reverse()
                                    .map((arrayData, arrayIndex) => (
                                        <Box key={arrayIndex} mb={4}>
                                            {arrayData.Order_date && (
                                                <Typography variant="h6" gutterBottom>
                                                    <strong>Order Date: {arrayData.Order_date}</strong>
                                                </Typography>
                                            )}

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Card sx={{ maxWidth: 240, maxHeight: 360 }}>
                                                        <CardContent>
                                                            {/* Display image with fallback */}
                                                            {arrayData.img ? (
                                                                <img
                                                                    src={`http://localhost:5000/images/${arrayData.img}`}
                                                                    alt={arrayData.name}
                                                                    style={{
                                                                        height: '120px',
                                                                        objectFit: 'cover',
                                                                        width: '100%',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={`http://localhost:5000/images/${arrayData.img}`}
                                                                    alt={arrayData.name}
                                                                    style={{
                                                                        height: '120px',
                                                                        objectFit: 'cover',
                                                                        width: '100%',
                                                                    }}
                                                                />
                                                            )}

                                                            <Typography variant="h6" component="div" mt={2}>
                                                                {arrayData.name}
                                                            </Typography>
                                                            <Box sx={{ height: '38px' }} display="flex" alignItems="center">
                                                                <Typography variant="body2" sx={{ marginRight: 1 }}>
                                                                    {arrayData.qty} x {arrayData.size}
                                                                </Typography>
                                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                                    ₱{arrayData.price}
                                                                </Typography>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ))
                            ) : (
                                <div>No order data found</div>
                            )}
                        </Box>
                    ))
                ) : (
                    <div>No orders found</div>
                )}
            </Box>

            <div>
                <Footer />
            </div>
        </>
    );
}
