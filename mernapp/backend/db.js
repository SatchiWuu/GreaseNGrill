const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://kc:Kayekristel09@cluster0.bbibc.mongodb.net/GreaseNGrill?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected successfully");

    // Fetch data from the "food_items" collection
    const db = mongoose.connection.db;

    const fetched_data = await db.collection("food_items").find({}).toArray();
    const food_category = await db.collection("food_category").find({}).toArray();

    // Assign global variables
    global.food_items = fetched_data;
    global.food_category = food_category;

    console.log("Food items fetched:", global.food_items);
    console.log("Food categories fetched:", global.food_category);
  } catch (error) {
    console.error("Error connecting to MongoDB or fetching data:", error.message);
  }
};

module.exports = mongoDB;