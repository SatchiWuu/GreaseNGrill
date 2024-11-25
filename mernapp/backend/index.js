const express = require('express');
const mongoDB = require('./db');  
const DisplayData = require('./Routes/DisplayData');

const app = express();
const port = 5000;

// MongoDB connection
mongoDB();  // Call the mongoDB function to connect

// CORS and other middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(express.json());

app.use('/api', require("./Routes/CreateUser"));
app.use('/api', require("./Routes/DisplayData")); // Corrected import for DisplayData
app.use('/api', require("./Routes/OrderData"));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});