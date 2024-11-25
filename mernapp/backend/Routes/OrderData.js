const express = require('express'); // Import express
const router = express.Router();   // Create a new router instance
const Order = require('../models/Orders'); // Import the Order model

router.post('/orderData', async (req, res) => {
    const { email, order_data, order_date } = req.body;

    if (!email || !order_data || !order_date) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Add order_date at the start of the order_data array
        const dataWithDate = [{ Order_date: order_date }, ...order_data];

        // Check if a record already exists for the email
        let existingOrder = await Order.findOne({ email });

        if (!existingOrder) {
            // Create a new order record if no existing order is found
            await Order.create({
                email,
                order_data: [dataWithDate], // Wrap in an array
            });

            return res.status(201).json({ success: true, message: "Order created successfully" });
        }

        // Update existing order by pushing new data
        await Order.updateOne(
            { email },
            { $push: { order_data: dataWithDate } }
        );

        return res.status(200).json({ success: true, message: "Order updated successfully" });

    } catch (error) {
        console.error("Error handling orderData:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/myorderData', async (req, res)=>{
try {
    let myData = await Order.findOne({'email': req.body.email})
    res.json({orderData:myData})
} catch (error) {
    res.send("Server Error", error.message)
}
})
module.exports = router;