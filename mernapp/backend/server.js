const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // If you're using CORS for cross-origin requests

const app = express();
const PORT = process.env.PORT || 5000;

<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" />

app.listen(3000,()=>{
    console.log("Listen to 3000");
})

app.use("/css",express.static("./node_modules/bootstrap/dist/css"));
app.use("/js",express.static("./node_modules/bootstrap/dist/js"));

app.use("/",express.static("./node_modules/bootstrap/dist/"));


// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow only your frontend's domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow necessary headers
  credentials: true,  // Allow cookies, if needed
};

// Middleware
app.use(cors(corsOptions));  // Use the CORS configuration
app.use(express.json());

// Your route imports
const foodDataRoute = require('./Routes/DisplayData');  // Ensure this path is correct

// Use the route for the `/api` path
app.use('/api', foodDataRoute);

// MongoDB Connection
const mongoURI = 'mongodb+srv://kc:Kayekristel09@cluster0.bbibc.mongodb.net/GreaseNGrill?retryWrites=true&w=majority'; // Replace with your MongoDB Atlas URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});