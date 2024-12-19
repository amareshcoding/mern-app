import express from 'express';
import mongoConnect from './config/mongoDbConfig.mjs';

// Create the Express application
const app = express();

// Define a route for the root URL that sends a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to Express Server!');
});

// Define the port number on which the server will listen
const PORT = 8000;

// Start the server and connect to MongoDB
app.listen(PORT, async () => {
  // Connect to MongoDB
  await mongoConnect();
  // Log a message indicating that the server is running and listening on the specified port
  console.log(`Server listening at PORT: ${PORT}`);
});