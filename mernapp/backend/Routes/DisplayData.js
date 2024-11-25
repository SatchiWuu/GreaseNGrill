const express = require('express'); // Import express
const router = express.Router();   // Create a new router instance

// Define the /foodData route
router.get('/foodData', (req, res) => {
  try {
    // Ensure global variables are populated
    if (!global.food_items || !global.food_category) {
      throw new Error("Data not initialized");
    }

    // Respond with two separate arrays as the frontend expects
    res.json([global.food_items, global.food_category]);
  } catch (error) {
    console.error("Error in /api/foodData route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router; // Export the router so it can be used in index.js