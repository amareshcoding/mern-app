import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

// Function to connect to MongoDB
const mongoConnect = async () => {
  try {
    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    // Log a success message if the connection is established
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    // Log an error message and exit the process if the connection fails
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default mongoConnect;
