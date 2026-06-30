import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Primary connection failed (${error.message}). Attempting DNS bypass...`);
    try {
      const fallbackUri = "mongodb://delaridge88_db_user:crisis123@ac-ppyu62q-shard-00-00.6beqwvc.mongodb.net:27017,ac-ppyu62q-shard-00-01.6beqwvc.mongodb.net:27017,ac-ppyu62q-shard-00-02.6beqwvc.mongodb.net:27017/crisiseye?ssl=true&replicaSet=atlas-ppyu62q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
      const fallbackConn = await mongoose.connect(fallbackUri, { serverSelectionTimeoutMS: 10000 });
      console.log(`MongoDB Connected via DNS Bypass: ${fallbackConn.connection.host}`);
    } catch (fallbackError) {
      console.error(`MongoDB Bypass Error: ${fallbackError.message}`);
      if (fallbackError.message.includes("timed out")) {
         console.error("\n>>> CRITICAL FIX NEEDED: Your IP address is actively blocked by MongoDB Atlas. You must go to the MongoDB Atlas Dashboard -> Network Access -> Add IP Address, enter exactly '0.0.0.0/0', and wait for it to become Active! <<<\n");
      }
      console.warn('Backend is running, but database features will be unavailable until connected.');
    }
  }
};

export default connectDB;
