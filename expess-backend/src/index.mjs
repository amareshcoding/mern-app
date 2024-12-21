// Import dotenv to load environment variables
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

// Import dependencies
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

// Config import
import mongoConnect from './config/mongoDbConfig.mjs';
import { listRoutes } from './utils/printRoutes.mjs';

// Create the Express application
const app = express();

// Configure middleware
app.use(express.json()); // Middleware to parse JSON data
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors()); // Middleware to enable CORS
app.use(helmet()); // Middleware to secure the app by setting various HTTP headers

// Define a route for the root URL that sends a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to Express Server!');
});

listRoutes(app);

// Define the port number on which the server will listen
const PORT = process.env.PORT || 8000;

// Start the server and connect to MongoDB
app.listen(PORT, async () => {
  // Connect to MongoDB
  await mongoConnect();
  console.log(`Server listening at PORT: ${PORT}`);
});