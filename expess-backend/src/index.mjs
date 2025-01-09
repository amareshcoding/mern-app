// Import dotenv to load environment variables
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

// Import dependencies
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Config import
import mongoConnect from './config/mongoDbConfig.mjs';

// Import middlewares
import { printAllRoutes } from './middlewares/printRoutes.mjs';

// Import routers
import authRouther from './routers/authRouters.mjs';

// Create the Express application
const app = express();

// Configure middleware
app.use(express.json()); // Middleware to parse JSON data
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors()); // Middleware to enable CORS
app.use(helmet()); // Middleware to secure the app by setting various HTTP headers
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // Middleware to log HTTP requests dev/combined

// Define a route for the root URL that sends a welcome message
app.get('/', (req, res) => {
  res.send('Welcome to Express Server!');
});

// Auth routes
app.use('/auth', authRouther);

// Print all routes middleware
printAllRoutes(app);

// Define the port number on which the server will listen
const PORT = process.env.PORT || 8000;

// Start the server and connect to MongoDB
app.listen(PORT, async () => {
  // Connect to MongoDB
  console.log('==============Server===========================');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  await mongoConnect();
  console.log(`Server listening at PORT: ${PORT}`);
  console.log('===============================================');
});
